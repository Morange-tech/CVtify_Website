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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import StarIcon from '@mui/icons-material/Star';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth'; // adjust path



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
                        bgcolor: '#667eea12',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#667eea',
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
    const { user, logoutMutation } = useAuth();
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

    // ─── Snackbar ───
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ─── Handlers ───
    const handleProfileSave = () => {
        // TODO: API call to update profile
        setIsEditingProfile(false);
        setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    };

    const handlePasswordChange = () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setSnackbar({ open: true, message: 'Passwords do not match!', severity: 'error' });
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            setSnackbar({ open: true, message: 'Password must be at least 8 characters!', severity: 'error' });
            return;
        }
        // TODO: API call to change password
        setIsChangingPassword(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
    };

    const handleDeleteAccount = () => {
        if (deleteConfirmText !== 'DELETE') return;
        // TODO: API call to delete account
        setDeleteDialogOpen(false);
        logoutMutation.mutate();
    };

    const handleCancelSubscription = () => {
        // TODO: API call to cancel subscription
        setCancelSubDialogOpen(false);
        setSnackbar({ open: true, message: 'Subscription cancelled. Access until end of billing period.', severity: 'info' });
    };


    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="700" color="#1e293b">
                    ⚙️ Settings
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
                icon={<PersonIcon fontSize="small" />}
                action={
                    !isEditingProfile ? (
                        <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditingProfile(true)}
                            sx={{
                                textTransform: 'none',
                                color: '#667eea',
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
                                bgcolor: '#667eea',
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
                                    bgcolor: '#667eea',
                                    color: '#ffffff',
                                    width: 28,
                                    height: 28,
                                    '&:hover': { bgcolor: '#5a6fd6' },
                                }}
                            >
                                <PhotoCameraIcon sx={{ fontSize: 14 }} />
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
                            label={isPremium ? '⭐ Premium' : 'Free Plan'}
                            size="small"
                            sx={{
                                mt: 0.5,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                ...(isPremium
                                    ? {
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                                    <PersonIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': { borderColor: '#667eea' },
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
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
                                    <EmailIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&.Mui-focused fieldset': { borderColor: '#667eea' },
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
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
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    bgcolor: '#667eea',
                                    '&:hover': { bgcolor: '#5a6fd6' },
                                }}
                            >
                                Save Changes
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
                icon={<LockIcon fontSize="small" />}
                action={
                    !isChangingPassword ? (
                        <Button
                            size="small"
                            onClick={() => setIsChangingPassword(true)}
                            sx={{
                                textTransform: 'none',
                                color: '#667eea',
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
                                                    <VisibilityOffIcon sx={{ fontSize: 18 }} />
                                                ) : (
                                                    <VisibilityIcon sx={{ fontSize: 18 }} />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&.Mui-focused fieldset': { borderColor: '#667eea' },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
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
                                    !passwordForm.confirmPassword
                                }
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    bgcolor: '#667eea',
                                    '&:hover': { bgcolor: '#5a6fd6' },
                                }}
                            >
                                Update Password
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
                icon={<CreditCardIcon fontSize="small" />}
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
                        borderColor: isPremium ? '#667eea40' : '#e2e8f0',
                        bgcolor: isPremium ? '#667eea08' : '#f8fafc',
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
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : '#e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {isPremium ? (
                                <StarIcon sx={{ color: '#ffffff' }} />
                            ) : (
                                <PersonIcon sx={{ color: '#64748b' }} />
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
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
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
                                <CheckCircleIcon
                                    sx={{
                                        fontSize: 16,
                                        color: isPremium ? '#667eea' : '#10b981',
                                    }}
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
                                <CreditCardIcon sx={{ color: '#667eea' }} />
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
                                    color: '#667eea',
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
                                    <ReceiptIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
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
                                            color: '#667eea',
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
                                bgcolor: '#667eea08',
                                border: '1px solid #667eea20',
                            }}
                        >
                            <CalendarTodayIcon sx={{ fontSize: 16, color: '#667eea' }} />
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
                            background: 'linear-gradient(135deg, #667eea08 0%, #764ba208 100%)',
                            border: '1px solid #667eea20',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                            🚀 Unlock unlimited CVs, premium templates, no watermark, and more!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => router.push('/upgrade')}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 4,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                icon={<NotificationsIcon fontSize="small" />}
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
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#667eea' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#667eea',
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
                            <DeleteForeverIcon fontSize="small" />
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
                        startIcon={<DeleteForeverIcon />}
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
                        <WarningAmberIcon />
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
                                    <CancelIcon sx={{ fontSize: 16, color: '#ef4444' }} />
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
                        disabled={deleteConfirmText !== 'DELETE'}
                        sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                    >
                        Delete My Account
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
                                    <CancelIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
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
                            bgcolor: '#667eea',
                            '&:hover': { bgcolor: '#5a6fd6' },
                        }}
                    >
                        Keep Premium
                    </Button>
                    <Button
                        onClick={handleCancelSubscription}
                        color="error"
                        sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                    >
                        Cancel Subscription
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