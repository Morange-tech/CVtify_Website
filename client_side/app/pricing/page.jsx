'use client';

import React, { useMemo, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Switch,
    Chip,
    Grid,
    useTheme,
    useMediaQuery,
    Divider,
    Alert,
    Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useUpgradeContent from '../hooks/useUpgradeContent';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudIcon from '@mui/icons-material/Cloud';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DiamondIcon from '@mui/icons-material/Diamond';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

// Styled Components
const PageWrapper = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
});

const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: theme.spacing(20, 2, 15),
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(16, 2, 12),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(14, 2, 10),
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
    marginTop: '-80px',
    position: 'relative',
    zIndex: 1,
    paddingBottom: theme.spacing(10),
}));

const ToggleWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(6),
}));

const PricingCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'featured' && prop !== 'custom',
})(({ theme, featured, custom }) => ({
    height: '100%',
    borderRadius: theme.spacing(3),
    border: featured ? '2px solid #EAB308' : custom ? '2px dashed #8b5cf6' : '1px solid #e2e8f0',
    boxShadow: featured ? '0 20px 60px rgba(234, 179, 8, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    overflow: 'visible',
    transition: 'all 0.3s ease',
    transform: featured ? 'scale(1.05)' : 'none',
    zIndex: featured ? 2 : 1,
    '&:hover': {
        transform: featured ? 'scale(1.07)' : 'translateY(-10px)',
        boxShadow: featured
            ? '0 25px 70px rgba(234, 179, 8, 0.25)'
            : '0 20px 50px rgba(0, 0, 0, 0.1)',
    },
    [theme.breakpoints.down('md')]: {
        transform: 'none',
        '&:hover': {
            transform: 'translateY(-10px)',
        },
    },
}));

const BadgeWrapper = styled(Box)({
    position: 'absolute',
    top: -15,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
});

const PlanBadge = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'badgetype',
})(({ badgetype }) => {
    const styles = {
        free: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
        },
        pro: {
            background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
            color: '#000000',
        },
        proplus: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
        },
        custom: {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: '#ffffff',
        },
        enterprise: {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: '#ffffff',
        },
        premium: {
            background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
            color: '#ffffff',
        },
        default: {
            background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
            color: '#ffffff',
        },
    };

    return {
        ...(styles[badgetype] || styles.default),
        fontWeight: 700,
        fontSize: '0.8rem',
        padding: '4px 16px',
        height: 32,
        letterSpacing: '0.5px',
    };
});

const IconWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'bgcolor',
})(({ bgcolor }) => ({
    width: 70,
    height: 70,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: bgcolor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    margin: '0 auto 20px',
    '& .MuiSvgIcon-root': {
        fontSize: '2rem',
        color: '#ffffff',
    },
}));

const FeatureItem = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'included',
})(({ included }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    color: included ? '#1e293b' : '#94a3b8',
    '& .MuiSvgIcon-root': {
        fontSize: 20,
        color: included ? '#10b981' : '#cbd5e1',
    },
}));

const PriceDisplay = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

const CompareTable = styled(Box)(({ theme }) => ({
    backgroundColor: '#ffffff',
    borderRadius: theme.spacing(3),
    overflowX: 'auto',
    overflowY: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const TableRow = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'columns' && prop !== 'header',
})(({ theme, columns, header }) => ({
    display: 'grid',
    gridTemplateColumns: columns || '2fr 1fr 1fr 1fr',
    padding: theme.spacing(2, 3),
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: header ? '#f8fafc' : '#ffffff',
    fontWeight: header ? 700 : 400,
    minWidth: 700,
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1.5, 2),
        fontSize: '0.85rem',
    },
}));

const normalizeText = (value = '') => String(value).trim().toLowerCase();

const iconMap = {
    document: <DescriptionIcon />,
    rocket: <RocketLaunchIcon />,
    support: <SupportAgentIcon />,
    diamond: <DiamondIcon />,
    premium: <WorkspacePremiumIcon />,
    business: <BusinessCenterIcon />,
};

const iconBgMap = {
    free: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    pro: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
    proplus: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    custom: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    enterprise: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    premium: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const getDynamicBadge = (plan, id) => {
    if (plan?.badge) return plan.badge;
    if (plan?.featured) return 'POPULAR';
    if (id === 'free') return 'FREE';
    if (id === 'custom' || id === 'enterprise') return 'ENTERPRISE';
    return 'PLAN';
};

const getDynamicBadgeType = (plan, id) => {
    return normalizeText(plan?.badgeType || plan?.type || id || 'default');
};

const getDynamicIconKey = (plan, id) => {
    const raw = normalizeText(plan?.icon || plan?.iconKey || plan?.type || id);

    if (iconMap[raw]) return raw;
    if (raw.includes('free')) return 'document';
    if (raw.includes('pro')) return 'rocket';
    if (raw.includes('custom') || raw.includes('enterprise')) return 'support';
    if (raw.includes('premium')) return 'premium';
    if (raw.includes('diamond')) return 'diamond';
    return 'document';
};

const getPlanIcon = (plan, id) => {
    const key = getDynamicIconKey(plan, id);
    return iconMap[key] || <DescriptionIcon />;
};

const getPlanIconBg = (plan, id) => {
    const type = getDynamicBadgeType(plan, id);
    return iconBgMap[type] || iconBgMap.default;
};

const normalizeFeatures = (features = []) => {
    if (!Array.isArray(features)) return [];

    return features.map((feature) => {
        if (typeof feature === 'string') {
            return {
                text: feature,
                included: true,
                compareValue: '✓',
            };
        }

        return {
            text: feature?.text || feature?.name || '',
            included: feature?.included ?? true,
            compareValue:
                feature?.compareValue ??
                feature?.value ??
                (feature?.included === false ? '—' : '✓'),
        };
    });
};

const normalizePlan = ([id, plan]) => {
    const normalizedFeatures = normalizeFeatures(plan?.features);

    return {
        id,
        name: plan?.name || id,
        description: plan?.description || '',
        monthlyPrice: plan?.monthlyPrice ?? plan?.monthly_price ?? 0,
        annualPrice: plan?.annualPrice ?? plan?.annual_price ?? 0,
        features: normalizedFeatures,
        cta: plan?.cta || (id === 'custom' ? 'Book a Call' : id === 'pro' ? 'Get Pro' : 'Start for Free'),
        ctaVariant: plan?.ctaVariant || (id === 'pro' ? 'contained' : 'outlined'),
        featured: plan?.featured ?? (id === 'pro'),
        badge: getDynamicBadge(plan, id),
        badgeType: getDynamicBadgeType(plan, id),
        iconKey: getDynamicIconKey(plan, id),
        isCustom: plan?.isCustom ?? (id === 'custom' || id === 'enterprise'),
        comparison: plan?.comparison || {},
    };
};

const buildComparisonRows = (plans) => {
    const featureMap = new Map();

    plans.forEach((plan) => {
        plan.features.forEach((feature) => {
            const key = normalizeText(feature.text);
            if (!key) return;

            if (!featureMap.has(key)) {
                featureMap.set(key, { name: feature.text });
            }

            featureMap.get(key)[plan.id] = feature.compareValue ?? (feature.included ? '✓' : '—');
        });

        if (plan.comparison && typeof plan.comparison === 'object') {
            Object.entries(plan.comparison).forEach(([name, value]) => {
                const key = normalizeText(name);
                if (!key) return;

                if (!featureMap.has(key)) {
                    featureMap.set(key, { name });
                }

                featureMap.get(key)[plan.id] = value;
            });
        }
    });

    return Array.from(featureMap.values());
};

const SkeletonCard = () => (
    <Card
        sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
    >
        <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Skeleton variant="circular" width={70} height={70} />
            </Box>
            <Skeleton variant="text" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" height={24} sx={{ mb: 3 }} />
            <Skeleton variant="text" height={60} sx={{ mb: 3 }} />
            <Divider sx={{ my: 3 }} />
            {[...Array(5)].map((_, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" height={24} sx={{ flex: 1 }} />
                </Box>
            ))}
            <Skeleton variant="rounded" height={48} sx={{ mt: 3, borderRadius: 3 }} />
        </CardContent>
    </Card>
);

const PricingPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isAnnual, setIsAnnual] = useState(true);

    const { plans: apiPlans, faqs, loading, error } = useUpgradeContent();

const plans = useMemo(() => {
    if (apiPlans && Object.keys(apiPlans).length > 0) {
        return Object.entries(apiPlans).map(normalizePlan);
    }
    return [];
}, [apiPlans]);

const faqList = useMemo(() => {
    if (Array.isArray(faqs) && faqs.length > 0) {
        return faqs.map((faq) => ({
            q: faq?.q || faq?.question || '',
            a: faq?.a || faq?.answer || '',
        }));
    }
    return [];
}, [faqs]);

    const comparisonRows = useMemo(() => buildComparisonRows(plans), [plans]);

    const comparisonColumns = `2fr ${plans.map(() => '1fr').join(' ')}`;

    return (
        <PageWrapper>
            <Navbar />

            <HeroSection>
                <HeroDecoration />
                <HeroDecoration2 />
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box textAlign="center" color="#ffffff">
                        <Chip
                            icon={<AutoAwesomeIcon sx={{ color: '#EAB308 !important' }} />}
                            label="Simple, transparent pricing"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: '#ffffff',
                                fontWeight: 600,
                                mb: 3,
                                backdropFilter: 'blur(10px)',
                            }}
                        />
                        <Typography variant={isMobile ? 'h4' : 'h2'} fontWeight="700" gutterBottom>
                            Choose Your
                            <Box component="span" sx={{ color: '#EAB308', display: 'block' }}>
                                Perfect Plan
                            </Box>
                        </Typography>
                        <Typography
                            variant={isMobile ? 'body1' : 'h6'}
                            sx={{
                                maxWidth: 600,
                                margin: '0 auto',
                                opacity: 0.9,
                                lineHeight: 1.7,
                            }}
                        >
                            Start for free and upgrade as you grow. All plans include access to our CV
                            builder with no hidden fees.
                        </Typography>
                    </Box>
                </Container>
            </HeroSection>

            <MainContent>
                <Container maxWidth="lg">
                    {error && (
                        <Alert severity="warning" sx={{ mb: 4 }}>
                            {error}
                        </Alert>
                    )}

                    <ToggleWrapper>
                        <Typography
                            variant="body1"
                            fontWeight={!isAnnual ? 700 : 400}
                            color={!isAnnual ? 'text.primary' : 'text.secondary'}
                        >
                            Monthly
                        </Typography>
                        <Switch
                            checked={isAnnual}
                            onChange={() => setIsAnnual(!isAnnual)}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#667eea',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#667eea',
                                },
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                                variant="body1"
                                fontWeight={isAnnual ? 700 : 400}
                                color={isAnnual ? 'text.primary' : 'text.secondary'}
                            >
                                Annual
                            </Typography>
                            <Chip
                                label="Save 20%"
                                size="small"
                                sx={{
                                    backgroundColor: '#10b981',
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                }}
                            />
                        </Box>
                    </ToggleWrapper>

<Grid container spacing={3} justifyContent="center" sx={{ mb: 10 }}>
    {loading ? (
        [...Array(3)].map((_, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
                <SkeletonCard />
            </Grid>
        ))
    ) : plans.length > 0 ? (
        plans.map((plan) => (
            <Grid item xs={12} sm={6} lg={4} key={plan.id}>
                <PricingCard featured={plan.featured} custom={plan.isCustom}>
                    <BadgeWrapper>
                        <PlanBadge
                            label={plan.badge}
                            badgetype={plan.badgeType}
                            icon={plan.featured ? <StarIcon sx={{ fontSize: 16 }} /> : undefined}
                        />
                    </BadgeWrapper>

                    <CardContent sx={{ p: 4, pt: 5 }}>
                        <IconWrapper bgcolor={getPlanIconBg(plan, plan.id)}>
                            {getPlanIcon(plan, plan.id)}
                        </IconWrapper>

                        <Typography
                            variant="h5"
                            fontWeight="700"
                            textAlign="center"
                            color={plan.featured ? '#EAB308' : 'text.primary'}
                            gutterBottom
                        >
                            {plan.name}
                        </Typography>

                        <Typography
                            variant="body2"
                            textAlign="center"
                            color="text.secondary"
                            sx={{ mb: 3, minHeight: 40 }}
                        >
                            {plan.description}
                        </Typography>

                        <PriceDisplay>
                            {plan.isCustom ? (
                                <Typography variant="h4" fontWeight="700" color="text.primary">
                                    Custom
                                </Typography>
                            ) : (
                                <>
                                    <Typography
                                        variant="h3"
                                        fontWeight="700"
                                        color={plan.featured ? '#EAB308' : 'text.primary'}
                                    >
                                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                    </Typography>
                                    <Box sx={{ ml: 1, pt: 0.5 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="700"
                                            color={plan.featured ? '#EAB308' : 'text.primary'}
                                        >
                                            $
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            per month
                                        </Typography>
                                    </Box>
                                </>
                            )}
                        </PriceDisplay>

                        {isAnnual && !plan.isCustom && plan.monthlyPrice > 0 && (
                            <Typography
                                variant="caption"
                                textAlign="center"
                                display="block"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Billed ${(plan.annualPrice * 12).toFixed(2)} annually
                            </Typography>
                        )}

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ mb: 4 }}>
                            {plan.features.map((feature, index) => (
                                <FeatureItem key={index} included={feature.included}>
                                    {feature.included ? <CheckCircleIcon /> : <CancelIcon />}
                                    <Typography variant="body2">{feature.text}</Typography>
                                </FeatureItem>
                            ))}
                        </Box>

                        <Link
                            href={plan.isCustom ? '/contact' : '/signup'}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                fullWidth
                                variant={plan.ctaVariant}
                                size="large"
                                endIcon={plan.isCustom ? <PhoneInTalkIcon /> : <ArrowForwardIcon />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    ...(plan.ctaVariant === 'contained' && {
                                        background: plan.featured
                                            ? 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)'
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: plan.featured ? '#000000' : '#ffffff',
                                        boxShadow: plan.featured
                                            ? '0 4px 15px rgba(234, 179, 8, 0.4)'
                                            : '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        '&:hover': {
                                            boxShadow: plan.featured
                                                ? '0 6px 20px rgba(234, 179, 8, 0.5)'
                                                : '0 6px 20px rgba(102, 126, 234, 0.5)',
                                        },
                                    }),
                                    ...(plan.ctaVariant === 'outlined' && {
                                        borderColor: plan.isCustom ? '#8b5cf6' : '#667eea',
                                        color: plan.isCustom ? '#8b5cf6' : '#667eea',
                                        borderWidth: 2,
                                        '&:hover': {
                                            borderWidth: 2,
                                            backgroundColor: plan.isCustom
                                                ? 'rgba(139, 92, 246, 0.05)'
                                                : 'rgba(102, 126, 234, 0.05)',
                                        },
                                    }),
                                }}
                            >
                                {plan.cta}
                            </Button>
                        </Link>
                    </CardContent>
                </PricingCard>
            </Grid>
        ))
    ) : (
        <Grid item xs={12}>
            <Alert severity="info">No pricing plans available at the moment.</Alert>
        </Grid>
    )}
</Grid>

                    <Box sx={{ mb: 10 }}>
                        <Typography variant="h4" fontWeight="700" textAlign="center" gutterBottom>
                            Compare Plans
                        </Typography>
                        <Typography
                            variant="body1"
                            textAlign="center"
                            color="text.secondary"
                            sx={{ mb: 5 }}
                        >
                            See what's included in each plan
                        </Typography>

                        <CompareTable>
    {loading ? (
        <>
            <TableRow header columns="2fr 1fr 1fr 1fr">
                <Skeleton variant="text" height={28} width={100} />
                <Skeleton variant="text" height={28} width={60} />
                <Skeleton variant="text" height={28} width={60} />
                <Skeleton variant="text" height={28} width={60} />
            </TableRow>

            {[...Array(6)].map((_, index) => (
                <TableRow key={index} columns="2fr 1fr 1fr 1fr">
                    <Skeleton variant="text" height={28} />
                    <Skeleton variant="text" height={28} sx={{ mx: 'auto', width: '60%' }} />
                    <Skeleton variant="text" height={28} sx={{ mx: 'auto', width: '60%' }} />
                    <Skeleton variant="text" height={28} sx={{ mx: 'auto', width: '60%' }} />
                </TableRow>
            ))}
        </>
    ) : plans.length > 0 && comparisonRows.length > 0 ? (
        <>
            <TableRow header columns={comparisonColumns}>
                <Box>Features</Box>
                {plans.map((plan) => (
                    <Box
                        key={plan.id}
                        sx={{
                            textAlign: 'center',
                            color: plan.featured
                                ? '#EAB308'
                                : plan.isCustom
                                ? '#8b5cf6'
                                : 'text.primary',
                        }}
                    >
                        {plan.name}
                    </Box>
                ))}
            </TableRow>

            {comparisonRows.map((row, index) => (
                <TableRow key={index} columns={comparisonColumns}>
                    <Box>{row.name}</Box>
                    {plans.map((plan) => (
                        <Box key={plan.id} sx={{ textAlign: 'center' }}>
                            {row[plan.id] ?? '—'}
                        </Box>
                    ))}
                </TableRow>
            ))}
        </>
    ) : (
        <Box sx={{ p: 4 }}>
            <Alert severity="info">No comparison data available.</Alert>
        </Box>
    )}
</CompareTable>

                        <Typography
                            variant="body2"
                            textAlign="center"
                            color="text.secondary"
                            sx={{ mt: 2, display: { sm: 'none' } }}
                        >
                            Scroll horizontally to see all plans →
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h5" fontWeight="700" gutterBottom>
                            Trusted by 250,000+ professionals
                        </Typography>
                        <Grid container spacing={4} sx={{ mt: 2, textAlign: 'left' }}>
    {loading ? (
        [...Array(4)].map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
                <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={24} width="80%" />
            </Grid>
        ))
    ) : faqList.length > 0 ? (
        faqList.map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
                <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                    {faq.q}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {faq.a}
                </Typography>
            </Grid>
        ))
    ) : (
        <Grid item xs={12}>
            <Alert severity="info">No FAQs available right now.</Alert>
        </Grid>
    )}
</Grid>
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 4,
                            p: { xs: 3, md: 6 },
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h5" fontWeight="700" gutterBottom>
                            Frequently Asked Questions
                        </Typography>

                        <Grid container spacing={4} sx={{ mt: 2, textAlign: 'left' }}>
                            {loading
                                ? [...Array(4)].map((_, index) => (
                                    <Grid item xs={12} md={6} key={index}>
                                        <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
                                        <Skeleton variant="text" height={24} />
                                        <Skeleton variant="text" height={24} />
                                        <Skeleton variant="text" height={24} width="80%" />
                                    </Grid>
                                ))
                                : faqList.map((faq, index) => (
                                    <Grid item xs={12} md={6} key={index}>
                                        <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                                            {faq.q}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {faq.a}
                                        </Typography>
                                    </Grid>
                                ))}
                        </Grid>
                    </Box>

                    <Box
                        sx={{
                            mt: 8,
                            p: { xs: 4, md: 6 },
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            textAlign: 'center',
                            color: '#ffffff',
                        }}
                    >
                        <Typography variant="h4" fontWeight="700" gutterBottom>
                            Ready to Build Your Perfect CV?
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ mb: 4, opacity: 0.9, maxWidth: 500, margin: '0 auto 32px' }}
                        >
                            Join thousands of professionals who landed their dream jobs with our CV builder.
                        </Typography>
                        <Link href="/signup" style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    backgroundColor: '#ffffff',
                                    color: '#667eea',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderRadius: 3,
                                    px: 5,
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    },
                                }}
                            >
                                Get Started for Free
                            </Button>
                        </Link>
                    </Box>
                </Container>
            </MainContent>

            <Footer />
        </PageWrapper>
    );
};

export default PricingPage; //fix it here dont create new file