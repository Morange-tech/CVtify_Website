'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Avatar,
    Divider,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    InputAdornment,
    Switch,
    Alert,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import {
    Pencil,
    Eye,
    EyeOff,
    Camera,
    User,
    Lock,
    CreditCard,
    Trash2,
    Star,
    Mail,
    Calendar,
    Receipt,
    XCircle,
    AlertTriangle,
    CheckCircle2,
    Bell,
    Settings as SettingsIcon,
    Sparkles,
    Rocket,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth'; // adjust path
import { userApi } from '../../services/api';

const getErrorMessage = (err, fallback) => {
    const firstFieldError = err?.data?.errors && Object.values(err.data.errors)[0]?.[0];
    return firstFieldError || err?.message || fallback;
};



// ─── Section Wrapper ───
const SectionCard = ({ children, title, icon, action }) => (
    <Box
        sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            mb: 3,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 3,
                pb: 2,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: '#00000012',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000000',
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h6" fontWeight="700" color="#1e293b">
                    {title}
                </Typography>
            </Box>
            {action}
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
);

export default function SettingsPage() {
    const router = useRouter();
    const { user, logoutMutation, updateUser } = useAuth();
    const isPremium = user?.plan === 'premium';

    // ─── Profile State ───
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // ─── Password State ───
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // ─── Notification State ───
    const [notifications, setNotifications] = useState({
        emailUpdates: true,
        downloadAlerts: true,
        tips: false,
        marketing: false,
    });

    // ─── Dialog State ───
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cancelSubDialogOpen, setCancelSubDialogOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // ─── Loading States ───
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);

    // ─── Snackbar ───
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ─── Handlers ───
    const handleProfileSave = async () => {
        if (!profileForm.name.trim()) {
            setSnackbar({ open: true, message: 'Name is required.', severity: 'error' });
            return;
        }
        setIsSavingProfile(true);
        try {
            const res = await userApi.updateProfile({
                name: profileForm.name,
                email: profileForm.email,
            });
            updateUser(res.user);
            setIsEditingProfile(false);
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: getErrorMessage(err, 'Failed to update profile.'), severity: 'error' });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' });
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            setSnackbar({ open: true, message: 'Password must be at least 8 characters!', severity: 'error' });
            return;
        }
        setIsSavingPassword(true);
        try {
            await userApi.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                newPasswordConfirmation: passwordForm.confirmPassword,
            });
            setIsChangingPassword(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: getErrorMessage(err, 'Failed to change password.'), severity: 'error' });
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        setIsDeletingAccount(true);
        try {
            await userApi.deleteAccount();
            setDeleteDialogOpen(false);
            logoutMutation.mutate();
        } catch (err) {
            setSnackbar({ open: true, message: getErrorMessage(err, 'Failed to delete account.'), severity: 'error' });
            setIsDeletingAccount(false);
        }
    };

    const handleCancelSubscription = async () => {
        setIsCancellingSubscription(true);
        try {
            await userApi.cancelSubscription();
            updateUser({ subscription_status: 'inactive' });
            setCancelSubDialogOpen(false);
            setSnackbar({ open: true, message: 'Subscription cancelled. Access until end of billing period.', severity: 'info' });
        } catch (err) {
            setSnackbar({ open: true, message: getErrorMessage(err, 'Failed to cancel subscription.'), severity: 'error' });
        } finally {
            setIsCancellingSubscription(false);
        }
    };


    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="700" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SettingsIcon size={32} /> Settings
                </Typography>
                <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
                    Manage your account, security, and preferences
                </Typography>
            </Box>

            {/* ═══════════════════════════════════════════ */}
            {/* 1. PROFILE INFO */}
            {/* ═══════════════════════════════════════════ */}
            <SectionCard
                title="Profile Information"
                icon={<User size={18} />}
                action={
                    !isEditingProfile ? (
                        <Button
                            size="small"
                            startIcon={<Pencil size={16} />}
                            onClick={() => setIsEditingProfile(true)}
                            sx={{
                                textTransform: 'none',
                                color: '#000000',
                                fontWeight: 600,
                            }}
                        >
                            Edit
                        </Button>
                    ) : null
                }
            >
                {/* Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={user?.avatar}
                            sx={{
                                width: 72,
                                height: 72,
                                bgcolor: '#000000',
                                fontSize: '1.8rem',
                                fontWeight: 700,
                            }}
                        >
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        {isEditingProfile && (
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    bottom: -4,
                                    right: -4,
                                    bgcolor: '#000000',
                                    color: '#ffffff',
                                    width: 28,
                                    height: 28,
                                    '&:hover': { bgcolor: '#5a6fd6' },
                                }}
                            >
                                <Camera size={14} />
                            </IconButton>
                        )}
                    </Box>
                    <Box>
                        <Typography variant="body1" fontWeight="600" color="#1e293b">
                            {user?.name}
                        </Typography>
                        <Typography variant="body2" color="#64748b">
                            {user?.email}
                        </Typography>
                        <Chip
                            label={isPremium ? (<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Sparkles size={12} /> Premium</Box>) : 'Free Plan'}
                            size="small"
                            sx={{
                                mt: 0.5,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                ...(isPremium
                                    ? {
                                        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                                        color: '#ffffff',
                                    }
                                    : {
                                        bgcolor: '#f1f5f9',
                                        color: '#64748b',
                                    }),
                            }}
                        />
                    </Box>
                </Box>

                {/* Form Fields */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        label="Full Name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditingProfile}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <User size={18} color="#94a3b8" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': { borderColor: '#000000' },
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
                        }}
                    />

                    <TextField
                        label="Email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditingProfile}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Mail size={18} color="#94a3b8" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': { borderColor: '#000000' },
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
                        }}
                    />

                    {isEditingProfile && (
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => {
                                    setIsEditingProfile(false);
                                    setProfileForm({ name: user?.name || '', email: user?.email || '' });
                                }}
                                sx={{ textTransform: 'none', color: '#64748b', borderRadius: 2 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleProfileSave}
                                disabled={isSavingProfile}
                                startIcon={isSavingProfile ? <CircularProgress size={16} color="inherit" /> : null}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    bgcolor: '#000000',
                                    '&:hover': { bgcolor: '#5a6fd6' },
                                }}
                            >
                                {isSavingProfile ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Box>
                    )}
                </Box>
            </SectionCard>

            {/* ═══════════════════════════════════════════ */}
            {/* 2. CHANGE PASSWORD */}
            {/* ═══════════════════════════════════════════ */}
            <SectionCard
                title="Change Password"
                icon={<Lock size={18} />}
                action={
                    !isChangingPassword ? (
                        <Button
                            size="small"
                            onClick={() => setIsChangingPassword(true)}
                            sx={{
                                textTransform: 'none',
                                color: '#000000',
                                fontWeight: 600,
                            }}
                        >
                            Change
                        </Button>
                    ) : null
                }
            >
                {!isChangingPassword ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="#64748b">
                            ••••••••••••
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">
                            Last changed 30 days ago
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {[
                            { label: 'Current Password', key: 'currentPassword', showKey: 'current' },
                            { label: 'New Password', key: 'newPassword', showKey: 'new' },
                            { label: 'Confirm New Password', key: 'confirmPassword', showKey: 'confirm' },
                        ].map((field) => (
                            <TextField
                                key={field.key}
                                label={field.label}
                                type={showPasswords[field.showKey] ? 'text' : 'password'}
                                value={passwordForm[field.key]}
                                onChange={(e) =>
                                    setPasswordForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                                }
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    setShowPasswords((prev) => ({
                                                        ...prev,
                                                        [field.showKey]: !prev[field.showKey],
                                                    }))
                                                }
                                            >
                                                {showPasswords[field.showKey] ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&.Mui-focused fieldset': { borderColor: '#000000' },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
                                }}
                            />
                        ))}

                        {/* Password strength hint */}
                        <Typography variant="caption" color="#94a3b8">
                            Password must be at least 8 characters with a mix of letters and numbers.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                sx={{ textTransform: 'none', color: '#64748b', borderRadius: 2 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handlePasswordChange}
                                disabled={
                                    !passwordForm.currentPassword ||
                                    !passwordForm.newPassword ||
                                    !passwordForm.confirmPassword ||
                                    isSavingPassword
                                }
                                startIcon={isSavingPassword ? <CircularProgress size={16} color="inherit" /> : null}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    bgcolor: '#000000',
                                    '&:hover': { bgcolor: '#5a6fd6' },
                                }}
                            >
                                {isSavingPassword ? 'Updating...' : 'Update Password'}
                            </Button>
                        </Box>
                    </Box>
                )}
            </SectionCard>

            {/* ═══════════════════════════════════════════ */}
            {/* 3. PLAN & SUBSCRIPTION */}
            {/* ═══════════════════════════════════════════ */}
            <SectionCard
                title="Plan & Subscription"
                icon={<CreditCard size={18} />}
            >
                {/* Current Plan Display */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: isPremium ? '#00000040' : '#e2e8f0',
                        bgcolor: isPremium ? '#00000008' : '#f8fafc',
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: isPremium
                                    ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
                                    : '#e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {isPremium ? (
                                <Star size={22} color="#ffffff" />
                            ) : (
                                <User size={22} color="#64748b" />
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body1" fontWeight="700" color="#1e293b">
                                {isPremium ? 'Premium Plan' : 'Free Plan'}
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                {isPremium ? '$9.99/month • Renews July 18, 2025' : 'Basic features included'}
                            </Typography>
                        </Box>
                    </Box>

                    {!isPremium ? (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => router.push('/upgrade')}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                },
                            }}
                        >
                            Upgrade
                        </Button>
                    ) : (
                        <Chip
                            label="Active"
                            size="small"
                            sx={{
                                fontWeight: 600,
                                bgcolor: '#10b98115',
                                color: '#10b981',
                            }}
                        />
                    )}
                </Box>

                {/* Plan Features */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1.5 }}>
                        Your plan includes:
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 1,
                        }}
                    >
                        {(isPremium
                            ? [
                                'Unlimited CVs & Letters',
                                'All Premium Templates',
                                'PDF, DOCX, PNG, JPG',
                                'No Watermark',
                                'High-Quality Exports',
                                'Version History',
                                'Advanced Analytics',
                                'Priority Support',
                            ]
                            : [
                                '3 CVs',
                                '3 Motivation Letters',
                                'PDF Download Only',
                                'Basic Templates',
                            ]
                        ).map((feature, index) => (
                            <Box
                                key={index}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}
                            >
                                <CheckCircle2
                                    size={16}
                                    color={isPremium ? '#000000' : '#10b981'}
                                />
                                <Typography variant="body2" color="#64748b">
                                    {feature}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* ═══ PREMIUM ONLY: Billing Details ═══ */}
                {isPremium && (
                    <>
                        <Divider sx={{ my: 3 }} />

                        <Typography variant="body1" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
                            Billing Details
                        </Typography>

                        {/* Payment Method */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: 2,
                                bgcolor: '#f8fafc',
                                mb: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <CreditCard size={22} color="#000000" />
                                <Box>
                                    <Typography variant="body2" fontWeight="600" color="#1e293b">
                                        •••• •••• •••• 4242
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">
                                        Visa • Expires 12/2026
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                size="small"
                                sx={{
                                    textTransform: 'none',
                                    color: '#000000',
                                    fontWeight: 600,
                                }}
                            >
                                Update
                            </Button>
                        </Box>

                        {/* Billing History */}
                        <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1.5 }}>
                            Recent Invoices
                        </Typography>
                        {[
                            { date: 'June 18, 2025', amount: '$9.99', status: 'Paid' },
                            { date: 'May 18, 2025', amount: '$9.99', status: 'Paid' },
                            { date: 'April 18, 2025', amount: '$9.99', status: 'Paid' },
                        ].map((invoice, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    py: 1.5,
                                    borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Receipt size={16} color="#94a3b8" />
                                    <Typography variant="body2" color="#1e293b">
                                        {invoice.date}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body2" fontWeight="600" color="#1e293b">
                                        {invoice.amount}
                                    </Typography>
                                    <Chip
                                        label={invoice.status}
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            height: 20,
                                            bgcolor: '#10b98115',
                                            color: '#10b981',
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        sx={{
                                            textTransform: 'none',
                                            fontSize: '0.75rem',
                                            color: '#000000',
                                            minWidth: 0,
                                            p: 0,
                                        }}
                                    >
                                        Download
                                    </Button>
                                </Box>
                            </Box>
                        ))}

                        {/* Next Billing */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                bgcolor: '#00000008',
                                border: '1px solid #00000020',
                            }}
                        >
                            <Calendar size={16} color="#000000" />
                            <Typography variant="body2" color="#64748b">
                                Next billing date: <strong>July 18, 2025</strong> — $9.99
                            </Typography>
                        </Box>

                        {/* Cancel Subscription */}
                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => setCancelSubDialogOpen(true)}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                }}
                            >
                                Cancel Subscription
                            </Button>
                        </Box>
                    </>
                )}

                {/* Free user upgrade nudge */}
                {!isPremium && (
                    <Box
                        sx={{
                            mt: 2,
                            p: 3,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #00000008 0%, #1a1a1a08 100%)',
                            border: '1px solid #00000020',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="body2" color="#64748b" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
                            <Rocket size={16} /> Unlock unlimited CVs, premium templates, no watermark, and more!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => router.push('/upgrade')}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 4,
                                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                            }}
                        >
                            Upgrade to Premium
                        </Button>
                    </Box>
                )}
            </SectionCard>

            {/* ═══════════════════════════════════════════ */}
            {/* 4. NOTIFICATIONS */}
            {/* ═══════════════════════════════════════════ */}
            <SectionCard
                title="Notifications"
                icon={<Bell size={18} />}
            >
                {[
                    {
                        key: 'emailUpdates',
                        label: 'Email Updates',
                        desc: 'Receive updates about your account and CVs',
                    },
                    {
                        key: 'downloadAlerts',
                        label: 'Download Alerts',
                        desc: 'Get notified when downloads are ready',
                    },
                    {
                        key: 'tips',
                        label: 'CV Tips & Suggestions',
                        desc: 'Receive tips to improve your CVs',
                    },
                    {
                        key: 'marketing',
                        label: 'Marketing Emails',
                        desc: 'Receive promotions and special offers',
                    },
                ].map((item) => (
                    <Box
                        key={item.key}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 2,
                            borderBottom: '1px solid #f1f5f9',
                            '&:last-child': { borderBottom: 'none' },
                        }}
                    >
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1e293b">
                                {item.label}
                            </Typography>
                            <Typography variant="caption" color="#94a3b8">
                                {item.desc}
                            </Typography>
                        </Box>
                        <Switch
                            checked={notifications[item.key]}
                            onChange={(e) =>
                                setNotifications((prev) => ({
                                    ...prev,
                                    [item.key]: e.target.checked,
                                }))
                            }
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#000000' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#000000',
                                },
                            }}
                        />
                    </Box>
                ))}
            </SectionCard>

            {/* ═══════════════════════════════════════════ */}
            {/* 5. DANGER ZONE — DELETE ACCOUNT */}
            {/* ═══════════════════════════════════════════ */}
            <Box
                sx={{
                    bgcolor: '#ffffff',
                    borderRadius: 3,
                    border: '1px solid #ef444440',
                    overflow: 'hidden',
                    mb: 3,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 3,
                        pb: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                bgcolor: '#ef444412',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ef4444',
                            }}
                        >
                            <Trash2 size={18} />
                        </Box>
                        <Typography variant="h6" fontWeight="700" color="#ef4444">
                            Danger Zone
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ p: 3 }}>
                    <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                        Once you delete your account, there is no going back. All your CVs, motivation letters,
                        and data will be permanently removed.
                    </Typography>

                    {isPremium && (
                        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                            You have an active Premium subscription. Deleting your account will also cancel
                            your subscription immediately with no refund.
                        </Alert>
                    )}

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Trash2 size={16} />}
                        onClick={() => setDeleteDialogOpen(true)}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                        }}
                    >
                        Delete Account
                    </Button>
                </Box>
            </Box>

            {/* ═══════════════════════════════════════════ */}
            {/* DIALOGS */}
            {/* ═══════════════════════════════════════════ */}

            {/* Delete Account Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AlertTriangle size={20} />
                        Delete Account
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                        This action is <strong>permanent and irreversible</strong>. All your data including:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        {['All CVs and motivation letters', 'Download history', 'Account settings', 'Subscription (if any)'].map(
                            (item, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                                    <XCircle size={16} color="#ef4444" />
                                    <Typography variant="body2" color="#64748b">
                                        {item}
                                    </Typography>
                                </Box>
                            )
                        )}
                    </Box>
                    <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                        Type <strong>DELETE</strong> to confirm:
                    </Typography>
                    <TextField
                        fullWidth
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': { borderColor: '#ef4444' },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => {
                            setDeleteDialogOpen(false);
                            setDeleteConfirmText('');
                        }}
                        sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        variant="contained"
                        color="error"
                        disabled={deleteConfirmText !== 'DELETE' || isDeletingAccount}
                        startIcon={isDeletingAccount ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                    >
                        {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Cancel Subscription Dialog (Premium only) */}
            <Dialog
                open={cancelSubDialogOpen}
                onClose={() => setCancelSubDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Cancel Subscription?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                        Are you sure you want to cancel your Premium subscription?
                    </Typography>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fef3c7',
                            border: '1px solid #fcd34d',
                            mb: 2,
                        }}
                    >
                        <Typography variant="body2" color="#92400e" fontWeight="600">
                            You&apos;ll lose access to:
                        </Typography>
                        {['No watermark downloads', 'DOCX, PNG, JPG formats', 'Premium templates', 'Advanced features'].map(
                            (item, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.3 }}>
                                    <XCircle size={14} color="#f59e0b" />
                                    <Typography variant="body2" color="#92400e">
                                        {item}
                                    </Typography>
                                </Box>
                            )
                        )}
                    </Box>
                    <Typography variant="body2" color="#64748b">
                        Your access will continue until the end of your current billing period (July 18, 2025).
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setCancelSubDialogOpen(false)}
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            fontWeight: 600,
                            bgcolor: '#000000',
                            '&:hover': { bgcolor: '#5a6fd6' },
                        }}
                    >
                        Keep Premium
                    </Button>
                    <Button
                        onClick={handleCancelSubscription}
                        color="error"
                        disabled={isCancellingSubscription}
                        startIcon={isCancellingSubscription ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                    >
                        {isCancellingSubscription ? 'Cancelling...' : 'Cancel Subscription'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}