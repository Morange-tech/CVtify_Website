// app/resources/page.jsx
'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Modal,
    Fade,
    Backdrop,
    CircularProgress,
    Skeleton,
    Alert,
    keyframes,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import useResources from '../hooks/useResources';

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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';

// Maps an icon key stored on the backend to the matching MUI icon component
const RESOURCE_ICON_MAP = {
    Person: PersonIcon,
    Lightbulb: LightbulbIcon,
    BusinessCenter: BusinessCenterIcon,
    AutoAwesome: AutoAwesomeIcon,
    FormatQuote: FormatQuoteIcon,
    CheckCircle: CheckCircleIcon,
    School: SchoolIcon,
    TrendingUp: TrendingUpIcon,
    Psychology: PsychologyIcon,
};
const getResourceIcon = (name, Fallback = DescriptionIcon) => {
    const IconComponent = RESOURCE_ICON_MAP[name] || Fallback;
    return <IconComponent />;
};

const scaleIn = keyframes`
    from { transform: scale(0); }
    to { transform: scale(1); }
`;

const SUPPORT_CATEGORY_VALUES = ['general', 'bug', 'billing', 'feature', 'account', 'template'];
const SUPPORT_PRIORITY_VALUES = ['low', 'medium', 'high', 'urgent'];

const EMPTY_SUPPORT_FORM = { subject: '', category: 'general', priority: 'medium', message: '' };

// Styled Components
const PageWrapper = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
});

const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
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
    border: active ? '2px solid #000000' : '2px solid transparent',
    boxShadow: active ? '0 10px 40px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
        borderColor: '#000000',
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
    background: bgcolor || 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
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
        borderColor: '#000000',
    },
}));

const ArticleImage = styled(Box)(({ theme }) => ({
    height: 180,
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
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
        borderColor: '#000000',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    '& .MuiAccordionSummary-content': {
        margin: '12px 0',
    },
    '&.Mui-expanded': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
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
            backgroundColor: '#000000',
        },
        '&:hover:not(.Mui-selected)': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
        borderColor: '#000000',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
}));

const ResourcesPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [activeCategory, setActiveCategory] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { t } = useLanguage();

    const supportCategories = SUPPORT_CATEGORY_VALUES.map((value) => ({
        value,
        label: t(`resourcesPage.contactModal.categories.${value}`),
    }));
    const supportPriorities = SUPPORT_PRIORITY_VALUES.map((value) => ({
        value,
        label: t(`resourcesPage.contactModal.priorities.${value}`),
    }));

    // Real content, managed from the admin dashboard
    const {
        cvGuides: cvWritingGuidesRaw,
        coverLetterTips: coverLetterTipsRaw,
        interviewPrep: interviewPrepRaw,
        careerAdvice: careerAdviceRaw,
        faqs: faqContentRaw,
        loading: resourcesLoading,
        error: resourcesError,
        refetch: refetchResources,
    } = useResources();

    // Live search — filters instantly as the user types, no debounce/network round-trip
    const q = searchQuery.trim().toLowerCase();
    const matches = useCallback(
        (...fields) => !q || fields.some((f) => (f || '').toLowerCase().includes(q)),
        [q]
    );

    const cvWritingGuides = useMemo(
        () => cvWritingGuidesRaw.filter((a) => matches(a.title, a.description)),
        [cvWritingGuidesRaw, matches]
    );
    const coverLetterTips = useMemo(
        () => coverLetterTipsRaw.filter((t) => matches(t.title, t.description)),
        [coverLetterTipsRaw, matches]
    );
    const interviewPrepContent = useMemo(
        () => interviewPrepRaw.filter((a) => matches(a.title, a.description)),
        [interviewPrepRaw, matches]
    );
    const careerAdviceArticles = useMemo(
        () => careerAdviceRaw.filter((a) => matches(a.title, a.description)),
        [careerAdviceRaw, matches]
    );
    const faqContent = useMemo(
        () => faqContentRaw.filter((f) => matches(f.question, f.answer)),
        [faqContentRaw, matches]
    );

    // Categories
    const categories = [
        {
            id: 0,
            title: t('resourcesPage.categories.cvGuide.title'),
            icon: <DescriptionIcon />,
            color: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            description: t('resourcesPage.categories.cvGuide.description'),
            articleCount: cvWritingGuidesRaw.length,
        },
        {
            id: 1,
            title: t('resourcesPage.categories.coverLetterTip.title'),
            icon: <MailOutlineIcon />,
            color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            description: t('resourcesPage.categories.coverLetterTip.description'),
            articleCount: coverLetterTipsRaw.length,
        },
        {
            id: 2,
            title: t('resourcesPage.categories.interviewPrep.title'),
            icon: <WorkIcon />,
            color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            description: t('resourcesPage.categories.interviewPrep.description'),
            articleCount: interviewPrepRaw.length,
        },
        {
            id: 3,
            title: t('resourcesPage.categories.careerAdvice.title'),
            icon: <TrendingUpIcon />,
            color: 'linear-gradient(135deg, #eab308 0%, #000000 100%)',
            description: t('resourcesPage.categories.careerAdvice.description'),
            articleCount: careerAdviceRaw.length,
        },
        {
            id: 4,
            title: t('resourcesPage.categories.faq.title'),
            icon: <HelpOutlineIcon />,
            color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            description: t('resourcesPage.categories.faq.description'),
            articleCount: faqContentRaw.length,
        },
    ];

    // ── Contact Support modal ──────────────────────────────────
    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [supportForm, setSupportForm] = useState(EMPTY_SUPPORT_FORM);
    const [supportFieldErrors, setSupportFieldErrors] = useState({});
    const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
    const [resultModal, setResultModal] = useState({ open: false, type: 'success', message: '' });

    const handleOpenContactSupport = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        setSupportForm(EMPTY_SUPPORT_FORM);
        setSupportFieldErrors({});
        setContactModalOpen(true);
    };

    const handleCloseContactSupport = () => {
        if (isSubmittingSupport) return;
        setContactModalOpen(false);
    };

    const updateSupportField = (field, value) => {
        setSupportForm((prev) => ({ ...prev, [field]: value }));
    };

    const showResultModal = (type, message) => {
        setResultModal({ open: true, type, message });
        setTimeout(() => {
            setResultModal((prev) => ({ ...prev, open: false }));
        }, 2500);
    };

    const handleSubmitSupport = async () => {
        const errors = {};
        const required = t('resourcesPage.contactModal.required');
        if (!supportForm.subject.trim()) errors.subject = required;
        if (!supportForm.category) errors.category = required;
        if (!supportForm.priority) errors.priority = required;
        if (!supportForm.message.trim()) errors.message = required;

        if (Object.keys(errors).length > 0) {
            setSupportFieldErrors(errors);
            showResultModal('error', t('resourcesPage.contactModal.fillAllFields'));
            return;
        }

        setIsSubmittingSupport(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support-tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(supportForm),
            });

            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(result?.message || t('resourcesPage.contactModal.failedToSend'));
            }

            setContactModalOpen(false);
            showResultModal('success', t('resourcesPage.contactModal.messageSent'));
        } catch (err) {
            showResultModal('error', err.message || t('resourcesPage.contactModal.genericError'));
        } finally {
            setIsSubmittingSupport(false);
        }
    };

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
                {t('resourcesPage.cvGuideSection.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                {t('resourcesPage.cvGuideSection.intro')}
            </Typography>

            {/* Featured Articles */}
            <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 3 }}>
                {t('resourcesPage.cvGuideSection.featuredGuides')}
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            color: '#000000',
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
                                        color: '#000000',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        p: 0,
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: '#1a1a1a',
                                        },
                                    }}
                                >
                                    {t('resourcesPage.cvGuideSection.readGuide')}
                                </Button>
                            </CardContent>
                        </ArticleCard>
                    </Grid>
                ))}
            </Grid>

            {/* All Articles */}
            <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 3 }}>
                {t('resourcesPage.cvGuideSection.allGuides')}
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                            color: '#000000',
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
                {t('resourcesPage.coverLetterSection.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                {t('resourcesPage.coverLetterSection.intro')}
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
                                {getResourceIcon(tip.icon, LightbulbIcon)}
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
                    {t('resourcesPage.coverLetterSection.ctaTitle')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 500, margin: '0 auto 24px' }}>
                    {t('resourcesPage.coverLetterSection.ctaText')}
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
                        {t('resourcesPage.coverLetterSection.browseTemplates')}
                    </Button>
                </Link>
            </Box>
        </Box>
    );

    // Interview Prep Section
    const renderInterviewPrep = () => (
        <Box>
            <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                {t('resourcesPage.interviewPrepSection.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                {t('resourcesPage.interviewPrepSection.intro')}
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
                                    {t('resourcesPage.interviewPrepSection.readArticle')}
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
                    {t('resourcesPage.interviewPrepSection.checklistTitle')}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {t('resourcesPage.interviewPrepSection.checklist').map((item, index) => (
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
                {t('resourcesPage.careerAdviceSection.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                {t('resourcesPage.careerAdviceSection.intro')}
            </Typography>

            {/* Career Advice Articles */}
            <Grid container spacing={3}>
                {careerAdviceArticles.map((article) => (
                    <Grid item xs={12} sm={6} key={article.id}>
                        <ArticleCard sx={{ height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <IconWrapper
                                    bgcolor="linear-gradient(135deg, #eab308 0%, #000000 100%)"
                                    sx={{ width: 48, height: 48, borderRadius: 2 }}
                                >
                                    {getResourceIcon(article.icon, TrendingUpIcon)}
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
                                            color: '#eab308',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                                color: '#000000',
                                            },
                                        }}
                                    >
                                        {t('resourcesPage.careerAdviceSection.read')}
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
                {t('resourcesPage.faqSection.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
                {t('resourcesPage.faqSection.intro')}
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
                            expandIcon={<ExpandMoreIcon sx={{ color: '#000000' }} />}
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
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(26, 26, 26, 0.05) 100%)',
                    textAlign: 'center',
                }}
            >
                <HelpOutlineIcon sx={{ fontSize: 48, color: '#000000', mb: 2 }} />
                <Typography variant="h5" fontWeight="700" gutterBottom>
                    {t('resourcesPage.faqSection.stillHaveQuestions')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, margin: '0 auto 24px' }}>
                    {t('resourcesPage.faqSection.stillHaveQuestionsText')}
                </Typography>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={handleOpenContactSupport}
                    sx={{
                        borderColor: '#000000',
                        color: '#000000',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 3,
                        px: 4,
                        borderWidth: 2,
                        '&:hover': {
                            borderWidth: 2,
                            backgroundColor: '#000000',
                            color: '#ffffff',
                        },
                    }}
                >
                    {t('resourcesPage.faqSection.contactSupport')}
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
                            {t('resourcesPage.heroTitle')}
                            <Box component="span" sx={{ color: '#EAB308', display: 'block' }}>
                                {t('resourcesPage.heroTitleAccent')}
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
                            {t('resourcesPage.heroSubtitle')}
                        </Typography>

                        {/* Search Bar */}
                        <Box sx={{ maxWidth: 500, width: '100%', margin: '0 auto' }}>
                            <TextField
                                fullWidth
                                placeholder={t('resourcesPage.searchPlaceholder')}
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
                        {resourcesError ? (
                            <Alert
                                severity="error"
                                action={
                                    <Button color="inherit" size="small" onClick={refetchResources} startIcon={<RefreshIcon />}>
                                        Retry
                                    </Button>
                                }
                            >
                                {resourcesError}
                            </Alert>
                        ) : resourcesLoading ? (
                            <Grid container spacing={3}>
                                {[...Array(6)].map((_, i) => (
                                    <Grid item xs={12} sm={6} lg={4} key={i}>
                                        <Skeleton variant="rounded" height={220} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            renderContent()
                        )}
                    </Box>
                </Container>
            </MainContent>

            {/* Contact Support Modal */}
            <Dialog open={contactModalOpen} onClose={handleCloseContactSupport} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{t('resourcesPage.contactModal.title')}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label={t('resourcesPage.contactModal.subject')}
                        value={supportForm.subject}
                        onChange={(e) => updateSupportField('subject', e.target.value)}
                        error={Boolean(supportFieldErrors.subject)}
                        helperText={supportFieldErrors.subject}
                        sx={{ mt: 1, mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <FormControl fullWidth error={Boolean(supportFieldErrors.category)}>
                            <InputLabel>{t('resourcesPage.contactModal.category')}</InputLabel>
                            <Select
                                label={t('resourcesPage.contactModal.category')}
                                value={supportForm.category}
                                onChange={(e) => updateSupportField('category', e.target.value)}
                            >
                                {supportCategories.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth error={Boolean(supportFieldErrors.priority)}>
                            <InputLabel>{t('resourcesPage.contactModal.priority')}</InputLabel>
                            <Select
                                label={t('resourcesPage.contactModal.priority')}
                                value={supportForm.priority}
                                onChange={(e) => updateSupportField('priority', e.target.value)}
                            >
                                {supportPriorities.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label={t('resourcesPage.contactModal.message')}
                        value={supportForm.message}
                        onChange={(e) => updateSupportField('message', e.target.value)}
                        error={Boolean(supportFieldErrors.message)}
                        helperText={supportFieldErrors.message}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseContactSupport} disabled={isSubmittingSupport} sx={{ textTransform: 'none', color: '#64748b' }}>
                        {t('resourcesPage.contactModal.cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmitSupport}
                        variant="contained"
                        disabled={isSubmittingSupport}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                        }}
                    >
                        {isSubmittingSupport ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : t('resourcesPage.contactModal.sendMessage')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success / Error result modal */}
            <Modal
                open={resultModal.open}
                onClose={() => setResultModal((prev) => ({ ...prev, open: false }))}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 300, sx: { backgroundColor: 'rgba(0, 0, 0, 0.4)' } } }}
            >
                <Fade in={resultModal.open}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#ffffff',
                            borderRadius: 3,
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                            p: 4,
                            maxWidth: 340,
                            width: '90%',
                            textAlign: 'center',
                            outline: 'none',
                        }}
                    >
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                backgroundColor: resultModal.type === 'success' ? '#dcfce7' : '#fee2e2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                                animation: `${scaleIn} 0.4s ease-out`,
                            }}
                        >
                            {resultModal.type === 'success' ? (
                                <CheckCircleIcon sx={{ fontSize: 36, color: '#16a34a' }} />
                            ) : (
                                <CancelIcon sx={{ fontSize: 36, color: '#dc2626' }} />
                            )}
                        </Box>
                        <Typography variant="body1" fontWeight="600" color="text.primary">
                            {resultModal.message}
                        </Typography>
                    </Box>
                </Fade>
            </Modal>

            <Footer />
        </PageWrapper>
    );
};

export default ResourcesPage;