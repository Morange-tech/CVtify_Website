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
    Switch,
    LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ShieldIcon from '@mui/icons-material/Shield';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SortIcon from '@mui/icons-material/Sort';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircleIcon from '@mui/icons-material/Circle';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import ForumIcon from '@mui/icons-material/Forum';
import BrushIcon from '@mui/icons-material/Brush';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import LoginIcon from '@mui/icons-material/Login';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

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

// ─── Role Config ───
const ROLES = {
    super_admin: {
        label: 'Super Admin',
        shortLabel: 'Super Admin',
        icon: <ShieldIcon />,
        color: '#dc2626',
        gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        bgLight: '#dc262612',
        description: 'Full access to all platform features, settings, and admin management',
        permissions: [
            'Dashboard',
            'User Management',
            'Admin Management',
            'Templates',
            'Payments',
            'Messages',
            'Settings',
            'Logs',
            'Notifications',
            'Downloads',
            'Analytics',
        ],
    },
    manager: {
        label: 'Manager',
        shortLabel: 'Manager',
        icon: <SupervisorAccountIcon />,
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        bgLight: '#8b5cf612',
        description: 'Can manage users, templates, payments, and view analytics',
        permissions: [
            'Dashboard',
            'User Management',
            'Templates',
            'Payments',
            'Messages',
            'Notifications',
            'Downloads',
            'Analytics',
        ],
    },
    support: {
        label: 'Support',
        shortLabel: 'Support',
        icon: <SupportAgentIcon />,
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        bgLight: '#10b98112',
        description: 'Can view users, handle messages, and manage support tickets',
        permissions: ['Dashboard', 'User Management (View)', 'Messages', 'Notifications'],
    },
};

const ALL_PERMISSIONS = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 16 }} />, color: '#667eea' },
    { key: 'users', label: 'User Management', icon: <PeopleIcon sx={{ fontSize: 16 }} />, color: '#3b82f6' },
    { key: 'admins', label: 'Admin Management', icon: <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />, color: '#dc2626' },
    { key: 'templates', label: 'Templates', icon: <BrushIcon sx={{ fontSize: 16 }} />, color: '#ec4899' },
    { key: 'payments', label: 'Payments', icon: <PaymentIcon sx={{ fontSize: 16 }} />, color: '#f59e0b' },
    { key: 'messages', label: 'Messages', icon: <ForumIcon sx={{ fontSize: 16 }} />, color: '#06b6d4' },
    { key: 'settings', label: 'Settings', icon: <SettingsIcon sx={{ fontSize: 16 }} />, color: '#64748b' },
    { key: 'logs', label: 'Logs', icon: <ReceiptLongIcon sx={{ fontSize: 16 }} />, color: '#8b5cf6' },
    { key: 'notifications', label: 'Notifications', icon: <NotificationsIcon sx={{ fontSize: 16 }} />, color: '#ef4444' },
    { key: 'downloads', label: 'Downloads', icon: <AnalyticsIcon sx={{ fontSize: 16 }} />, color: '#10b981' },
];

const STATUS_CONFIG = {
    active: { label: 'Active', color: '#10b981', bgcolor: '#10b98115', icon: <CircleIcon sx={{ fontSize: 10 }} /> },
    inactive: { label: 'Inactive', color: '#f59e0b', bgcolor: '#f59e0b15', icon: <CircleIcon sx={{ fontSize: 10 }} /> },
    suspended: { label: 'Suspended', color: '#ef4444', bgcolor: '#ef444415', icon: <BlockIcon sx={{ fontSize: 14 }} /> },
};

// ─── Mock Admin Data ───
const INITIAL_ADMINS = [
    {
        id: 'ADM-001',
        name: 'Ahmed Al-Rashid',
        email: 'ahmed@cvbuilder.pro',
        phone: '+1 (555) 100-0001',
        role: 'super_admin',
        status: 'active',
        avatar: null,
        lastLogin: '2025-06-18T16:30:00',
        createdAt: '2024-01-15',
        actionsCount: 342,
        isCurrent: true,
        twoFactorEnabled: true,
    },
    {
        id: 'ADM-002',
        name: 'Sarah Mitchell',
        email: 'sarah.m@cvbuilder.pro',
        phone: '+1 (555) 100-0002',
        role: 'manager',
        status: 'active',
        avatar: null,
        lastLogin: '2025-06-18T14:15:00',
        createdAt: '2024-06-01',
        actionsCount: 187,
        isCurrent: false,
        twoFactorEnabled: true,
    },
    {
        id: 'ADM-003',
        name: 'James Cooper',
        email: 'james.c@cvbuilder.pro',
        phone: '+1 (555) 100-0003',
        role: 'support',
        status: 'active',
        avatar: null,
        lastLogin: '2025-06-18T12:45:00',
        createdAt: '2024-09-10',
        actionsCount: 95,
        isCurrent: false,
        twoFactorEnabled: false,
    },
    {
        id: 'ADM-004',
        name: 'Maria Garcia',
        email: 'maria.g@cvbuilder.pro',
        phone: '+1 (555) 100-0004',
        role: 'manager',
        status: 'active',
        avatar: null,
        lastLogin: '2025-06-17T18:00:00',
        createdAt: '2024-11-20',
        actionsCount: 63,
        isCurrent: false,
        twoFactorEnabled: true,
    },
    {
        id: 'ADM-005',
        name: 'David Kim',
        email: 'david.k@cvbuilder.pro',
        phone: '+1 (555) 100-0005',
        role: 'support',
        status: 'inactive',
        avatar: null,
        lastLogin: '2025-06-10T09:30:00',
        createdAt: '2025-02-01',
        actionsCount: 28,
        isCurrent: false,
        twoFactorEnabled: false,
    },
    {
        id: 'ADM-006',
        name: 'Alex Turner',
        email: 'alex.t@cvbuilder.pro',
        phone: '+1 (555) 100-0006',
        role: 'support',
        status: 'suspended',
        avatar: null,
        lastLogin: '2025-05-28T11:00:00',
        createdAt: '2025-03-15',
        actionsCount: 12,
        isCurrent: false,
        twoFactorEnabled: false,
    },
];

// ─── Text Field SX ───
const tfSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        '&.Mui-focused fieldset': { borderColor: '#667eea' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
};

export default function AdminManagementPage() {
    // ─── State ───
    const [admins, setAdmins] = useState(INITIAL_ADMINS);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuTarget, setMenuTarget] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    // Dialogs
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [viewTarget, setViewTarget] = useState(null);

    // Form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'support',
        status: 'active',
        twoFactorEnabled: false,
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ─── Stats ───
    const totalAdmins = admins.length;
    const superAdmins = admins.filter((a) => a.role === 'super_admin').length;
    const managers = admins.filter((a) => a.role === 'manager').length;
    const supportStaff = admins.filter((a) => a.role === 'support').length;
    const activeAdmins = admins.filter((a) => a.status === 'active').length;
    const inactiveAdmins = admins.filter((a) => a.status !== 'active').length;

    // ─── Filtered ───
    const filteredAdmins = useMemo(() => {
        let result = admins.filter((a) => {
            const matchesSearch =
                a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTab =
                activeTab === 'all' ||
                (activeTab === 'super_admin' && a.role === 'super_admin') ||
                (activeTab === 'manager' && a.role === 'manager') ||
                (activeTab === 'support' && a.role === 'support') ||
                (activeTab === 'inactive' && a.status !== 'active');

            const matchesRole = roleFilter === 'all' || a.role === roleFilter;

            return matchesSearch && matchesTab && matchesRole;
        });

        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'activity') return b.actionsCount - a.actionsCount;
            return 0;
        });

        return result;
    }, [admins, searchQuery, activeTab, roleFilter, sortBy]);

    // ─── Handlers ───
    const handleMenuOpen = (e, admin) => {
        e.stopPropagation();
        setMenuAnchorEl(e.currentTarget);
        setMenuTarget(admin);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuTarget(null);
    };

    const handleAddOpen = () => {
        setFormData({ name: '', email: '', phone: '', role: 'support', status: 'active', twoFactorEnabled: false });
        setAddDialogOpen(true);
    };

    const handleAddConfirm = () => {
        const newAdmin = {
            id: `ADM-${String(admins.length + 1).padStart(3, '0')}`,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: formData.status,
            avatar: null,
            lastLogin: null,
            createdAt: new Date().toISOString().split('T')[0],
            actionsCount: 0,
            isCurrent: false,
            twoFactorEnabled: formData.twoFactorEnabled,
        };
        setAdmins((prev) => [newAdmin, ...prev]);
        setAddDialogOpen(false);
        setSnackbar({ open: true, message: `Admin "${formData.name}" added as ${ROLES[formData.role].label}!`, severity: 'success' });
    };

    const handleEditOpen = (admin) => {
        const target = admin || menuTarget;
        setMenuTarget(target);
        setFormData({
            name: target.name,
            email: target.email,
            phone: target.phone,
            role: target.role,
            status: target.status,
            twoFactorEnabled: target.twoFactorEnabled,
        });
        setEditDialogOpen(true);
        handleMenuClose();
    };

    const handleEditConfirm = () => {
        setAdmins((prev) =>
            prev.map((a) =>
                a.id === menuTarget.id
                    ? { ...a, name: formData.name, email: formData.email, phone: formData.phone, role: formData.role, status: formData.status, twoFactorEnabled: formData.twoFactorEnabled }
                    : a
            )
        );
        setEditDialogOpen(false);
        setSnackbar({ open: true, message: `Admin "${formData.name}" updated!`, severity: 'success' });
    };

    const handleRoleChangeOpen = (admin) => {
        const target = admin || menuTarget;
        setMenuTarget(target);
        setFormData((prev) => ({ ...prev, role: target.role }));
        setRoleDialogOpen(true);
        handleMenuClose();
    };

    const handleRoleChangeConfirm = () => {
        setAdmins((prev) =>
            prev.map((a) => (a.id === menuTarget.id ? { ...a, role: formData.role } : a))
        );
        setRoleDialogOpen(false);
        setSnackbar({ open: true, message: `"${menuTarget.name}" role changed to ${ROLES[formData.role].label}.`, severity: 'success' });
    };

    const handleViewOpen = (admin) => {
        setViewTarget(admin || menuTarget);
        setViewDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteOpen = (admin) => {
        setDeleteTarget(admin || menuTarget);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = () => {
        setAdmins((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setDeleteDialogOpen(false);
        setSnackbar({ open: true, message: `Admin "${deleteTarget.name}" removed.`, severity: 'warning' });
    };

    const handleToggleStatus = (admin) => {
        const target = admin || menuTarget;
        const newStatus = target.status === 'active' ? 'suspended' : 'active';
        setAdmins((prev) =>
            prev.map((a) => (a.id === target.id ? { ...a, status: newStatus } : a))
        );
        handleMenuClose();
        setSnackbar({ open: true, message: `"${target.name}" ${newStatus === 'active' ? 'activated' : 'suspended'}.`, severity: 'info' });
    };

    const handleCopyId = (id) => {
        navigator.clipboard?.writeText(id);
        setSnackbar({ open: true, message: `Copied ${id}`, severity: 'info' });
    };

    // ─── Admin Form (inline) ───
    const renderAdminForm = (isEdit = false) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
                fullWidth
                label="Full Name"
                placeholder="e.g. John Smith"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }}
                sx={tfSx}
            />

            <TextField
                fullWidth
                label="Email Address"
                placeholder="e.g. john@cvbuilder.pro"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }}
                sx={tfSx}
            />

            <TextField
                fullWidth
                label="Phone Number"
                placeholder="e.g. +1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }}
                sx={tfSx}
            />

            {/* Role Selection */}
            <Box>
                <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1.5 }}>
                    Assign Role
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(ROLES).map(([key, role]) => (
                        <Box
                            key={key}
                            onClick={() => setFormData((prev) => ({ ...prev, role: key }))}
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                border: `2px solid ${formData.role === key ? role.color : '#f1f5f9'}`,
                                bgcolor: formData.role === key ? role.bgLight : '#ffffff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': { borderColor: role.color, bgcolor: role.bgLight },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2,
                                        background: formData.role === key ? role.gradient : '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: formData.role === key ? '#ffffff' : '#94a3b8',
                                        '& .MuiSvgIcon-root': { fontSize: 18 },
                                    }}
                                >
                                    {role.icon}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight="700" color={formData.role === key ? role.color : '#1e293b'}>
                                        {role.label}
                                    </Typography>
                                    <Typography variant="caption" color="#94a3b8">
                                        {role.description}
                                    </Typography>
                                </Box>
                                {formData.role === key && <CheckCircleIcon sx={{ color: role.color, fontSize: 22 }} />}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Status */}
            {isEdit && (
                <FormControl fullWidth size="small">
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Status</InputLabel>
                    <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                        sx={{ borderRadius: 2, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                    >
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                            <MenuItem key={key} value={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ color: cfg.color }}>{cfg.icon}</Box>
                                    <Typography variant="body2" fontWeight={600} color={cfg.color}>
                                        {cfg.label}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {/* 2FA Toggle */}
            <Box
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: formData.twoFactorEnabled ? '#10b98108' : '#f8fafc',
                    border: `1px solid ${formData.twoFactorEnabled ? '#10b98120' : '#f1f5f9'}`,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <SecurityIcon sx={{ color: formData.twoFactorEnabled ? '#10b981' : '#94a3b8', fontSize: 20 }} />
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1e293b">
                                Two-Factor Authentication
                            </Typography>
                            <Typography variant="caption" color="#94a3b8">
                                {formData.twoFactorEnabled ? 'Enabled — extra security layer active' : 'Disabled — enable for better security'}
                            </Typography>
                        </Box>
                    </Box>
                    <Switch
                        checked={formData.twoFactorEnabled}
                        onChange={(e) => setFormData((prev) => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10b981' },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* ─── Header ─── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="700" color="#1e293b">👨‍💼 Admin Management</Typography>
                    <Typography variant="body2" color="#64748b">Add, remove, and assign roles to admin users</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={handleAddOpen}
                        sx={{
                            textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
                            '&:hover': { boxShadow: '0 6px 20px rgba(102,126,234,0.5)' },
                        }}
                    >
                        Add Admin
                    </Button>
                    <Tooltip title="Refresh">
                        <IconButton sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}>
                            <RefreshIcon sx={{ fontSize: 20, color: '#64748b' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* ─── Stats ─── */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(6, 1fr)' }, gap: 2, mb: 4 }}>
                {[
                    { label: 'Total Admins', value: totalAdmins, icon: <AdminPanelSettingsIcon />, color: '#667eea', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
                    { label: 'Super Admins', value: superAdmins, icon: <ShieldIcon />, color: '#dc2626', gradient: ROLES.super_admin.gradient },
                    { label: 'Managers', value: managers, icon: <SupervisorAccountIcon />, color: '#8b5cf6', gradient: ROLES.manager.gradient },
                    { label: 'Support Staff', value: supportStaff, icon: <SupportAgentIcon />, color: '#10b981', gradient: ROLES.support.gradient },
                    { label: 'Active', value: activeAdmins, icon: <CheckCircleIcon />, color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
                    { label: 'Inactive / Suspended', value: inactiveAdmins, icon: <BlockIcon />, color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
                ].map((stat, i) => (
                    <Box key={i} sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }, position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'absolute', top: -8, right: -8, width: 60, height: 60, borderRadius: '50%', background: stat.gradient, opacity: 0.08 }} />
                        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: stat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', mb: 1, '& .MuiSvgIcon-root': { fontSize: 18 } }}>
                            {stat.icon}
                        </Box>
                        <Typography variant="h6" fontWeight="800" color="#1e293b" sx={{ lineHeight: 1.2 }}>{stat.value}</Typography>
                        <Typography variant="caption" color="#94a3b8">{stat.label}</Typography>
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
                <Tab label={`All (${totalAdmins})`} value="all" />
                <Tab icon={<ShieldIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Super Admin (${superAdmins})`} value="super_admin" />
                <Tab icon={<SupervisorAccountIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Managers (${managers})`} value="manager" />
                <Tab icon={<SupportAgentIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Support (${supportStaff})`} value="support" />
                <Tab label={`Inactive (${inactiveAdmins})`} value="inactive" />
            </Tabs>

            {/* ─── Search & Filters ─── */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search admins..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flex: 1, minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#ffffff', '&.Mui-focused fieldset': { borderColor: '#667eea' } } }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
                />

                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Role</InputLabel>
                    <Select value={roleFilter} label="Role" onChange={(e) => setRoleFilter(e.target.value)} sx={{ borderRadius: 2, bgcolor: '#ffffff', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}>
                        <MenuItem value="all">All Roles</MenuItem>
                        {Object.entries(ROLES).map(([key, cfg]) => (
                            <MenuItem key={key} value={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: cfg.color }}>
                                    <Box sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }}>{cfg.icon}</Box>
                                    <Typography variant="body2">{cfg.label}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <IconButton size="small" onClick={(e) => setSortAnchorEl(e.currentTarget)} sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, width: 38, height: 38 }}>
                    <SortIcon sx={{ fontSize: 18, color: '#64748b' }} />
                </IconButton>

                <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)}>
                    {[
                        { label: 'Newest First', value: 'newest' },
                        { label: 'Oldest First', value: 'oldest' },
                        { label: 'Name (A-Z)', value: 'name' },
                        { label: 'Most Active', value: 'activity' },
                    ].map((opt) => (
                        <MenuItem key={opt.value} selected={sortBy === opt.value} onClick={() => { setSortBy(opt.value); setSortAnchorEl(null); }}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Menu>

                <Box sx={{ display: 'flex', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <IconButton size="small" onClick={() => setViewMode('grid')} sx={{ borderRadius: '8px 0 0 8px', bgcolor: viewMode === 'grid' ? '#667eea15' : 'transparent', color: viewMode === 'grid' ? '#667eea' : '#94a3b8' }}>
                        <GridViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setViewMode('list')} sx={{ borderRadius: '0 8px 8px 0', bgcolor: viewMode === 'list' ? '#667eea15' : 'transparent', color: viewMode === 'list' ? '#667eea' : '#94a3b8' }}>
                        <ViewListIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* ─── Admin Cards / List ─── */}
            {filteredAdmins.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <AdminPanelSettingsIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 2 }} />
                    <Typography variant="h6" fontWeight="600" color="#94a3b8">No admins found</Typography>
                    <Button startIcon={<PersonAddIcon />} onClick={handleAddOpen} sx={{ mt: 2, textTransform: 'none', color: '#667eea', fontWeight: 600 }}>Add Admin</Button>
                </Box>
            ) : viewMode === 'grid' ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                    {filteredAdmins.map((admin) => {
                        const roleConfig = ROLES[admin.role];
                        const statusConfig = STATUS_CONFIG[admin.status];
                        return (
                            <Box
                                key={admin.id}
                                onClick={() => handleViewOpen(admin)}
                                sx={{
                                    bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    overflow: 'hidden', cursor: 'pointer',
                                    opacity: admin.status === 'active' ? 1 : 0.75,
                                    border: admin.isCurrent ? `2px solid ${roleConfig.color}` : '1px solid transparent',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' },
                                }}
                            >
                                {/* Top Banner */}
                                <Box sx={{ height: 60, background: roleConfig.gradient, position: 'relative' }}>
                                    {admin.isCurrent && (
                                        <Chip label="You" size="small" sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 700, fontSize: '0.6rem', height: 20, bgcolor: 'rgba(255,255,255,0.9)', color: roleConfig.color }} />
                                    )}
                                </Box>

                                {/* Avatar */}
                                <Box sx={{ px: 2.5, mt: -3.5 }}>
                                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#ffffff', border: `3px solid ${roleConfig.color}`, color: roleConfig.color, fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                        {getInitials(admin.name)}
                                    </Avatar>
                                </Box>

                                {/* Info */}
                                <Box sx={{ p: 2.5, pt: 1.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="body1" fontWeight="700" color="#1e293b">{admin.name}</Typography>
                                                {admin.twoFactorEnabled && <VerifiedIcon sx={{ fontSize: 16, color: '#10b981' }} />}
                                            </Box>
                                            <Typography variant="caption" color="#94a3b8">{admin.email}</Typography>
                                        </Box>
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, admin)}>
                                            <MoreVertIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                                        </IconButton>
                                    </Box>

                                    {/* Role & Status */}
                                    <Box sx={{ display: 'flex', gap: 0.8, mt: 1.5, mb: 2 }}>
                                        <Chip
                                            icon={<Box sx={{ '& .MuiSvgIcon-root': { fontSize: 14 } }}>{roleConfig.icon}</Box>}
                                            label={roleConfig.label}
                                            size="small"
                                            sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24, bgcolor: roleConfig.bgLight, color: roleConfig.color, '& .MuiChip-icon': { ml: 0.5, color: roleConfig.color } }}
                                        />
                                        <Chip
                                            icon={statusConfig.icon}
                                            label={statusConfig.label}
                                            size="small"
                                            sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24, bgcolor: statusConfig.bgcolor, color: statusConfig.color, '& .MuiChip-icon': { ml: 0.5, color: statusConfig.color } }}
                                        />
                                    </Box>

                                    <Divider sx={{ mb: 1.5 }} />

                                    {/* Stats */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Tooltip title="Total Actions">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <HistoryIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                <Typography variant="caption" color="#94a3b8">{admin.actionsCount} actions</Typography>
                                            </Box>
                                        </Tooltip>
                                        <Tooltip title={admin.lastLogin ? `Last login: ${formatFullDate(admin.lastLogin)}` : 'Never logged in'}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <LoginIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                                <Typography variant="caption" color="#94a3b8">
                                                    {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}

                    {/* Add New Card */}
                    <Box
                        onClick={handleAddOpen}
                        sx={{
                            bgcolor: '#ffffff', borderRadius: 3, border: '2px dashed #e2e8f0',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            minHeight: 260, cursor: 'pointer', transition: 'all 0.3s ease',
                            '&:hover': { borderColor: '#667eea', bgcolor: '#667eea08', transform: 'translateY(-4px)' },
                        }}
                    >
                        <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: '#667eea15', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <PersonAddIcon sx={{ fontSize: 28, color: '#667eea' }} />
                        </Box>
                        <Typography variant="body1" fontWeight="600" color="#667eea">Add New Admin</Typography>
                        <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5 }}>Invite a team member</Typography>
                    </Box>
                </Box>
            ) : (
                /* List View */
                <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr auto', gap: 2, p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {['ADMIN', 'ROLE', 'STATUS', 'ACTIONS', 'LAST LOGIN', ''].map((h) => (
                            <Typography key={h} variant="caption" fontWeight="700" color="#64748b" letterSpacing="0.05em">{h}</Typography>
                        ))}
                    </Box>

                    {filteredAdmins.map((admin, index) => {
                        const roleConfig = ROLES[admin.role];
                        const statusConfig = STATUS_CONFIG[admin.status];
                        return (
                            <Box
                                key={admin.id}
                                onClick={() => handleViewOpen(admin)}
                                sx={{
                                    display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr auto',
                                    gap: 2, p: 2, alignItems: 'center', cursor: 'pointer',
                                    opacity: admin.status === 'active' ? 1 : 0.65,
                                    borderBottom: index < filteredAdmins.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    '&:hover': { bgcolor: '#f8fafc' },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                    <Avatar sx={{ width: 38, height: 38, bgcolor: roleConfig.bgLight, color: roleConfig.color, fontWeight: 700, fontSize: '0.8rem' }}>
                                        {getInitials(admin.name)}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>{admin.name}</Typography>
                                            {admin.isCurrent && <Chip label="You" size="small" sx={{ fontWeight: 700, fontSize: '0.55rem', height: 16, bgcolor: '#667eea15', color: '#667eea' }} />}
                                            {admin.twoFactorEnabled && <VerifiedIcon sx={{ fontSize: 14, color: '#10b981' }} />}
                                        </Box>
                                        <Typography variant="caption" color="#94a3b8" noWrap>{admin.email}</Typography>
                                    </Box>
                                </Box>

                                <Chip
                                    icon={<Box sx={{ '& .MuiSvgIcon-root': { fontSize: 14 } }}>{roleConfig.icon}</Box>}
                                    label={roleConfig.shortLabel}
                                    size="small"
                                    sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22, width: 'fit-content', bgcolor: roleConfig.bgLight, color: roleConfig.color, '& .MuiChip-icon': { ml: 0.5, color: roleConfig.color } }}
                                />

                                <Chip
                                    icon={statusConfig.icon}
                                    label={statusConfig.label}
                                    size="small"
                                    sx={{ fontWeight: 600, fontSize: '0.65rem', height: 22, width: 'fit-content', bgcolor: statusConfig.bgcolor, color: statusConfig.color, '& .MuiChip-icon': { ml: 0.5, color: statusConfig.color } }}
                                />

                                <Typography variant="body2" fontWeight="600" color="#64748b">{admin.actionsCount}</Typography>

                                <Tooltip title={admin.lastLogin ? formatFullDate(admin.lastLogin) : 'Never'}>
                                    <Typography variant="body2" color="#94a3b8" sx={{ cursor: 'default' }}>
                                        {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
                                    </Typography>
                                </Tooltip>

                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Edit"><IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEditOpen(admin); }}><EditIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></IconButton></Tooltip>
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, admin)}><MoreVertIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></IconButton>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* ═══════════ CONTEXT MENU ═══════════ */}
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 200 } }}>
                <MenuItem onClick={() => handleViewOpen()} sx={{ py: 1 }}>
                    <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="View Profile" />
                </MenuItem>
                <MenuItem onClick={() => handleEditOpen()} sx={{ py: 1 }}>
                    <ListItemIcon><EditIcon fontSize="small" sx={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="Edit Admin" />
                </MenuItem>
                <MenuItem onClick={() => handleRoleChangeOpen()} sx={{ py: 1 }}>
                    <ListItemIcon><ManageAccountsIcon fontSize="small" sx={{ color: '#8b5cf6' }} /></ListItemIcon>
                    <ListItemText primary="Change Role" />
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem onClick={() => handleToggleStatus()} sx={{ py: 1 }}>
                    <ListItemIcon>
                        {menuTarget?.status === 'active' ? <BlockIcon fontSize="small" sx={{ color: '#f59e0b' }} /> : <LockOpenIcon fontSize="small" sx={{ color: '#10b981' }} />}
                    </ListItemIcon>
                    <ListItemText primary={menuTarget?.status === 'active' ? 'Suspend Admin' : 'Activate Admin'} primaryTypographyProps={{ color: menuTarget?.status === 'active' ? '#f59e0b' : '#10b981' }} />
                </MenuItem>

                {!menuTarget?.isCurrent && (
                    <>
                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem onClick={() => handleDeleteOpen()} sx={{ py: 1, '&:hover': { bgcolor: '#ef444410' } }}>
                            <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                            <ListItemText primary="Remove Admin" primaryTypographyProps={{ color: '#ef4444' }} />
                        </MenuItem>
                    </>
                )}
            </Menu>

            {/* ═══════════ ADD ADMIN DIALOG ═══════════ */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAddIcon sx={{ color: '#667eea' }} /> Add New Admin
                </DialogTitle>
                <DialogContent>{renderAdminForm()}</DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setAddDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button variant="contained" disabled={!formData.name.trim() || !formData.email.trim()} onClick={handleAddConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, bgcolor: '#667eea', '&:hover': { bgcolor: '#5a6fd6' } }}>
                        Add Admin
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ EDIT ADMIN DIALOG ═══════════ */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EditIcon sx={{ color: '#667eea' }} /> Edit Admin
                </DialogTitle>
                <DialogContent>{renderAdminForm(true)}</DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setEditDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button variant="contained" disabled={!formData.name.trim() || !formData.email.trim()} onClick={handleEditConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, bgcolor: '#667eea', '&:hover': { bgcolor: '#5a6fd6' } }}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ CHANGE ROLE DIALOG ═══════════ */}
            <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ManageAccountsIcon sx={{ color: '#8b5cf6' }} /> Change Role
                </DialogTitle>
                <DialogContent>
                    {menuTarget && (
                        <Box sx={{ mb: 2.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 2, bgcolor: '#f8fafc', mb: 2 }}>
                                <Avatar sx={{ width: 36, height: 36, bgcolor: ROLES[menuTarget.role].bgLight, color: ROLES[menuTarget.role].color, fontWeight: 700, fontSize: '0.8rem' }}>
                                    {getInitials(menuTarget.name)}
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight="600" color="#1e293b">{menuTarget.name}</Typography>
                                    <Typography variant="caption" color="#94a3b8">Current: {ROLES[menuTarget.role].label}</Typography>
                                </Box>
                            </Box>

                            <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1.5 }}>Select New Role</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {Object.entries(ROLES).map(([key, role]) => (
                                    <Box
                                        key={key}
                                        onClick={() => setFormData((prev) => ({ ...prev, role: key }))}
                                        sx={{
                                            p: 2, borderRadius: 2,
                                            border: `2px solid ${formData.role === key ? role.color : '#f1f5f9'}`,
                                            bgcolor: formData.role === key ? role.bgLight : '#ffffff',
                                            cursor: 'pointer', transition: 'all 0.2s ease',
                                            '&:hover': { borderColor: role.color, bgcolor: role.bgLight },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: formData.role === key ? role.gradient : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: formData.role === key ? '#ffffff' : '#94a3b8', '& .MuiSvgIcon-root': { fontSize: 16 } }}>
                                                {role.icon}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" fontWeight="700" color={formData.role === key ? role.color : '#1e293b'}>{role.label}</Typography>
                                                <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.65rem' }}>{role.description}</Typography>
                                            </Box>
                                            {formData.role === key && <CheckCircleIcon sx={{ color: role.color, fontSize: 20 }} />}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Permissions Preview */}
                    {formData.role && (
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: ROLES[formData.role].bgLight, border: `1px solid ${ROLES[formData.role].color}20` }}>
                            <Typography variant="caption" fontWeight="700" color={ROLES[formData.role].color} sx={{ mb: 1, display: 'block' }}>
                                PERMISSIONS
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {ROLES[formData.role].permissions.map((perm) => (
                                    <Chip key={perm} label={perm} size="small" sx={{ fontWeight: 500, fontSize: '0.6rem', height: 20, bgcolor: '#ffffff', color: '#64748b' }} />
                                ))}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setRoleDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleRoleChangeConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, background: ROLES[formData.role]?.gradient || '#667eea', '&:hover': { opacity: 0.9 } }}>
                        Update Role
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ VIEW PROFILE DIALOG ═══════════ */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
                {viewTarget && (() => {
                    const roleConfig = ROLES[viewTarget.role];
                    const statusConfig = STATUS_CONFIG[viewTarget.status];
                    return (
                        <>
                            <Box sx={{ background: roleConfig.gradient, p: 3, color: '#ffffff', position: 'relative' }}>
                                <IconButton onClick={() => setViewDialogOpen(false)} sx={{ position: 'absolute', top: 8, right: 8, color: '#ffffff' }}>
                                    <CloseIcon />
                                </IconButton>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 700, fontSize: '1.4rem', border: '3px solid rgba(255,255,255,0.3)' }}>
                                        {getInitials(viewTarget.name)}
                                    </Avatar>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="h5" fontWeight="700">{viewTarget.name}</Typography>
                                            {viewTarget.isCurrent && <Chip label="You" size="small" sx={{ fontWeight: 700, fontSize: '0.6rem', height: 20, bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff' }} />}
                                        </Box>
                                        <Typography variant="body2" sx={{ opacity: 0.85 }}>{viewTarget.email}</Typography>
                                        <Box sx={{ display: 'flex', gap: 0.8, mt: 1 }}>
                                            <Chip
                                                icon={<Box sx={{ '& .MuiSvgIcon-root': { fontSize: 12, color: '#ffffff' } }}>{roleConfig.icon}</Box>}
                                                label={roleConfig.label}
                                                size="small"
                                                sx={{ fontWeight: 700, fontSize: '0.65rem', height: 22, bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', '& .MuiChip-icon': { ml: 0.5 } }}
                                            />
                                            <Chip
                                                label={statusConfig.label}
                                                size="small"
                                                sx={{ fontWeight: 700, fontSize: '0.65rem', height: 22, bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
                                            />
                                            {viewTarget.twoFactorEnabled && (
                                                <Chip icon={<VerifiedIcon sx={{ fontSize: 12, color: '#ffffff' }} />} label="2FA" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 22, bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', '& .MuiChip-icon': { ml: 0.5 } }} />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <DialogContent sx={{ p: 3 }}>
                                {/* Info Grid */}
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                                            <EmailIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                            <Typography variant="caption" fontWeight="700" color="#94a3b8">EMAIL</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">{viewTarget.email}</Typography>
                                    </Box>

                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                                            <PhoneIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                            <Typography variant="caption" fontWeight="700" color="#94a3b8">PHONE</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">{viewTarget.phone || 'N/A'}</Typography>
                                    </Box>

                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                            <Typography variant="caption" fontWeight="700" color="#94a3b8">JOINED</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">{formatFullDate(viewTarget.createdAt)}</Typography>
                                    </Box>

                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                                            <LoginIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                            <Typography variant="caption" fontWeight="700" color="#94a3b8">LAST LOGIN</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">
                                            {viewTarget.lastLogin ? formatDate(viewTarget.lastLogin) : 'Never'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Activity */}
                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: roleConfig.bgLight, border: `1px solid ${roleConfig.color}20`, mb: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="caption" fontWeight="700" color={roleConfig.color}>TOTAL ACTIONS</Typography>
                                            <Typography variant="h5" fontWeight="800" color="#1e293b">{viewTarget.actionsCount}</Typography>
                                        </Box>
                                        <Tooltip title="Copy Admin ID">
                                            <Chip
                                                label={viewTarget.id}
                                                size="small"
                                                icon={<FingerprintIcon sx={{ fontSize: 12 }} />}
                                                onClick={() => handleCopyId(viewTarget.id)}
                                                sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.7rem', bgcolor: '#ffffff', color: '#64748b', cursor: 'pointer', '& .MuiChip-icon': { color: '#94a3b8' } }}
                                            />
                                        </Tooltip>
                                    </Box>
                                </Box>

                                {/* Permissions */}
                                <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                    <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ mb: 1, display: 'block' }}>PERMISSIONS</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {ALL_PERMISSIONS.map((perm) => {
                                            const hasAccess = roleConfig.permissions.some((p) => p.toLowerCase().includes(perm.label.toLowerCase().replace(' (view)', '')));
                                            return (
                                                <Chip
                                                    key={perm.key}
                                                    icon={perm.icon}
                                                    label={perm.label}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 600, fontSize: '0.65rem', height: 24,
                                                        bgcolor: hasAccess ? `${perm.color}12` : '#f1f5f9',
                                                        color: hasAccess ? perm.color : '#cbd5e1',
                                                        '& .MuiChip-icon': { ml: 0.5, color: hasAccess ? perm.color : '#cbd5e1' },
                                                        opacity: hasAccess ? 1 : 0.5,
                                                    }}
                                                />
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </DialogContent>

                            <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
                                <Button onClick={() => { setViewDialogOpen(false); handleEditOpen(viewTarget); }} startIcon={<EditIcon />} sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}>
                                    Edit
                                </Button>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button onClick={() => setViewDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Close</Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => { setViewDialogOpen(false); handleRoleChangeOpen(viewTarget); }}
                                        startIcon={<ManageAccountsIcon />}
                                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, background: roleConfig.gradient, '&:hover': { opacity: 0.9 } }}
                                    >
                                        Change Role
                                    </Button>
                                </Box>
                            </DialogActions>
                        </>
                    );
                })()}
            </Dialog>

            {/* ═══════════ DELETE DIALOG ═══════════ */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><WarningAmberIcon /> Remove Admin</Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="#64748b">
                        Remove <strong>&quot;{deleteTarget?.name}&quot;</strong> from the admin team? They will lose all administrative access.
                    </Typography>
                    {deleteTarget && (
                        <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: ROLES[deleteTarget.role]?.bgLight, color: ROLES[deleteTarget.role]?.color, fontWeight: 700, fontSize: '0.8rem' }}>
                                {getInitials(deleteTarget.name)}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight="600" color="#1e293b">{deleteTarget.name}</Typography>
                                <Typography variant="caption" color="#94a3b8">{deleteTarget.email} · {ROLES[deleteTarget.role]?.label}</Typography>
                            </Box>
                        </Box>
                    )}
                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                        This action cannot be undone. The admin will be permanently removed.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>Remove Admin</Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ SNACKBAR ═══════════ */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* ─── Role Legend ─── */}
            <Box sx={{ mt: 4, p: 3, bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Typography variant="body1" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
                    🔐 Role Permissions Overview
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                    {Object.entries(ROLES).map(([key, role]) => (
                        <Box key={key} sx={{ p: 2, borderRadius: 2, bgcolor: role.bgLight, border: `1px solid ${role.color}20` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: role.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', '& .MuiSvgIcon-root': { fontSize: 16 } }}>
                                    {role.icon}
                                </Box>
                                <Typography variant="body2" fontWeight="700" color={role.color}>{role.label}</Typography>
                            </Box>
                            <Typography variant="caption" color="#64748b" sx={{ display: 'block', mb: 1 }}>{role.description}</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {role.permissions.map((perm) => (
                                    <Chip key={perm} label={perm} size="small" sx={{ fontWeight: 500, fontSize: '0.55rem', height: 18, bgcolor: '#ffffff', color: '#64748b' }} />
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}