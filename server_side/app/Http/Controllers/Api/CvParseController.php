<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\PdfToText\Pdf;
use PhpOffice\PhpWord\IOFactory;

class CvParseController extends Controller
{
    public function parse(Request $request)
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

            return response()->json($this->structureCvText($text));
        } finally {
            Storage::disk($disk)->delete($tmpPath);
        }
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
