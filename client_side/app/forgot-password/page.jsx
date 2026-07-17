// app/forgot-password/page.jsx
'use client';

import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    useTheme,
    useMediaQuery,
    Alert,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TimerIcon from '@mui/icons-material/Timer';

// Styled Components
const PageContainer = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
});

const LeftPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(6),
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));

const RightPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    backgroundColor: '#ffffff',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
    },
}));

const BackgroundDecoration = styled(Box)({
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    top: '-100px',
    right: '-100px',
});

const BackgroundDecoration2 = styled(Box)({
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    bottom: '-50px',
    left: '-50px',
});

const FormContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 450,
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2.5),
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#f1f5f9',
        },
        '&.Mui-focused': {
            backgroundColor: '#ffffff',
            '& fieldset': {
                borderColor: '#ff8d8d',
                borderWidth: 2,
            },
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#ff8d8d',
    },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: 12,
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    background: 'linear-gradient(135deg, #EAB308)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
        transform: 'translateY(-2px)',
    },
    '&:disabled': {
        background: '#e2e8f0',
        boxShadow: 'none',
    },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: 12,
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    border: '2px solid #000000',
    color: '#000000',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderColor: '#1a1a1a',
        color: '#1a1a1a',
    },
}));

const FeatureItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2.5),
    color: '#ffffff',
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(4),
}));

const LogoIcon = styled(Box)(({ theme }) => ({
    width: 45,
    height: 45,
    borderRadius: theme.spacing(1.5),
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiSvgIcon-root': {
        fontSize: '1.5rem',
        color: '#ffffff',
    },
}));

const BackLink = styled(Link)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(3),
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    '&:hover': {
        color: '#fa9a9a',
    },
}));

const IconContainer = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(26, 26, 26, 0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing(3),
}));

const SuccessIconContainer = styled(Box)(({ theme }) => ({
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: theme.spacing(3),
}));

const StepIndicator = styled(Box)(({ theme, active, completed }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
    borderRadius: 20,
    backgroundColor: completed 
        ? 'rgba(16, 185, 129, 0.1)' 
        : active 
            ? 'rgba(0, 0, 0, 0.1)' 
            : '#f1f5f9',
    color: completed 
        ? '#10b981' 
        : active 
            ? '#000000' 
            : '#94a3b8',
    fontSize: '0.8rem',
    fontWeight: 600,
}));

export default function ForgotPasswordPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useLanguage();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic email validation
        if (!email) {
            setError(t('forgotPasswordPage.emailRequiredError'));
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(t('forgotPasswordPage.emailInvalidError'));
            return;
        }

        setIsLoading(true);

        // Simulate API call
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        setIsLoading(false);

        if (response.ok) {
            setIsEmailSent(true);
            startCountdown();
        } else {
            const data = await response.json();
            setError(error.message || t('forgotPasswordPage.genericError'));
        }
    };

    const startCountdown = () => {
        setCountdown(60);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendEmail = async () => {
        if (countdown > 0) return;
        
        setIsLoading(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
        } catch (error) {
            console.error('Error resending email:', error);
        }
        setIsLoading(false);
        startCountdown();
    };

    const featureTexts = t('forgotPasswordPage.features');

    const features = [
        {
            icon: <SecurityIcon sx={{ color: '#EAB308', fontSize: 24 }} />,
            text: featureTexts[0],
        },
        {
            icon: <TimerIcon sx={{ color: '#EAB308', fontSize: 24 }} />,
            text: featureTexts[1],
        },
        {
            icon: <MarkEmailReadIcon sx={{ color: '#EAB308', fontSize: 24 }} />,
            text: featureTexts[2],
        },
        {
            icon: <SupportAgentIcon sx={{ color: '#EAB308', fontSize: 24 }} />,
            text: featureTexts[3],
        },
    ];

    return (
        <PageContainer>
            {/* Left Panel - Branding & Info */}
            <LeftPanel>
                <BackgroundDecoration />
                <BackgroundDecoration2 />

                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 450 }}>
                    {/* Logo */}
                    <LogoWrapper>
                        <Box
                            sx={{
                                width: 50,
                                height: 50,
                                borderRadius: 2,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <DescriptionIcon sx={{ fontSize: 28, color: '#ffffff' }} />
                        </Box>
                        <Typography variant="h5" fontWeight="700" color="#ffffff">
                            CVtify
                        </Typography>
                    </LogoWrapper>

                    {/* Heading */}
                    <Typography
                        variant="h3"
                        fontWeight="700"
                        color="#ffffff"
                        sx={{ mb: 2, lineHeight: 1.2 }}
                    >
                        {t('forgotPasswordPage.headingLine1')}
                        <Box component="span" sx={{ color: '#EAB308', display: 'block' }}>
                            {t('forgotPasswordPage.headingLine2')}
                        </Box>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 5, lineHeight: 1.7 }}
                    >
                        {t('forgotPasswordPage.subtitle')}
                    </Typography>

                    {/* Features */}
                    <Box>
                        {features.map((feature, index) => (
                            <FeatureItem key={index}>
                                {feature.icon}
                                <Typography variant="body1" fontWeight="500">
                                    {feature.text}
                                </Typography>
                            </FeatureItem>
                        ))}
                    </Box>

                    {/* Help Box */}
                    <Box
                        sx={{
                            mt: 5,
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ color: '#ffffff', mb: 2, fontWeight: 600 }}
                        >
                            {t('forgotPasswordPage.helpTitle')}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}
                        >
                            {t('forgotPasswordPage.helpTextBefore')}{' '}
                            <Box
                                component="a"
                                href="mailto:support@cvtify.com"
                                sx={{ color: '#EAB308', textDecoration: 'none' }}
                            >
                                support@cvtify.com
                            </Box>{' '}
                            {t('forgotPasswordPage.helpTextAfter')}
                        </Typography>
                    </Box>
                </Box>
            </LeftPanel>

            {/* Right Panel - Form */}
            <RightPanel>
                <FormContainer>
                    {/* Back Link */}
                    <BackLink href="/login">
                        <ArrowBackIcon sx={{ fontSize: 18 }} />
                        {t('forgotPasswordPage.backToLogin')}
                    </BackLink>

                    {/* Mobile Logo */}
                    {isMobile && (
                        <LogoWrapper sx={{ justifyContent: 'center', mb: 3 }}>
                            <LogoIcon>
                                <DescriptionIcon />
                            </LogoIcon>
                            <Typography variant="h5" fontWeight="700" color="#000000">
                                CVtify
                            </Typography>
                        </LogoWrapper>
                    )}

                    {!isEmailSent ? (
                        /* Email Form */
                        <>
                            {/* Icon */}
                            <IconContainer>
                                <LockResetIcon sx={{ fontSize: 40, color: '#000000' }} />
                            </IconContainer>

                            {/* Header */}
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography 
                                    variant="h4" 
                                    fontWeight="700" 
                                    color="#1e293b" 
                                    gutterBottom
                                >
                                    {t('forgotPasswordPage.resetPasswordHeading')}
                                </Typography>
                                <Typography variant="body1" color="#64748b">
                                    {t('forgotPasswordPage.resetPasswordSubtitle')}
                                </Typography>
                            </Box>

                            {/* Error Alert */}
                            {error && (
                                <Alert 
                                    severity="error" 
                                    sx={{ mb: 3, borderRadius: 2 }}
                                    onClose={() => setError('')}
                                >
                                    {error}
                                </Alert>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                <StyledTextField
                                    fullWidth
                                    label={t('forgotPasswordPage.emailLabel')}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('forgotPasswordPage.emailPlaceholder')}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: '#94a3b8' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <PrimaryButton
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={isLoading}
                                    startIcon={
                                        isLoading ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : null
                                    }
                                >
                                    {isLoading ? t('forgotPasswordPage.sending') : t('forgotPasswordPage.sendResetLink')}
                                </PrimaryButton>
                            </form>

                            {/* Divider */}
                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Typography variant="body2" color="#64748b">
                                    {t('forgotPasswordPage.rememberPassword')}{' '}
                                    <Link
                                        href="/login"
                                        style={{
                                            color: '#df4c4c',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {t('forgotPasswordPage.signIn')}
                                    </Link>
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        /* Success State */
                        <>
                            {/* Success Icon */}
                            <SuccessIconContainer>
                                <CheckCircleOutlineIcon 
                                    sx={{ fontSize: 50, color: '#10b981' }} 
                                />
                            </SuccessIconContainer>

                            {/* Success Message */}
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography 
                                    variant="h4" 
                                    fontWeight="700" 
                                    color="#1e293b" 
                                    gutterBottom
                                >
                                    {t('forgotPasswordPage.checkEmailHeading')}
                                </Typography>
                                <Typography variant="body1" color="#64748b" sx={{ mb: 2 }}>
                                    {t('forgotPasswordPage.emailSentTo')}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    fontWeight="600" 
                                    color="#1e293b"
                                    sx={{
                                        backgroundColor: '#f1f5f9',
                                        padding: '12px 20px',
                                        borderRadius: 2,
                                        display: 'inline-block',
                                    }}
                                >
                                    {email}
                                </Typography>
                            </Box>

                            {/* Instructions */}
                            <Box
                                sx={{
                                    backgroundColor: '#f8fafc',
                                    borderRadius: 3,
                                    p: 3,
                                    mb: 4,
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    fontWeight="600" 
                                    color="#1e293b" 
                                    gutterBottom
                                >
                                    {t('forgotPasswordPage.nextStepsTitle')}
                                </Typography>
                                <Box component="ol" sx={{ pl: 2, m: 0, color: '#64748b' }}>
                                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                        {t('forgotPasswordPage.nextSteps')[0]}
                                    </Typography>
                                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                        {t('forgotPasswordPage.nextSteps')[1]}
                                    </Typography>
                                    <Typography component="li" variant="body2">
                                        {t('forgotPasswordPage.nextSteps')[2]}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Resend Button */}
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                                    {t('forgotPasswordPage.didntReceiveEmail')}
                                </Typography>
                                <SecondaryButton
                                    onClick={handleResendEmail}
                                    disabled={countdown > 0 || isLoading}
                                    fullWidth
                                    startIcon={
                                        isLoading ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : null
                                    }
                                >
                                    {countdown > 0
                                        ? t('forgotPasswordPage.resendIn', { countdown })
                                        : isLoading
                                            ? t('forgotPasswordPage.sending')
                                            : t('forgotPasswordPage.resendEmail')
                                    }
                                </SecondaryButton>
                            </Box>

                            {/* Back to Login */}
                            <Box sx={{ textAlign: 'center' }}>
                                <Link
                                    href="/login"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#fa9a9a',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    <ArrowBackIcon sx={{ fontSize: 18 }} />
                                    {t('forgotPasswordPage.backToLogin')}
                                </Link>
                            </Box>

                            {/* Spam Notice */}
                            <Box
                                sx={{
                                    mt: 4,
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                                    border: '1px solid rgba(234, 179, 8, 0.3)',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                }}
                            >
                                <MarkEmailReadIcon sx={{ color: '#EAB308', fontSize: 20, mt: 0.2 }} />
                                <Typography variant="caption" color="#92400e">
                                    <strong>{t('forgotPasswordPage.tipLabel')}</strong> {t('forgotPasswordPage.spamTipText')}
                                </Typography>
                            </Box>
                        </>
                    )}
                </FormContainer>
            </RightPanel>
        </PageContainer>
    );
}