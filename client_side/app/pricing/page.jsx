// app/pricing/page.jsx
'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DiamondIcon from '@mui/icons-material/Diamond';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import BrushIcon from '@mui/icons-material/Brush';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloudIcon from '@mui/icons-material/Cloud';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

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

const BadgeWrapper = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: -15,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
}));

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
    };

    return {
        ...styles[badgetype],
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
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
}));

const TableRow = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'header',
})(({ theme, header }) => ({
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    padding: theme.spacing(2, 3),
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: header ? '#f8fafc' : '#ffffff',
    fontWeight: header ? 700 : 400,
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
        padding: theme.spacing(1.5, 2),
        fontSize: '0.85rem',
    },
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

const PricingPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [isAnnual, setIsAnnual] = useState(true);

    // Pricing Plans
    const plans = [
        {
            id: 'free',
            name: 'Free',
            badge: 'FREE',
            badgeType: 'free',
            icon: <DescriptionIcon />,
            iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            description: 'Perfect for getting started with your first CV',
            monthlyPrice: 0,
            annualPrice: 0,
            features: [
                { text: '1 CV template', included: true },
                { text: 'Basic formatting', included: true },
                { text: 'PDF download', included: true },
                { text: 'Limited customization', included: true },
                { text: 'AI writing suggestions', included: false },
                { text: 'Cover letter templates', included: false },
                { text: 'Premium templates', included: false },
                { text: 'Priority support', included: false },
            ],
            cta: 'Start for Free',
            ctaVariant: 'outlined',
            featured: false,
        },
        {
            id: 'pro',
            name: 'Pro',
            badge: 'POPULAR',
            badgeType: 'pro',
            icon: <RocketLaunchIcon />,
            iconBg: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
            description: 'Everything you need to land your dream job',
            monthlyPrice: 9.99,
            annualPrice: 7.99,
            features: [
                { text: 'Unlimited CV templates', included: true },
                { text: 'Advanced formatting', included: true },
                { text: 'PDF & Word download', included: true },
                { text: 'Full customization', included: true },
                { text: 'AI writing suggestions', included: true },
                { text: '5 Cover letter templates', included: true },
                { text: 'Premium templates', included: false },
                { text: 'Priority support', included: false },
            ],
            cta: 'Get Pro',
            ctaVariant: 'contained',
            featured: true,
        },
        // {
        //     id: 'proplus',
        //     name: 'Pro Plus',
        //     badge: 'PRO PLUS',
        //     badgeType: 'proplus',
        //     icon: <DiamondIcon />,
        //     iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        //     description: 'Advanced features for serious job seekers',
        //     monthlyPrice: 19.99,
        //     annualPrice: 14.99,
        //     features: [
        //         { text: 'Everything in Pro', included: true },
        //         { text: 'All premium templates', included: true },
        //         { text: 'Unlimited cover letters', included: true },
        //         { text: 'LinkedIn optimization', included: true },
        //         { text: 'Advanced AI assistance', included: true },
        //         { text: 'ATS score checker', included: true },
        //         { text: 'Priority support', included: true },
        //         { text: 'Career coaching tips', included: true },
        //     ],
        //     cta: 'Get Pro Plus',
        //     ctaVariant: 'contained',
        //     featured: false,
        // },
        {
            id: 'custom',
            name: 'Custom',
            badge: 'ENTERPRISE',
            badgeType: 'custom',
            icon: <SupportAgentIcon />,
            iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            description: "Can't find what fits? Let's create a custom plan for you",
            monthlyPrice: null,
            annualPrice: null,
            features: [
                { text: 'Everything in Pro Plus', included: true },
                { text: 'Custom templates', included: true },
                { text: 'Dedicated support', included: true },
                { text: 'Team collaboration', included: true },
                { text: 'White-label options', included: true },
                { text: 'API access', included: true },
                { text: 'Custom integrations', included: true },
                { text: 'SLA guarantee', included: true },
            ],
            cta: 'Book a Call',
            ctaVariant: 'outlined',
            featured: false,
            isCustom: true,
        },
    ];

    // Comparison features
    const comparisonFeatures = [
        { name: 'CV Templates', free: '1', pro: 'Unlimited', custom: 'Custom' },    //proplus: 'Unlimited', 
        { name: 'Cover Letters', free: '—', pro: '5', custom: 'Custom' },  //proplus: 'Unlimited', 
        { name: 'AI Writing', free: '—', pro: '✓', custom: 'Custom' },   //proplus: 'Advanced', 
        { name: 'Download Formats', free: 'PDF', pro: 'PDF, Word', custom: 'All formats' },  //proplus: 'All formats', 
        { name: 'ATS Optimization', free: 'Basic', pro: '✓', custom: '✓' },   //proplus: 'Advanced', 
        { name: 'Support', free: 'Email', pro: 'Chat', custom: 'Dedicated' },  //proplus: 'Priority', 
        { name: 'Analytics', free: '—', pro: 'Basic', custom: 'Custom' },   //proplus: 'Advanced', 
    ];

    return (
        <PageWrapper>
            <Navbar />

            {/* Hero Section */}
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
                        <Typography
                            variant={isMobile ? 'h4' : 'h2'}
                            fontWeight="700"
                            gutterBottom
                        >
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
                            Start for free and upgrade as you grow. All plans include 
                            access to our CV builder with no hidden fees.
                        </Typography>
                    </Box>
                </Container>
            </HeroSection>

            {/* Main Content */}
            <MainContent>
                <Container maxWidth="lg">
                    {/* Billing Toggle */}
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

                    {/* Pricing Cards */}
                    <Grid container spacing={3} justifyContent="center" sx={{ mb: 10 }}>
                        {plans.map((plan) => (
                            <Grid item xs={12} sm={6} lg={3} key={plan.id}>
                                <PricingCard featured={plan.featured} custom={plan.isCustom}>
                                    {/* Badge */}
                                    <BadgeWrapper>
                                        <PlanBadge 
                                            label={plan.badge} 
                                            badgetype={plan.badgeType}
                                            icon={plan.featured ? <StarIcon sx={{ fontSize: 16 }} /> : undefined}
                                        />
                                    </BadgeWrapper>

                                    <CardContent sx={{ p: 4, pt: 5 }}>
                                        {/* Icon */}
                                        <IconWrapper bgcolor={plan.iconBg}>
                                            {plan.icon}
                                        </IconWrapper>

                                        {/* Plan Name */}
                                        <Typography
                                            variant="h5"
                                            fontWeight="700"
                                            textAlign="center"
                                            color={plan.featured ? '#EAB308' : 'text.primary'}
                                            gutterBottom
                                        >
                                            {plan.name}
                                        </Typography>

                                        {/* Description */}
                                        <Typography
                                            variant="body2"
                                            textAlign="center"
                                            color="text.secondary"
                                            sx={{ mb: 3, minHeight: 40 }}
                                        >
                                            {plan.description}
                                        </Typography>

                                        {/* Price */}
                                        <PriceDisplay>
                                            {plan.isCustom ? (
                                                <Typography
                                                    variant="h4"
                                                    fontWeight="700"
                                                    color="text.primary"
                                                >
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

                                        {/* Annual savings note */}
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

                                        {/* Features */}
                                        <Box sx={{ mb: 4 }}>
                                            {plan.features.map((feature, index) => (
                                                <FeatureItem key={index} included={feature.included}>
                                                    {feature.included ? (
                                                        <CheckCircleIcon />
                                                    ) : (
                                                        <CancelIcon />
                                                    )}
                                                    <Typography variant="body2">
                                                        {feature.text}
                                                    </Typography>
                                                </FeatureItem>
                                            ))}
                                        </Box>

                                        {/* CTA Button */}
                                        <Link 
                                            href={plan.isCustom ? '/contact' : '/signup'} 
                                            passHref 
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
                        ))}
                    </Grid>

                    {/* Feature Comparison Table */}
                    <Box sx={{ mb: 10 }}>
                        <Typography
                            variant="h4"
                            fontWeight="700"
                            textAlign="center"
                            gutterBottom
                        >
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
                            {/* Header */}
                            <TableRow header>
                                <Box>Features</Box>
                                <Box sx={{ textAlign: 'center' }}>Free</Box>
                                <Box sx={{ textAlign: 'center', color: '#EAB308' }}>Pro</Box>
                                {/* <Box sx={{ textAlign: 'center', color: '#667eea' }}>Pro Plus</Box> */}
                                <Box sx={{ textAlign: 'center', color: '#8b5cf6' }}>Custom</Box>
                            </TableRow>

                            {/* Features */}
                            {comparisonFeatures.map((feature, index) => (
                                <TableRow key={index}>
                                    <Box>{feature.name}</Box>
                                    <Box sx={{ textAlign: 'center' }}>{feature.free}</Box>
                                    <Box sx={{ textAlign: 'center' }}>{feature.pro}</Box>
                                    {/* <Box sx={{ textAlign: 'center' }}>{feature.proplus}</Box> */}
                                    <Box sx={{ textAlign: 'center' }}>{feature.custom}</Box>
                                </TableRow>
                            ))}
                        </CompareTable>

                        {/* Mobile Comparison Note */}
                        <Typography
                            variant="body2"
                            textAlign="center"
                            color="text.secondary"
                            sx={{ mt: 2, display: { sm: 'none' } }}
                        >
                            Scroll horizontally to see all plans →
                        </Typography>
                    </Box>

                    {/* Trust Badges */}
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h5" fontWeight="700" gutterBottom>
                            Trusted by 250,000+ professionals
                        </Typography>
                        <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
                            {[
                                { icon: <SecurityIcon />, text: 'Secure Payments' },
                                { icon: <SpeedIcon />, text: '99.9% Uptime' },
                                { icon: <CloudIcon />, text: 'Cloud Backup' },
                                { icon: <GroupsIcon />, text: '24/7 Support' },
                            ].map((item, index) => (
                                <Grid item xs={6} sm={3} key={index}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#667eea',
                                            }}
                                        >
                                            {item.icon}
                                        </Box>
                                        <Typography variant="body2" fontWeight="600">
                                            {item.text}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* FAQ Section */}
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
                            {[
                                {
                                    q: 'Can I cancel anytime?',
                                    a: 'Yes, you can cancel your subscription at any time. No questions asked.',
                                },
                                {
                                    q: 'Is there a free trial?',
                                    a: 'The Free plan is free forever. For Pro plans, you get a 7-day free trial.',
                                },
                                {
                                    q: 'Can I switch plans?',
                                    a: "Absolutely! You can upgrade or downgrade your plan at any time.",
                                },
                                {
                                    q: 'What payment methods do you accept?',
                                    a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
                                },
                            ].map((faq, index) => (
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

                    {/* CTA Section */}
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
                        <Link href="/signup" passHref style={{ textDecoration: 'none' }}>
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

export default PricingPage;