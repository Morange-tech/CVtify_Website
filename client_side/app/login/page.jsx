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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
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
        backgroundColor: 'rgba(102, 126, 234, 0.05)',
        color: '#667eea',
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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


    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/dashboard' });
    };

    const handleLinkedInLogin = () => {
        signIn('linkedin', { callbackUrl: '/dashboard' });
    };

    const { loginMutation, isAuthenticated } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);
    const router = useRouter();


    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [redirecting, setRedirecting] = useState(false);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isAuthenticated && !loginMutation.isPending) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, loginMutation.isPending]);

    useEffect(() => {
        if (loginMutation.isSuccess) {
            setShowSuccess(true);

            setTimeout(() => {
                setRedirecting(true);
            }, 1500);

            setTimeout(() => {
                router.push('/dashboard');
            }, 3000);
        }
    }, [loginMutation.isSuccess, router]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'rememberMe' ? checked : value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            loginMutation.mutate({
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe,
            });
        }
    };

    const features = [
        'Access your saved CVs anytime',
        'Continue where you left off',
        'Sync across all your devices',
        'Track your application progress',
        'Get personalized recommendations',
    ];

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
                        Welcome Back,
                        <Box component="span" sx={{ color: '#EAB308', display: 'block' }}>
                            Resume Builder!
                        </Box>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 5, lineHeight: 1.7 }}
                    >
                        Sign in to access your saved CVs, templates, and continue
                        building your professional career.
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
                                Active Users
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="700" color="#EAB308">
                                500K+
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                CVs Created
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="700" color="#EAB308">
                                95%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                Success Rate
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
                        Back to Home
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
                            Sign In
                        </Typography>
                        <Typography variant="body1" color="#64748b">
                            Don&apos;t have an account?{' '}
                            <StyledLink href="/signup">
                                Create one
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
                            or sign in with email
                        </Typography>
                    </Divider>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                        <StyledTextField
                            fullWidth
                            label="Email Address"
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
                            label="Password"
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
                                        Remember me
                                    </Typography>
                                }
                            />
                            <StyledLink href="/forgot-password" style={{ fontSize: '0.875rem' }}>
                                Forgot password?
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
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
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
                            Your data is protected with 256-bit SSL encryption
                        </Typography>
                    </Box>
                </FormContainer>
            </RightPanel>
            {/* Success Modal */}
            <SuccessModal
                open={showSuccess}
                loading={redirecting}
                loadingText="Redirecting to dashboard..."
                title="Login Successful!"
                message="Welcome back! Redirecting to your dashboard..."
            />
        </PageContainer>
    );
}