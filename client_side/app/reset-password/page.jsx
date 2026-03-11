// app/reset-password/page.jsx
'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    useTheme,
    useMediaQuery,
    Alert,
    CircularProgress,
    LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LockResetIcon from '@mui/icons-material/LockReset';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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
    marginBottom: theme.spacing(2),
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
                borderColor: '#667eea',
                borderWidth: 2,
            },
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#667eea',
    },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: 12,
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
        transform: 'translateY(-2px)',
    },
    '&:disabled': {
        background: '#e2e8f0',
        boxShadow: 'none',
    },
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
        color: '#667eea',
    },
}));

const IconContainer = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
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

const RequirementItem = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'met',
})(({ met }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    color: met ? '#10b981' : '#94a3b8',
    fontSize: '0.85rem',
    transition: 'all 0.3s ease',
}));

const StrengthBar = styled(LinearProgress, {
    shouldForwardProp: (prop) => prop !== 'strength',
})(({ strength }) => {
    const colors = {
        0: '#e2e8f0',
        1: '#ef4444',
        2: '#f59e0b',
        3: '#eab308',
        4: '#10b981',
    };

    return {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e2e8f0',
        '& .MuiLinearProgress-bar': {
            backgroundColor: colors[strength] || '#e2e8f0',
            borderRadius: 4,
        },
    };
});

export default function ResetPasswordPage() {
    const theme = useTheme();
    const router = useRouter();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // Password requirements
    const requirements = [
        { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
        { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
        { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
        { label: 'One number', test: (pwd) => /[0-9]/.test(pwd) },
        { label: 'One special character (!@#$%^&*)', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
    ];

    // Calculate password strength
    const getPasswordStrength = () => {
        const metRequirements = requirements.filter((req) => req.test(formData.password));
        return metRequirements.length;
    };

    const getStrengthLabel = () => {
        const strength = getPasswordStrength();
        if (strength === 0) return '';
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Fair';
        if (strength <= 4) return 'Good';
        return 'Strong';
    };

    const getStrengthColor = () => {
        const strength = getPasswordStrength();
        if (strength <= 2) return '#ef4444';
        if (strength <= 3) return '#f59e0b';
        if (strength <= 4) return '#eab308';
        return '#10b981';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (getPasswordStrength() < 4) {
            setError('Please create a stronger password');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    email: email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,  // ← Laravel expects this name
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Password reset failed');
            }

            setIsSuccess(true);
        } catch (error) {
            console.error('Error resetting password:', error);
            setError(error.message || 'Password reset failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToLogin = () => {
        router.push('/login');
    };

    return (
        <PageContainer>
            {/* Left Panel */}
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
                            CVBuilder
                        </Typography>
                    </LogoWrapper>

                    {/* Heading */}
                    <Typography
                        variant="h3"
                        fontWeight="700"
                        color="#ffffff"
                        sx={{ mb: 2, lineHeight: 1.2 }}
                    >
                        Create a New
                        <Box component="span" sx={{ color: '#EAB308', display: 'block' }}>
                            Secure Password
                        </Box>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 5, lineHeight: 1.7 }}
                    >
                        Choose a strong password to protect your account.
                        We recommend using a mix of letters, numbers, and symbols.
                    </Typography>

                    {/* Security Tips */}
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <SecurityIcon sx={{ color: '#EAB308' }} />
                            <Typography variant="body1" fontWeight="600" color="#ffffff">
                                Password Security Tips
                            </Typography>
                        </Box>
                        <Box component="ul" sx={{ pl: 2, m: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Don&apos;t reuse passwords from other sites
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Avoid using personal information
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                Consider using a password manager
                            </Typography>
                            <Typography component="li" variant="body2">
                                Change your password regularly
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </LeftPanel>

            {/* Right Panel */}
            <RightPanel>
                <FormContainer>
                    {/* Back Link */}
                    <BackLink href="/login">
                        <ArrowBackIcon sx={{ fontSize: 18 }} />
                        Back to Login
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

                    {!isSuccess ? (
                        <>
                            {/* Icon */}
                            <IconContainer>
                                <LockResetIcon sx={{ fontSize: 40, color: '#667eea' }} />
                            </IconContainer>

                            {/* Header */}
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    fontWeight="700"
                                    color="#1e293b"
                                    gutterBottom
                                >
                                    Set New Password
                                </Typography>
                                <Typography variant="body1" color="#64748b">
                                    Create a strong password for your account
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
                                    label="New Password"
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

                                {/* Password Strength */}
                                {formData.password && (
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="caption" color="#64748b">
                                                Password Strength
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                fontWeight="600"
                                                sx={{ color: getStrengthColor() }}
                                            >
                                                {getStrengthLabel()}
                                            </Typography>
                                        </Box>
                                        <StrengthBar
                                            variant="determinate"
                                            value={(getPasswordStrength() / 5) * 100}
                                            strength={getPasswordStrength()}
                                        />
                                    </Box>
                                )}

                                {/* Password Requirements */}
                                <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                                    <Typography variant="caption" color="#64748b" sx={{ mb: 1, display: 'block' }}>
                                        Password must contain:
                                    </Typography>
                                    {requirements.map((req, index) => (
                                        <RequirementItem key={index} met={req.test(formData.password)}>
                                            {req.test(formData.password) ? (
                                                <CheckCircleIcon sx={{ fontSize: 16 }} />
                                            ) : (
                                                <CancelIcon sx={{ fontSize: 16 }} />
                                            )}
                                            {req.label}
                                        </RequirementItem>
                                    ))}
                                </Box>

                                <StyledTextField
                                    fullWidth
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    error={
                                        formData.confirmPassword !== '' &&
                                        formData.password !== formData.confirmPassword
                                    }
                                    helperText={
                                        formData.confirmPassword !== '' &&
                                            formData.password !== formData.confirmPassword
                                            ? 'Passwords do not match'
                                            : ''
                                    }
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
                                    sx={{ mt: 2 }}
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </PrimaryButton>
                            </form>
                        </>
                    ) : (
                        /* Success State */
                        <>
                            <SuccessIconContainer>
                                <CheckCircleOutlineIcon sx={{ fontSize: 50, color: '#10b981' }} />
                            </SuccessIconContainer>

                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    fontWeight="700"
                                    color="#1e293b"
                                    gutterBottom
                                >
                                    Password Reset!
                                </Typography>
                                <Typography variant="body1" color="#64748b">
                                    Your password has been successfully reset.
                                    You can now sign in with your new password.
                                </Typography>
                            </Box>

                            <PrimaryButton
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleGoToLogin}
                            >
                                Sign In Now
                            </PrimaryButton>
                        </>
                    )}
                </FormContainer>
            </RightPanel>
        </PageContainer>
    );
}