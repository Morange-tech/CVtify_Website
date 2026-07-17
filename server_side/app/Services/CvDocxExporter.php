<?php

namespace App\Services;

use App\Models\Cv;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Settings;
use PhpOffice\PhpWord\Shared\Html;
use Throwable;

class CvDocxExporter
{
    private const LEVEL_LABELS = [
        '01' => 'Beginner',
        '02' => 'Intermediate',
        '03' => 'Good',
        '04' => 'Very Good',
        '05' => 'Fluent',
        '06' => 'Native',
    ];

    private const HEADING_FONT = ['bold' => true, 'size' => 13, 'color' => '2F5496'];

    private const HEADING_PARAGRAPH = ['spaceBefore' => 240, 'spaceAfter' => 120];

    private const META_FONT = ['italic' => true, 'size' => 10, 'color' => '595959'];

    /** @var string[] */
    private array $tempFiles = [];

    public function export(Cv $cv): string
    {
        $content = $cv->content ?? [];

        // Enable XML output escaping so PhpWord uses XMLWriter::text() instead of
        // writeRaw(). Without this, bare & < > chars in CV fields write invalid XML,
        // causing Word to report "errors in characters" when opening the file.
        Settings::setOutputEscapingEnabled(true);

        $phpWord = new PhpWord();
        $phpWord->setDefaultFontName('Calibri');
        $phpWord->setDefaultFontSize(11);
        $phpWord->addTitleStyle(2, self::HEADING_FONT, self::HEADING_PARAGRAPH);

        $section = $phpWord->addSection();

        try {
            $this->addHeader($section, $content['personalInfo'] ?? []);
            $this->addProfile($section, $content['profile'] ?? '');
            $this->addExperience($section, $content['experience'] ?? []);
            $this->addEducation($section, $content['education'] ?? []);
            $this->addLeveledList($section, 'Skills', $content['skills'] ?? [], 'skill');
            $this->addLeveledList($section, 'Languages', $content['languages'] ?? [], 'language');
            $this->addBulletList($section, 'Interests', $content['interests'] ?? [], 'interest');
            $this->addCourses($section, $content['courses'] ?? []);
            $this->addWorkLikeSection($section, 'Internships', $content['internships'] ?? []);
            $this->addWorkLikeSection($section, 'Extracurricular Activities', $content['extracurricular'] ?? []);
            $this->addReferences($section, $content['references'] ?? []);
            $this->addBulletList($section, 'Qualities', $content['qualities'] ?? [], 'quality');
            $this->addCertificates($section, $content['certificates'] ?? []);
            $this->addAchievements($section, $content['achievements'] ?? []);
            $this->addCustomSections($section, $content['customSections'] ?? []);
            $this->addSignature($section, $content['signature'] ?? []);
            $this->addFooter($section, $content['footer'] ?? []);

            $path = $this->tempPath('cv_', 'docx');
            IOFactory::createWriter($phpWord, 'Word2007')->save($path);
        } finally {
            foreach ($this->tempFiles as $file) {
                @unlink($file);
            }
        }

        return $path;
    }

    private function tempPath(string $prefix, string $extension): string
    {
        $base = tempnam(sys_get_temp_dir(), $prefix);
        $path = $base . '.' . $extension;
        rename($base, $path);

        return $path;
    }

    private function heading($section, string $text): void
    {
        $section->addTitle($text, 2);
    }

    private function addHtml($section, ?string $html): void
    {
        $html = (string) ($html ?? '');
        if (trim(strip_tags($html)) === '') {
            return;
        }

        // Strip <img> tags: PhpWord's HTML renderer will attempt to load image
        // sources (local paths or remote URLs), which is unsafe for user content.
        $html = preg_replace('/<img\b[^>]*>/i', '', $html) ?? $html;

        // Remove characters invalid in XML 1.0 (control chars except TAB/LF/CR).
        $html = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $html) ?? $html;

        // Encode non-ASCII code points as numeric HTML entities before DOMDocument
        // parses the HTML. Without an explicit charset declaration, DOMDocument::loadHTML
        // treats the string as Latin-1 on Windows, corrupting multi-byte UTF-8 sequences
        // and producing invalid XML that Word rejects as "errors in characters".
        $html = preg_replace_callback(
            '/[^\x00-\x7F]/u',
            fn($m) => '&#' . mb_ord($m[0]) . ';',
            $html
        ) ?? $html;

        try {
            Html::addHtml($section, $html, false, false);
        } catch (Throwable $e) {
            $section->addText(strip_tags($html));
        }
    }

    private function levelLabel(?string $level): ?string
    {
        return $level && isset(self::LEVEL_LABELS[$level]) ? self::LEVEL_LABELS[$level] : null;
    }

    private function dateRange(array $item): string
    {
        $start = implode('/', array_filter([$item['startMonth'] ?? null, $item['startYear'] ?? null]));
        $end = !empty($item['isPresent'])
            ? 'Present'
            : implode('/', array_filter([$item['endMonth'] ?? null, $item['endYear'] ?? null]));

        return implode(' - ', array_filter([$start, $end], fn ($v) => $v !== ''));
    }

    private function singleDate(array $item): string
    {
        if (!empty($item['isPresent'])) {
            return 'Present';
        }

        return implode('/', array_filter([$item['month'] ?? null, $item['year'] ?? null]));
    }

    private function addHeader($section, array $info): void
    {
        $fullName = trim(($info['firstName'] ?? '') . ' ' . ($info['lastName'] ?? ''));
        $section->addText($fullName !== '' ? $fullName : 'Curriculum Vitae', ['bold' => true, 'size' => 22]);

        if (!empty($info['title'])) {
            $section->addText($info['title'], ['italic' => true, 'size' => 12, 'color' => '595959']);
        }

        $contact = array_values(array_filter([
            $info['phoneNumber'] ?? null,
            $info['email'] ?? null,
            $info['website'] ?? null,
            implode(', ', array_filter([$info['address'] ?? null, $info['city'] ?? null])),
        ], fn ($v) => $v !== null && $v !== ''));
        if (!empty($contact)) {
            $section->addText(implode('   |   ', $contact), ['size' => 9, 'color' => '404040']);
        }

        $details = array_values(array_filter([
            !empty($info['birthDate']) ? 'Date of birth: ' . $info['birthDate'] : null,
            !empty($info['placeOfBirth']) ? 'Place of birth: ' . $info['placeOfBirth'] : null,
            !empty($info['nationality']) ? 'Nationality: ' . $info['nationality'] : null,
            !empty($info['sex']) ? 'Sex: ' . $info['sex'] : null,
            !empty($info['maritalStatus']) ? 'Marital status: ' . $info['maritalStatus'] : null,
            !empty($info['drivingLicense']) ? 'Driving licence: ' . $info['drivingLicense'] : null,
        ]));
        if (!empty($details)) {
            $section->addText(implode('   |   ', $details), ['size' => 9, 'color' => '808080']);
        }

        $section->addTextBreak(1);
    }

    private function addProfile($section, $profile): void
    {
        if (trim(strip_tags((string) $profile)) === '') {
            return;
        }

        $this->heading($section, 'Profile');
        $this->addHtml($section, $profile);
    }

    private function addExperience($section, array $items): void
    {
        $items = array_values(array_filter($items, fn ($i) => !empty($i['position']) || !empty($i['employer']) || !empty($i['description'])));
        if (empty($items)) {
            return;
        }

        $this->heading($section, 'Experience');
        foreach ($items as $item) {
            $section->addText($item['position'] ?? '', ['bold' => true]);

            $meta = implode('   |   ', array_filter([
                implode(', ', array_filter([$item['employer'] ?? null, $item['city'] ?? null])),
                $this->dateRange($item),
            ], fn ($v) => $v !== ''));
            if ($meta !== '') {
                $section->addText($meta, self::META_FONT);
            }

            $this->addHtml($section, $item['description'] ?? '');
            $section->addTextBreak(1);
        }
    }

    private function addEducation($section, array $items): void
    {
        $items = array_values(array_filter($items, fn ($i) => !empty($i['education']) || !empty($i['school']) || !empty($i['description'])));
        if (empty($items)) {
            return;
        }

        $this->heading($section, 'Education');
        foreach ($items as $item) {
            $section->addText($item['education'] ?? '', ['bold' => true]);

            $meta = implode('   |   ', array_filter([
                implode(', ', array_filter([$item['school'] ?? null, $item['city'] ?? null])),
                $this->dateRange($item),
            ], fn ($v) => $v !== ''));
            if ($meta !== '') {
                $section->addText($meta, self::META_FONT);
            }

            $this->addHtml($section, $item['description'] ?? '');
            $section->addTextBreak(1);
        }
    }

    private function addLeveledList($section, string $title, array $items, string $field): void
    {
        $items = array_values(array_filter($items, fn ($i) => !empty($i[$field])));
        if (empty($items)) {
            return;
        }

        $this->heading($section, $title);
        foreach ($items as $item) {
            $label = $item[$field];
            $levelLabel = $this->levelLabel($item['level'] ?? null);
            if ($levelLabel) {
                $label .= ' — ' . $levelLabel;
            }
            $section->addListItem($label);
        }
        $section->addTextBreak(1);
    }

    private function addBulletList($section, string $title, array $items, string $field): void
    {
        $items = array_values(array_filter($items, fn ($i) => !empty($i[$field])));
        if (empty($items)) {
            return;
        }

        $this->heading($section, $title);
        foreach ($items as $item) {
            $section->addListItem($item[$field]);
        }
        $section->addTextBreak(1);
    }

    private function addCourses($section, array $items): void
    {
        $items = array_values(array_filter($items, fn ($i) => !empty($i['course']) || !empty($i['description'])));
        if (empty($items)) {
            return;
        }

        $this->heading($section, 'Courses');
        foreach ($items as $item) {
            $section->addText($item['course'] ?? '', ['bold' => true]);

            $date = $this->singleDate($item);
            if ($date !== '') {
                $section->addText($date, self::META_FONT);
            }

            $this->addHtml($section, $item['description'] ?? '');
            $section->addTextBreak(1);
        }
    }

    private function addWorkLikeSection($section, string $title, array $items): void
    {
        $items = array_values(array_filter($items, fn ($i) => !empty($i['position']) || !empty($i['employer']) || !empty($i['description'])));
        if (empty($items)) {
            return;
        }

        $this->heading($section, $title);
        foreach ($items as $item) {
            $section->addText($item['position'] ?? '', ['bold' => true]);

            $meta = implode('   |   ', array_filter([
                implode(', ', array_filter([$item['employer'] ?? null, $item['city'] ?? null])),
                $this->dateRange($item),
            ], fn ($v) => $v !== ''));
            if ($meta !== '') {
                $section->addText($meta, self::META_FONT);
            }

            $this->addHtml($section, $item['description'] ?? '');
            $section->addTextBreak(1);
        }
    }

    private function addReferences($section, array $items): void
    {
        $items = array_values(array_filter($items, fn ($i) => !empty($i['name']) || !empty($i['company'])));
        if (empty($items)) {
            return;
        }

        $this->heading($section, 'References');
        foreach ($items as $item) {
            $section->addText($item['name'] ?? '', ['bold' => true]);

            $meta = implode('   |   ', array_filter([
                $item['company'] ?? null,
                $item['city'] ?? null,
                !empty($item['phone']) ? 'Tel: ' . $item['phone'] : null,
                !empty($item['email']) ? 'Email: ' . $item['email'] : null,
            ], fn ($v) => $v !== null && $v !== ''));
            if ($meta !== '') {
                $section->addText($meta, ['size' => 10, 'color' => '595959']);
            }

            $section->addTextBreak(1);
        }
    }

    private function addCertificates($section, array $items): void
    {
        $items = array_values(array_filter($items, fn ($i) => !empty($i['certificate']) || !empty($i['description'])));
        if (empty($items)) {
            return;
        }

        $this->heading($section, 'Certificates');
        foreach ($items as $item) {
            $section->addText($item['certificate'] ?? '', ['bold' => true]);

            $date = $this->singleDate($item);
            if ($date !== '') {
                $section->addText($date, self::META_FONT);
            }

            $this->addHtml($section, $item['description'] ?? '');
            $section->addTextBreak(1);
        }
    }

    private function addAchievements($section, array $items): void
    {
        $items = array_values(array_filter($items, fn ($i) => trim(strip_tags((string) ($i['description'] ?? ''))) !== ''));
        if (empty($items)) {
            return;
        }

        $this->heading($section, 'Achievements');
        foreach ($items as $item) {
            $this->addHtml($section, $item['description'] ?? '');
        }
    }

    private function addCustomSections($section, array $items): void
    {
        foreach ($items as $item) {
            $title = $item['title'] ?? 'Custom Section';
            $type = $item['type'] ?? 'description';

            switch ($type) {
                case 'entries':
                    $entries = array_values(array_filter($item['entries'] ?? [], fn ($e) => !empty($e['title']) || !empty($e['summary']) || !empty($e['description'])));
                    if (empty($entries)) {
                        continue 2;
                    }

                    $this->heading($section, $title);
                    foreach ($entries as $entry) {
                        $heading = implode(' - ', array_filter([$entry['title'] ?? null, $entry['summary'] ?? null], fn ($v) => $v !== null && $v !== ''));
                        $section->addText($heading, ['bold' => true]);

                        $dateRange = implode(' - ', array_filter([
                            $entry['startDate'] ?? null,
                            $entry['endDate'] ?? 'Present',
                        ], fn ($v) => $v !== null && $v !== ''));
                        if ($dateRange !== '') {
                            $section->addText($dateRange, self::META_FONT);
                        }

                        $this->addHtml($section, $entry['description'] ?? '');
                        $section->addTextBreak(1);
                    }

                    break;

                case 'skills':
                    $skills = array_values(array_filter($item['skills'] ?? [], fn ($s) => !empty($s['name'])));
                    if (empty($skills)) {
                        continue 2;
                    }

                    $this->heading($section, $title);
                    foreach ($skills as $skill) {
                        $label = $skill['name'];
                        if (!empty($skill['level'])) {
                            $label .= ' (' . $skill['level'] . ')';
                        }
                        $section->addListItem($label);
                    }
                    $section->addTextBreak(1);

                    break;

                case 'list':
                    $listItems = array_values(array_filter($item['list'] ?? [], fn ($l) => !empty($l['text'])));
                    if (empty($listItems)) {
                        continue 2;
                    }

                    $this->heading($section, $title);
                    foreach ($listItems as $listItem) {
                        $section->addListItem($listItem['text']);
                    }
                    $section->addTextBreak(1);

                    break;

                default:
                    if (trim(strip_tags((string) ($item['description'] ?? ''))) === '') {
                        continue 2;
                    }

                    $this->heading($section, $title);
                    $this->addHtml($section, $item['description'] ?? '');

                    break;
            }
        }
    }

    private function addSignature($section, array $items): void
    {
        $items = array_values(array_filter($items, fn ($i) => !empty($i['city']) || !empty($i['date']) || !empty($i['signature'])));
        if (empty($items)) {
            return;
        }

        foreach ($items as $item) {
            $section->addTextBreak(1);

            $meta = implode('   |   ', array_filter([$item['city'] ?? null, $item['date'] ?? null], fn ($v) => $v !== null && $v !== ''));
            if ($meta !== '') {
                $section->addText($meta, ['size' => 10]);
            }

            if (($item['signatureType'] ?? null) === 'type') {
                if (!empty($item['signature'])) {
                    $section->addText($item['signature'], ['italic' => true, 'size' => 16]);
                }
            } else {
                $this->addSignatureImage($section, (string) ($item['signature'] ?? ''));
            }
        }
    }

    private function addSignatureImage($section, string $dataUrl): void
    {
        if (!preg_match('/^data:image\/(png|jpe?g|gif);base64,(.+)$/i', $dataUrl, $matches)) {
            return;
        }

        $extension = strtolower($matches[1]) === 'jpg' ? 'jpeg' : strtolower($matches[1]);
        $data = base64_decode($matches[2], true);
        if ($data === false) {
            return;
        }

        $path = $this->tempPath('sig_', $extension);
        file_put_contents($path, $data);
        $this->tempFiles[] = $path;

        $section->addImage($path, ['width' => 150, 'height' => 60]);
    }

    private function addFooter($section, array $items): void
    {
        $items = array_values(array_filter($items, fn ($i) => trim(strip_tags((string) ($i['description'] ?? ''))) !== ''));
        if (empty($items)) {
            return;
        }

        $section->addTextBreak(1);
        foreach ($items as $item) {
            $this->addHtml($section, $item['description'] ?? '');
        }
    }
}
