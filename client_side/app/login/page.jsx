// app/login/page.jsx
'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Divider,
    Checkbox,
    FormControlLabel,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert,
    Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import SuccessModal from '../components/SuccessModal';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';





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
    animation: 'formFadeIn 0.5s ease',
    '@keyframes formFadeIn': {
        from: { opacity: 0, transform: 'translateY(16px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
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
}));

const SocialButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: 12,
    fontSize: '0.9rem',
    fontWeight: 500,
    textTransform: 'none',
    border: '1px solid #e2e8f0',
    color: '#64748b',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: '#ff8d8d',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        color: '#000000',
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

// Styled Link Component
const StyledLink = styled(Link)(({ theme }) => ({
    color: '#df4c4c',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
        textDecoration: 'underline',
        color: '#ff8d8d',
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

export default function LoginPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { t } = useLanguage();


    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/dashboard' });
    };

    const handleLinkedInLogin = () => {
        signIn('linkedin', { callbackUrl: '/dashboard' });
    };

    const { loginMutation, isAuthenticated, user } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [redirecting, setRedirecting] = useState(false);
    const [loginError, setLoginError] = useState('');

    const [errors, setErrors] = useState({});

    const getRedirectPath = (user) => {
        return user?.role === 'admin' ? '/admin' : '/dashboard';
    };

    // useEffect(() => {
    //     if (isAuthenticated && !loginMutation.isPending && user) {
    //         router.push(getRedirectPath(user));
    //     }
    // }, [isAuthenticated, loginMutation.isPending, user, router]);

    // useEffect(() => {
    //     if (loginMutation.isSuccess && user) {
    //         setShowSuccess(true);

    //         setTimeout(() => {
    //             setRedirecting(true);
    //         }, 1500);

    //         setTimeout(() => {
    //             router.push(getRedirectPath(user));
    //         }, 3000);
    //     }
    // }, [loginMutation.isSuccess, user, router]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'rememberMe' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        if (loginError) setLoginError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = t('login.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('login.emailInvalid');
        }

        if (!formData.password) {
            newErrors.password = t('login.passwordRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (validateForm()) {
    //         loginMutation.mutate({
    //             email: formData.email,
    //             password: formData.password,
    //             rememberMe: formData.rememberMe,
    //         });
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoginError('');

        try {
            const data = await loginMutation.mutateAsync({
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe,
            });

            setShowSuccess(true);

            setTimeout(() => setRedirecting(true), 1500);
            setTimeout(() => router.push(getRedirectPath(data.user)), 3000);

        } catch (error) {
            setLoginError(error?.message || t('login.invalidCredentials'));
        }
    };

    const features = t('login.features');

    return (
        <PageContainer>
            {/* Left Panel - Branding & Features */}
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
                        {t('login.welcomeBack')}
                        <Box component="span" sx={{ color: '#EAB308', display: 'block' }}>
                            {t('login.resumeBuilder')}
                        </Box>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 5, lineHeight: 1.7 }}
                    >
                        {t('login.heroText')}
                    </Typography>

                    {/* Features */}
                    <Box>
                        {features.map((feature, index) => (
                            <FeatureItem key={index}>
                                <CheckCircleIcon sx={{ color: '#EAB308', fontSize: 24 }} />
                                <Typography variant="body1" fontWeight="500">
                                    {feature}
                                </Typography>
                            </FeatureItem>
                        ))}
                    </Box>

                    {/* Stats */}
                    <Box
                        sx={{
                            mt: 5,
                            display: 'flex',
                            gap: 4,
                        }}
                    >
                        <Box>
                            <Typography variant="h4" fontWeight="700" color="#EAB308">
                                250K+
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {t('login.activeUsers')}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="700" color="#EAB308">
                                500K+
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {t('login.cvsCreated')}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="700" color="#EAB308">
                                95%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {t('login.successRate')}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </LeftPanel>

            {/* Right Panel - Login Form */}
            <RightPanel>
                <FormContainer>
                    {/* Back to Home */}
                    <BackLink href="/">
                        <ArrowBackIcon sx={{ fontSize: 18 }} />
                        {t('login.backToHome')}
                    </BackLink>

                    {/* Mobile Logo */}
                    {isMobile && (
                        <LogoWrapper sx={{ justifyContent: 'center', mb: 3 }}>
                            <LogoIcon>
                                <DescriptionIcon />
                            </LogoIcon>
                            <Typography variant="h5" fontWeight="700" color="#000000">
                                CVBuilder
                            </Typography>
                        </LogoWrapper>
                    )}

                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="700" color="#1e293b" gutterBottom>
                            {t('login.signIn')}
                        </Typography>
                        <Typography variant="body1" color="#64748b">
                            {t('login.noAccount')}{' '}
                            <StyledLink href="/signup">
                                {t('login.createOne')}
                            </StyledLink>
                        </Typography>
                    </Box>

                    {/* Social Login */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <SocialButton fullWidth
                            startIcon={<GoogleIcon />}
                            onClick={handleGoogleLogin}
                        >
                            Google
                        </SocialButton>
                        <SocialButton fullWidth
                            startIcon={<LinkedInIcon />}
                            onClick={handleLinkedInLogin}
                        >
                            LinkedIn
                        </SocialButton>
                    </Box>

                    {/* Divider */}
                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="#94a3b8">
                            {t('login.orSignInWithEmail')}
                        </Typography>
                    </Divider>

                    {/* Login Error */}
                    <Collapse in={!!loginError}>
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setLoginError('')}>
                            {loginError}
                        </Alert>
                    </Collapse>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                        <StyledTextField
                            fullWidth
                            label={t('login.emailAddress')}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="baesara803@example.com"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <StyledTextField
                            fullWidth
                            label={t('login.password')}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOffIcon sx={{ color: '#94a3b8' }} />
                                            ) : (
                                                <VisibilityIcon sx={{ color: '#94a3b8' }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Remember Me & Forgot Password */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3,
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        sx={{
                                            color: '#94a3b8',
                                            '&.Mui-checked': {
                                                color: '#ff8d8d',
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" color="#64748b">
                                        {t('login.rememberMe')}
                                    </Typography>
                                }
                            />
                            <StyledLink href="/forgot-password" style={{ fontSize: '0.875rem' }}>
                                {t('login.forgotPassword')}
                            </StyledLink>
                        </Box>

                        {/* Submit Button */}
                        <PrimaryButton
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <>
                                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                    {t('login.signingIn')}
                                </>
                            ) : (
                                t('login.signIn')
                            )}
                        </PrimaryButton>
                    </form>

                    {/* Security Note */}
                    <Box
                        sx={{
                            mt: 4,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                        }}
                    >
                        <LockIcon sx={{ color: '#10b981', fontSize: 20 }} />
                        <Typography variant="caption" color="#64748b">
                            {t('login.sslNotice')}
                        </Typography>
                    </Box>
                </FormContainer>
            </RightPanel>
            {/* Success Modal */}
            <SuccessModal
                open={showSuccess}
                loading={redirecting}
                loadingText={user?.role === 'admin' ? t('login.redirectingAdmin') : t('login.redirectingDashboard')}
                title={t('login.loginSuccessful')}
                message={user?.role === 'admin' ? t('login.welcomeBackAdminMessage') : t('login.welcomeBackMessage')}
            />
        </PageContainer>
    );
}