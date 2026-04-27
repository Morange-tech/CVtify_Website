'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BlockIcon from '@mui/icons-material/Block';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import BrushIcon from '@mui/icons-material/Brush';
import TuneIcon from '@mui/icons-material/Tune';
import MailIcon from '@mui/icons-material/Mail';
import FlagIcon from '@mui/icons-material/Flag';
import GavelIcon from '@mui/icons-material/Gavel';
import DevicesIcon from '@mui/icons-material/Devices';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import CircleIcon from '@mui/icons-material/Circle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { fetchLogs as fetchLogsApi, fetchLogStats, fetchLogById, deleteLog as deleteLogApi, clearLogs as clearLogsApi, } from '../../hooks/useLogs';

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
        second: '2-digit',
    });

const LOG_TYPES = {
    admin_action: {
        label: 'Admin Action',
        shortLabel: 'Admin',
        icon: <AdminPanelSettingsIcon />,
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    },
    settings_changed: {
        label: 'Settings Changed',
        shortLabel: 'Settings',
        icon: <SettingsIcon />,
        color: '#6366f1',
        gradient: 'linear-gradient(135deg,#6366f1,#4f46e5)',
    },
    template_added: {
        label: 'Template Added',
        shortLabel: 'Template',
        icon: <NoteAddIcon />,
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg,#06b6d4,#0891b2)',
    },
    user_login: {
        label: 'User Login',
        shortLabel: 'Login',
        icon: <LoginIcon />,
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)',
    },
    user_logout: {
        label: 'User Logout',
        shortLabel: 'Logout',
        icon: <LogoutIcon />,
        color: '#64748b',
        gradient: 'linear-gradient(135deg,#64748b,#475569)',
    },
    user_registered: {
        label: 'User Registered',
        shortLabel: 'Signup',
        icon: <PersonAddIcon />,
        color: '#10b981',
        gradient: 'linear-gradient(135deg,#10b981,#059669)',
    },
    cv_created: {
        label: 'CV Created',
        shortLabel: 'CV Create',
        icon: <DescriptionIcon />,
        color: '#10b981',
        gradient: 'linear-gradient(135deg,#10b981,#059669)',
    },
    cv_updated: {
        label: 'CV Updated',
        shortLabel: 'CV Edit',
        icon: <EditIcon />,
        color: '#0ea5e9',
        gradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
    },
    cv_deleted: {
        label: 'CV Deleted',
        shortLabel: 'CV Delete',
        icon: <DeleteForeverIcon />,
        color: '#ef4444',
        gradient: 'linear-gradient(135deg,#ef4444,#dc2626)',
    },
    payment_submitted: {
        label: 'Payment Submitted',
        shortLabel: 'Payment',
        icon: <PaymentIcon />,
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
    },
    payment_failed: {
        label: 'Payment Failed',
        shortLabel: 'Failed Pay',
        icon: <CancelIcon />,
        color: '#ef4444',
        gradient: 'linear-gradient(135deg,#ef4444,#dc2626)',
    },
    premium_upgrade: {
        label: 'Premium Upgrade',
        shortLabel: 'Upgrade',
        icon: <WorkspacePremiumIcon />,
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    },
};

const SEVERITY_CONFIG = {
    info: { label: 'Info', color: '#3b82f6', bgcolor: '#3b82f615', icon: <InfoIcon sx={{ fontSize: 14 }} /> },
    success: { label: 'Success', color: '#10b981', bgcolor: '#10b98115', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
    warning: { label: 'Warning', color: '#f59e0b', bgcolor: '#f59e0b15', icon: <WarningAmberIcon sx={{ fontSize: 14 }} /> },
    error: { label: 'Error', color: '#ef4444', bgcolor: '#ef444415', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
};

const handleRefresh = async () => {
    setRefreshing(true);
    await loadLogs(false);
    setSnackbar({
        open: true,
        message: 'Logs refreshed!',
        severity: 'success',
    });
};

// ─── Category groups for tabs ───
const TAB_FILTERS = {
    all: () => true,
    admin: (l) => l.actorRole === 'admin' || l.type === 'admin_action' || l.type === 'settings_changed' || l.type === 'template_added',
    logins: (l) => l.type === 'user_login' || l.type === 'user_logout' || l.type === 'user_registered',
    cv: (l) => l.type.startsWith('cv_'),
    payments: (l) => l.type.startsWith('payment_') || l.type === 'premium_upgrade',
    errors: (l) => l.severity === 'error' || l.severity === 'warning',
};

export default function AdminLogsPage() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        admin: 0,
        logins: 0,
        cv: 0,
        payments: 0,
        errors: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [sortAnchorEl, setSortAnchorEl] = useState(null);

    // Detail
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailTarget, setDetailTarget] = useState(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ─── Computed ───
    const totalLogs = stats.total || logs.length;
    const adminLogs = stats.admin || 0;
    const loginLogs = stats.logins || 0;
    const cvLogs = stats.cv || 0;
    const paymentLogs = stats.payments || 0;
    const errorLogs = stats.errors || 0;
    const todayCount = stats.today || 0;

    // ─── Filtered ───
    const filteredLogs = useMemo(() => {
        let result = logs.filter((l) => {
            const matchesSearch =
                l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.actorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTab = TAB_FILTERS[activeTab](l);
            const matchesType = typeFilter === 'all' || l.type === typeFilter;
            const matchesSeverity = severityFilter === 'all' || l.severity === severityFilter;
            const matchesRole = roleFilter === 'all' || l.actorRole === roleFilter;

            return matchesSearch && matchesTab && matchesType && matchesSeverity && matchesRole;
        });

        result.sort((a, b) =>
            sortBy === 'newest'
                ? new Date(b.timestamp) - new Date(a.timestamp)
                : new Date(a.timestamp) - new Date(b.timestamp)
        );

        return result;
    }, [logs, searchQuery, activeTab, typeFilter, severityFilter, roleFilter, sortBy]);

    const loadLogs = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            setError(null);

            const [logsData, statsData] = await Promise.all([
                fetchLogsApi({
                    tab: activeTab,
                    type: typeFilter,
                    severity: severityFilter,
                    role: roleFilter,
                    search: searchQuery,
                    sort: sortBy,
                }),
                fetchLogStats(),
            ]);

            setLogs(logsData.logs || logsData.data || logsData || []);
            setStats(statsData || {});
        } catch (err) {
            console.error('Failed to fetch logs:', err);
            setError(err.message);
            setSnackbar({
                open: true,
                message: `Failed to load logs: ${err.message}`,
                severity: 'error',
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab, typeFilter, severityFilter, roleFilter, searchQuery, sortBy]);

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    // Group by date
    const groupedLogs = useMemo(() => {
        const groups = {};
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        filteredLogs.forEach((l) => {
            const dateStr = new Date(l.timestamp).toDateString();
            let label;
            if (dateStr === today) label = 'Today';
            else if (dateStr === yesterday) label = 'Yesterday';
            else label = new Date(l.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            if (!groups[label]) groups[label] = [];
            groups[label].push(l);
        });

        return groups;
    }, [filteredLogs]);

    // ─── Handlers ───
    const handleViewDetail = async (log) => {
        try {
            const data = await fetchLogById(log.id);
            setDetailTarget(data.log || data.data || data);
            setDetailOpen(true);
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Failed to load log details',
                severity: 'error',
            });
        }
    };

    const handleCopyId = (id) => {
        navigator.clipboard?.writeText(id);
        setSnackbar({ open: true, message: `Copied ${id}`, severity: 'info' });
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
                        🧾 Activity Logs
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                        Track admin actions, user logins, CV activity, and payment events
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
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
                        Export Logs
                    </Button>
                    <Tooltip title="Refresh">
                        <IconButton
                            onClick={handleRefresh}
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
                    { label: 'Total Logs', value: totalLogs, sub: `${todayCount} today`, icon: <ReceiptLongIcon />, color: '#667eea', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
                    { label: 'Admin Actions', value: adminLogs, icon: <AdminPanelSettingsIcon />, color: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
                    { label: 'Logins / Signups', value: loginLogs, icon: <LoginIcon />, color: '#3b82f6', gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
                    { label: 'CV Activity', value: cvLogs, icon: <DescriptionIcon />, color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
                    { label: 'Payments', value: paymentLogs, icon: <PaymentIcon />, color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
                    { label: 'Errors / Warnings', value: errorLogs, icon: <WarningAmberIcon />, color: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#dc2626)' },
                ].map((stat, i) => (
                    <Box
                        key={i}
                        sx={{
                            bgcolor: '#ffffff',
                            p: 2,
                            borderRadius: 2.5,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
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
                        <Typography variant="h6" fontWeight="800" color="#1e293b" sx={{ lineHeight: 1.2 }}>
                            {stat.value}
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">
                            {stat.label}
                        </Typography>
                        {stat.sub && (
                            <Typography variant="caption" color="#cbd5e1" sx={{ display: 'block' }}>
                                {stat.sub}
                            </Typography>
                        )}
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
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 40 },
                    '& .Mui-selected': { color: '#667eea' },
                    '& .MuiTabs-indicator': { backgroundColor: '#667eea', height: 3, borderRadius: '3px 3px 0 0' },
                }}
            >
                <Tab label={`All (${totalLogs})`} value="all" />
                <Tab icon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Admin (${adminLogs})`} value="admin" />
                <Tab icon={<LoginIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Logins (${loginLogs})`} value="logins" />
                <Tab icon={<DescriptionIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`CVs (${cvLogs})`} value="cv" />
                <Tab icon={<PaymentIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Payments (${paymentLogs})`} value="payments" />
                <Tab
                    icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                    iconPosition="start"
                    label={
                        <Badge
                            badgeContent={errorLogs}
                            color="error"
                            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}
                        >
                            <Box sx={{ pr: 1.5 }}>Errors</Box>
                        </Badge>
                    }
                    value="errors"
                />
            </Tabs>

            {/* ─── Filters ─── */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search logs..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        flex: 1,
                        minWidth: 220,
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

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Type</InputLabel>
                    <Select
                        value={typeFilter}
                        label="Type"
                        onChange={(e) => setTypeFilter(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            bgcolor: '#ffffff',
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                        }}
                    >
                        <MenuItem value="all">All Types</MenuItem>
                        {Object.entries(LOG_TYPES).map(([key, cfg]) => (
                            <MenuItem key={key} value={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: cfg.color }}>
                                    <Box sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }}>{cfg.icon}</Box>
                                    <Typography variant="body2">{cfg.shortLabel}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Severity</InputLabel>
                    <Select
                        value={severityFilter}
                        label="Severity"
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            bgcolor: '#ffffff',
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                        }}
                    >
                        <MenuItem value="all">All</MenuItem>
                        {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
                            <MenuItem key={key} value={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <Box sx={{ color: cfg.color }}>{cfg.icon}</Box>
                                    <Typography variant="body2" color={cfg.color} fontWeight={600}>
                                        {cfg.label}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Role</InputLabel>
                    <Select
                        value={roleFilter}
                        label="Role"
                        onChange={(e) => setRoleFilter(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            bgcolor: '#ffffff',
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                        }}
                    >
                        <MenuItem value="all">All Roles</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="system">System</MenuItem>
                    </Select>
                </FormControl>

                <IconButton
                    size="small"
                    onClick={(e) => setSortAnchorEl(e.currentTarget)}
                    sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, width: 38, height: 38 }}
                >
                    <SortIcon sx={{ fontSize: 18, color: '#64748b' }} />
                </IconButton>

                <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)}>
                    {[
                        { label: 'Newest First', value: 'newest' },
                        { label: 'Oldest First', value: 'oldest' },
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

            {/* Results */}
            <Typography variant="body2" color="#94a3b8" sx={{ mb: 2 }}>
                Showing {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
            </Typography>

            {/* ─── Log List ─── */}
            {filteredLogs.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 10,
                        bgcolor: '#ffffff',
                        borderRadius: 3,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    <ReceiptLongIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 2 }} />
                    <Typography variant="h6" fontWeight="600" color="#94a3b8">
                        No logs found
                    </Typography>
                    <Typography variant="body2" color="#cbd5e1">
                        Try adjusting your filters
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {Object.entries(groupedLogs).map(([dateLabel, dateLogs]) => (
                        <Box key={dateLabel}>
                            {/* Date Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                <CalendarTodayIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                <Typography variant="body2" fontWeight="700" color="#64748b">
                                    {dateLabel}
                                </Typography>
                                <Box sx={{ flex: 1, height: 1, bgcolor: '#e2e8f0' }} />
                                <Chip
                                    label={dateLogs.length}
                                    size="small"
                                    sx={{ fontWeight: 600, fontSize: '0.65rem', height: 20, bgcolor: '#f1f5f9', color: '#64748b' }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    bgcolor: '#ffffff',
                                    borderRadius: 3,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    overflow: 'hidden',
                                }}
                            >
                                {dateLogs.map((log, index) => {
                                    const typeConfig = LOG_TYPES[log.type] || LOG_TYPES.admin_action;
                                    const sevConfig = SEVERITY_CONFIG[log.severity];

                                    return (
                                        <Box
                                            key={log.id}
                                            onClick={() => handleViewDetail(log)}
                                            sx={{
                                                display: 'flex',
                                                gap: 2,
                                                p: 2,
                                                cursor: 'pointer',
                                                borderBottom: index < dateLogs.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                borderLeft: `3px solid ${sevConfig.color}`,
                                                transition: 'all 0.15s ease',
                                                '&:hover': { bgcolor: '#f8fafc' },
                                            }}
                                        >
                                            {/* Timeline dot */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.3 }}>
                                                <Box
                                                    sx={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: 2,
                                                        background: typeConfig.gradient,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#ffffff',
                                                        flexShrink: 0,
                                                        '& .MuiSvgIcon-root': { fontSize: 18 },
                                                    }}
                                                >
                                                    {typeConfig.icon}
                                                </Box>
                                            </Box>

                                            {/* Content */}
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        mb: 0.3,
                                                    }}
                                                >
                                                    <Typography variant="body2" fontWeight="700" color="#1e293b">
                                                        {log.action}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                                                        <Tooltip title={formatFullDate(log.timestamp)}>
                                                            <Typography variant="caption" color="#94a3b8" sx={{ cursor: 'default' }}>
                                                                {formatDate(log.timestamp)}
                                                            </Typography>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    color="#64748b"
                                                    sx={{
                                                        mb: 1,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {log.details}
                                                </Typography>

                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                                    {/* Severity */}
                                                    <Chip
                                                        icon={sevConfig.icon}
                                                        label={sevConfig.label}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '0.6rem',
                                                            height: 20,
                                                            bgcolor: sevConfig.bgcolor,
                                                            color: sevConfig.color,
                                                            '& .MuiChip-icon': { ml: 0.5, color: sevConfig.color },
                                                        }}
                                                    />

                                                    {/* Type */}
                                                    <Chip
                                                        label={typeConfig.shortLabel}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '0.6rem',
                                                            height: 20,
                                                            bgcolor: `${typeConfig.color}12`,
                                                            color: typeConfig.color,
                                                        }}
                                                    />

                                                    {/* Actor */}
                                                    <Chip
                                                        avatar={
                                                            <Avatar
                                                                sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    fontSize: '0.5rem',
                                                                    bgcolor:
                                                                        log.actorRole === 'admin'
                                                                            ? '#8b5cf630'
                                                                            : log.actorRole === 'system'
                                                                                ? '#64748b30'
                                                                                : '#667eea20',
                                                                    color:
                                                                        log.actorRole === 'admin'
                                                                            ? '#8b5cf6'
                                                                            : log.actorRole === 'system'
                                                                                ? '#64748b'
                                                                                : '#667eea',
                                                                }}
                                                            >
                                                                {log.actorRole === 'system' ? '⚙' : getInitials(log.actor)}
                                                            </Avatar>
                                                        }
                                                        label={log.actor}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 500,
                                                            fontSize: '0.65rem',
                                                            height: 20,
                                                            bgcolor: '#f1f5f9',
                                                            color: '#64748b',
                                                        }}
                                                    />

                                                    {/* Role */}
                                                    <Chip
                                                        label={log.actorRole}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '0.55rem',
                                                            height: 18,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.05em',
                                                            bgcolor:
                                                                log.actorRole === 'admin'
                                                                    ? '#8b5cf612'
                                                                    : log.actorRole === 'system'
                                                                        ? '#64748b12'
                                                                        : '#667eea10',
                                                            color:
                                                                log.actorRole === 'admin'
                                                                    ? '#8b5cf6'
                                                                    : log.actorRole === 'system'
                                                                        ? '#64748b'
                                                                        : '#667eea',
                                                        }}
                                                    />

                                                    {/* Log ID */}
                                                    <Tooltip title="Click to copy">
                                                        <Chip
                                                            label={log.id}
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleCopyId(log.id);
                                                            }}
                                                            sx={{
                                                                fontWeight: 500,
                                                                fontSize: '0.55rem',
                                                                height: 18,
                                                                fontFamily: 'monospace',
                                                                bgcolor: '#f1f5f9',
                                                                color: '#94a3b8',
                                                                cursor: 'pointer',
                                                                '&:hover': { bgcolor: '#e2e8f0' },
                                                            }}
                                                        />
                                                    </Tooltip>

                                                    {/* IP (if exists) */}
                                                    {log.ip && (
                                                        <Chip
                                                            label={log.ip}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 500,
                                                                fontSize: '0.55rem',
                                                                height: 18,
                                                                fontFamily: 'monospace',
                                                                bgcolor: '#f1f5f9',
                                                                color: '#94a3b8',
                                                                display: { xs: 'none', md: 'flex' },
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {/* ═══════════ DETAIL DIALOG ═══════════ */}
            <Dialog
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
            >
                {detailTarget &&
                    (() => {
                        const typeConfig = LOG_TYPES[detailTarget.type] || LOG_TYPES.admin_action;
                        const sevConfig = SEVERITY_CONFIG[detailTarget.severity];
                        return (
                            <>
                                {/* Header */}
                                <Box
                                    sx={{
                                        background: typeConfig.gradient,
                                        p: 3,
                                        color: '#ffffff',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 2.5,
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '& .MuiSvgIcon-root': { fontSize: 26, color: '#ffffff' },
                                            }}
                                        >
                                            {typeConfig.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight="700">
                                                {detailTarget.action}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                                {typeConfig.label}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <IconButton onClick={() => setDetailOpen(false)} sx={{ color: '#ffffff' }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                <DialogContent sx={{ p: 3 }}>
                                    {/* Severity badge */}
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                                        <Chip
                                            icon={sevConfig.icon}
                                            label={sevConfig.label}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                bgcolor: sevConfig.bgcolor,
                                                color: sevConfig.color,
                                                '& .MuiChip-icon': { color: sevConfig.color },
                                            }}
                                        />
                                        <Chip
                                            label={detailTarget.id}
                                            size="small"
                                            onClick={() => handleCopyId(detailTarget.id)}
                                            icon={<ContentCopyIcon sx={{ fontSize: 12 }} />}
                                            sx={{
                                                fontWeight: 600,
                                                fontFamily: 'monospace',
                                                bgcolor: '#f1f5f9',
                                                color: '#64748b',
                                                cursor: 'pointer',
                                                '& .MuiChip-icon': { color: '#94a3b8' },
                                            }}
                                        />
                                    </Box>

                                    {/* Details */}
                                    <Typography variant="body2" color="#1e293b" sx={{ mb: 2.5, lineHeight: 1.7 }}>
                                        {detailTarget.details}
                                    </Typography>

                                    {/* Info Grid */}
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: 2,
                                            mb: 2,
                                        }}
                                    >
                                        {/* Actor */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                                                <PersonIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                <Typography variant="caption" fontWeight="700" color="#94a3b8">
                                                    ACTOR
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" fontWeight="600" color="#1e293b">
                                                {detailTarget.actor}
                                            </Typography>
                                            <Typography variant="caption" color="#94a3b8">
                                                {detailTarget.actorEmail}
                                            </Typography>
                                            <Chip
                                                label={detailTarget.actorRole}
                                                size="small"
                                                sx={{
                                                    mt: 0.5,
                                                    fontWeight: 600,
                                                    fontSize: '0.6rem',
                                                    height: 20,
                                                    textTransform: 'uppercase',
                                                    bgcolor:
                                                        detailTarget.actorRole === 'admin'
                                                            ? '#8b5cf612'
                                                            : detailTarget.actorRole === 'system'
                                                                ? '#64748b12'
                                                                : '#667eea10',
                                                    color:
                                                        detailTarget.actorRole === 'admin'
                                                            ? '#8b5cf6'
                                                            : detailTarget.actorRole === 'system'
                                                                ? '#64748b'
                                                                : '#667eea',
                                                    display: 'block',
                                                    width: 'fit-content',
                                                }}
                                            />
                                        </Box>

                                        {/* Timestamp */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                                                <AccessTimeIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                <Typography variant="caption" fontWeight="700" color="#94a3b8">
                                                    TIMESTAMP
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" fontWeight="600" color="#1e293b">
                                                {formatFullDate(detailTarget.timestamp)}
                                            </Typography>
                                            <Typography variant="caption" color="#94a3b8">
                                                {formatDate(detailTarget.timestamp)}
                                            </Typography>
                                        </Box>

                                        {/* Device */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                                                <DevicesIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                <Typography variant="caption" fontWeight="700" color="#94a3b8">
                                                    DEVICE
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" fontWeight="600" color="#1e293b">
                                                {detailTarget.device}
                                            </Typography>
                                        </Box>

                                        {/* IP & Location */}
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #f1f5f9',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                                                <LocationOnIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                <Typography variant="caption" fontWeight="700" color="#94a3b8">
                                                    LOCATION & IP
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" fontWeight="600" color="#1e293b">
                                                {detailTarget.location || 'N/A'}
                                            </Typography>
                                            {detailTarget.ip && (
                                                <Typography variant="caption" color="#94a3b8" sx={{ fontFamily: 'monospace' }}>
                                                    {detailTarget.ip}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Target */}
                                    {detailTarget.target && (
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: `${typeConfig.color}08`,
                                                border: `1px solid ${typeConfig.color}20`,
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                                                <FlagIcon sx={{ fontSize: 16, color: typeConfig.color }} />
                                                <Typography variant="caption" fontWeight="700" color={typeConfig.color}>
                                                    TARGET
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" fontWeight="600" color="#1e293b">
                                                {detailTarget.target}
                                            </Typography>
                                        </Box>
                                    )}
                                </DialogContent>

                                <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
                                    <Tooltip title="Copy Log ID">
                                        <Button
                                            onClick={() => handleCopyId(detailTarget.id)}
                                            startIcon={<ContentCopyIcon />}
                                            sx={{ textTransform: 'none', color: '#64748b', fontWeight: 600 }}
                                        >
                                            {detailTarget.id}
                                        </Button>
                                    </Tooltip>
                                    <Button
                                        onClick={() => setDetailOpen(false)}
                                        sx={{ textTransform: 'none', color: '#64748b' }}
                                    >
                                        Close
                                    </Button>
                                </DialogActions>
                            </>
                        );
                    })()}
            </Dialog>

            {/* ═══════════ SNACKBAR ═══════════ */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
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

// i also want Premium Requests and Analytics features