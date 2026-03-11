// app/signup/page.jsx
'use client';

import { useState } from 'react';
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
    Snackbar,
    Alert,
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
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
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
    overflowY: 'auto',
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
                borderColor: '#fa9a9a',
                borderWidth: 2,
            },
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#fa9a9a',
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
        borderColor: '#fa9a9a',
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
const StyledLink = styled(Link)({
    color: '#df4c4c',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
        textDecoration: 'underline',
        color: '#ff8d8d',
    },
});

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

export default function SignupPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/dashboard' });
    };

    const handleLinkedInLogin = () => {
        signIn('linkedin', { callbackUrl: '/dashboard' });
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        agreeToTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState({});

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const { registerMutation, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = '/dashboard';
        }
    }, [isAuthenticated]);

    // Handle successful registration
    useEffect(() => {
        if (registerMutation.isSuccess) {
            setShowSuccess(true);

            // Show success for 2 seconds, then redirect
            setTimeout(() => {
                setRedirecting(true);
            }, 2000);

            setTimeout(() => {
                router.push('/login');
            }, 3500);
        }
    }, [registerMutation.isSuccess, router]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'agreeToTerms' ? checked : value,
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

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            registerMutation.mutate({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation
            });
        }
    };

    const features = [
        'Create ATS-friendly CVs in minutes',
        'Access 50+ professional templates',
        'AI-powered content suggestions',
        'Download in PDF & Word formats',
        'Free forever for basic features',
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
                        Start Building Your
                        <Box component="span" sx={{ color: '#EAB308', display: 'block' }}>
                            Dream Career
                        </Box>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 5, lineHeight: 1.7 }}
                    >
                        Join thousands of professionals who have landed their dream jobs
                        with our powerful CV builder.
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

                    {/* Testimonial */}
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
                            sx={{ color: '#ffffff', fontStyle: 'italic', mb: 2, lineHeight: 1.6 }}
                        >
                            &quot;CVtify helped me create a professional resume in just 15 minutes.
                            I got 3 interview calls within a week!&quot;
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    backgroundColor: '#EAB308',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography variant="body2" fontWeight="700" color="#000000">
                                    SK
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight="600" color="#ffffff">
                                    Sarah Kim
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Software Engineer at Google
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </LeftPanel>

            {registerMutation.isError && registerMutation.error.response
                ? <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {registerMutation.error.response.data ? registerMutation.error.response.data.message : 'Response data is undefined'}
                    </Alert>
                </Snackbar>
                : null
            }

            {/* Right Panel - Registration Form */}
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
                                CVtify
                            </Typography>
                        </LogoWrapper>
                    )}

                    {/* Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="700" color="#1e293b" gutterBottom>
                            Create Account
                        </Typography>
                        <Typography variant="body1" color="#64748b">
                            Already have an account?{' '}
                            <StyledLink href="/login">
                                Sign in
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
                            or register with email
                        </Typography>
                    </Divider>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit}>
                        <StyledTextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            placeholder="Kapawa Morange"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon sx={{ color: '#94a3b8' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <StyledTextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!error.email}
                            helperText={errors.email}
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
                            error={!!errors.password}
                            helperText={errors.password}
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

                        <StyledTextField
                            fullWidth
                            label="Confirm Password"
                            name="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.password_confirmation}
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
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
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOffIcon sx={{ color: '#94a3b8' }} />
                                            ) : (
                                                <VisibilityIcon sx={{ color: '#94a3b8' }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Terms Checkbox */}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    sx={{
                                        color: errors.agreeToTerms ? '#d32f2f' : '#94a3b8',
                                        '&.Mui-checked': {
                                            color: '#fa9a9a',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body2" color="#64748b">
                                    I agree to the{' '}
                                    <StyledLink href="/terms">
                                        Terms of Service
                                    </StyledLink>{' '}
                                    and{' '}
                                    <StyledLink href="/privacy">
                                        Privacy Policy
                                    </StyledLink>
                                </Typography>
                            }
                            sx={{ mb: errors.agreeToTerms ? 0 : 3 }}
                        />

                        {/* Error message */}
                        {errors.agreeToTerms && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ display: 'block', ml: 4, mb: 3 }}
                            >
                                {errors.agreeToTerms}
                            </Typography>
                        )}

                        {/* Submit Button */}
                        <PrimaryButton
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? (
                                <>
                                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                    Creating Account
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </PrimaryButton>
                    </form>
                </FormContainer>
            </RightPanel>
            {/* Success Modal */}
            <SuccessModal
                open={showSuccess}
                loading={redirecting}
                loadingText="Redirecting to login..."
                title="Registration Successful!"
                message="Please check your email for verification. Redirecting to login..."
            />
        </PageContainer>
    );
}