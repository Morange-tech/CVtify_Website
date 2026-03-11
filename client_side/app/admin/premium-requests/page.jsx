'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Chip,
    IconButton,
    Tooltip,
    Divider,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Alert,
    Snackbar,
    Select,
    FormControl,
    InputLabel,
    Avatar,
    Button,
    Badge,
    LinearProgress,
    TextareaAutosize,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SortIcon from '@mui/icons-material/Sort';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ImageIcon from '@mui/icons-material/Image';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircleIcon from '@mui/icons-material/Circle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import InfoIcon from '@mui/icons-material/Info';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList';
import VerifiedIcon from '@mui/icons-material/Verified';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SendIcon from '@mui/icons-material/Send';
import NotesIcon from '@mui/icons-material/Notes';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FlagIcon from '@mui/icons-material/Flag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';

// ─── Helpers ───
const getInitials = (name) =>
    name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatFullDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

const formatCurrency = (amount, currency = 'XAF') => {
    if (currency === 'XAF') return `${amount.toLocaleString()} FCFA`;
    return `$${amount.toFixed(2)}`;
};

// ─── Status Config ───
const STATUS_CONFIG = {
    pending: {
        label: 'Pending',
        color: '#f59e0b',
        bgcolor: '#f59e0b12',
        borderColor: '#f59e0b30',
        icon: <HourglassEmptyIcon sx={{ fontSize: 16 }} />,
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    approved: {
        label: 'Approved',
        color: '#10b981',
        bgcolor: '#10b98112',
        borderColor: '#10b98130',
        icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    rejected: {
        label: 'Rejected',
        color: '#ef4444',
        bgcolor: '#ef444412',
        borderColor: '#ef444430',
        icon: <CancelIcon sx={{ fontSize: 16 }} />,
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
};

// ─── Payment Method Config ───
const PAYMENT_METHODS = {
    mtn_momo: {
        label: 'MTN Mobile Money',
        shortLabel: 'MTN MoMo',
        icon: <PhoneAndroidIcon sx={{ fontSize: 16 }} />,
        color: '#f59e0b',
        bgcolor: '#f59e0b12',
    },
    orange_money: {
        label: 'Orange Money',
        shortLabel: 'Orange Money',
        icon: <PhoneAndroidIcon sx={{ fontSize: 16 }} />,
        color: '#f97316',
        bgcolor: '#f9731612',
    },
    bank_transfer: {
        label: 'Bank Transfer',
        shortLabel: 'Bank',
        icon: <AccountBalanceIcon sx={{ fontSize: 16 }} />,
        color: '#3b82f6',
        bgcolor: '#3b82f612',
    },
    credit_card: {
        label: 'Credit Card',
        shortLabel: 'Card',
        icon: <CreditCardIcon sx={{ fontSize: 16 }} />,
        color: '#8b5cf6',
        bgcolor: '#8b5cf612',
    },
};

// ─── Plan Config ───
const PLAN_CONFIG = {
    premium_monthly: {
        label: 'Premium Monthly',
        shortLabel: 'Monthly',
        price: 5000,
        currency: 'XAF',
        color: '#667eea',
        icon: <StarIcon sx={{ fontSize: 14 }} />,
    },
    premium_annual: {
        label: 'Premium Annual',
        shortLabel: 'Annual',
        price: 45000,
        currency: 'XAF',
        color: '#8b5cf6',
        icon: <WorkspacePremiumIcon sx={{ fontSize: 14 }} />,
    },
};

// ─── Mock Premium Requests ───
const INITIAL_REQUESTS = [
    {
        id: 'REQ-001',
        userId: 'USR-101',
        userName: 'Sarah Johnson',
        userEmail: 'sarah.johnson@email.com',
        userPhone: '+237 6XX XXX 001',
        userAvatar: null,
        plan: 'premium_monthly',
        paymentMethod: 'mtn_momo',
        amount: 5000,
        currency: 'XAF',
        transactionRef: 'MTN-TXN-78429301',
        screenshot: '/payment-proofs/req-001.jpg',
        status: 'pending',
        note: 'Please upgrade my account. I paid via MTN MoMo.',
        adminNote: '',
        reviewedBy: null,
        reviewedAt: null,
        createdAt: '2025-06-18T16:30:00',
        updatedAt: '2025-06-18T16:30:00',
    },
    {
        id: 'REQ-002',
        userId: 'USR-102',
        userName: 'Michael Chen',
        userEmail: 'michael.chen@email.com',
        userPhone: '+237 6XX XXX 002',
        userAvatar: null,
        plan: 'premium_annual',
        paymentMethod: 'orange_money',
        amount: 45000,
        currency: 'XAF',
        transactionRef: 'OM-TXN-56231890',
        screenshot: '/payment-proofs/req-002.jpg',
        status: 'pending',
        note: 'Annual subscription payment done via Orange Money.',
        adminNote: '',
        reviewedBy: null,
        reviewedAt: null,
        createdAt: '2025-06-18T14:15:00',
        updatedAt: '2025-06-18T14:15:00',
    },
    {
        id: 'REQ-003',
        userId: 'USR-103',
        userName: 'Emily Davis',
        userEmail: 'emily.davis@email.com',
        userPhone: '+237 6XX XXX 003',
        userAvatar: null,
        plan: 'premium_monthly',
        paymentMethod: 'bank_transfer',
        amount: 5000,
        currency: 'XAF',
        transactionRef: 'BNK-REF-44120098',
        screenshot: '/payment-proofs/req-003.jpg',
        status: 'pending',
        note: 'Bank transfer done. Attached receipt.',
        adminNote: '',
        reviewedBy: null,
        reviewedAt: null,
        createdAt: '2025-06-18T11:45:00',
        updatedAt: '2025-06-18T11:45:00',
    },
    {
        id: 'REQ-004',
        userId: 'USR-104',
        userName: 'James Wilson',
        userEmail: 'james.w@email.com',
        userPhone: '+237 6XX XXX 004',
        userAvatar: null,
        plan: 'premium_monthly',
        paymentMethod: 'mtn_momo',
        amount: 5000,
        currency: 'XAF',
        transactionRef: 'MTN-TXN-99182736',
        screenshot: '/payment-proofs/req-004.jpg',
        status: 'approved',
        note: 'Payment done.',
        adminNote: 'Payment verified. Transaction confirmed on MTN dashboard.',
        reviewedBy: 'Admin',
        reviewedAt: '2025-06-17T15:30:00',
        createdAt: '2025-06-17T10:20:00',
        updatedAt: '2025-06-17T15:30:00',
    },
    {
        id: 'REQ-005',
        userId: 'USR-105',
        userName: 'Lisa Anderson',
        userEmail: 'lisa.a@email.com',
        userPhone: '+237 6XX XXX 005',
        userAvatar: null,
        plan: 'premium_annual',
        paymentMethod: 'orange_money',
        amount: 45000,
        currency: 'XAF',
        transactionRef: 'OM-TXN-33901827',
        screenshot: '/payment-proofs/req-005.jpg',
        status: 'approved',
        note: 'Annual plan payment via Orange Money.',
        adminNote: 'Verified and approved. Annual subscription activated.',
        reviewedBy: 'Admin',
        reviewedAt: '2025-06-16T14:00:00',
        createdAt: '2025-06-16T09:15:00',
        updatedAt: '2025-06-16T14:00:00',
    },
    {
        id: 'REQ-006',
        userId: 'USR-106',
        userName: 'Tom Harris',
        userEmail: 'tom.h@email.com',
        userPhone: '+237 6XX XXX 006',
        userAvatar: null,
        plan: 'premium_monthly',
        paymentMethod: 'mtn_momo',
        amount: 3000,
        currency: 'XAF',
        transactionRef: 'MTN-TXN-11002233',
        screenshot: '/payment-proofs/req-006.jpg',
        status: 'rejected',
        note: 'I paid for premium.',
        adminNote: 'Incorrect amount. Monthly plan costs 5,000 FCFA but only 3,000 FCFA was sent. Please pay the remaining balance and resubmit.',
        reviewedBy: 'Admin',
        reviewedAt: '2025-06-15T16:45:00',
        createdAt: '2025-06-15T12:00:00',
        updatedAt: '2025-06-15T16:45:00',
    },
    {
        id: 'REQ-007',
        userId: 'USR-107',
        userName: 'Nina Patel',
        userEmail: 'nina.p@email.com',
        userPhone: '+237 6XX XXX 007',
        userAvatar: null,
        plan: 'premium_monthly',
        paymentMethod: 'credit_card',
        amount: 5000,
        currency: 'XAF',
        transactionRef: 'CC-TXN-88776655',
        screenshot: '/payment-proofs/req-007.jpg',
        status: 'rejected',
        note: 'Card payment screenshot attached.',
        adminNote: 'Screenshot appears to be edited/fake. Transaction reference not found in payment system. Request denied.',
        reviewedBy: 'Admin',
        reviewedAt: '2025-06-14T11:30:00',
        createdAt: '2025-06-14T08:00:00',
        updatedAt: '2025-06-14T11:30:00',
    },
    {
        id: 'REQ-008',
        userId: 'USR-108',
        userName: 'David Brown',
        userEmail: 'david.b@email.com',
        userPhone: '+237 6XX XXX 008',
        userAvatar: null,
        plan: 'premium_annual',
        paymentMethod: 'bank_transfer',
        amount: 45000,
        currency: 'XAF',
        transactionRef: 'BNK-REF-77553311',
        screenshot: '/payment-proofs/req-008.jpg',
        status: 'pending',
        note: 'Bank transfer receipt attached. Annual plan please.',
        adminNote: '',
        reviewedBy: null,
        reviewedAt: null,
        createdAt: '2025-06-18T09:00:00',
        updatedAt: '2025-06-18T09:00:00',
    },
    {
        id: 'REQ-009',
        userId: 'USR-109',
        userName: 'Rachel Green',
        userEmail: 'rachel.g@email.com',
        userPhone: '+237 6XX XXX 009',
        userAvatar: null,
        plan: 'premium_monthly',
        paymentMethod: 'mtn_momo',
        amount: 5000,
        currency: 'XAF',
        transactionRef: 'MTN-TXN-44556677',
        screenshot: '/payment-proofs/req-009.jpg',
        status: 'approved',
        note: 'Monthly premium please.',
        adminNote: 'Payment confirmed via MTN records.',
        reviewedBy: 'Admin',
        reviewedAt: '2025-06-13T10:00:00',
        createdAt: '2025-06-13T08:30:00',
        updatedAt: '2025-06-13T10:00:00',
    },
    {
        id: 'REQ-010',
        userId: 'USR-110',
        userName: 'Alex Turner',
        userEmail: 'alex.t@email.com',
        userPhone: '+237 6XX XXX 010',
        userAvatar: null,
        plan: 'premium_monthly',
        paymentMethod: 'orange_money',
        amount: 5000,
        currency: 'XAF',
        transactionRef: 'OM-TXN-22113344',
        screenshot: '/payment-proofs/req-010.jpg',
        status: 'pending',
        note: 'Orange Money payment done. Ref attached.',
        adminNote: '',
        reviewedBy: null,
        reviewedAt: null,
        createdAt: '2025-06-18T08:00:00',
        updatedAt: '2025-06-18T08:00:00',
    },
];

export default function PremiumRequestsPage() {
    // ─── State ───
    const [requests, setRequests] = useState(INITIAL_REQUESTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [sortAnchorEl, setSortAnchorEl] = useState(null);

    // Dialogs
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [screenshotDialogOpen, setScreenshotDialogOpen] = useState(false);
    const [actionTarget, setActionTarget] = useState(null);
    const [adminNote, setAdminNote] = useState('');

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ─── Stats ───
    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === 'pending').length;
    const approvedRequests = requests.filter((r) => r.status === 'approved').length;
    const rejectedRequests = requests.filter((r) => r.status === 'rejected').length;
    const totalRevenue = requests
        .filter((r) => r.status === 'approved')
        .reduce((sum, r) => sum + r.amount, 0);
    const pendingRevenue = requests
        .filter((r) => r.status === 'pending')
        .reduce((sum, r) => sum + r.amount, 0);

    // ─── Filtered ───
    const filteredRequests = useMemo(() => {
        let result = requests.filter((r) => {
            const matchesSearch =
                r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.transactionRef.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTab = activeTab === 'all' || r.status === activeTab;
            const matchesMethod = methodFilter === 'all' || r.paymentMethod === methodFilter;
            const matchesPlan = planFilter === 'all' || r.plan === planFilter;

            return matchesSearch && matchesTab && matchesMethod && matchesPlan;
        });

        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'amount_high') return b.amount - a.amount;
            if (sortBy === 'amount_low') return a.amount - b.amount;
            return 0;
        });

        return result;
    }, [requests, searchQuery, activeTab, methodFilter, planFilter, sortBy]);

    // ─── Handlers ───
    const handleViewOpen = (request) => {
        setActionTarget(request);
        setViewDialogOpen(true);
    };

    const handleApproveOpen = (request) => {
        setActionTarget(request);
        setAdminNote('');
        setApproveDialogOpen(true);
    };

    const handleApproveConfirm = () => {
        if (!actionTarget) return;
        setRequests((prev) =>
            prev.map((r) =>
                r.id === actionTarget.id
                    ? {
                        ...r,
                        status: 'approved',
                        adminNote: adminNote || 'Payment verified and approved.',
                        reviewedBy: 'Admin',
                        reviewedAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }
                    : r
            )
        );
        setApproveDialogOpen(false);
        setViewDialogOpen(false);
        setSnackbar({
            open: true,
            message: `✅ Request ${actionTarget.id} approved! "${actionTarget.userName}" is now Premium.`,
            severity: 'success',
        });
    };

    const handleRejectOpen = (request) => {
        setActionTarget(request);
        setAdminNote('');
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = () => {
        if (!actionTarget) return;
        setRequests((prev) =>
            prev.map((r) =>
                r.id === actionTarget.id
                    ? {
                        ...r,
                        status: 'rejected',
                        adminNote: adminNote || 'Payment could not be verified.',
                        reviewedBy: 'Admin',
                        reviewedAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }
                    : r
            )
        );
        setRejectDialogOpen(false);
        setViewDialogOpen(false);
        setSnackbar({
            open: true,
            message: `❌ Request ${actionTarget.id} rejected.`,
            severity: 'error',
        });
    };

    const handleScreenshotOpen = (request) => {
        setActionTarget(request);
        setScreenshotDialogOpen(true);
    };

    const handleCopyRef = (ref) => {
        navigator.clipboard?.writeText(ref);
        setSnackbar({ open: true, message: `Copied: ${ref}`, severity: 'info' });
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* ─── Header ─── */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="700" color="#1e293b">
                        💎 Premium Requests
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                        Review and manage premium upgrade payment requests
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {pendingRequests > 0 && (
                        <Chip
                            icon={<PendingActionsIcon sx={{ fontSize: 16 }} />}
                            label={`${pendingRequests} pending`}
                            sx={{
                                fontWeight: 700,
                                bgcolor: '#f59e0b12',
                                color: '#f59e0b',
                                border: '1px solid #f59e0b30',
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.7 },
                                },
                            }}
                        />
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                            borderColor: '#e2e8f0',
                            color: '#64748b',
                            '&:hover': { borderColor: '#667eea', color: '#667eea', bgcolor: '#667eea08' },
                        }}
                    >
                        Export
                    </Button>
                    <Tooltip title="Refresh">
                        <IconButton
                            sx={{
                                bgcolor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: '#f8fafc' },
                            }}
                        >
                            <RefreshIcon sx={{ fontSize: 20, color: '#64748b' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* ─── Stats ─── */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(6, 1fr)' },
                    gap: 2,
                    mb: 4,
                }}
            >
                {[
                    {
                        label: 'Total Requests',
                        value: totalRequests,
                        icon: <ReceiptLongIcon />,
                        color: '#667eea',
                        gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
                    },
                    {
                        label: 'Pending',
                        value: pendingRequests,
                        icon: <HourglassEmptyIcon />,
                        color: '#f59e0b',
                        gradient: STATUS_CONFIG.pending.gradient,
                    },
                    {
                        label: 'Approved',
                        value: approvedRequests,
                        icon: <CheckCircleIcon />,
                        color: '#10b981',
                        gradient: STATUS_CONFIG.approved.gradient,
                    },
                    {
                        label: 'Rejected',
                        value: rejectedRequests,
                        icon: <CancelIcon />,
                        color: '#ef4444',
                        gradient: STATUS_CONFIG.rejected.gradient,
                    },
                    {
                        label: 'Total Revenue',
                        value: formatCurrency(totalRevenue),
                        icon: <MonetizationOnIcon />,
                        color: '#10b981',
                        gradient: 'linear-gradient(135deg,#10b981,#059669)',
                        isText: true,
                    },
                    {
                        label: 'Pending Revenue',
                        value: formatCurrency(pendingRevenue),
                        icon: <TrendingUpIcon />,
                        color: '#f59e0b',
                        gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
                        isText: true,
                    },
                ].map((stat, i) => (
                    <Box
                        key={i}
                        sx={{
                            bgcolor: '#ffffff',
                            p: 2,
                            borderRadius: 2.5,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            },
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: stat.gradient,
                                opacity: 0.08,
                            }}
                        />
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 2,
                                background: stat.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                mb: 1,
                                '& .MuiSvgIcon-root': { fontSize: 18 },
                            }}
                        >
                            {stat.icon}
                        </Box>
                        <Typography
                            variant={stat.isText ? 'body1' : 'h6'}
                            fontWeight="800"
                            color="#1e293b"
                            sx={{ lineHeight: 1.2 }}
                        >
                            {stat.value}
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">
                            {stat.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* ─── Tabs ─── */}
            <Tabs
                value={activeTab}
                onChange={(e, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    mb: 3,
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        minHeight: 40,
                    },
                    '& .Mui-selected': { color: '#667eea' },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#667eea',
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                    },
                }}
            >
                <Tab label={`All (${totalRequests})`} value="all" />
                <Tab
                    icon={<HourglassEmptyIcon sx={{ fontSize: 16 }} />}
                    iconPosition="start"
                    label={
                        <Badge
                            badgeContent={pendingRequests}
                            color="warning"
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '0.6rem',
                                    height: 16,
                                    minWidth: 16,
                                },
                            }}
                        >
                            <Box sx={{ pr: 1.5 }}>Pending</Box>
                        </Badge>
                    }
                    value="pending"
                />
                <Tab
                    icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                    iconPosition="start"
                    label={`Approved (${approvedRequests})`}
                    value="approved"
                />
                <Tab
                    icon={<CancelIcon sx={{ fontSize: 16 }} />}
                    iconPosition="start"
                    label={`Rejected (${rejectedRequests})`}
                    value="rejected"
                />
            </Tabs>

            {/* ─── Filters ─── */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search by name, email, ID, or reference..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        flex: 1,
                        minWidth: 260,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#ffffff',
                            '&.Mui-focused fieldset': { borderColor: '#667eea' },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>
                        Payment Method
                    </InputLabel>
                    <Select
                        value={methodFilter}
                        label="Payment Method"
                        onChange={(e) => setMethodFilter(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            bgcolor: '#ffffff',
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#667eea',
                            },
                        }}
                    >
                        <MenuItem value="all">All Methods</MenuItem>
                        {Object.entries(PAYMENT_METHODS).map(([key, cfg]) => (
                            <MenuItem key={key} value={key}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: cfg.color,
                                    }}
                                >
                                    {cfg.icon}
                                    <Typography variant="body2">{cfg.shortLabel}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Plan</InputLabel>
                    <Select
                        value={planFilter}
                        label="Plan"
                        onChange={(e) => setPlanFilter(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            bgcolor: '#ffffff',
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#667eea',
                            },
                        }}
                    >
                        <MenuItem value="all">All Plans</MenuItem>
                        {Object.entries(PLAN_CONFIG).map(([key, cfg]) => (
                            <MenuItem key={key} value={key}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: cfg.color,
                                    }}
                                >
                                    {cfg.icon}
                                    <Typography variant="body2">{cfg.shortLabel}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <IconButton
                    size="small"
                    onClick={(e) => setSortAnchorEl(e.currentTarget)}
                    sx={{
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        width: 38,
                        height: 38,
                    }}
                >
                    <SortIcon sx={{ fontSize: 18, color: '#64748b' }} />
                </IconButton>

                <Menu
                    anchorEl={sortAnchorEl}
                    open={Boolean(sortAnchorEl)}
                    onClose={() => setSortAnchorEl(null)}
                >
                    {[
                        { label: 'Newest First', value: 'newest' },
                        { label: 'Oldest First', value: 'oldest' },
                        { label: 'Amount (High → Low)', value: 'amount_high' },
                        { label: 'Amount (Low → High)', value: 'amount_low' },
                    ].map((opt) => (
                        <MenuItem
                            key={opt.value}
                            selected={sortBy === opt.value}
                            onClick={() => {
                                setSortBy(opt.value);
                                setSortAnchorEl(null);
                            }}
                        >
                            {opt.label}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>

            {/* Results count */}
            <Typography variant="body2" color="#94a3b8" sx={{ mb: 2 }}>
                Showing {filteredRequests.length} request
                {filteredRequests.length !== 1 ? 's' : ''}
            </Typography>

            {/* ─── Request List ─── */}
            {filteredRequests.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 10,
                        bgcolor: '#ffffff',
                        borderRadius: 3,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    <WorkspacePremiumIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 2 }} />
                    <Typography variant="h6" fontWeight="600" color="#94a3b8">
                        No requests found
                    </Typography>
                    <Typography variant="body2" color="#cbd5e1">
                        Try adjusting your filters or search query
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        bgcolor: '#ffffff',
                        borderRadius: 3,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Table Header */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'grid' },
                            gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.8fr 1.5fr',
                            gap: 2,
                            p: 2,
                            bgcolor: '#f8fafc',
                            borderBottom: '1px solid #e2e8f0',
                        }}
                    >
                        {['USER', 'PAYMENT METHOD', 'AMOUNT', 'PLAN', 'STATUS', 'ACTIONS'].map(
                            (h) => (
                                <Typography
                                    key={h}
                                    variant="caption"
                                    fontWeight="700"
                                    color="#64748b"
                                    letterSpacing="0.05em"
                                >
                                    {h}
                                </Typography>
                            )
                        )}
                    </Box>

                    {/* Rows */}
                    {filteredRequests.map((request, index) => {
                        const statusCfg = STATUS_CONFIG[request.status];
                        const methodCfg =
                            PAYMENT_METHODS[request.paymentMethod] || PAYMENT_METHODS.mtn_momo;
                        const planCfg =
                            PLAN_CONFIG[request.plan] || PLAN_CONFIG.premium_monthly;

                        return (
                            <Box
                                key={request.id}
                                sx={{
                                    display: { xs: 'flex', md: 'grid' },
                                    flexDirection: { xs: 'column', md: 'unset' },
                                    gridTemplateColumns: '2fr 1.2fr 1fr 1fr 0.8fr 1.5fr',
                                    gap: { xs: 1.5, md: 2 },
                                    p: 2,
                                    alignItems: { md: 'center' },
                                    borderBottom:
                                        index < filteredRequests.length - 1
                                            ? '1px solid #f1f5f9'
                                            : 'none',
                                    borderLeft: `3px solid ${statusCfg.color}`,
                                    transition: 'all 0.15s ease',
                                    '&:hover': { bgcolor: '#f8fafc' },
                                    opacity: request.status === 'rejected' ? 0.7 : 1,
                                }}
                            >
                                {/* User */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        minWidth: 0,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: '#667eea15',
                                            color: '#667eea',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        {getInitials(request.userName)}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                fontWeight="600"
                                                color="#1e293b"
                                                noWrap
                                            >
                                                {request.userName}
                                            </Typography>
                                            {request.status === 'approved' && (
                                                <VerifiedIcon
                                                    sx={{ fontSize: 14, color: '#10b981' }}
                                                />
                                            )}
                                        </Box>
                                        <Typography variant="caption" color="#94a3b8" noWrap>
                                            {request.userEmail}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: { xs: 'flex', md: 'none' },
                                                gap: 0.5,
                                                mt: 0.5,
                                            }}
                                        >
                                            <Chip
                                                label={request.id}
                                                size="small"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.55rem',
                                                    height: 18,
                                                    fontFamily: 'monospace',
                                                    bgcolor: '#f1f5f9',
                                                    color: '#94a3b8',
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Payment Method */}
                                <Box>
                                    <Chip
                                        icon={methodCfg.icon}
                                        label={methodCfg.shortLabel}
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            height: 24,
                                            bgcolor: methodCfg.bgcolor,
                                            color: methodCfg.color,
                                            '& .MuiChip-icon': {
                                                ml: 0.5,
                                                color: methodCfg.color,
                                            },
                                        }}
                                    />
                                    <Tooltip title="Click to copy">
                                        <Typography
                                            variant="caption"
                                            color="#94a3b8"
                                            sx={{
                                                display: 'block',
                                                mt: 0.3,
                                                fontFamily: 'monospace',
                                                fontSize: '0.6rem',
                                                cursor: 'pointer',
                                                '&:hover': { color: '#667eea' },
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyRef(request.transactionRef);
                                            }}
                                        >
                                            {request.transactionRef}
                                        </Typography>
                                    </Tooltip>
                                </Box>

                                {/* Amount */}
                                <Box>
                                    <Typography variant="body2" fontWeight="700" color="#1e293b">
                                        {formatCurrency(request.amount, request.currency)}
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">
                                        {formatDate(request.createdAt)}
                                    </Typography>
                                </Box>

                                {/* Plan */}
                                <Box>
                                    <Chip
                                        icon={planCfg.icon}
                                        label={planCfg.shortLabel}
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.65rem',
                                            height: 22,
                                            bgcolor: `${planCfg.color}12`,
                                            color: planCfg.color,
                                            '& .MuiChip-icon': {
                                                ml: 0.5,
                                                color: planCfg.color,
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Status */}
                                <Box>
                                    <Chip
                                        icon={statusCfg.icon}
                                        label={statusCfg.label}
                                        size="small"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.65rem',
                                            height: 24,
                                            bgcolor: statusCfg.bgcolor,
                                            color: statusCfg.color,
                                            border: `1px solid ${statusCfg.borderColor}`,
                                            '& .MuiChip-icon': {
                                                ml: 0.5,
                                                color: statusCfg.color,
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Actions */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 0.5,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {/* View */}
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewOpen(request)}
                                            sx={{
                                                bgcolor: '#667eea10',
                                                color: '#667eea',
                                                '&:hover': { bgcolor: '#667eea20' },
                                            }}
                                        >
                                            <VisibilityIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Screenshot */}
                                    <Tooltip title="View Payment Proof">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleScreenshotOpen(request)}
                                            sx={{
                                                bgcolor: '#06b6d410',
                                                color: '#06b6d4',
                                                '&:hover': { bgcolor: '#06b6d420' },
                                            }}
                                        >
                                            <ImageIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Approve / Reject (only for pending) */}
                                    {request.status === 'pending' && (
                                        <>
                                            <Tooltip title="Approve">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleApproveOpen(request)}
                                                    sx={{
                                                        bgcolor: '#10b98110',
                                                        color: '#10b981',
                                                        '&:hover': { bgcolor: '#10b98125' },
                                                    }}
                                                >
                                                    <ThumbUpIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reject">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRejectOpen(request)}
                                                    sx={{
                                                        bgcolor: '#ef444410',
                                                        color: '#ef4444',
                                                        '&:hover': { bgcolor: '#ef444425' },
                                                    }}
                                                >
                                                    <ThumbDownIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )}

                                    {/* Already reviewed indicator */}
                                    {request.status !== 'pending' && (
                                        <Tooltip
                                            title={`Reviewed by ${request.reviewedBy} on ${request.reviewedAt ? formatFullDate(request.reviewedAt) : 'N/A'}`}
                                        >
                                            <Chip
                                                icon={
                                                    <HistoryIcon
                                                        sx={{ fontSize: 12 }}
                                                    />
                                                }
                                                label={`by ${request.reviewedBy}`}
                                                size="small"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.55rem',
                                                    height: 22,
                                                    bgcolor: '#f1f5f9',
                                                    color: '#94a3b8',
                                                    '& .MuiChip-icon': {
                                                        ml: 0.5,
                                                        color: '#94a3b8',
                                                    },
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* ═══════════ VIEW DETAIL DIALOG ═══════════ */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
            >
                {actionTarget &&
                    (() => {
                        const statusCfg = STATUS_CONFIG[actionTarget.status];
                        const methodCfg =
                            PAYMENT_METHODS[actionTarget.paymentMethod] ||
                            PAYMENT_METHODS.mtn_momo;
                        const planCfg =
                            PLAN_CONFIG[actionTarget.plan] || PLAN_CONFIG.premium_monthly;

                        return (
                            <>
                                {/* Header */}
                                <Box
                                    sx={{
                                        background: statusCfg.gradient,
                                        p: 3,
                                        color: '#ffffff',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 2.5,
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <WorkspacePremiumIcon
                                                sx={{ fontSize: 26, color: '#ffffff' }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight="700">
                                                Premium Request
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ opacity: 0.85 }}
                                            >
                                                {actionTarget.id} ·{' '}
                                                {statusCfg.label}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton
                                        onClick={() => setViewDialogOpen(false)}
                                        sx={{ color: '#ffffff' }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                <DialogContent sx={{ p: 3 }}>
                                    {/* Status & Plan */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            mb: 2.5,
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <Chip
                                            icon={statusCfg.icon}
                                            label={statusCfg.label}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                bgcolor: statusCfg.bgcolor,
                                                color: statusCfg.color,
                                                border: `1px solid ${statusCfg.borderColor}`,
                                                '& .MuiChip-icon': {
                                                    color: statusCfg.color,
                                                },
                                            }}
                                        />
                                        <Chip
                                            icon={planCfg.icon}
                                            label={planCfg.label}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                bgcolor: `${planCfg.color}12`,
                                                color: planCfg.color,
                                                '& .MuiChip-icon': {
                                                    color: planCfg.color,
                                                },
                                            }}
                                        />
                                        <Chip
                                            label={actionTarget.id}
                                            size="small"
                                            icon={
                                                <ContentCopyIcon sx={{ fontSize: 12 }} />
                                            }
                                            onClick={() =>
                                                handleCopyRef(actionTarget.id)
                                            }
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: 'monospace',
                                                bgcolor: '#f1f5f9',
                                                color: '#64748b',
                                                cursor: 'pointer',
                                                '& .MuiChip-icon': {
                                                    color: '#94a3b8',
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Info Grid */}
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 2,
                                            mb: 2.5,
                                        }}
                                    >
                                        {/* User */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.8,
                                                    mb: 0.8,
                                                }}
                                            >
                                                <PersonIcon
                                                    sx={{
                                                        fontSize: 14,
                                                        color: '#94a3b8',
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="700"
                                                    color="#94a3b8"
                                                >
                                                    USER
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight="600"
                                                color="#1e293b"
                                            >
                                                {actionTarget.userName}
                                            </Typography>
                                            <Typography variant="caption" color="#94a3b8">
                                                {actionTarget.userEmail}
                                            </Typography>
                                        </Box>

                                        {/* Amount */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.8,
                                                    mb: 0.8,
                                                }}
                                            >
                                                <AttachMoneyIcon
                                                    sx={{
                                                        fontSize: 14,
                                                        color: '#94a3b8',
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="700"
                                                    color="#94a3b8"
                                                >
                                                    AMOUNT
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                fontWeight="800"
                                                color="#1e293b"
                                            >
                                                {formatCurrency(
                                                    actionTarget.amount,
                                                    actionTarget.currency
                                                )}
                                            </Typography>
                                            {actionTarget.amount !==
                                                (PLAN_CONFIG[actionTarget.plan]?.price || 0) && (
                                                    <Alert
                                                        severity="warning"
                                                        sx={{
                                                            mt: 1,
                                                            borderRadius: 1.5,
                                                            py: 0,
                                                            '& .MuiAlert-message': {
                                                                fontSize: '0.7rem',
                                                            },
                                                        }}
                                                    >
                                                        Expected:{' '}
                                                        {formatCurrency(
                                                            PLAN_CONFIG[actionTarget.plan]?.price || 0,
                                                            actionTarget.currency
                                                        )}
                                                    </Alert>
                                                )}
                                        </Box>

                                        {/* Payment Method */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.8,
                                                    mb: 0.8,
                                                }}
                                            >
                                                <PaymentIcon
                                                    sx={{
                                                        fontSize: 14,
                                                        color: '#94a3b8',
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="700"
                                                    color="#94a3b8"
                                                >
                                                    PAYMENT METHOD
                                                </Typography>
                                            </Box>
                                            <Chip
                                                icon={methodCfg.icon}
                                                label={methodCfg.label}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '0.7rem',
                                                    height: 24,
                                                    bgcolor: methodCfg.bgcolor,
                                                    color: methodCfg.color,
                                                    '& .MuiChip-icon': {
                                                        ml: 0.5,
                                                        color: methodCfg.color,
                                                    },
                                                }}
                                            />
                                        </Box>

                                        {/* Date */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.8,
                                                    mb: 0.8,
                                                }}
                                            >
                                                <CalendarTodayIcon
                                                    sx={{
                                                        fontSize: 14,
                                                        color: '#94a3b8',
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="700"
                                                    color="#94a3b8"
                                                >
                                                    SUBMITTED
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight="600"
                                                color="#1e293b"
                                            >
                                                {formatFullDate(actionTarget.createdAt)}
                                            </Typography>
                                            <Typography variant="caption" color="#94a3b8">
                                                {formatDate(actionTarget.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Transaction Reference */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: '#667eea08',
                                            border: '1px solid #667eea20',
                                            mb: 2,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="700"
                                                    color="#667eea"
                                                >
                                                    TRANSACTION REFERENCE
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="600"
                                                    color="#1e293b"
                                                    sx={{ fontFamily: 'monospace' }}
                                                >
                                                    {actionTarget.transactionRef}
                                                </Typography>
                                            </Box>
                                            <Tooltip title="Copy Reference">
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleCopyRef(
                                                            actionTarget.transactionRef
                                                        )
                                                    }
                                                    sx={{ color: '#667eea' }}
                                                >
                                                    <ContentCopyIcon
                                                        sx={{ fontSize: 16 }}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>

                                    {/* User Note */}
                                    {actionTarget.note && (
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                                mb: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.8,
                                                    mb: 0.8,
                                                }}
                                            >
                                                <NotesIcon
                                                    sx={{
                                                        fontSize: 14,
                                                        color: '#94a3b8',
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="700"
                                                    color="#94a3b8"
                                                >
                                                    USER NOTE
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                color="#64748b"
                                                sx={{ lineHeight: 1.7 }}
                                            >
                                                {actionTarget.note}
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* Admin Note */}
                                    {actionTarget.adminNote && (
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: statusCfg.bgcolor,
                                                border: `1px solid ${statusCfg.borderColor}`,
                                                mb: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.8,
                                                    mb: 0.8,
                                                }}
                                            >
                                                <FlagIcon
                                                    sx={{
                                                        fontSize: 14,
                                                        color: statusCfg.color,
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight="700"
                                                    color={statusCfg.color}
                                                >
                                                    ADMIN NOTE
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                color="#64748b"
                                                sx={{ lineHeight: 1.7 }}
                                            >
                                                {actionTarget.adminNote}
                                            </Typography>
                                            {actionTarget.reviewedBy && (
                                                <Typography
                                                    variant="caption"
                                                    color="#94a3b8"
                                                    sx={{ display: 'block', mt: 1 }}
                                                >
                                                    — {actionTarget.reviewedBy},{' '}
                                                    {actionTarget.reviewedAt
                                                        ? formatFullDate(
                                                            actionTarget.reviewedAt
                                                        )
                                                        : ''}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {/* Payment Proof Preview */}
                                    <Box
                                        onClick={() =>
                                            handleScreenshotOpen(actionTarget)
                                        }
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor: '#f1f5f9',
                                            border: '2px dashed #e2e8f0',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: '#667eea',
                                                bgcolor: '#667eea08',
                                            },
                                        }}
                                    >
                                        <ImageIcon
                                            sx={{
                                                fontSize: 40,
                                                color: '#94a3b8',
                                                mb: 1,
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            fontWeight="600"
                                            color="#667eea"
                                        >
                                            View Payment Proof
                                        </Typography>
                                        <Typography variant="caption" color="#94a3b8">
                                            Click to view the uploaded screenshot
                                        </Typography>
                                    </Box>
                                </DialogContent>

                                <DialogActions
                                    sx={{
                                        px: 3,
                                        pb: 2,
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Button
                                        onClick={() => setViewDialogOpen(false)}
                                        sx={{
                                            textTransform: 'none',
                                            color: '#64748b',
                                        }}
                                    >
                                        Close
                                    </Button>

                                    {actionTarget.status === 'pending' && (
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<ThumbDownIcon />}
                                                onClick={() =>
                                                    handleRejectOpen(actionTarget)
                                                }
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<ThumbUpIcon />}
                                                onClick={() =>
                                                    handleApproveOpen(actionTarget)
                                                }
                                                sx={{
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    borderRadius: 2,
                                                    bgcolor: '#10b981',
                                                    '&:hover': { bgcolor: '#059669' },
                                                }}
                                            >
                                                Approve
                                            </Button>
                                        </Box>
                                    )}
                                </DialogActions>
                            </>
                        );
                    })()}
            </Dialog>

            {/* ═══════════ APPROVE DIALOG ═══════════ */}
            <Dialog
                open={approveDialogOpen}
                onClose={() => setApproveDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#10b981' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <CheckCircleIcon /> Approve Request
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {actionTarget && (
                        <>
                            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                                Approve premium upgrade for{' '}
                                <strong>{actionTarget.userName}</strong>?
                            </Typography>

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    mb: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        color="#94a3b8"
                                    >
                                        Plan
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight="600"
                                        color="#1e293b"
                                    >
                                        {PLAN_CONFIG[actionTarget.plan]?.label}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        color="#94a3b8"
                                    >
                                        Amount
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight="600"
                                        color="#1e293b"
                                    >
                                        {formatCurrency(
                                            actionTarget.amount,
                                            actionTarget.currency
                                        )}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        color="#94a3b8"
                                    >
                                        Ref
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight="600"
                                        color="#1e293b"
                                        sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                    >
                                        {actionTarget.transactionRef}
                                    </Typography>
                                </Box>
                            </Box>

                            <Alert
                                severity="info"
                                sx={{ mb: 2, borderRadius: 2 }}
                            >
                                <Typography variant="caption">
                                    This will:
                                    <br />
                                    1️⃣ Update request status → <strong>Approved</strong>
                                    <br />
                                    2️⃣ Update user subscription → <strong>Active</strong>
                                </Typography>
                            </Alert>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Admin Note (optional)"
                                placeholder="e.g. Payment verified via MTN dashboard. Transaction confirmed."
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#10b981',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#10b981',
                                    },
                                }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setApproveDialogOpen(false)}
                        sx={{ textTransform: 'none', color: '#64748b' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleApproveConfirm}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            bgcolor: '#10b981',
                            '&:hover': { bgcolor: '#059669' },
                        }}
                    >
                        Approve & Activate
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ REJECT DIALOG ═══════════ */}
            <Dialog
                open={rejectDialogOpen}
                onClose={() => setRejectDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <CancelIcon /> Reject Request
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {actionTarget && (
                        <>
                            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                                Reject premium request from{' '}
                                <strong>{actionTarget.userName}</strong>?
                            </Typography>

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    mb: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        color="#94a3b8"
                                    >
                                        Amount Claimed
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight="600"
                                        color="#1e293b"
                                    >
                                        {formatCurrency(
                                            actionTarget.amount,
                                            actionTarget.currency
                                        )}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        color="#94a3b8"
                                    >
                                        Ref
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight="600"
                                        color="#1e293b"
                                        sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                                    >
                                        {actionTarget.transactionRef}
                                    </Typography>
                                </Box>
                            </Box>

                            <Alert
                                severity="warning"
                                sx={{ mb: 2, borderRadius: 2 }}
                            >
                                Please provide a reason for rejection so the user understands why.
                            </Alert>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Rejection Reason"
                                placeholder="e.g. Incorrect amount sent. Please pay the full amount and resubmit."
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#ef4444',
                                        },
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#ef4444',
                                    },
                                }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setRejectDialogOpen(false)}
                        sx={{ textTransform: 'none', color: '#64748b' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={handleRejectConfirm}
                        disabled={!adminNote.trim()}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                        }}
                    >
                        Reject Request
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ SCREENSHOT DIALOG ═══════════ */}
            <Dialog
                open={screenshotDialogOpen}
                onClose={() => setScreenshotDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
            >
                {actionTarget && (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 2,
                                borderBottom: '1px solid #e2e8f0',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                }}
                            >
                                <ImageIcon sx={{ color: '#667eea' }} />
                                <Box>
                                    <Typography
                                        variant="body1"
                                        fontWeight="700"
                                        color="#1e293b"
                                    >
                                        Payment Proof
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">
                                        {actionTarget.userName} ·{' '}
                                        {actionTarget.id} ·{' '}
                                        {formatCurrency(
                                            actionTarget.amount,
                                            actionTarget.currency
                                        )}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                onClick={() => setScreenshotDialogOpen(false)}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <DialogContent
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {/* Placeholder for screenshot */}
                            <Box
                                sx={{
                                    width: '100%',
                                    minHeight: 400,
                                    bgcolor: '#f1f5f9',
                                    borderRadius: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px dashed #e2e8f0',
                                }}
                            >
                                <ImageIcon
                                    sx={{
                                        fontSize: 64,
                                        color: '#cbd5e1',
                                        mb: 2,
                                    }}
                                />
                                <Typography
                                    variant="body1"
                                    fontWeight="600"
                                    color="#94a3b8"
                                >
                                    Payment Screenshot
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="#cbd5e1"
                                    sx={{ mt: 0.5 }}
                                >
                                    {actionTarget.screenshot}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="#cbd5e1"
                                    sx={{ mt: 1, fontStyle: 'italic' }}
                                >
                                    (In production, the actual uploaded image will be displayed here)
                                </Typography>
                            </Box>

                            {/* Transaction info below screenshot */}
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: '#f8fafc',
                                    border: '1px solid #f1f5f9',
                                    width: '100%',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="#94a3b8"
                                        >
                                            Transaction Ref
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontWeight="600"
                                            color="#1e293b"
                                            sx={{ fontFamily: 'monospace' }}
                                        >
                                            {actionTarget.transactionRef}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="#94a3b8"
                                        >
                                            Method
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontWeight="600"
                                            color="#1e293b"
                                        >
                                            {PAYMENT_METHODS[actionTarget.paymentMethod]
                                                ?.label || actionTarget.paymentMethod}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="#94a3b8"
                                        >
                                            Amount
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontWeight="700"
                                            color="#1e293b"
                                        >
                                            {formatCurrency(
                                                actionTarget.amount,
                                                actionTarget.currency
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions
                            sx={{
                                px: 3,
                                pb: 2,
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                onClick={() => setScreenshotDialogOpen(false)}
                                sx={{ textTransform: 'none', color: '#64748b' }}
                            >
                                Close
                            </Button>
                            {actionTarget.status === 'pending' && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<ThumbDownIcon />}
                                        onClick={() => {
                                            setScreenshotDialogOpen(false);
                                            handleRejectOpen(actionTarget);
                                        }}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                        }}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<ThumbUpIcon />}
                                        onClick={() => {
                                            setScreenshotDialogOpen(false);
                                            handleApproveOpen(actionTarget);
                                        }}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            bgcolor: '#10b981',
                                            '&:hover': { bgcolor: '#059669' },
                                        }}
                                    >
                                        Approve
                                    </Button>
                                </Box>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* ═══════════ SNACKBAR ═══════════ */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((prev) => ({ ...prev, open: false }))
                }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() =>
                        setSnackbar((prev) => ({ ...prev, open: false }))
                    }
                    severity={snackbar.severity}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* ─── Info Banner ─── */}
            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: '#ffffff',
                    borderRadius: 3,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
            >
                <Typography
                    variant="body1"
                    fontWeight="700"
                    color="#1e293b"
                    sx={{ mb: 2 }}
                >
                    💡 How Premium Requests Work
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                        gap: 2,
                    }}
                >
                    {[
                        {
                            step: '1',
                            title: 'User Submits Request',
                            description:
                                'User makes a payment via MTN MoMo, Orange Money, or Bank Transfer, then submits a request with their payment proof screenshot and transaction reference.',
                            color: '#3b82f6',
                            icon: <SendIcon sx={{ fontSize: 18 }} />,
                        },
                        {
                            step: '2',
                            title: 'Admin Reviews',
                            description:
                                'Admin verifies the payment proof, checks the transaction reference in the payment system dashboard, and confirms the amount matches.',
                            color: '#f59e0b',
                            icon: <VisibilityIcon sx={{ fontSize: 18 }} />,
                        },
                        {
                            step: '3',
                            title: 'Approve or Reject',
                            description:
                                'If valid: request status → Approved, user subscription → Active. If invalid: request status → Rejected with a reason note.',
                            color: '#10b981',
                            icon: <TaskAltIcon sx={{ fontSize: 18 }} />,
                        },
                    ].map((item) => (
                        <Box
                            key={item.step}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: `${item.color}08`,
                                border: `1px solid ${item.color}20`,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        bgcolor: item.color,
                                        color: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {item.step}
                                </Box>
                                <Typography
                                    variant="body2"
                                    fontWeight="700"
                                    color={item.color}
                                >
                                    {item.title}
                                </Typography>
                            </Box>
                            <Typography
                                variant="caption"
                                color="#64748b"
                                sx={{ lineHeight: 1.6 }}
                            >
                                {item.description}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}