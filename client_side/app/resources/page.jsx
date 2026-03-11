// app/resources/page.jsx
'use client';

import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tabs,
    Tab,
    Chip,
    Grid,
    useTheme,
    useMediaQuery,
    TextField,
    InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Icons
import DescriptionIcon from '@mui/icons-material/Description';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

// Styled Components
const PageWrapper = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
});

const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: theme.spacing(20, 2, 12),
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(16, 2, 10),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(14, 2, 8),
    },
}));

const HeroDecoration = styled(Box)({
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    top: '-200px',
    right: '-100px',
});

const HeroDecoration2 = styled(Box)({
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    bottom: '-100px',
    left: '-50px',
});

const MainContent = styled(Box)(({ theme }) => ({
    flex: 1,
    backgroundColor: '#f8fafc',
    marginTop: '-60px',
    position: 'relative',
    zIndex: 1,
}));

const CategoryCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
    height: '100%',
    borderRadius: theme.spacing(2),
    border: active ? '2px solid #667eea' : '2px solid transparent',
    boxShadow: active ? '0 10px 40px rgba(102, 126, 234, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.15)',
        borderColor: '#667eea',
    },
}));

const IconWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'bgcolor',
})(({ bgcolor }) => ({
    width: 60,
    height: 60,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: bgcolor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    marginBottom: 16,
    '& .MuiSvgIcon-root': {
        fontSize: '1.75rem',
        color: '#ffffff',
    },
}));

const ArticleCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: theme.spacing(2),
    border: '1px solid #e2e8f0',
    boxShadow: 'none',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
        borderColor: '#667eea',
    },
}));

const ArticleImage = styled(Box)(({ theme }) => ({
    height: 180,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.1)',
    },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    borderRadius: `${theme.spacing(2)} !important`,
    border: '1px solid #e2e8f0',
    boxShadow: 'none',
    marginBottom: theme.spacing(2),
    '&::before': {
        display: 'none',
    },
    '&.Mui-expanded': {
        margin: `0 0 ${theme.spacing(2)} 0`,
        borderColor: '#667eea',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    '& .MuiAccordionSummary-content': {
        margin: '12px 0',
    },
    '&.Mui-expanded': {
        backgroundColor: 'rgba(102, 126, 234, 0.03)',
    },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    '& .MuiTabs-indicator': {
        display: 'none',
    },
    '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.9rem',
        color: '#64748b',
        borderRadius: theme.spacing(1.5),
        minHeight: 48,
        transition: 'all 0.3s ease',
        '&.Mui-selected': {
            color: '#ffffff',
            backgroundColor: '#667eea',
        },
        '&:hover:not(.Mui-selected)': {
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
        },
    },
}));

const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: theme.spacing(3),
        color: '#ffffff',
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#EAB308',
        },
    },
    '& .MuiInputBase-input': {
        color: '#ffffff',
        '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.7)',
            opacity: 1,
        },
    },
}));

const TipCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    padding: theme.spacing(2.5),
    borderRadius: theme.spacing(2),
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: '#667eea',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
    },
}));

const ResourcesPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [activeCategory, setActiveCategory] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Categories
    const categories = [
        {
            id: 0,
            title: 'CV Writing Guide',
            icon: <DescriptionIcon />,
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            description: 'Master the art of writing compelling CVs',
            articleCount: 12,
        },
        {
            id: 1,
            title: 'Cover Letter Tips',
            icon: <MailOutlineIcon />,
            color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            description: 'Create cover letters that get noticed',
            articleCount: 8,
        },
        {
            id: 2,
            title: 'Interview Prep',
            icon: <WorkIcon />,
            color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            description: 'Ace your interviews with confidence',
            articleCount: 15,
        },
        {
            id: 3,
            title: 'Career Advice',
            icon: <TrendingUpIcon />,
            color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            description: 'Navigate your career path successfully',
            articleCount: 10,
        },
        {
            id: 4,
            title: 'FAQ',
            icon: <HelpOutlineIcon />,
            color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            description: 'Find answers to common questions',
            articleCount: 20,
        },
    ];

    // CV Writing Guide Content
    const cvWritingGuides = [
        {
            id: 1,
            title: 'How to Write a Perfect CV in 2024',
            description: 'Learn the essential components of a modern CV that gets results.',
            readTime: '8 min read',
            category: 'Beginner',
            featured: true,
        },
        {
            id: 2,
            title: 'ATS-Friendly CV: Complete Guide',
            description: 'Optimize your CV to pass Applicant Tracking Systems.',
            readTime: '10 min read',
            category: 'Advanced',
            featured: true,
        },
        {
            id: 3,
            title: 'CV Format: Which One is Right for You?',
            description: 'Chronological, functional, or combination? Find out which works best.',
            readTime: '6 min read',
            category: 'Beginner',
            featured: false,
        },
        {
            id: 4,
            title: 'Power Words to Make Your CV Stand Out',
            description: 'Use action verbs and power words to make an impact.',
            readTime: '5 min read',
            category: 'Tips',
            featured: false,
        },
        {
            id: 5,
            title: 'Common CV Mistakes to Avoid',
            description: 'Learn what not to do when writing your CV.',
            readTime: '7 min read',
            category: 'Beginner',
            featured: false,
        },
        {
            id: 6,
            title: 'How to Quantify Your Achievements',
            description: 'Use numbers and metrics to showcase your impact.',
            readTime: '6 min read',
            category: 'Advanced',
            featured: false,
        },
    ];

    // Cover Letter Tips
    const coverLetterTips = [
        {
            icon: <PersonIcon />,
            title: 'Personalize Every Letter',
            description: 'Address the hiring manager by name and tailor content to the specific role.',
        },
        {
            icon: <LightbulbIcon />,
            title: 'Lead with Your Best',
            description: 'Start with a compelling hook that showcases your most relevant achievement.',
        },
        {
            icon: <BusinessCenterIcon />,
            title: 'Show Company Knowledge',
            description: "Demonstrate you've researched the company and understand their needs.",
        },
        {
            icon: <AutoAwesomeIcon />,
            title: 'Highlight Unique Value',
            description: "Explain what makes you different and why you're the perfect fit.",
        },
        {
            icon: <FormatQuoteIcon />,
            title: 'Tell a Story',
            description: 'Use storytelling to make your experience memorable and engaging.',
        },
        {
            icon: <CheckCircleIcon />,
            title: 'Include a Clear CTA',
            description: 'End with a strong call-to-action requesting an interview.',
        },
    ];

    // Interview Prep Content
    const interviewPrepContent = [
        {
            id: 1,
            title: 'Top 50 Interview Questions & Answers',
            description: 'Prepare for the most common interview questions with expert answers.',
            readTime: '15 min read',
            category: 'Essential',
        },
        {
            id: 2,
            title: 'STAR Method: Complete Guide',
            description: 'Master behavioral interview questions with the STAR technique.',
            readTime: '8 min read',
            category: 'Technique',
        },
        {
            id: 3,
            title: 'Virtual Interview Tips',
            description: 'Ace your video interviews with these proven strategies.',
            readTime: '6 min read',
            category: 'Remote',
        },
        {
            id: 4,
            title: 'Questions to Ask the Interviewer',
            description: 'Impress hiring managers with thoughtful questions.',
            readTime: '5 min read',
            category: 'Strategy',
        },
    ];

    // Career Advice Articles
    const careerAdviceArticles = [
        {
            id: 1,
            title: 'How to Successfully Change Careers',
            description: 'A complete guide to transitioning into a new industry.',
            readTime: '12 min read',
            icon: <SchoolIcon />,
        },
        {
            id: 2,
            title: 'Negotiating Your Salary: Expert Tips',
            description: 'Get the compensation you deserve with these strategies.',
            readTime: '8 min read',
            icon: <TrendingUpIcon />,
        },
        {
            id: 3,
            title: 'Building Your Personal Brand',
            description: 'Stand out in a competitive job market with strong personal branding.',
            readTime: '10 min read',
            icon: <AutoAwesomeIcon />,
        },
        {
            id: 4,
            title: 'Networking Strategies That Work',
            description: 'Build meaningful professional relationships that advance your career.',
            readTime: '7 min read',
            icon: <PsychologyIcon />,
        },
    ];

    // FAQ Content
    const faqContent = [
        {
            question: 'How long should my CV be?',
            answer: 'For most professionals, a CV should be 1-2 pages. Entry-level candidates should aim for 1 page, while experienced professionals can extend to 2 pages. Academic CVs can be longer. Focus on relevance over length – include only information that adds value to your application.',
        },
        {
            question: 'Should I include a photo on my CV?',
            answer: "It depends on your location and industry. In the US and UK, photos are generally not recommended to avoid potential bias. In Europe and some Asian countries, photos are more common. When in doubt, research the norms for your target country and industry.",
        },
        {
            question: 'How far back should my work history go?',
            answer: "Generally, include the last 10-15 years of relevant work experience. Older positions can be summarized briefly or omitted unless they're directly relevant to the role you're applying for. Focus on quality over quantity.",
        },
        {
            question: 'What file format should I use for my CV?',
            answer: 'PDF is the most universally accepted format as it preserves formatting across devices. Some ATS systems prefer Word documents (.docx). When in doubt, check the job posting for specific requirements or submit both formats.',
        },
        {
            question: 'How do I explain employment gaps?',
            answer: "Be honest and brief. Focus on any productive activities during the gap – freelancing, volunteering, education, or personal development. If asked in an interview, explain what you learned and how it makes you a better candidate.",
        },
        {
            question: 'Should I customize my CV for each job application?',
            answer: 'Yes! Tailoring your CV to each role significantly increases your chances. Focus on relevant keywords from the job description, highlight matching skills and experiences, and adjust your professional summary to align with the specific position.',
        },
        {
            question: 'What should I include in my cover letter?',
            answer: 'A strong cover letter includes: a compelling opening that grabs attention, specific examples of relevant achievements, demonstration of company knowledge, explanation of why you\'re the ideal candidate, and a clear call-to-action. Keep it to one page.',
        },
        {
            question: 'How do I prepare for a virtual interview?',
            answer: 'Test your technology beforehand, ensure good lighting and a clean background, dress professionally, maintain eye contact by looking at the camera, minimize distractions, and have your CV and notes nearby but not visible on screen.',
        },
    ];

    const handleCategoryChange = (newValue) => {
        setActiveCategory(newValue);
    };

    const handleFaqChange = (panel) => (event, isExpanded) => {
        setExpandedFaq(isExpanded ? panel : null);
    };

    // Render content based on active category
    const renderContent = () => {
        switch (activeCategory) {
            case 0:
                return renderCVWritingGuide();
            case 1:
                return renderCoverLetterTips();
            case 2:
                return renderInterviewPrep();
            case 3:
                return renderCareerAdvice();
            case 4:
                return renderFAQ();
            default:
                return renderCVWritingGuide();
        }
    };

    // CV Writing Guide Section
    const renderCVWritingGuide = () => (
        <Box>
            <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                CV Writing Guide
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                Master the art of CV writing with our comprehensive guides. From basics to advanced
                techniques, learn everything you need to create a CV that stands out.
            </Typography>

            {/* Featured Articles */}
            <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 3 }}>
                Featured Guides
            </Typography>
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {cvWritingGuides.filter(a => a.featured).map((article) => (
                    <Grid item xs={12} md={6} key={article.id}>
                        <ArticleCard>
                            <ArticleImage>
                                <DescriptionIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.8)' }} />
                            </ArticleImage>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <Chip
                                        label={article.category}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                            color: '#667eea',
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Chip
                                        icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                                        label={article.readTime}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#f1f5f9',
                                            color: '#64748b',
                                        }}
                                    />
                                </Box>
                                <Typography variant="h6" fontWeight="700" gutterBottom>
                                    {article.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {article.description}
                                </Typography>
                                <Button
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        color: '#667eea',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        p: 0,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: '#764ba2',
                                        },
                                    }}
                                >
                                    Read Guide
                                </Button>
                            </CardContent>
                        </ArticleCard>
                    </Grid>
                ))}
            </Grid>

            {/* All Articles */}
            <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 3 }}>
                All Guides
            </Typography>
            <Grid container spacing={3}>
                {cvWritingGuides.filter(a => !a.featured).map((article) => (
                    <Grid item xs={12} sm={6} lg={4} key={article.id}>
                        <ArticleCard sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <Chip
                                        label={article.category}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                            color: '#667eea',
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                        }}
                                    />
                                </Box>
                                <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                                    {article.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {article.description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTimeIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {article.readTime}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </ArticleCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    // Cover Letter Tips Section
    const renderCoverLetterTips = () => (
        <Box>
            <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                Cover Letter Tips
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                Learn how to write compelling cover letters that complement your CV and
                help you stand out from other applicants.
            </Typography>

            {/* Quick Tips Grid */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {coverLetterTips.map((tip, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={index}>
                        <TipCard>
                            <IconWrapper
                                bgcolor="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                sx={{ width: 48, height: 48, borderRadius: 2, flexShrink: 0 }}
                            >
                                {tip.icon}
                            </IconWrapper>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                                    {tip.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {tip.description}
                                </Typography>
                            </Box>
                        </TipCard>
                    </Grid>
                ))}
            </Grid>

            {/* Cover Letter Template CTA */}
            <Box
                sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    textAlign: 'center',
                }}
            >
                <MailOutlineIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                <Typography variant="h5" fontWeight="700" gutterBottom>
                    Ready to Write Your Cover Letter?
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 500, margin: '0 auto 24px' }}>
                    Use our professional cover letter templates and AI-powered writing assistant.
                </Typography>
                <Link href="/motivation-letters" passHref style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            backgroundColor: '#ffffff',
                            color: '#059669',
                            fontWeight: 600,
                            textTransform: 'none',
                            borderRadius: 3,
                            px: 4,
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.9)',
                            },
                        }}
                    >
                        Browse Templates
                    </Button>
                </Link>
            </Box>
        </Box>
    );

    // Interview Prep Section
    const renderInterviewPrep = () => (
        <Box>
            <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                Interview Preparation
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                Prepare for your next interview with confidence. From common questions to
                advanced techniques, we've got you covered.
            </Typography>

            {/* Interview Prep Articles */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
                {interviewPrepContent.map((article) => (
                    <Grid item xs={12} sm={6} key={article.id}>
                        <ArticleCard sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <Chip
                                        label={article.category}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                            color: '#d97706',
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Chip
                                        icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                                        label={article.readTime}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#f1f5f9',
                                            color: '#64748b',
                                        }}
                                    />
                                </Box>
                                <Typography variant="h6" fontWeight="700" gutterBottom>
                                    {article.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {article.description}
                                </Typography>
                                <Button
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        color: '#d97706',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        p: 0,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: '#b45309',
                                        },
                                    }}
                                >
                                    Read Article
                                </Button>
                            </CardContent>
                        </ArticleCard>
                    </Grid>
                ))}
            </Grid>

            {/* Interview Checklist */}
            <Box
                sx={{
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                }}
            >
                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiObjectsIcon sx={{ color: '#f59e0b' }} />
                    Quick Interview Checklist
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {[
                        'Research the company thoroughly',
                        'Prepare your STAR stories',
                        'Review the job description',
                        'Prepare questions to ask',
                        'Plan your outfit the night before',
                        'Test your tech for virtual interviews',
                        'Arrive 10-15 minutes early',
                        'Bring extra copies of your CV',
                    ].map((item, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                                <Typography variant="body2">{item}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );

    // Career Advice Section
    const renderCareerAdvice = () => (
        <Box>
            <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                Career Advice
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                Navigate your career path with expert advice on job searching,
                networking, salary negotiation, and professional development.
            </Typography>

            {/* Career Advice Articles */}
            <Grid container spacing={3}>
                {careerAdviceArticles.map((article) => (
                    <Grid item xs={12} sm={6} key={article.id}>
                        <ArticleCard sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <IconWrapper
                                    bgcolor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                                    sx={{ width: 48, height: 48, borderRadius: 2 }}
                                >
                                    {article.icon}
                                </IconWrapper>
                                <Typography variant="h6" fontWeight="700" gutterBottom>
                                    {article.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {article.description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <AccessTimeIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {article.readTime}
                                        </Typography>
                                    </Box>
                                    <Button
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            color: '#8b5cf6',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                                color: '#7c3aed',
                                            },
                                        }}
                                    >
                                        Read
                                    </Button>
                                </Box>
                            </CardContent>
                        </ArticleCard>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    // FAQ Section
    const renderFAQ = () => (
        <Box>
            <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                Find answers to the most common questions about CV writing,
                cover letters, and job searching.
            </Typography>

            {/* FAQ Accordions */}
            <Box sx={{ maxWidth: 800 }}>
                {faqContent.map((faq, index) => (
                    <StyledAccordion
                        key={index}
                        expanded={expandedFaq === index}
                        onChange={handleFaqChange(index)}
                    >
                        <StyledAccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                        >
                            <Typography variant="subtitle1" fontWeight="600">
                                {faq.question}
                            </Typography>
                        </StyledAccordionSummary>
                        <AccordionDetails sx={{ px: 3, pb: 3 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                {faq.answer}
                            </Typography>
                        </AccordionDetails>
                    </StyledAccordion>
                ))}
            </Box>

            {/* Still Have Questions CTA */}
            <Box
                sx={{
                    mt: 5,
                    p: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    textAlign: 'center',
                }}
            >
                <HelpOutlineIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                <Typography variant="h5" fontWeight="700" gutterBottom>
                    Still Have Questions?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, margin: '0 auto 24px' }}>
                    Can't find what you're looking for? Our support team is here to help.
                </Typography>
                <Button
                    variant="outlined"
                    size="large"
                    sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 4,
                        borderWidth: 2,
                        '&:hover': {
                            borderWidth: 2,
                            backgroundColor: '#667eea',
                            color: '#ffffff',
                        },
                    }}
                >
                    Contact Support
                </Button>
            </Box>
        </Box>
    );

    return (
        <PageWrapper>
            <Navbar />

            {/* Hero Section */}
            <HeroSection>
                <HeroDecoration />
                <HeroDecoration2 />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box textAlign="center" color="#ffffff">
                        <Typography
                            variant={isMobile ? 'h4' : 'h2'}
                            fontWeight="700"
                            gutterBottom
                        >
                            Career Resources
                            <Box component="span" sx={{ color: '#EAB308', display: 'block' }}>
                                & Guides
                            </Box>
                        </Typography>
                        <Typography
                            variant={isMobile ? 'body1' : 'h6'}
                            sx={{
                                maxWidth: 600,
                                margin: '0 auto 32px',
                                opacity: 0.9,
                                lineHeight: 1.7,
                            }}
                        >
                            Everything you need to succeed in your job search. From CV writing
                            tips to interview preparation, we've got you covered.
                        </Typography>

                        {/* Search Bar */}
                        <Box sx={{ maxWidth: 500, width: '100%', margin: '0 auto' }}>
                            <TextField
                                fullWidth
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 3,
                                        color: '#ffffff',
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.4)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#EAB308',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: '#ffffff',
                                        '&::placeholder': {
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            opacity: 1,
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Container>
            </HeroSection>

            {/* Main Content */}
            <MainContent>
                <Container maxWidth="lg" sx={{ py: 6 }}>
                    {/* Category Cards */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {categories.map((category) => (
                            <Grid item xs={6} sm={4} md={2.4} key={category.id}>
                                <CategoryCard
                                    active={activeCategory === category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                >
                                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                        <IconWrapper bgcolor={category.color} sx={{ margin: '0 auto 12px' }}>
                                            {category.icon}
                                        </IconWrapper>
                                        <Typography
                                            variant="subtitle2"
                                            fontWeight="700"
                                            gutterBottom
                                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                        >
                                            {category.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: { xs: 'none', sm: 'block' } }}
                                        >
                                            {category.articleCount} articles
                                        </Typography>
                                    </CardContent>
                                </CategoryCard>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Content Area */}
                    <Box sx={{ backgroundColor: '#ffffff', borderRadius: 4, p: { xs: 3, md: 5 } }}>
                        {renderContent()}
                    </Box>
                </Container>
            </MainContent>

            <Footer />
        </PageWrapper>
    );
};

export default ResourcesPage;