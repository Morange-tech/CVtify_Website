<?php

namespace Database\Seeders;

use App\Models\Faq;
use App\Models\Resource;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cvGuides = [
            ['title' => 'How to Write a Perfect CV in 2024', 'description' => 'Learn the essential components of a modern CV that gets results.', 'read_time' => '8 min read', 'category' => 'Beginner', 'is_featured' => true],
            ['title' => 'ATS-Friendly CV: Complete Guide', 'description' => 'Optimize your CV to pass Applicant Tracking Systems.', 'read_time' => '10 min read', 'category' => 'Advanced', 'is_featured' => true],
            ['title' => 'CV Format: Which One is Right for You?', 'description' => 'Chronological, functional, or combination? Find out which works best.', 'read_time' => '6 min read', 'category' => 'Beginner', 'is_featured' => false],
            ['title' => 'Power Words to Make Your CV Stand Out', 'description' => 'Use action verbs and power words to make an impact.', 'read_time' => '5 min read', 'category' => 'Tips', 'is_featured' => false],
            ['title' => 'Common CV Mistakes to Avoid', 'description' => 'Learn what not to do when writing your CV.', 'read_time' => '7 min read', 'category' => 'Beginner', 'is_featured' => false],
            ['title' => 'How to Quantify Your Achievements', 'description' => 'Use numbers and metrics to showcase your impact.', 'read_time' => '6 min read', 'category' => 'Advanced', 'is_featured' => false],
        ];

        $coverLetterTips = [
            ['title' => 'Personalize Every Letter', 'description' => 'Address the hiring manager by name and tailor content to the specific role.', 'icon' => 'Person'],
            ['title' => 'Lead with Your Best', 'description' => 'Start with a compelling hook that showcases your most relevant achievement.', 'icon' => 'Lightbulb'],
            ['title' => 'Show Company Knowledge', 'description' => "Demonstrate you've researched the company and understand their needs.", 'icon' => 'BusinessCenter'],
            ['title' => 'Highlight Unique Value', 'description' => "Explain what makes you different and why you're the perfect fit.", 'icon' => 'AutoAwesome'],
            ['title' => 'Tell a Story', 'description' => 'Use storytelling to make your experience memorable and engaging.', 'icon' => 'FormatQuote'],
            ['title' => 'Include a Clear CTA', 'description' => 'End with a strong call-to-action requesting an interview.', 'icon' => 'CheckCircle'],
        ];

        $interviewPrep = [
            ['title' => 'Top 50 Interview Questions & Answers', 'description' => 'Prepare for the most common interview questions with expert answers.', 'read_time' => '15 min read', 'category' => 'Essential'],
            ['title' => 'STAR Method: Complete Guide', 'description' => 'Master behavioral interview questions with the STAR technique.', 'read_time' => '8 min read', 'category' => 'Technique'],
            ['title' => 'Virtual Interview Tips', 'description' => 'Ace your video interviews with these proven strategies.', 'read_time' => '6 min read', 'category' => 'Remote'],
            ['title' => 'Questions to Ask the Interviewer', 'description' => 'Impress hiring managers with thoughtful questions.', 'read_time' => '5 min read', 'category' => 'Strategy'],
        ];

        $careerAdvice = [
            ['title' => 'How to Successfully Change Careers', 'description' => 'A complete guide to transitioning into a new industry.', 'read_time' => '12 min read', 'icon' => 'School'],
            ['title' => 'Negotiating Your Salary: Expert Tips', 'description' => 'Get the compensation you deserve with these strategies.', 'read_time' => '8 min read', 'icon' => 'TrendingUp'],
            ['title' => 'Building Your Personal Brand', 'description' => 'Stand out in a competitive job market with strong personal branding.', 'read_time' => '10 min read', 'icon' => 'AutoAwesome'],
            ['title' => 'Networking Strategies That Work', 'description' => 'Build meaningful professional relationships that advance your career.', 'read_time' => '7 min read', 'icon' => 'Psychology'],
        ];

        $this->seedType('cv_guide', $cvGuides);
        $this->seedType('cover_letter_tip', $coverLetterTips);
        $this->seedType('interview_prep', $interviewPrep);
        $this->seedType('career_advice', $careerAdvice);

        $faqs = [
            ['question' => 'How long should my CV be?', 'answer' => 'For most professionals, a CV should be 1-2 pages. Entry-level candidates should aim for 1 page, while experienced professionals can extend to 2 pages. Academic CVs can be longer. Focus on relevance over length – include only information that adds value to your application.'],
            ['question' => 'Should I include a photo on my CV?', 'answer' => "It depends on your location and industry. In the US and UK, photos are generally not recommended to avoid potential bias. In Europe and some Asian countries, photos are more common. When in doubt, research the norms for your target country and industry."],
            ['question' => 'How far back should my work history go?', 'answer' => "Generally, include the last 10-15 years of relevant work experience. Older positions can be summarized briefly or omitted unless they're directly relevant to the role you're applying for. Focus on quality over quantity."],
            ['question' => 'What file format should I use for my CV?', 'answer' => 'PDF is the most universally accepted format as it preserves formatting across devices. Some ATS systems prefer Word documents (.docx). When in doubt, check the job posting for specific requirements or submit both formats.'],
            ['question' => 'How do I explain employment gaps?', 'answer' => "Be honest and brief. Focus on any productive activities during the gap – freelancing, volunteering, education, or personal development. If asked in an interview, explain what you learned and how it makes you a better candidate."],
            ['question' => 'Should I customize my CV for each job application?', 'answer' => 'Yes! Tailoring your CV to each role significantly increases your chances. Focus on relevant keywords from the job description, highlight matching skills and experiences, and adjust your professional summary to align with the specific position.'],
            ['question' => 'What should I include in my cover letter?', 'answer' => 'A strong cover letter includes: a compelling opening that grabs attention, specific examples of relevant achievements, demonstration of company knowledge, explanation of why you\'re the ideal candidate, and a clear call-to-action. Keep it to one page.'],
            ['question' => 'How do I prepare for a virtual interview?', 'answer' => 'Test your technology beforehand, ensure good lighting and a clean background, dress professionally, maintain eye contact by looking at the camera, minimize distractions, and have your CV and notes nearby but not visible on screen.'],
        ];

        foreach ($faqs as $i => $faq) {
            Faq::updateOrCreate(
                ['page' => 'resources', 'question' => $faq['question']],
                ['answer' => $faq['answer'], 'sort_order' => $i + 1, 'is_active' => true]
            );
        }
    }

    private function seedType(string $type, array $items): void
    {
        foreach ($items as $i => $item) {
            Resource::updateOrCreate(
                ['type' => $type, 'title' => $item['title']],
                [
                    'description' => $item['description'] ?? null,
                    'read_time' => $item['read_time'] ?? null,
                    'icon' => $item['icon'] ?? null,
                    'category' => $item['category'] ?? null,
                    'is_featured' => $item['is_featured'] ?? false,
                    'sort_order' => $i + 1,
                    'is_published' => true,
                ]
            );
        }
    }
}
