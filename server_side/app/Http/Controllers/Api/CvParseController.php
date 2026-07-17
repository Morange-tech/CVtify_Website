<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GroqService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\PdfToText\Pdf;
use PhpOffice\PhpWord\IOFactory;

class CvParseController extends Controller
{
    public function parse(Request $request, GroqService $groq)
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,docx',
        ]);

        $file = $request->file('file');
        $ext = strtolower($file->getClientOriginalExtension());

        // Force local disk for temp parsing (recommended)
        $disk = 'local';

        $tmpPath = $file->storeAs('tmp', Str::uuid() . '.' . $ext, $disk);
        $fullPath = Storage::disk($disk)->path($tmpPath);

        if (!is_readable($fullPath)) {
            throw new \RuntimeException("Uploaded file not readable at: {$fullPath}");
        }

        try {
            $text = match ($ext) {
                'pdf' => Pdf::getText($fullPath, config('services.pdftotext_binary')),
                'docx' => $this->extractDocxText($fullPath),
                default => throw new \RuntimeException('Unsupported file type'),
            };

            if (!$this->looksLikeCv($text)) {
                return response()->json([
                    'message' => "Ce document ne ressemble pas à un CV. Veuillez importer un CV valide (PDF ou DOCX).",
                ], 422);
            }

            $result = $this->tryAiParse($text, $groq) ?? $this->structureCvText($text);

            return response()->json($result);
        } finally {
            Storage::disk($disk)->delete($tmpPath);
        }
    }

    /**
     * Heuristic check that the uploaded document is actually a CV: it must contain
     * enough text and either contact details (email/phone) or several CV-shaped
     * section headings (experience, education, skills, etc.).
     */
    private function looksLikeCv(string $text): bool
    {
        $text = trim($text);

        if (mb_strlen($text) < 100) {
            return false;
        }

        $hasContactInfo = (bool) preg_match('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', $text)
            || (bool) preg_match('/(\+?\d[\d\-\s().]{7,}\d)/', $text);

        $cvKeywords = [
            'experience', 'expérience', 'education', 'formation', 'skills', 'compétences',
            'profile', 'profil', 'summary', 'résumé', 'employment', 'work experience',
            'languages', 'langues', 'curriculum vitae',
        ];

        $lower = mb_strtolower($text);
        $keywordHits = 0;
        foreach ($cvKeywords as $keyword) {
            if (str_contains($lower, $keyword)) {
                $keywordHits++;
            }
        }

        return $hasContactInfo || $keywordHits >= 2;
    }

    private function extractPdfText(string $path): string
    {
        $bin = config('services.pdftotext_binary'); // "C:/poppler-25.12.0/Library/bin/pdftotext.exe"
        return Pdf::getText($path, $bin);
    }

    private function extractDocxText(string $path): string
    {
        $phpWord = IOFactory::load($path, 'Word2007');

        // Easiest: write to temporary plain text using PhpWord Text writer
        $tmpTxt = tempnam(sys_get_temp_dir(), 'cv_') . '.txt';
        $writer = IOFactory::createWriter($phpWord, 'Text');
        $writer->save($tmpTxt);

        $text = file_get_contents($tmpTxt) ?: '';
        @unlink($tmpTxt);

        return $text;
    }

    /**
     * IMPORTANT:
     * This is a basic parser to “match fields”. For best quality, you can later
     * replace this with an LLM-based parser, but this works as a starting point.
     */
    private function structureCvText(string $text): array
    {
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace("/[ \t]+/", " ", $text);
        $lines = array_values(array_filter(array_map('trim', explode("\n", $text)), fn($l) => $l !== ''));

        $fullName = $lines[0] ?? '';
        [$firstName, $lastName] = $this->splitName($fullName);

        $email = $this->firstMatch($text, '/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i');
        $phone = $this->firstMatch($text, '/(\+?\d[\d\-\s().]{7,}\d)/');
        $linkedin = $this->firstMatch($text, '/https?:\/\/(www\.)?linkedin\.com\/[^\s)]+/i');
        $website = $this->firstMatch($text, '/https?:\/\/(?!www\.linkedin\.com)[^\s)]+/i');

        $sections = $this->splitByHeadings($text, [
            'profile'    => ['profile', 'summary', 'professional summary', 'résumé', 'profil'],
            'education'  => ['education', 'formation', 'études'],
            'experience' => ['experience', 'work experience', 'expérience', 'employment'],
            'skills'     => ['skills', 'compétences'],
            'languages'  => ['languages', 'langues'],
            'interests'  => ['interests', 'hobbies', 'centres d\'intérêt', 'centres d’intérêt'],
        ]);

        return [
            'personalInfo' => array_filter([
                'firstName' => $firstName,
                'lastName' => $lastName,
                'email' => $email,
                'phoneNumber' => $phone,
                'website' => $website,
                // You can also map linkedin into website or add a dedicated field if you have one
            ], fn($v) => $v !== null && $v !== ''),

            // Quill expects HTML; we wrap plain text
            'profile' => isset($sections['profile'])
                ? '<p>' . e(trim($sections['profile'])) . '</p>'
                : null,

            'education' => $this->parseEducation($sections['education'] ?? ''),
            'experience' => $this->parseExperience($sections['experience'] ?? ''),
            'skills' => $this->parseSkills($sections['skills'] ?? ''),
            'languages' => $this->parseLanguages($sections['languages'] ?? ''),
            'interests' => $this->parseInterests($sections['interests'] ?? ''),
        ];
    }

    private function tryAiParse(string $text, GroqService $groq): ?array
    {
        // The Groq call can take up to 45s; make sure PHP's max_execution_time
        // doesn't kill the request before the fallback path gets a chance to run.
        set_time_limit(60);

        try {
            return $this->structureCvTextWithAi($text, $groq);
        } catch (\Throwable $e) {
            Log::warning('AI CV parsing failed, falling back to regex parser: ' . $e->getMessage());
            return null;
        }
    }

    private function structureCvTextWithAi(string $text, GroqService $groq): array
    {
        $truncated = mb_substr(trim($text), 0, 12000);

        $userPrompt = "Extract structured data from the following CV/resume text and return it as a single JSON "
            . "object matching the schema described in your instructions. CV text follows between the markers.\n\n"
            . "---BEGIN CV TEXT---\n{$truncated}\n---END CV TEXT---";

        $data = $groq->generateJson($this->aiExtractionSystemPrompt(), $userPrompt, maxTokens: 4000, timeout: 45);

        return $this->normalizeAiResult($data);
    }

    private function aiExtractionSystemPrompt(): string
    {
        return <<<'PROMPT'
You are a CV/resume parsing engine. Extract structured data from the raw CV text the user provides.

Respond with JSON only: a single valid JSON object, no markdown code fences, no commentary. It must match
exactly this schema (every key must always be present):

{
  "personalInfo": {"firstName": "", "lastName": "", "email": "", "phoneNumber": "", "website": ""},
  "profile": "",
  "education": [{"education": "", "school": "", "city": "", "startMonth": "", "startYear": "", "endMonth": "", "endYear": "", "isPresent": false, "description": ""}],
  "experience": [{"position": "", "employer": "", "city": "", "startMonth": "", "startYear": "", "endMonth": "", "endYear": "", "isPresent": false, "description": ""}],
  "skills": [{"skill": "", "level": ""}],
  "languages": [{"language": "", "level": ""}],
  "interests": [{"interest": ""}],
  "courses": [{"course": "", "month": "", "year": "", "isPresent": false, "description": ""}],
  "internships": [{"position": "", "employer": "", "city": "", "startMonth": "", "startYear": "", "endMonth": "", "endYear": "", "isPresent": false, "description": ""}],
  "extracurricular": [{"position": "", "employer": "", "city": "", "startMonth": "", "startYear": "", "endMonth": "", "endYear": "", "isPresent": false, "description": ""}],
  "references": [{"name": "", "company": "", "city": "", "phone": "", "email": ""}],
  "qualities": [{"quality": ""}],
  "certificates": [{"certificate": "", "month": "", "year": "", "isPresent": false, "description": ""}],
  "achievements": [{"description": ""}]
}

Rules:
- Use only information present in the text. Never invent facts, dates, employers, or schools.
- If a field is unknown, use an empty string ("") — never null, never omit the key.
- If a whole section has no entries in the CV, return it as an empty array [], not omitted.
- Month fields are two-digit strings "01"-"12" when known, else "".
- Year fields are 4-digit year strings when known, else "". Do not guess a month/year you are not confident about.
- isPresent is true only when the entry explicitly says the role/education is ongoing ("present", "current",
  "ongoing", or an equivalent phrase in any language), otherwise false.
- languages[].level must be one of "01" (beginner), "02" (intermediate), "03" (good), "04" (very good),
  "05" (fluent), "06" (native/mother tongue) — map the CV's own wording (in any language) to this scale by
  meaning, or use "" if unstated.
- profile is a short plain-text paragraph (no HTML tags) summarizing the candidate, or "" if there is no
  summary/profile section.
- Preserve the original language of the CV — do not translate any extracted text.
PROMPT;
    }

    private function normalizeAiResult(array $data): array
    {
        return [
            'personalInfo' => $this->normalizePersonalInfo($data['personalInfo'] ?? []),
            'profile' => $this->normalizeProfile($data['profile'] ?? ''),
            'education' => $this->normalizeListSection($data['education'] ?? null, $this->sectionSchema('education')),
            'experience' => $this->normalizeListSection($data['experience'] ?? null, $this->sectionSchema('experience')),
            'skills' => $this->normalizeListSection($data['skills'] ?? null, $this->sectionSchema('skills')),
            'languages' => $this->normalizeListSection($data['languages'] ?? null, $this->sectionSchema('languages')),
            'interests' => $this->normalizeListSection($data['interests'] ?? null, $this->sectionSchema('interests')),
            'courses' => $this->normalizeListSection($data['courses'] ?? null, $this->sectionSchema('courses')),
            'internships' => $this->normalizeListSection($data['internships'] ?? null, $this->sectionSchema('internships')),
            'extracurricular' => $this->normalizeListSection($data['extracurricular'] ?? null, $this->sectionSchema('extracurricular')),
            'references' => $this->normalizeListSection($data['references'] ?? null, $this->sectionSchema('references')),
            'qualities' => $this->normalizeListSection($data['qualities'] ?? null, $this->sectionSchema('qualities')),
            'certificates' => $this->normalizeListSection($data['certificates'] ?? null, $this->sectionSchema('certificates')),
            'achievements' => $this->normalizeListSection($data['achievements'] ?? null, $this->sectionSchema('achievements')),
        ];
    }

    /**
     * Field map per section, keyed by exact frontend field name. Used to rebuild AI
     * output key-by-key so hallucinated/malformed shapes can never leak to the client.
     */
    private function sectionSchema(string $section): array
    {
        $personEntry = [
            'position' => 'string', 'employer' => 'string', 'city' => 'string',
            'startMonth' => 'month', 'startYear' => 'year', 'endMonth' => 'month', 'endYear' => 'year',
            'isPresent' => 'bool', 'description' => 'string',
        ];

        return match ($section) {
            'education' => [
                'education' => 'string', 'school' => 'string', 'city' => 'string',
                'startMonth' => 'month', 'startYear' => 'year', 'endMonth' => 'month', 'endYear' => 'year',
                'isPresent' => 'bool', 'description' => 'string',
            ],
            'experience', 'internships', 'extracurricular' => $personEntry,
            'skills' => ['skill' => 'string', 'level' => 'string'],
            'languages' => ['language' => 'string', 'level' => 'langlevel'],
            'interests' => ['interest' => 'string'],
            'courses' => ['course' => 'string', 'month' => 'month', 'year' => 'year', 'isPresent' => 'bool', 'description' => 'string'],
            'certificates' => ['certificate' => 'string', 'month' => 'month', 'year' => 'year', 'isPresent' => 'bool', 'description' => 'string'],
            'references' => ['name' => 'string', 'company' => 'string', 'city' => 'string', 'phone' => 'string', 'email' => 'string'],
            'qualities' => ['quality' => 'string'],
            'achievements' => ['description' => 'string'],
            default => [],
        };
    }

    private function normalizeListSection(mixed $items, array $schema): array
    {
        if (!is_array($items) || empty($schema) || !array_is_list($items)) {
            return [];
        }

        $out = [];
        foreach (array_slice($items, 0, 50) as $item) {
            if (!is_array($item)) {
                continue;
            }

            $row = [];
            $hasContent = false;
            foreach ($schema as $key => $type) {
                $row[$key] = $this->coerce($item[$key] ?? '', $type);
                if ($type !== 'bool' && $row[$key] !== '') {
                    $hasContent = true;
                }
            }

            if ($hasContent) {
                $out[] = $row;
            }
        }

        return $out;
    }

    private function coerce(mixed $value, string $type): string|bool
    {
        return match ($type) {
            'bool' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'month' => (is_string($value) && preg_match('/^(0[1-9]|1[0-2])$/', $value)) ? $value : '',
            'year' => (is_string($value) && preg_match('/^(19|20)\d{2}$/', $value)) ? $value : '',
            'langlevel' => (is_string($value) && preg_match('/^0[1-6]$/', $value)) ? $value : '',
            default => is_scalar($value) ? trim((string) $value) : '',
        };
    }

    private function normalizePersonalInfo(mixed $raw): array
    {
        if (!is_array($raw)) {
            $raw = [];
        }

        return array_filter([
            'firstName' => $this->coerce($raw['firstName'] ?? '', 'string'),
            'lastName' => $this->coerce($raw['lastName'] ?? '', 'string'),
            'email' => $this->coerce($raw['email'] ?? '', 'string'),
            'phoneNumber' => $this->coerce($raw['phoneNumber'] ?? '', 'string'),
            'website' => $this->coerce($raw['website'] ?? '', 'string'),
        ], fn($v) => $v !== '');
    }

    private function normalizeProfile(mixed $raw): ?string
    {
        $text = is_scalar($raw) ? trim(strip_tags((string) $raw)) : '';

        return $text !== '' ? '<p>' . e($text) . '</p>' : null;
    }

    private function splitName(string $fullName): array
    {
        $fullName = trim(preg_replace('/\s+/', ' ', $fullName));
        if ($fullName === '') return ['', ''];
        $parts = explode(' ', $fullName);
        if (count($parts) === 1) return [$parts[0], ''];
        $last = array_pop($parts);
        return [implode(' ', $parts), $last];
    }

    private function firstMatch(string $text, string $regex): ?string
    {
        if (preg_match($regex, $text, $m)) return trim($m[0]);
        return null;
    }

    private function splitByHeadings(string $text, array $headingMap): array
    {
        // Normalize for searching
        $lower = mb_strtolower($text);

        // Find positions of headings
        $found = [];
        foreach ($headingMap as $key => $headings) {
            foreach ($headings as $h) {
                $hLower = mb_strtolower($h);
                $pos = mb_strpos($lower, "\n" . $hLower);
                if ($pos === false) $pos = mb_strpos($lower, $hLower . "\n");
                if ($pos !== false) {
                    $found[] = ['key' => $key, 'pos' => $pos, 'len' => mb_strlen($hLower)];
                    break;
                }
            }
        }

        usort($found, fn($a, $b) => $a['pos'] <=> $b['pos']);

        $result = [];
        for ($i = 0; $i < count($found); $i++) {
            $start = $found[$i]['pos'];
            $end = $found[$i + 1]['pos'] ?? mb_strlen($text);
            $chunk = mb_substr($text, $start, $end - $start);
            // Remove the heading line itself (best-effort)
            $chunk = preg_replace("/^.*\n/", "", trim($chunk));
            $result[$found[$i]['key']] = trim($chunk);
        }

        return $result;
    }

    private function parseSkills(string $block): array
    {
        $block = trim($block);
        if ($block === '') return [];

        // Split by lines or commas
        $items = preg_split("/\n|,|•|\- /", $block);
        $items = array_values(array_filter(array_map('trim', $items), fn($x) => $x !== ''));

        return array_map(fn($s) => ['skill' => $s, 'level' => ''], $items);
    }

    private function parseLanguages(string $block): array
    {
        $block = trim($block);
        if ($block === '') return [];

        $lines = array_values(array_filter(array_map('trim', explode("\n", $block))));
        return array_map(function ($l) {
            // examples: "English - Fluent", "French: Native"
            $parts = preg_split('/\s*[-:]\s*/', $l, 2);
            $lang = trim($parts[0] ?? '');
            $levelText = mb_strtolower(trim($parts[1] ?? ''));

            $levelCode = match (true) {
                str_contains($levelText, 'native') => '06',
                str_contains($levelText, 'fluent') => '05',
                str_contains($levelText, 'very') => '04',
                str_contains($levelText, 'good') => '03',
                str_contains($levelText, 'intermediate') => '02',
                str_contains($levelText, 'beginner') => '01',
                default => '',
            };

            return ['language' => $lang, 'level' => $levelCode];
        }, $lines);
    }

    private function parseInterests(string $block): array
    {
        $block = trim($block);
        if ($block === '') return [];

        $items = preg_split("/\n|,|•/", $block);
        $items = array_values(array_filter(array_map('trim', $items), fn($x) => $x !== ''));

        return array_map(fn($i) => ['interest' => $i], $items);
    }

    private function parseEducation(string $block): array
    {
        $block = trim($block);
        if ($block === '') return [];

        // Naive: split entries by blank lines
        $entries = preg_split("/\n\s*\n/", $block);
        $out = [];

        foreach ($entries as $entry) {
            $lines = array_values(array_filter(array_map('trim', explode("\n", trim($entry)))));
            if (!$lines) continue;

            $out[] = [
                'education' => $lines[0] ?? '',
                'school' => $lines[1] ?? '',
                'city' => '',
                'startMonth' => '',
                'startYear' => '',
                'endMonth' => '',
                'endYear' => '',
                'isPresent' => false,
                'description' => isset($lines[2]) ? implode("\n", array_slice($lines, 2)) : '',
            ];
        }

        return $out;
    }

    private function parseExperience(string $block): array
    {
        $block = trim($block);
        if ($block === '') return [];

        $entries = preg_split("/\n\s*\n/", $block);
        $out = [];

        foreach ($entries as $entry) {
            $lines = array_values(array_filter(array_map('trim', explode("\n", trim($entry)))));
            if (!$lines) continue;

            $out[] = [
                'position' => $lines[0] ?? '',
                'employer' => $lines[1] ?? '',
                'city' => '',
                'startMonth' => '',
                'startYear' => '',
                'endMonth' => '',
                'endYear' => '',
                'isPresent' => false,
                'description' => isset($lines[2]) ? implode("\n", array_slice($lines, 2)) : '',
            ];
        }

        return $out;
    }
}
