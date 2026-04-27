'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
    Skeleton,
    CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SortIcon from '@mui/icons-material/Sort';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircleIcon from '@mui/icons-material/Circle';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FlagIcon from '@mui/icons-material/Flag';
import ReportIcon from '@mui/icons-material/Report';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import GavelIcon from '@mui/icons-material/Gavel';
import BlockIcon from '@mui/icons-material/Block';
import BrushIcon from '@mui/icons-material/Brush';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SubjectIcon from '@mui/icons-material/Subject';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VerifiedIcon from '@mui/icons-material/Verified';
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShieldIcon from '@mui/icons-material/Shield';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { adminApi } from '../../services/api';

// ─── Helpers ───
const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
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

const formatFullDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// ─── Template Config ───
const TEMPLATES = {
    professional: {
        label: 'Professional',
        color: '#667eea',
        icon: <ArticleIcon sx={{ fontSize: 14 }} />,
        bgcolor: '#667eea12',
    },
    creative: {
        label: 'Creative',
        color: '#ec4899',
        icon: <BrushIcon sx={{ fontSize: 14 }} />,
        bgcolor: '#ec489912',
    },
    academic: {
        label: 'Academic',
        color: '#8b5cf6',
        icon: <DescriptionIcon sx={{ fontSize: 14 }} />,
        bgcolor: '#8b5cf612',
    },
    simple: {
        label: 'Simple',
        color: '#10b981',
        icon: <TextSnippetIcon sx={{ fontSize: 14 }} />,
        bgcolor: '#10b98112',
    },
    executive: {
        label: 'Executive',
        color: '#f59e0b',
        icon: <StarIcon sx={{ fontSize: 14 }} />,
        bgcolor: '#f59e0b12',
    },
    modern: {
        label: 'Modern',
        color: '#06b6d4',
        icon: <SubjectIcon sx={{ fontSize: 14 }} />,
        bgcolor: '#06b6d412',
    },
};

// ─── Status Config ───
const STATUS_CONFIG = {
    active: {
        label: 'Active',
        color: '#10b981',
        bgcolor: '#10b98112',
        icon: <CircleIcon sx={{ fontSize: 10 }} />,
    },
    flagged: {
        label: 'Flagged',
        color: '#f59e0b',
        bgcolor: '#f59e0b12',
        icon: <FlagIcon sx={{ fontSize: 14 }} />,
    },
    reported: {
        label: 'Reported',
        color: '#ef4444',
        bgcolor: '#ef444412',
        icon: <ReportIcon sx={{ fontSize: 14 }} />,
    },
    deleted: {
        label: 'Deleted',
        color: '#94a3b8',
        bgcolor: '#94a3b812',
        icon: <BlockIcon sx={{ fontSize: 14 }} />,
    },
};

// ─── Report Reasons ───
const REPORT_REASONS = [
    { value: 'inappropriate', label: 'Inappropriate Content', icon: <ReportProblemIcon sx={{ fontSize: 16 }} /> },
    { value: 'spam', label: 'Spam / Scam', icon: <BlockIcon sx={{ fontSize: 16 }} /> },
    { value: 'plagiarism', label: 'Plagiarism', icon: <ContentCopyIcon sx={{ fontSize: 16 }} /> },
    { value: 'offensive', label: 'Offensive Language', icon: <GavelIcon sx={{ fontSize: 16 }} /> },
    { value: 'misleading', label: 'Misleading Information', icon: <WarningAmberIcon sx={{ fontSize: 16 }} /> },
    { value: 'other', label: 'Other', icon: <InfoIcon sx={{ fontSize: 16 }} /> },
];

export default function MotivationLettersPage() {
    // ─── State ───
    const [letters, setLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [templateFilter, setTemplateFilter] = useState('all');
    const [userFilter, setUserFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [sortAnchorEl, setSortAnchorEl] = useState(null);
    const [viewMode, setViewMode] = useState('list');

    // Dialogs
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [statsDialogOpen, setStatsDialogOpen] = useState(false);
    const [actionTarget, setActionTarget] = useState(null);
    const [reportReason, setReportReason] = useState('');
    const [reportNote, setReportNote] = useState('');

    // Menu
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuTarget, setMenuTarget] = useState(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // ─── Fetch Data ───
    const fetchLetters = useCallback(async (showRefresh = false) => {
        try {
            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            let response;
            if (typeof adminApi.getMotivationLetters === 'function') {
                response = await adminApi.getMotivationLetters();
            } else if (typeof adminApi.getLetters === 'function') {
                response = await adminApi.getLetters();
            } else if (typeof adminApi.getCoverLetters === 'function') {
                response = await adminApi.getCoverLetters();
            } else {
                console.warn(
                    'No motivation letters API method found. Available adminApi methods:',
                    Object.keys(adminApi).filter((k) => typeof adminApi[k] === 'function')
                );
                response = { data: [] };
            }

            const extractArray = (res) => {
                if (Array.isArray(res)) return res;
                if (Array.isArray(res?.data)) return res.data;
                if (Array.isArray(res?.data?.results)) return res.data.results;
                if (Array.isArray(res?.data?.letters)) return res.data.letters;
                if (Array.isArray(res?.data?.motivationLetters)) return res.data.motivationLetters;
                if (Array.isArray(res?.data?.coverLetters)) return res.data.coverLetters;
                if (Array.isArray(res?.letters)) return res.letters;
                if (Array.isArray(res?.motivationLetters)) return res.motivationLetters;
                return [];
            };

            setLetters(extractArray(response));
        } catch (error) {
            console.error('Failed to fetch motivation letters:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load motivation letters. Please try again.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchLetters();
    }, [fetchLetters]);

    // ─── Safe Accessors ───
    const getLetterTitle = (l) => l?.title || 'Untitled';
    const getLetterUserName = (l) => l?.userName || l?.user?.name || 'Unknown';
    const getLetterUserEmail = (l) => l?.userEmail || l?.user?.email || '';
    const getLetterUserPlan = (l) => l?.userPlan || l?.user?.plan || 'free';
    const getLetterUserId = (l) => l?.userId || l?.user?.id || '';
    const getLetterTemplate = (l) => l?.template || 'simple';
    const getLetterContent = (l) => l?.content || '';
    const getLetterPreview = (l) => l?.preview || truncateText(l?.content, 120) || '';
    const getLetterWordCount = (l) => l?.wordCount || 0;
    const getLetterStatus = (l) => l?.status || 'active';
    const getLetterReports = (l) => Array.isArray(l?.reports) ? l.reports : [];
    const getLetterReportCount = (l) => l?.reportCount || getLetterReports(l).length || 0;
    const getLetterId = (l) => l?.id || '';
    const getLetterCreatedAt = (l) => l?.createdAt || l?.created_at || null;
    const getLetterUpdatedAt = (l) => l?.updatedAt || l?.updated_at || l?.createdAt || null;

    // ─── Stats ───
    const totalLetters = letters.length;
    const activeLetters = letters.filter((l) => getLetterStatus(l) === 'active').length;
    const flaggedLetters = letters.filter((l) => getLetterStatus(l) === 'flagged').length;
    const reportedLetters = letters.filter((l) => getLetterStatus(l) === 'reported').length;
    const deletedLetters = letters.filter((l) => getLetterStatus(l) === 'deleted').length;
    const uniqueUsers = [...new Set(
        letters
            .filter((l) => getLetterStatus(l) !== 'deleted')
            .map((l) => getLetterUserId(l))
            .filter(Boolean)
    )].length;

    // Template usage stats
    const templateStats = useMemo(() => {
        const stats = {};
        letters.filter((l) => getLetterStatus(l) !== 'deleted').forEach((l) => {
            const tmpl = getLetterTemplate(l);
            stats[tmpl] = (stats[tmpl] || 0) + 1;
        });
        const activeCount = totalLetters - deletedLetters || 1;
        return Object.entries(stats)
            .map(([key, count]) => ({
                template: key,
                count,
                config: TEMPLATES[key] || TEMPLATES.simple,
                percentage: Math.round((count / activeCount) * 100),
            }))
            .sort((a, b) => b.count - a.count);
    }, [letters, totalLetters, deletedLetters]);

    // Unique users for filter
    const uniqueUsersList = useMemo(() => {
        const map = {};
        letters.forEach((l) => {
            const id = getLetterUserId(l);
            if (id && !map[id]) {
                map[id] = {
                    id,
                    name: getLetterUserName(l),
                    email: getLetterUserEmail(l),
                };
            }
        });
        return Object.values(map);
    }, [letters]);

    // ─── Filtered ───
    const filteredLetters = useMemo(() => {
        let result = letters.filter((l) => {
            const title = getLetterTitle(l).toLowerCase();
            const userName = getLetterUserName(l).toLowerCase();
            const userEmail = getLetterUserEmail(l).toLowerCase();
            const id = getLetterId(l).toString().toLowerCase();
            const preview = getLetterPreview(l).toLowerCase();
            const query = searchQuery.toLowerCase();

            const matchesSearch =
                title.includes(query) ||
                userName.includes(query) ||
                userEmail.includes(query) ||
                id.includes(query) ||
                preview.includes(query);

            const status = getLetterStatus(l);
            const matchesTab =
                activeTab === 'all' ||
                status === activeTab ||
                (activeTab === 'issues' && (status === 'flagged' || status === 'reported'));

            const matchesTemplate = templateFilter === 'all' || getLetterTemplate(l) === templateFilter;
            const matchesUser = userFilter === 'all' || getLetterUserId(l) === userFilter;

            return matchesSearch && matchesTab && matchesTemplate && matchesUser;
        });

        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(getLetterCreatedAt(b)) - new Date(getLetterCreatedAt(a));
            if (sortBy === 'oldest') return new Date(getLetterCreatedAt(a)) - new Date(getLetterCreatedAt(b));
            if (sortBy === 'title') return getLetterTitle(a).localeCompare(getLetterTitle(b));
            if (sortBy === 'reports') return getLetterReportCount(b) - getLetterReportCount(a);
            if (sortBy === 'words') return getLetterWordCount(b) - getLetterWordCount(a);
            return 0;
        });

        return result;
    }, [letters, searchQuery, activeTab, templateFilter, userFilter, sortBy]);

    // ─── Handlers ───
    const handleMenuOpen = (e, letter) => {
        e.stopPropagation();
        setMenuAnchorEl(e.currentTarget);
        setMenuTarget(letter);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuTarget(null);
    };

    const handleViewOpen = (letter) => {
        setActionTarget(letter || menuTarget);
        setViewDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteOpen = (letter) => {
        setActionTarget(letter || menuTarget);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        if (!actionTarget) return;
        setActionLoading(true);
        try {
            if (typeof adminApi.deleteMotivationLetter === 'function') {
                await adminApi.deleteMotivationLetter(actionTarget.id);
            } else if (typeof adminApi.deleteLetter === 'function') {
                await adminApi.deleteLetter(actionTarget.id);
            } else if (typeof adminApi.deleteCoverLetter === 'function') {
                await adminApi.deleteCoverLetter(actionTarget.id);
            } else {
                console.warn('No delete letter API method found');
            }

            setLetters((prev) =>
                prev.map((l) =>
                    l.id === actionTarget.id
                        ? {
                            ...l,
                            status: 'deleted',
                            content: '[Content removed by admin]',
                            preview: '[Content removed]',
                            updatedAt: new Date().toISOString(),
                        }
                        : l
                )
            );
            setDeleteDialogOpen(false);
            setViewDialogOpen(false);
            setSnackbar({
                open: true,
                message: `Letter "${getLetterTitle(actionTarget)}" has been deleted.`,
                severity: 'warning',
            });
        } catch (error) {
            console.error('Delete failed:', error);
            setSnackbar({
                open: true,
                message: `Failed to delete letter. ${error?.response?.data?.message || 'Please try again.'}`,
                severity: 'error',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReportOpen = (letter) => {
        setActionTarget(letter || menuTarget);
        setReportReason('');
        setReportNote('');
        setReportDialogOpen(true);
        handleMenuClose();
    };

    const handleReportConfirm = async () => {
        if (!actionTarget || !reportReason) return;
        setActionLoading(true);
        try {
            if (typeof adminApi.flagMotivationLetter === 'function') {
                await adminApi.flagMotivationLetter(actionTarget.id, {
                    reason: reportReason,
                    note: reportNote,
                });
            } else if (typeof adminApi.flagLetter === 'function') {
                await adminApi.flagLetter(actionTarget.id, {
                    reason: reportReason,
                    note: reportNote,
                });
            } else if (typeof adminApi.reportLetter === 'function') {
                await adminApi.reportLetter(actionTarget.id, {
                    reason: reportReason,
                    note: reportNote,
                });
            } else if (typeof adminApi.updateMotivationLetter === 'function') {
                await adminApi.updateMotivationLetter(actionTarget.id, {
                    status: getLetterReportCount(actionTarget) >= 1 ? 'reported' : 'flagged',
                    reportReason,
                    reportNote,
                });
            } else {
                console.warn('No flag/report letter API method found');
            }

            setLetters((prev) =>
                prev.map((l) =>
                    l.id === actionTarget.id
                        ? {
                            ...l,
                            status: getLetterReportCount(l) >= 1 ? 'reported' : 'flagged',
                            reportCount: getLetterReportCount(l) + 1,
                            reports: [
                                ...getLetterReports(l),
                                {
                                    reason: reportReason,
                                    note: reportNote,
                                    reportedBy: 'admin',
                                    reportedAt: new Date().toISOString(),
                                },
                            ],
                            updatedAt: new Date().toISOString(),
                        }
                        : l
                )
            );
            setReportDialogOpen(false);
            setSnackbar({
                open: true,
                message: `Letter "${getLetterTitle(actionTarget)}" has been flagged.`,
                severity: 'info',
            });
        } catch (error) {
            console.error('Flag failed:', error);
            setSnackbar({
                open: true,
                message: `Failed to flag letter. ${error?.response?.data?.message || 'Please try again.'}`,
                severity: 'error',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearFlag = async (letter) => {
        const target = letter || menuTarget;
        if (!target) return;
        setActionLoading(true);
        try {
            if (typeof adminApi.clearLetterFlags === 'function') {
                await adminApi.clearLetterFlags(target.id);
            } else if (typeof adminApi.updateMotivationLetter === 'function') {
                await adminApi.updateMotivationLetter(target.id, {
                    status: 'active',
                    reportCount: 0,
                    reports: [],
                });
            } else if (typeof adminApi.updateLetter === 'function') {
                await adminApi.updateLetter(target.id, {
                    status: 'active',
                    reportCount: 0,
                    reports: [],
                });
            } else {
                console.warn('No clear flags API method found');
            }

            setLetters((prev) =>
                prev.map((l) =>
                    l.id === target.id
                        ? {
                            ...l,
                            status: 'active',
                            reportCount: 0,
                            reports: [],
                            updatedAt: new Date().toISOString(),
                        }
                        : l
                )
            );
            handleMenuClose();
            setSnackbar({
                open: true,
                message: `Flags cleared for "${getLetterTitle(target)}".`,
                severity: 'success',
            });
        } catch (error) {
            console.error('Clear flags failed:', error);
            handleMenuClose();
            setSnackbar({
                open: true,
                message: `Failed to clear flags. ${error?.response?.data?.message || 'Please try again.'}`,
                severity: 'error',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCopyId = (id) => {
        if (!id) return;
        navigator.clipboard?.writeText(id);
        setSnackbar({ open: true, message: `Copied ${id}`, severity: 'info' });
    };

    const handleRefresh = () => {
        fetchLetters(true);
    };

    const handleExport = async () => {
        try {
            setSnackbar({ open: true, message: 'Exporting letters...', severity: 'info' });

            const headers = [
                'ID', 'Title', 'User', 'Email', 'Plan', 'Template',
                'Word Count', 'Status', 'Reports', 'Created', 'Updated',
            ];

            const csvRows = [
                headers.join(','),
                ...letters.map((l) =>
                    [
                        `"${getLetterId(l)}"`,
                        `"${getLetterTitle(l).replace(/"/g, '""')}"`,
                        `"${getLetterUserName(l)}"`,
                        `"${getLetterUserEmail(l)}"`,
                        `"${getLetterUserPlan(l)}"`,
                        `"${getLetterTemplate(l)}"`,
                        getLetterWordCount(l),
                        `"${getLetterStatus(l)}"`,
                        getLetterReportCount(l),
                        `"${getLetterCreatedAt(l) || ''}"`,
                        `"${getLetterUpdatedAt(l) || ''}"`,
                    ].join(',')
                ),
            ];

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `motivation-letters-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);

            setSnackbar({ open: true, message: 'Letters exported successfully!', severity: 'success' });
        } catch (error) {
            console.error('Export failed:', error);
            setSnackbar({ open: true, message: 'Failed to export letters.', severity: 'error' });
        }
    };

    // ─── Loading Skeleton ───
    if (loading) {
        return (
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ mb: 4 }}>
                    <Skeleton variant="text" width={300} height={40} />
                    <Skeleton variant="text" width={400} height={24} />
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(6, 1fr)' },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} variant="rounded" height={95} sx={{ borderRadius: 2.5 }} />
                    ))}
                </Box>

                <Skeleton variant="rounded" height={48} sx={{ mb: 3, borderRadius: 2 }} />
                <Skeleton variant="rounded" height={48} sx={{ mb: 3, borderRadius: 2 }} />

                <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <Skeleton variant="rectangular" height={48} />
                    {[...Array(6)].map((_, i) => (
                        <Box key={i} sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="60%" height={20} />
                                    <Skeleton variant="text" width="80%" height={16} />
                                    <Skeleton variant="text" width="30%" height={14} />
                                </Box>
                                <Skeleton variant="circular" width={30} height={30} />
                                <Skeleton variant="rounded" width={70} height={22} sx={{ borderRadius: 2 }} />
                                <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: 2 }} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }

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
                        📝 Motivation Letters
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                        Monitor, review, and manage user motivation letters
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    {(flaggedLetters > 0 || reportedLetters > 0) && (
                        <Chip
                            icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                            label={`${flaggedLetters + reportedLetters} needs review`}
                            sx={{
                                fontWeight: 700,
                                bgcolor: '#ef444412',
                                color: '#ef4444',
                                border: '1px solid #ef444430',
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.7 },
                                },
                            }}
                        />
                    )}
                    <Tooltip title="Template Statistics">
                        <IconButton
                            onClick={() => setStatsDialogOpen(true)}
                            sx={{
                                bgcolor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: '#f8fafc' },
                            }}
                        >
                            <BarChartIcon sx={{ fontSize: 20, color: '#64748b' }} />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExport}
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
                            onClick={handleRefresh}
                            disabled={refreshing}
                            sx={{
                                bgcolor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                '&:hover': { bgcolor: '#f8fafc' },
                            }}
                        >
                            <RefreshIcon
                                sx={{
                                    fontSize: 20,
                                    color: '#64748b',
                                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                                    '@keyframes spin': {
                                        '0%': { transform: 'rotate(0deg)' },
                                        '100%': { transform: 'rotate(360deg)' },
                                    },
                                }}
                            />
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
                    { label: 'Total Letters', value: totalLetters, icon: <MailOutlineIcon />, color: '#667eea', gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
                    { label: 'Active', value: activeLetters, icon: <CheckCircleIcon />, color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
                    { label: 'Flagged', value: flaggedLetters, icon: <FlagIcon />, color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)' },
                    { label: 'Reported', value: reportedLetters, icon: <ReportIcon />, color: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#dc2626)' },
                    { label: 'Deleted', value: deletedLetters, icon: <DeleteIcon />, color: '#94a3b8', gradient: 'linear-gradient(135deg,#94a3b8,#64748b)' },
                    { label: 'Unique Users', value: uniqueUsers, icon: <PeopleIcon />, color: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
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
                <Tab label={`All (${totalLetters})`} value="all" />
                <Tab icon={<CheckCircleIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Active (${activeLetters})`} value="active" />
                <Tab
                    icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                    iconPosition="start"
                    label={
                        <Badge badgeContent={flaggedLetters + reportedLetters} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>
                            <Box sx={{ pr: 1.5 }}>Issues</Box>
                        </Badge>
                    }
                    value="issues"
                />
                <Tab icon={<DeleteIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Deleted (${deletedLetters})`} value="deleted" />
            </Tabs>

            {/* ─── Filters ─── */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search by title, user, email, or content..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        flex: 1,
                        minWidth: 250,
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

                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Template</InputLabel>
                    <Select
                        value={templateFilter}
                        label="Template"
                        onChange={(e) => setTemplateFilter(e.target.value)}
                        sx={{ borderRadius: 2, bgcolor: '#ffffff', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                    >
                        <MenuItem value="all">All Templates</MenuItem>
                        {Object.entries(TEMPLATES).map(([key, cfg]) => (
                            <MenuItem key={key} value={key}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: cfg.color }}>
                                    {cfg.icon}
                                    <Typography variant="body2">{cfg.label}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>User</InputLabel>
                    <Select
                        value={userFilter}
                        label="User"
                        onChange={(e) => setUserFilter(e.target.value)}
                        sx={{ borderRadius: 2, bgcolor: '#ffffff', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
                    >
                        <MenuItem value="all">All Users</MenuItem>
                        {uniqueUsersList.map((u) => (
                            <MenuItem key={u.id} value={u.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ width: 20, height: 20, fontSize: '0.5rem', bgcolor: '#667eea15', color: '#667eea' }}>{getInitials(u.name)}</Avatar>
                                    <Typography variant="body2">{u.name}</Typography>
                                </Box>
                            </MenuItem>
                        ))}
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
                        { label: 'Title (A-Z)', value: 'title' },
                        { label: 'Most Reports', value: 'reports' },
                        { label: 'Word Count', value: 'words' },
                    ].map((opt) => (
                        <MenuItem key={opt.value} selected={sortBy === opt.value} onClick={() => { setSortBy(opt.value); setSortAnchorEl(null); }}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </Menu>

                <Box sx={{ display: 'flex', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <IconButton size="small" onClick={() => setViewMode('list')} sx={{ borderRadius: '8px 0 0 8px', bgcolor: viewMode === 'list' ? '#667eea15' : 'transparent', color: viewMode === 'list' ? '#667eea' : '#94a3b8' }}>
                        <ViewListIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setViewMode('grid')} sx={{ borderRadius: '0 8px 8px 0', bgcolor: viewMode === 'grid' ? '#667eea15' : 'transparent', color: viewMode === 'grid' ? '#667eea' : '#94a3b8' }}>
                        <GridViewIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Results */}
            <Typography variant="body2" color="#94a3b8" sx={{ mb: 2 }}>
                Showing {filteredLetters.length} letter{filteredLetters.length !== 1 ? 's' : ''}
            </Typography>

            {/* ─── Letter List / Grid ─── */}
            {filteredLetters.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <MailOutlineIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 2 }} />
                    <Typography variant="h6" fontWeight="600" color="#94a3b8">No letters found</Typography>
                    <Typography variant="body2" color="#cbd5e1">Try adjusting your filters or search query</Typography>
                </Box>
            ) : viewMode === 'list' ? (
                <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: '2.5fr 1.2fr 1fr 1fr 0.8fr auto', gap: 2, p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {['TITLE', 'USER', 'TEMPLATE', 'CREATED', 'STATUS', 'ACTIONS'].map((h) => (
                            <Typography key={h} variant="caption" fontWeight="700" color="#64748b" letterSpacing="0.05em">{h}</Typography>
                        ))}
                    </Box>

                    {filteredLetters.map((letter, index) => {
                        const status = getLetterStatus(letter);
                        const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;
                        const tmpl = getLetterTemplate(letter);
                        const templateCfg = TEMPLATES[tmpl] || TEMPLATES.simple;
                        const reportCount = getLetterReportCount(letter);

                        return (
                            <Box
                                key={getLetterId(letter) || index}
                                onClick={() => handleViewOpen(letter)}
                                sx={{
                                    display: { xs: 'flex', md: 'grid' },
                                    flexDirection: { xs: 'column', md: 'unset' },
                                    gridTemplateColumns: '2.5fr 1.2fr 1fr 1fr 0.8fr auto',
                                    gap: { xs: 1.5, md: 2 },
                                    p: 2,
                                    alignItems: { md: 'center' },
                                    cursor: 'pointer',
                                    borderBottom: index < filteredLetters.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    borderLeft: `3px solid ${statusCfg.color}`,
                                    transition: 'all 0.15s ease',
                                    opacity: status === 'deleted' ? 0.5 : 1,
                                    '&:hover': { bgcolor: '#f8fafc' },
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
                                            {getLetterTitle(letter)}
                                        </Typography>
                                        {reportCount > 0 && (
                                            <Badge badgeContent={reportCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.5rem', height: 14, minWidth: 14 } }}>
                                                <ReportIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                                            </Badge>
                                        )}
                                    </Box>
                                    <Typography variant="caption" color="#94a3b8" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {getLetterPreview(letter)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                        <Chip label={getLetterId(letter)} size="small" sx={{ fontWeight: 500, fontSize: '0.5rem', height: 16, fontFamily: 'monospace', bgcolor: '#f1f5f9', color: '#94a3b8' }} />
                                        <Chip label={`${getLetterWordCount(letter)} words`} size="small" sx={{ fontWeight: 500, fontSize: '0.5rem', height: 16, bgcolor: '#f1f5f9', color: '#94a3b8' }} />
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ width: 30, height: 30, fontSize: '0.65rem', bgcolor: '#667eea15', color: '#667eea', fontWeight: 700 }}>
                                        {getInitials(getLetterUserName(letter))}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="caption" fontWeight="600" color="#1e293b" noWrap>{getLetterUserName(letter)}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                            {getLetterUserPlan(letter) === 'premium' && <StarIcon sx={{ fontSize: 10, color: '#f59e0b' }} />}
                                            <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.6rem' }}>{getLetterUserPlan(letter)}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box>
                                    <Chip
                                        icon={templateCfg.icon}
                                        label={templateCfg.label}
                                        size="small"
                                        sx={{
                                            fontWeight: 600, fontSize: '0.65rem', height: 22,
                                            bgcolor: templateCfg.bgcolor, color: templateCfg.color,
                                            '& .MuiChip-icon': { ml: 0.5, color: templateCfg.color },
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Tooltip title={formatFullDate(getLetterCreatedAt(letter))}>
                                        <Typography variant="caption" color="#64748b" sx={{ cursor: 'default' }}>
                                            {formatDate(getLetterCreatedAt(letter))}
                                        </Typography>
                                    </Tooltip>
                                </Box>

                                <Box>
                                    <Chip
                                        icon={statusCfg.icon}
                                        label={statusCfg.label}
                                        size="small"
                                        sx={{
                                            fontWeight: 700, fontSize: '0.65rem', height: 22,
                                            bgcolor: statusCfg.bgcolor, color: statusCfg.color,
                                            '& .MuiChip-icon': { ml: 0.5, color: statusCfg.color },
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="View">
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewOpen(letter); }} sx={{ bgcolor: '#667eea10', color: '#667eea', '&:hover': { bgcolor: '#667eea20' } }}>
                                            <VisibilityIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, letter)}>
                                        <MoreVertIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2.5 }}>
                    {filteredLetters.map((letter) => {
                        const status = getLetterStatus(letter);
                        const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;
                        const tmpl = getLetterTemplate(letter);
                        const templateCfg = TEMPLATES[tmpl] || TEMPLATES.simple;
                        const reportCount = getLetterReportCount(letter);

                        return (
                            <Box
                                key={getLetterId(letter)}
                                onClick={() => handleViewOpen(letter)}
                                sx={{
                                    bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    overflow: 'hidden', cursor: 'pointer',
                                    opacity: status === 'deleted' ? 0.5 : 1,
                                    borderTop: `3px solid ${statusCfg.color}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' },
                                }}
                            >
                                <Box sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {getLetterTitle(letter)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                                            {reportCount > 0 && (
                                                <Badge badgeContent={reportCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.5rem', height: 14, minWidth: 14 } }}>
                                                    <ReportIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                                                </Badge>
                                            )}
                                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, letter)}>
                                                <MoreVertIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Typography variant="caption" color="#64748b" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6, mb: 2 }}>
                                        {getLetterPreview(letter)}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                                        <Chip icon={templateCfg.icon} label={templateCfg.label} size="small" sx={{ fontWeight: 600, fontSize: '0.6rem', height: 20, bgcolor: templateCfg.bgcolor, color: templateCfg.color, '& .MuiChip-icon': { ml: 0.5, color: templateCfg.color } }} />
                                        <Chip icon={statusCfg.icon} label={statusCfg.label} size="small" sx={{ fontWeight: 600, fontSize: '0.6rem', height: 20, bgcolor: statusCfg.bgcolor, color: statusCfg.color, '& .MuiChip-icon': { ml: 0.5, color: statusCfg.color } }} />
                                        <Chip label={`${getLetterWordCount(letter)} words`} size="small" sx={{ fontWeight: 500, fontSize: '0.55rem', height: 18, bgcolor: '#f1f5f9', color: '#94a3b8' }} />
                                    </Box>

                                    <Divider sx={{ mb: 1.5 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.55rem', bgcolor: '#667eea15', color: '#667eea', fontWeight: 700 }}>
                                                {getInitials(getLetterUserName(letter))}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" fontWeight="600" color="#1e293b" sx={{ fontSize: '0.65rem' }}>{getLetterUserName(letter)}</Typography>
                                                {getLetterUserPlan(letter) === 'premium' && <StarIcon sx={{ fontSize: 10, color: '#f59e0b', ml: 0.3 }} />}
                                            </Box>
                                        </Box>
                                        <Typography variant="caption" color="#94a3b8" sx={{ fontSize: '0.6rem' }}>
                                            {formatDate(getLetterCreatedAt(letter))}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* ═══════════ CONTEXT MENU ═══════════ */}
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 200 } }}>
                <MenuItem onClick={() => handleViewOpen(menuTarget)} sx={{ py: 1 }}>
                    <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: '#667eea' }} /></ListItemIcon>
                    <ListItemText primary="View Letter" />
                </MenuItem>

                {menuTarget && getLetterStatus(menuTarget) !== 'deleted' && (
                    <MenuItem onClick={() => handleReportOpen(menuTarget)} sx={{ py: 1 }}>
                        <ListItemIcon><FlagIcon fontSize="small" sx={{ color: '#f59e0b' }} /></ListItemIcon>
                        <ListItemText primary="Flag / Report" />
                    </MenuItem>
                )}

                {menuTarget && (getLetterStatus(menuTarget) === 'flagged' || getLetterStatus(menuTarget) === 'reported') && (
                    <MenuItem onClick={() => handleClearFlag(menuTarget)} sx={{ py: 1 }} disabled={actionLoading}>
                        <ListItemIcon><ShieldIcon fontSize="small" sx={{ color: '#10b981' }} /></ListItemIcon>
                        <ListItemText primary="Clear Flags" primaryTypographyProps={{ color: '#10b981' }} />
                    </MenuItem>
                )}

                <Divider sx={{ my: 0.5 }} />

                {menuTarget && getLetterStatus(menuTarget) !== 'deleted' && (
                    <MenuItem onClick={() => handleDeleteOpen(menuTarget)} sx={{ py: 1, '&:hover': { bgcolor: '#ef444410' } }}>
                        <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                        <ListItemText primary="Delete Letter" primaryTypographyProps={{ color: '#ef4444' }} />
                    </MenuItem>
                )}
            </Menu>

            {/* ═══════════ VIEW LETTER DIALOG ═══════════ */}
            <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
                {actionTarget && (() => {
                    const status = getLetterStatus(actionTarget);
                    const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;
                    const tmpl = getLetterTemplate(actionTarget);
                    const templateCfg = TEMPLATES[tmpl] || TEMPLATES.simple;
                    const reports = getLetterReports(actionTarget);
                    const reportCount = getLetterReportCount(actionTarget);

                    return (
                        <>
                            <Box sx={{ background: `linear-gradient(135deg, ${templateCfg.color} 0%, ${templateCfg.color}cc 100%)`, p: 3, color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Box sx={{ width: 50, height: 50, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ArticleIcon sx={{ fontSize: 26, color: '#ffffff' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" fontWeight="700">{getLetterTitle(actionTarget)}</Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.85 }}>{getLetterId(actionTarget)} · {templateCfg.label} Template</Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={() => setViewDialogOpen(false)} sx={{ color: '#ffffff' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <DialogContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
                                    <Chip icon={statusCfg.icon} label={statusCfg.label} size="small" sx={{ fontWeight: 700, bgcolor: statusCfg.bgcolor, color: statusCfg.color, '& .MuiChip-icon': { color: statusCfg.color } }} />
                                    <Chip icon={templateCfg.icon} label={templateCfg.label} size="small" sx={{ fontWeight: 600, bgcolor: templateCfg.bgcolor, color: templateCfg.color, '& .MuiChip-icon': { color: templateCfg.color } }} />
                                    <Chip label={`${getLetterWordCount(actionTarget)} words`} size="small" sx={{ fontWeight: 500, bgcolor: '#f1f5f9', color: '#64748b' }} />
                                    {reportCount > 0 && (
                                        <Chip icon={<ReportIcon sx={{ fontSize: 14 }} />} label={`${reportCount} report(s)`} size="small" sx={{ fontWeight: 600, bgcolor: '#ef444412', color: '#ef4444', '& .MuiChip-icon': { color: '#ef4444' } }} />
                                    )}
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2.5 }}>
                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                                            <PersonIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                            <Typography variant="caption" fontWeight="700" color="#94a3b8">AUTHOR</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 28, height: 28, fontSize: '0.6rem', bgcolor: '#667eea15', color: '#667eea', fontWeight: 700 }}>
                                                {getInitials(getLetterUserName(actionTarget))}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight="600" color="#1e293b">{getLetterUserName(actionTarget)}</Typography>
                                                <Typography variant="caption" color="#94a3b8">{getLetterUserEmail(actionTarget)}</Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            icon={getLetterUserPlan(actionTarget) === 'premium' ? <StarIcon sx={{ fontSize: 10 }} /> : undefined}
                                            label={getLetterUserPlan(actionTarget)}
                                            size="small"
                                            sx={{ mt: 0.5, fontWeight: 600, fontSize: '0.55rem', height: 18, textTransform: 'uppercase', bgcolor: getLetterUserPlan(actionTarget) === 'premium' ? '#f59e0b12' : '#f1f5f9', color: getLetterUserPlan(actionTarget) === 'premium' ? '#f59e0b' : '#94a3b8', '& .MuiChip-icon': { color: '#f59e0b' } }}
                                        />
                                    </Box>

                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                            <Typography variant="caption" fontWeight="700" color="#94a3b8">DATES</Typography>
                                        </Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">Created: {formatFullDate(getLetterCreatedAt(actionTarget))}</Typography>
                                        {getLetterUpdatedAt(actionTarget) !== getLetterCreatedAt(actionTarget) && (
                                            <Typography variant="caption" color="#94a3b8" sx={{ display: 'block' }}>Updated: {formatFullDate(getLetterUpdatedAt(actionTarget))}</Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={{ p: 3, borderRadius: 2, bgcolor: '#fafbfc', border: '1px solid #e2e8f0', mb: 2.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
                                        <FormatQuoteIcon sx={{ fontSize: 18, color: templateCfg.color }} />
                                        <Typography variant="caption" fontWeight="700" color={templateCfg.color}>LETTER CONTENT</Typography>
                                    </Box>
                                    <Typography variant="body2" color="#1e293b" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, fontFamily: '"Georgia", serif' }}>
                                        {getLetterContent(actionTarget)}
                                    </Typography>
                                </Box>

                                {reports.length > 0 && (
                                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#ef444408', border: '1px solid #ef444420' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
                                            <ReportIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                                            <Typography variant="caption" fontWeight="700" color="#ef4444">REPORTS ({reports.length})</Typography>
                                        </Box>
                                        {reports.map((report, i) => (
                                            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: i < reports.length - 1 ? '1px solid #ef444415' : 'none' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={REPORT_REASONS.find((r) => r.value === report.reason)?.label || report.reason}
                                                        size="small"
                                                        sx={{ fontWeight: 600, fontSize: '0.6rem', height: 20, bgcolor: '#ef444412', color: '#ef4444' }}
                                                    />
                                                    <Typography variant="caption" color="#94a3b8">by {report.reportedBy || 'N/A'}</Typography>
                                                </Box>
                                                <Typography variant="caption" color="#94a3b8">{formatDate(report.reportedAt)}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </DialogContent>

                            <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
                                <Button onClick={() => setViewDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Close</Button>

                                {status !== 'deleted' && (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {(status === 'flagged' || status === 'reported') && (
                                            <Button
                                                startIcon={actionLoading ? <CircularProgress size={16} /> : <ShieldIcon />}
                                                onClick={() => { handleClearFlag(actionTarget); setViewDialogOpen(false); }}
                                                disabled={actionLoading}
                                                sx={{ textTransform: 'none', color: '#10b981', fontWeight: 600 }}
                                            >
                                                Clear Flags
                                            </Button>
                                        )}
                                        <Button
                                            variant="outlined"
                                            startIcon={<FlagIcon />}
                                            onClick={() => handleReportOpen(actionTarget)}
                                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, borderColor: '#f59e0b', color: '#f59e0b', '&:hover': { bgcolor: '#f59e0b08', borderColor: '#f59e0b' } }}
                                        >
                                            Flag
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteForeverIcon />}
                                            onClick={() => handleDeleteOpen(actionTarget)}
                                            disabled={actionLoading}
                                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                )}
                            </DialogActions>
                        </>
                    );
                })()}
            </Dialog>

            {/* ═══════════ DELETE DIALOG ═══════════ */}
            <Dialog open={deleteDialogOpen} onClose={() => !actionLoading && setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><DeleteForeverIcon /> Delete Letter</Box>
                </DialogTitle>
                <DialogContent>
                    {actionTarget && (
                        <>
                            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                                Are you sure you want to delete this letter? The content will be permanently removed.
                            </Typography>
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', mb: 2 }}>
                                <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 0.5 }}>{getLetterTitle(actionTarget)}</Typography>
                                <Typography variant="caption" color="#94a3b8">by {getLetterUserName(actionTarget)} · {formatDate(getLetterCreatedAt(actionTarget))}</Typography>
                            </Box>
                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                                This action cannot be undone. The letter content will be replaced with a removal notice.
                            </Alert>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }} disabled={actionLoading}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteForeverIcon />}
                        onClick={handleDeleteConfirm}
                        disabled={actionLoading}
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                    >
                        {actionLoading ? 'Deleting...' : 'Delete Letter'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ REPORT / FLAG DIALOG ═══════════ */}
            <Dialog open={reportDialogOpen} onClose={() => !actionLoading && setReportDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FlagIcon /> Flag Content</Box>
                </DialogTitle>
                <DialogContent>
                    {actionTarget && (
                        <>
                            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                                Flag &quot;{getLetterTitle(actionTarget)}&quot; for review.
                            </Typography>

                            <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1.5 }}>Select Reason</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
                                {REPORT_REASONS.map((reason) => (
                                    <Box
                                        key={reason.value}
                                        onClick={() => !actionLoading && setReportReason(reason.value)}
                                        sx={{
                                            p: 1.5, borderRadius: 2,
                                            border: `2px solid ${reportReason === reason.value ? '#f59e0b' : '#f1f5f9'}`,
                                            bgcolor: reportReason === reason.value ? '#f59e0b08' : '#ffffff',
                                            cursor: actionLoading ? 'default' : 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                            opacity: actionLoading ? 0.6 : 1,
                                            '&:hover': actionLoading ? {} : { borderColor: '#f59e0b', bgcolor: '#f59e0b08' },
                                        }}
                                    >
                                        <Box sx={{ color: reportReason === reason.value ? '#f59e0b' : '#94a3b8' }}>{reason.icon}</Box>
                                        <Typography variant="body2" fontWeight={reportReason === reason.value ? 700 : 500} color={reportReason === reason.value ? '#f59e0b' : '#64748b'}>
                                            {reason.label}
                                        </Typography>
                                        {reportReason === reason.value && <CheckCircleIcon sx={{ fontSize: 18, color: '#f59e0b', ml: 'auto' }} />}
                                    </Box>
                                ))}
                            </Box>

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Additional Note (optional)"
                                placeholder="Add any details about this report..."
                                value={reportNote}
                                onChange={(e) => setReportNote(e.target.value)}
                                disabled={actionLoading}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#f59e0b' } },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#f59e0b' },
                                }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setReportDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }} disabled={actionLoading}>Cancel</Button>
                    <Button
                        variant="contained"
                        startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <FlagIcon />}
                        disabled={!reportReason || actionLoading}
                        onClick={handleReportConfirm}
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}
                    >
                        {actionLoading ? 'Flagging...' : 'Flag Content'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ TEMPLATE STATS DIALOG ═══════════ */}
            <Dialog open={statsDialogOpen} onClose={() => setStatsDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
                <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 3, color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BarChartIcon sx={{ fontSize: 24, color: '#ffffff' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="700">Template Usage Statistics</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.85 }}>How templates are being used</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={() => setStatsDialogOpen(false)} sx={{ color: '#ffffff' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <DialogContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="800" color="#667eea">{totalLetters - deletedLetters}</Typography>
                            <Typography variant="caption" color="#94a3b8">Active Letters</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="800" color="#8b5cf6">{templateStats.length}</Typography>
                            <Typography variant="caption" color="#94a3b8">Templates Used</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                            <Typography variant="h5" fontWeight="800" color="#10b981">{uniqueUsers}</Typography>
                            <Typography variant="caption" color="#94a3b8">Unique Users</Typography>
                        </Box>
                    </Box>

                    <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>Usage by Template</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {templateStats.map((stat) => (
                            <Box key={stat.template}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ color: stat.config.color }}>{stat.config.icon}</Box>
                                        <Typography variant="body2" fontWeight="600" color="#1e293b">{stat.config.label}</Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight="700" color={stat.config.color}>
                                        {stat.count} ({stat.percentage}%)
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stat.percentage}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: '#f1f5f9',
                                        '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: stat.config.color },
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>

                    {templateStats.length > 0 && (
                        <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: `${templateStats[0].config.color}08`, border: `1px solid ${templateStats[0].config.color}20` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: 18, color: templateStats[0].config.color }} />
                                <Typography variant="body2" fontWeight="700" color={templateStats[0].config.color}>
                                    Most Popular: {templateStats[0].config.label}
                                </Typography>
                            </Box>
                            <Typography variant="caption" color="#64748b" sx={{ mt: 0.5, display: 'block' }}>
                                The {templateStats[0].config.label} template is used in {templateStats[0].percentage}% of all motivation letters.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setStatsDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* ═══════════ SNACKBAR ═══════════ */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ borderRadius: 2, fontWeight: 600 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}