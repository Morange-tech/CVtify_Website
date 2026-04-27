'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Avatar,
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
  Badge,
  Alert,
  Snackbar,
  Switch,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { adminApi } from '../../services/api';

export default function UsersPage() {
  // ─── State ───
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [downgradeDialogOpen, setDowngradeDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // ─── Fetch Users ───
  const fetchUsers = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await adminApi.getUsers();

      // Handle different API response shapes
      const extractArray = (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.results)) return res.data.results;
        if (Array.isArray(res?.data?.users)) return res.data.users;
        if (Array.isArray(res?.users)) return res.users;
        return [];
      };

      setUsers(extractArray(response));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load users. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ─── Computed ───
  const totalUsers = users.length;
  const premiumUsers = users.filter((u) => u.plan === 'premium').length;
  const freeUsers = users.filter((u) => u.plan === 'free').length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const suspendedUsers = users.filter((u) => u.status === 'suspended').length;
  const bannedUsers = users.filter((u) => u.status === 'banned').length;

  // ─── Filter, Search & Sort ───
  const filteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesSearch =
        (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'all') return matchesSearch;
      if (activeTab === 'premium') return matchesSearch && user.plan === 'premium';
      if (activeTab === 'free') return matchesSearch && user.plan === 'free';
      if (activeTab === 'suspended')
        return matchesSearch && (user.status === 'suspended' || user.status === 'banned');
      return matchesSearch;
    });

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        result.sort(
          (a, b) => new Date(a.joinedDate || a.createdAt) - new Date(b.joinedDate || b.createdAt)
        );
        break;
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'cvs':
        result.sort((a, b) => (b.cvsCreated || 0) - (a.cvsCreated || 0));
        break;
      case 'downloads':
        result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) => new Date(b.joinedDate || b.createdAt) - new Date(a.joinedDate || a.createdAt)
        );
        break;
    }

    return result;
  }, [users, searchQuery, activeTab, sortBy]);

  // ─── Pagination ───
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // ─── Handlers ───
  const handleMenuOpen = (event, user) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user || selectedUser);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleUpgrade = () => {
    setUpgradeDialogOpen(true);
    handleMenuClose();
  };

  const handleUpgradeConfirm = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await adminApi.updateUser(selectedUser.id, { plan: 'premium' });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, plan: 'premium' } : u
        )
      );
      setUpgradeDialogOpen(false);
      setSnackbar({
        open: true,
        message: `${selectedUser.name} upgraded to Premium!`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Upgrade failed:', error);
      setSnackbar({
        open: true,
        message: `Failed to upgrade ${selectedUser.name}. Please try again.`,
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDowngrade = () => {
    setDowngradeDialogOpen(true);
    handleMenuClose();
  };

  const handleDowngradeConfirm = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await adminApi.updateUser(selectedUser.id, { plan: 'free' });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, plan: 'free' } : u
        )
      );
      setDowngradeDialogOpen(false);
      setSnackbar({
        open: true,
        message: `${selectedUser.name} downgraded to Free.`,
        severity: 'info',
      });
    } catch (error) {
      console.error('Downgrade failed:', error);
      setSnackbar({
        open: true,
        message: `Failed to downgrade ${selectedUser.name}. Please try again.`,
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBan = () => {
    setBanDialogOpen(true);
    handleMenuClose();
  };

  const handleBanConfirm = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === 'banned' ? 'active' : 'banned';
    setActionLoading(true);
    try {
      await adminApi.updateUser(selectedUser.id, { status: newStatus });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, status: newStatus } : u
        )
      );
      setBanDialogOpen(false);
      setSnackbar({
        open: true,
        message:
          newStatus === 'banned'
            ? `${selectedUser.name} has been banned.`
            : `${selectedUser.name} has been unbanned.`,
        severity: newStatus === 'banned' ? 'warning' : 'success',
      });
    } catch (error) {
      console.error('Ban/unban failed:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${newStatus === 'banned' ? 'ban' : 'unban'} ${selectedUser.name}.`,
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === 'suspended' ? 'active' : 'suspended';
    setActionLoading(true);
    try {
      await adminApi.updateUser(selectedUser.id, { status: newStatus });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, status: newStatus } : u
        )
      );
      handleMenuClose();
      setSnackbar({
        open: true,
        message:
          newStatus === 'suspended'
            ? `${selectedUser.name} has been suspended.`
            : `${selectedUser.name} has been reactivated.`,
        severity: 'info',
      });
    } catch (error) {
      console.error('Suspend/reactivate failed:', error);
      handleMenuClose();
      setSnackbar({
        open: true,
        message: `Failed to ${newStatus === 'suspended' ? 'suspend' : 'reactivate'} ${selectedUser.name}.`,
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await adminApi.deleteUser(selectedUser.id);

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setDeleteConfirmText('');
      setSnackbar({
        open: true,
        message: `${selectedUser.name} has been permanently deleted.`,
        severity: 'error',
      });
    } catch (error) {
      console.error('Delete failed:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete ${selectedUser.name}. Please try again.`,
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyEmail = () => {
    if (!selectedUser) return;
    navigator.clipboard.writeText(selectedUser.email);
    handleMenuClose();
    setSnackbar({ open: true, message: 'Email copied to clipboard!', severity: 'success' });
  };

  const handleExportUsers = async () => {
    try {
      setSnackbar({ open: true, message: 'Exporting users...', severity: 'info' });

      // If your API supports export:
      // const response = await adminApi.exportUsers();
      // const blob = new Blob([response.data], { type: 'text/csv' });
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      // a.click();
      // window.URL.revokeObjectURL(url);

      // Fallback: client-side CSV export
      const headers = ['Name', 'Email', 'Plan', 'Status', 'Joined', 'CVs Created', 'Downloads'];
      const csvRows = [
        headers.join(','),
        ...users.map((u) =>
          [
            `"${u.name || ''}"`,
            `"${u.email || ''}"`,
            u.plan || '',
            u.status || '',
            u.joinedDate || u.createdAt || '',
            u.cvsCreated || 0,
            u.downloads || 0,
          ].join(',')
        ),
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      setSnackbar({ open: true, message: 'Users exported successfully!', severity: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      setSnackbar({ open: true, message: 'Failed to export users.', severity: 'error' });
    }
  };

  const handleRefresh = () => {
    fetchUsers(true);
  };

  // ─── Status Helpers ───
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'suspended':
        return '#f59e0b';
      case 'banned':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'active':
        return '#10b98115';
      case 'suspended':
        return '#f59e0b15';
      case 'banned':
        return '#ef444415';
      default:
        return '#94a3b815';
    }
  };

  const getPlanColor = (plan) => (plan === 'premium' ? '#667eea' : '#64748b');
  const getPlanBg = (plan) => (plan === 'premium' ? '#667eea15' : '#f1f5f9');

  // ─── Loading Skeleton ───
  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={280} height={40} />
          <Skeleton variant="text" width={350} height={24} />
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
            <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 2 }} />
          ))}
        </Box>

        <Skeleton variant="rounded" height={48} sx={{ mb: 3, borderRadius: 2 }} />
        <Skeleton variant="rounded" height={48} sx={{ mb: 3, borderRadius: 2 }} />

        <Box
          sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Skeleton variant="rectangular" height={48} />
          {[...Array(5)].map((_, i) => (
            <Box key={i} sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={38} height={38} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
                <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 2 }} />
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
            User Management
          </Typography>
          <Typography variant="body2" color="#64748b">
            Manage all registered users, their plans and access
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportUsers}
            sx={{
              textTransform: 'none',
              color: '#64748b',
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': { bgcolor: '#f8fafc' },
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

      {/* ─── Stats Cards ─── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(6, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
        {[
          { label: 'Total Users', value: totalUsers, icon: <PeopleIcon />, color: '#667eea' },
          { label: 'Premium', value: premiumUsers, icon: <WorkspacePremiumIcon />, color: '#8b5cf6' },
          { label: 'Free', value: freeUsers, icon: <PersonIcon />, color: '#64748b' },
          { label: 'Active', value: activeUsers, icon: <CheckCircleIcon />, color: '#10b981' },
          {
            label: 'Suspended',
            value: suspendedUsers,
            icon: <PersonOffIcon />,
            color: '#f59e0b',
          },
          { label: 'Banned', value: bannedUsers, icon: <BlockIcon />, color: '#ef4444' },
        ].map((stat, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: '#ffffff',
              p: 2,
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                '& .MuiSvgIcon-root': { fontSize: 20 },
              }}
            >
              {stat.icon}
            </Box>
            <Box>
              <Typography
                variant="h6"
                fontWeight="700"
                color="#1e293b"
                sx={{ lineHeight: 1.2 }}
              >
                {stat.value}
              </Typography>
              <Typography variant="caption" color="#94a3b8">
                {stat.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ─── Tabs ─── */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => {
          setActiveTab(v);
          setCurrentPage(1);
        }}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            minHeight: 40,
          },
          '& .Mui-selected': { color: '#667eea' },
          '& .MuiTabs-indicator': { backgroundColor: '#667eea' },
        }}
      >
        <Tab label={`All (${totalUsers})`} value="all" />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Premium ({premiumUsers})
              <WorkspacePremiumIcon sx={{ fontSize: 14, color: '#8b5cf6' }} />
            </Box>
          }
          value="premium"
        />
        <Tab label={`Free (${freeUsers})`} value="free" />
        <Tab
          label={
            <Badge
              badgeContent={suspendedUsers + bannedUsers}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem',
                  height: 16,
                  minWidth: 16,
                },
              }}
            >
              Suspended / Banned
            </Badge>
          }
          value="suspended"
        />
      </Tabs>

      {/* ─── Search & Sort ─── */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <TextField
          placeholder="Search by name or email..."
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          sx={{
            flex: 1,
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

        <Button
          size="small"
          startIcon={<SortIcon />}
          onClick={(e) => setSortAnchorEl(e.currentTarget)}
          sx={{
            textTransform: 'none',
            color: '#64748b',
            bgcolor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            px: 2,
            fontWeight: 600,
            '&:hover': { bgcolor: '#f8fafc' },
          }}
        >
          Sort
        </Button>

        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
        >
          {[
            { label: 'Newest First', value: 'newest' },
            { label: 'Oldest First', value: 'oldest' },
            { label: 'Name (A-Z)', value: 'name' },
            { label: 'Most CVs', value: 'cvs' },
            { label: 'Most Downloads', value: 'downloads' },
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

      {/* ─── Users Table ─── */}
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
            display: 'grid',
            gridTemplateColumns: {
              xs: '2fr 1fr 1fr auto',
              md: '2.5fr 1fr 1fr 1fr 1fr 1fr auto',
            },
            gap: 2,
            p: 2,
            bgcolor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="caption" fontWeight="700" color="#64748b">
            USER
          </Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b">
            PLAN
          </Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b">
            STATUS
          </Typography>
          <Typography
            variant="caption"
            fontWeight="700"
            color="#64748b"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            JOINED
          </Typography>
          <Typography
            variant="caption"
            fontWeight="700"
            color="#64748b"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            CVs
          </Typography>
          <Typography
            variant="caption"
            fontWeight="700"
            color="#64748b"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            DOWNLOADS
          </Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b" textAlign="right">
            ACTIONS
          </Typography>
        </Box>

        {/* Rows */}
        {paginatedUsers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PersonIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
            <Typography variant="body1" fontWeight="600" color="#94a3b8">
              No users found
            </Typography>
            <Typography variant="body2" color="#cbd5e1">
              Try a different search or filter
            </Typography>
          </Box>
        ) : (
          paginatedUsers.map((user, index) => (
            <Box
              key={user.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '2fr 1fr 1fr auto',
                  md: '2.5fr 1fr 1fr 1fr 1fr 1fr auto',
                },
                gap: 2,
                p: 2,
                alignItems: 'center',
                borderBottom:
                  index < paginatedUsers.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              {/* User */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: 0,
                  cursor: 'pointer',
                }}
                onClick={() => handleViewUser(user)}
              >
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: getPlanColor(user.plan),
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    opacity: user.status === 'banned' ? 0.5 : 1,
                  }}
                >
                  {(user.name || '?').charAt(0)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color={user.status === 'banned' ? '#94a3b8' : '#1e293b'}
                      noWrap
                      sx={{
                        textDecoration:
                          user.status === 'banned' ? 'line-through' : 'none',
                      }}
                    >
                      {user.name}
                    </Typography>
                    {user.plan === 'premium' && (
                      <WorkspacePremiumIcon sx={{ fontSize: 14, color: '#8b5cf6' }} />
                    )}
                  </Box>
                  <Typography variant="caption" color="#94a3b8" noWrap>
                    {user.email}
                  </Typography>
                </Box>
              </Box>

              {/* Plan */}
              <Chip
                label={user.plan === 'premium' ? 'Premium' : 'Free'}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  width: 'fit-content',
                  bgcolor: getPlanBg(user.plan),
                  color: getPlanColor(user.plan),
                }}
              />

              {/* Status */}
              <Chip
                label={
                  (user.status || 'unknown').charAt(0).toUpperCase() +
                  (user.status || 'unknown').slice(1)
                }
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  width: 'fit-content',
                  bgcolor: getStatusBg(user.status),
                  color: getStatusColor(user.status),
                }}
              />

              {/* Joined */}
              <Typography
                variant="body2"
                color="#94a3b8"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                {new Date(user.joinedDate || user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Typography>

              {/* CVs */}
              <Typography
                variant="body2"
                fontWeight="600"
                color="#1e293b"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                {user.cvsCreated || 0}
              </Typography>

              {/* Downloads */}
              <Typography
                variant="body2"
                fontWeight="600"
                color="#1e293b"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                {user.downloads || 0}
              </Typography>

              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                <Tooltip title="View Profile">
                  <IconButton size="small" onClick={() => handleViewUser(user)}>
                    <VisibilityIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                  <MoreVertIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                </IconButton>
              </Box>
            </Box>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderTop: '1px solid #e2e8f0',
              bgcolor: '#f8fafc',
            }}
          >
            <Typography variant="caption" color="#94a3b8">
              Showing {(currentPage - 1) * usersPerPage + 1}–
              {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{' '}
              {filteredUsers.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                // Show smart pagination for many pages
                let page;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (currentPage <= 4) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + i;
                } else {
                  page = currentPage - 3 + i;
                }
                return (
                  <Button
                    key={page}
                    size="small"
                    onClick={() => setCurrentPage(page)}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: 1,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      ...(currentPage === page
                        ? { bgcolor: '#667eea', color: '#ffffff' }
                        : { color: '#64748b' }),
                    }}
                  >
                    {page}
                  </Button>
                );
              })}
              <IconButton
                size="small"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>

      {/* ═══════════ CONTEXT MENU ═══════════ */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            minWidth: 200,
          },
        }}
      >
        <MenuItem onClick={() => handleViewUser(selectedUser)} sx={{ py: 1 }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" sx={{ color: '#667eea' }} />
          </ListItemIcon>
          <ListItemText
            primary="View Profile"
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </MenuItem>

        <MenuItem onClick={handleCopyEmail} sx={{ py: 1 }}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" sx={{ color: '#64748b' }} />
          </ListItemIcon>
          <ListItemText
            primary="Copy Email"
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        {selectedUser?.plan === 'free' ? (
          <MenuItem onClick={handleUpgrade} sx={{ py: 1 }}>
            <ListItemIcon>
              <ArrowUpwardIcon fontSize="small" sx={{ color: '#10b981' }} />
            </ListItemIcon>
            <ListItemText
              primary="Upgrade to Premium"
              primaryTypographyProps={{ fontSize: '0.9rem', color: '#10b981' }}
            />
          </MenuItem>
        ) : (
          <MenuItem onClick={handleDowngrade} sx={{ py: 1 }}>
            <ListItemIcon>
              <ArrowDownwardIcon fontSize="small" sx={{ color: '#f59e0b' }} />
            </ListItemIcon>
            <ListItemText
              primary="Downgrade to Free"
              primaryTypographyProps={{ fontSize: '0.9rem', color: '#f59e0b' }}
            />
          </MenuItem>
        )}

        <MenuItem onClick={handleSuspend} sx={{ py: 1 }} disabled={actionLoading}>
          <ListItemIcon>
            <PersonOffIcon fontSize="small" sx={{ color: '#f59e0b' }} />
          </ListItemIcon>
          <ListItemText
            primary={
              selectedUser?.status === 'suspended' ? 'Reactivate User' : 'Suspend User'
            }
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </MenuItem>

        <MenuItem onClick={handleBan} sx={{ py: 1 }}>
          <ListItemIcon>
            {selectedUser?.status === 'banned' ? (
              <LockOpenIcon fontSize="small" sx={{ color: '#10b981' }} />
            ) : (
              <BlockIcon fontSize="small" sx={{ color: '#ef4444' }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={selectedUser?.status === 'banned' ? 'Unban User' : 'Ban User'}
            primaryTypographyProps={{
              fontSize: '0.9rem',
              color: selectedUser?.status === 'banned' ? '#10b981' : '#ef4444',
            }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleDelete}
          sx={{ py: 1, '&:hover': { bgcolor: '#ef444410' } }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete User"
            primaryTypographyProps={{ fontSize: '0.9rem', color: '#ef4444' }}
          />
        </MenuItem>
      </Menu>

      {/* ═══════════ VIEW USER DIALOG ═══════════ */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedUser && (
          <>
            {/* Profile Header */}
            <Box
              sx={{
                background:
                  selectedUser.plan === 'premium'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                p: 3,
                color: '#ffffff',
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() => setViewDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: '#ffffff80',
                  '&:hover': { color: '#ffffff' },
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={selectedUser.avatar}
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {(selectedUser.name || '?').charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700">
                    {selectedUser.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {selectedUser.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={selectedUser.plan === 'premium' ? '⭐ Premium' : 'Free'}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                    />
                    <Chip
                      label={selectedUser.status}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              {/* User Stats */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gap: 2,
                  mb: 3,
                }}
              >
                {[
                  {
                    label: 'CVs',
                    value: selectedUser.cvsCreated || 0,
                    icon: <DescriptionIcon sx={{ fontSize: 16 }} />,
                    color: '#667eea',
                  },
                  {
                    label: 'Letters',
                    value: selectedUser.lettersCreated || 0,
                    icon: <MailOutlineIcon sx={{ fontSize: 16 }} />,
                    color: '#8b5cf6',
                  },
                  {
                    label: 'Downloads',
                    value: selectedUser.downloads || 0,
                    icon: <DownloadIcon sx={{ fontSize: 16 }} />,
                    color: '#10b981',
                  },
                  {
                    label: 'Templates',
                    value: selectedUser.templatesUsed || 0,
                    icon: <DescriptionIcon sx={{ fontSize: 16 }} />,
                    color: '#f59e0b',
                  },
                ].map((stat, i) => (
                  <Box
                    key={i}
                    sx={{
                      textAlign: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${stat.color}08`,
                      border: `1px solid ${stat.color}20`,
                    }}
                  >
                    <Box sx={{ color: stat.color, mb: 0.5 }}>{stat.icon}</Box>
                    <Typography variant="h6" fontWeight="700" color="#1e293b">
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Details */}
              <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 1.5 }}>
                Account Details
              </Typography>
              {[
                {
                  label: 'Joined',
                  value: new Date(
                    selectedUser.joinedDate || selectedUser.createdAt
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }),
                },
                { label: 'Last Active', value: selectedUser.lastActive || 'N/A' },
                { label: 'Payment Method', value: selectedUser.paymentMethod || 'None' },
                { label: 'Total Spent', value: selectedUser.totalSpent || '$0.00' },
              ].map((detail, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1.2,
                    borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
                  }}
                >
                  <Typography variant="body2" color="#64748b">
                    {detail.label}
                  </Typography>
                  <Typography variant="body2" fontWeight="600" color="#1e293b">
                    {detail.value}
                  </Typography>
                </Box>
              ))}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              {selectedUser.plan === 'free' ? (
                <Button
                  size="small"
                  startIcon={<ArrowUpwardIcon />}
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleUpgrade();
                  }}
                  sx={{ textTransform: 'none', color: '#10b981', fontWeight: 600 }}
                >
                  Upgrade
                </Button>
              ) : (
                <Button
                  size="small"
                  startIcon={<ArrowDownwardIcon />}
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleDowngrade();
                  }}
                  sx={{ textTransform: 'none', color: '#f59e0b', fontWeight: 600 }}
                >
                  Downgrade
                </Button>
              )}
              <Button
                size="small"
                startIcon={<BlockIcon />}
                onClick={() => {
                  setViewDialogOpen(false);
                  handleBan();
                }}
                sx={{ textTransform: 'none', color: '#ef4444', fontWeight: 600 }}
              >
                {selectedUser.status === 'banned' ? 'Unban' : 'Ban'}
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button
                onClick={() => setViewDialogOpen(false)}
                sx={{ textTransform: 'none', color: '#64748b' }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ═══════════ UPGRADE DIALOG ═══════════ */}
      <Dialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Upgrade User to Premium</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Manually upgrade <strong>{selectedUser?.name}</strong> ({selectedUser?.email}) to
            Premium plan?
          </Typography>
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            This will give the user full premium access immediately.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setUpgradeDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#64748b' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpgradeConfirm}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : null}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
            }}
          >
            {actionLoading ? 'Upgrading...' : 'Upgrade to Premium'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════ DOWNGRADE DIALOG ═══════════ */}
      <Dialog
        open={downgradeDialogOpen}
        onClose={() => setDowngradeDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Downgrade User to Free</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Downgrade <strong>{selectedUser?.name}</strong> to the Free plan?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
            This will remove all premium features immediately. The user will be limited to 3
            CVs, PDF only, and watermarked exports.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDowngradeDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#64748b' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleDowngradeConfirm}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : null}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {actionLoading ? 'Downgrading...' : 'Downgrade'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════ BAN DIALOG ═══════════ */}
      <Dialog
        open={banDialogOpen}
        onClose={() => setBanDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: selectedUser?.status === 'banned' ? '#10b981' : '#ef4444',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedUser?.status === 'banned' ? <LockOpenIcon /> : <WarningAmberIcon />}
            {selectedUser?.status === 'banned' ? 'Unban User' : 'Ban User'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            {selectedUser?.status === 'banned'
              ? `Unban ${selectedUser?.name}? They will regain access to their account.`
              : `Ban ${selectedUser?.name}? They will lose all access to their account immediately.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setBanDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#64748b' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBanConfirm}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : null}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: selectedUser?.status === 'banned' ? '#10b981' : '#ef4444',
              '&:hover': {
                bgcolor: selectedUser?.status === 'banned' ? '#059669' : '#dc2626',
              },
            }}
          >
            {actionLoading
              ? 'Processing...'
              : selectedUser?.status === 'banned'
                ? 'Unban'
                : 'Ban'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════ DELETE DIALOG ═══════════ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteConfirmText('');
        }}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon />
            Delete User Permanently
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            This will permanently delete <strong>{selectedUser?.name}</strong> and all their
            data including:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {[
              'All CVs and motivation letters',
              'Download history',
              'Account data',
              'Subscription (if any)',
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                <DeleteIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                <Typography variant="body2" color="#64748b">
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography variant="body2" color="#64748b" sx={{ mb: 1 }}>
            Type <strong>DELETE</strong> to confirm:
          </Typography>
          <TextField
            fullWidth
            size="small"
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
            sx={{ textTransform: 'none', color: '#64748b' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleteConfirmText !== 'DELETE' || actionLoading}
            onClick={handleDeleteConfirm}
            startIcon={actionLoading ? <CircularProgress size={16} /> : null}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {actionLoading ? 'Deleting...' : 'Delete Permanently'}
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