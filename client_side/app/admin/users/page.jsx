'use client';

import { useState } from 'react';
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

export default function UsersPage() {
  // ─── State ───
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

  // ─── Mock Users Data ───
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: null,
      plan: 'premium',
      status: 'active',
      joinedDate: '2025-01-15',
      lastActive: '2 hours ago',
      cvsCreated: 5,
      lettersCreated: 3,
      downloads: 12,
      templatesUsed: 3,
      paymentMethod: 'Visa ••4242',
      totalSpent: '$59.94',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: null,
      plan: 'premium',
      status: 'active',
      joinedDate: '2025-02-20',
      lastActive: '5 minutes ago',
      cvsCreated: 8,
      lettersCreated: 5,
      downloads: 24,
      templatesUsed: 6,
      paymentMethod: 'Mastercard ••8888',
      totalSpent: '$39.96',
    },
    {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatar: null,
      plan: 'free',
      status: 'active',
      joinedDate: '2025-03-10',
      lastActive: '1 day ago',
      cvsCreated: 2,
      lettersCreated: 1,
      downloads: 3,
      templatesUsed: 1,
      paymentMethod: null,
      totalSpent: '$0',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      avatar: null,
      plan: 'free',
      status: 'active',
      joinedDate: '2025-04-05',
      lastActive: '3 days ago',
      cvsCreated: 3,
      lettersCreated: 2,
      downloads: 5,
      templatesUsed: 2,
      paymentMethod: null,
      totalSpent: '$0',
    },
    {
      id: 5,
      name: 'Mike Brown',
      email: 'mike@example.com',
      avatar: null,
      plan: 'premium',
      status: 'suspended',
      joinedDate: '2025-01-28',
      lastActive: '1 week ago',
      cvsCreated: 4,
      lettersCreated: 2,
      downloads: 8,
      templatesUsed: 4,
      paymentMethod: 'Visa ••1234',
      totalSpent: '$49.95',
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily@example.com',
      avatar: null,
      plan: 'free',
      status: 'active',
      joinedDate: '2025-05-12',
      lastActive: '6 hours ago',
      cvsCreated: 1,
      lettersCreated: 0,
      downloads: 1,
      templatesUsed: 1,
      paymentMethod: null,
      totalSpent: '$0',
    },
    {
      id: 7,
      name: 'Robert Chen',
      email: 'robert@example.com',
      avatar: null,
      plan: 'premium',
      status: 'active',
      joinedDate: '2025-02-14',
      lastActive: '30 minutes ago',
      cvsCreated: 12,
      lettersCreated: 8,
      downloads: 35,
      templatesUsed: 6,
      paymentMethod: 'PayPal',
      totalSpent: '$99.90',
    },
    {
      id: 8,
      name: 'Lisa Park',
      email: 'lisa@example.com',
      avatar: null,
      plan: 'free',
      status: 'banned',
      joinedDate: '2025-03-22',
      lastActive: '2 weeks ago',
      cvsCreated: 1,
      lettersCreated: 0,
      downloads: 0,
      templatesUsed: 1,
      paymentMethod: null,
      totalSpent: '$0',
    },
    {
      id: 9,
      name: 'David Kim',
      email: 'david@example.com',
      avatar: null,
      plan: 'free',
      status: 'active',
      joinedDate: '2025-06-01',
      lastActive: '10 minutes ago',
      cvsCreated: 2,
      lettersCreated: 1,
      downloads: 2,
      templatesUsed: 2,
      paymentMethod: null,
      totalSpent: '$0',
    },
    {
      id: 10,
      name: 'Amanda Foster',
      email: 'amanda@example.com',
      avatar: null,
      plan: 'premium',
      status: 'active',
      joinedDate: '2025-04-18',
      lastActive: '1 hour ago',
      cvsCreated: 6,
      lettersCreated: 4,
      downloads: 18,
      templatesUsed: 5,
      paymentMethod: 'Visa ••5678',
      totalSpent: '$29.97',
    },
    {
      id: 11,
      name: 'Chris Taylor',
      email: 'chris@example.com',
      avatar: null,
      plan: 'free',
      status: 'active',
      joinedDate: '2025-06-10',
      lastActive: '4 hours ago',
      cvsCreated: 1,
      lettersCreated: 1,
      downloads: 1,
      templatesUsed: 1,
      paymentMethod: null,
      totalSpent: '$0',
    },
    {
      id: 12,
      name: 'Rachel Green',
      email: 'rachel@example.com',
      avatar: null,
      plan: 'premium',
      status: 'active',
      joinedDate: '2025-03-05',
      lastActive: '20 minutes ago',
      cvsCreated: 9,
      lettersCreated: 6,
      downloads: 28,
      templatesUsed: 5,
      paymentMethod: 'Mastercard ••3456',
      totalSpent: '$69.93',
    },
  ]);

  // ─── Computed ───
  const totalUsers = users.length;
  const premiumUsers = users.filter((u) => u.plan === 'premium').length;
  const freeUsers = users.filter((u) => u.plan === 'free').length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const suspendedUsers = users.filter((u) => u.status === 'suspended').length;
  const bannedUsers = users.filter((u) => u.status === 'banned').length;

  // ─── Filter & Search ───
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'premium') return matchesSearch && user.plan === 'premium';
    if (activeTab === 'free') return matchesSearch && user.plan === 'free';
    if (activeTab === 'suspended') return matchesSearch && (user.status === 'suspended' || user.status === 'banned');
    return matchesSearch;
  });

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

  const handleUpgradeConfirm = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, plan: 'premium' } : u
      )
    );
    setUpgradeDialogOpen(false);
    setSnackbar({ open: true, message: `${selectedUser.name} upgraded to Premium!`, severity: 'success' });
  };

  const handleDowngrade = () => {
    setDowngradeDialogOpen(true);
    handleMenuClose();
  };

  const handleDowngradeConfirm = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, plan: 'free' } : u
      )
    );
    setDowngradeDialogOpen(false);
    setSnackbar({ open: true, message: `${selectedUser.name} downgraded to Free.`, severity: 'info' });
  };

  const handleBan = () => {
    setBanDialogOpen(true);
    handleMenuClose();
  };

  const handleBanConfirm = () => {
    const newStatus = selectedUser.status === 'banned' ? 'active' : 'banned';
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, status: newStatus } : u
      )
    );
    setBanDialogOpen(false);
    setSnackbar({
      open: true,
      message: newStatus === 'banned'
        ? `${selectedUser.name} has been banned.`
        : `${selectedUser.name} has been unbanned.`,
      severity: newStatus === 'banned' ? 'warning' : 'success',
    });
  };

  const handleSuspend = () => {
    const newStatus = selectedUser.status === 'suspended' ? 'active' : 'suspended';
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id ? { ...u, status: newStatus } : u
      )
    );
    handleMenuClose();
    setSnackbar({
      open: true,
      message: newStatus === 'suspended'
        ? `${selectedUser.name} has been suspended.`
        : `${selectedUser.name} has been reactivated.`,
      severity: 'info',
    });
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setDeleteDialogOpen(false);
    setDeleteConfirmText('');
    setSnackbar({ open: true, message: `${selectedUser.name} has been deleted.`, severity: 'error' });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(selectedUser.email);
    handleMenuClose();
    setSnackbar({ open: true, message: 'Email copied to clipboard!', severity: 'success' });
  };

  const handleExportUsers = () => {
    setSnackbar({ open: true, message: 'Exporting users...', severity: 'info' });
  };

  // ─── Status Helpers ───
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'suspended': return '#f59e0b';
      case 'banned': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'active': return '#10b98115';
      case 'suspended': return '#f59e0b15';
      case 'banned': return '#ef444415';
      default: return '#94a3b815';
    }
  };

  const getPlanColor = (plan) => plan === 'premium' ? '#667eea' : '#64748b';
  const getPlanBg = (plan) => plan === 'premium' ? '#667eea15' : '#f1f5f9';

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
          { label: 'Suspended', value: suspendedUsers, icon: <PersonOffIcon />, color: '#f59e0b' },
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
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
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
              <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ lineHeight: 1.2 }}>
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
        onChange={(e, v) => { setActiveTab(v); setCurrentPage(1); }}
        sx={{
          mb: 3,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 40 },
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
            <Badge badgeContent={suspendedUsers + bannedUsers} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>
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
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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
              onClick={() => { setSortBy(opt.value); setSortAnchorEl(null); }}
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
            gridTemplateColumns: { xs: '2fr 1fr 1fr auto', md: '2.5fr 1fr 1fr 1fr 1fr 1fr auto' },
            gap: 2,
            p: 2,
            bgcolor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="caption" fontWeight="700" color="#64748b">USER</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b">PLAN</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b">STATUS</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>JOINED</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>CVs</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>DOWNLOADS</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b" textAlign="right">ACTIONS</Typography>
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
                gridTemplateColumns: { xs: '2fr 1fr 1fr auto', md: '2.5fr 1fr 1fr 1fr 1fr 1fr auto' },
                gap: 2,
                p: 2,
                alignItems: 'center',
                borderBottom: index < paginatedUsers.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              {/* User */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, cursor: 'pointer' }}
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
                  {user.name.charAt(0)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      color={user.status === 'banned' ? '#94a3b8' : '#1e293b'}
                      noWrap
                      sx={{ textDecoration: user.status === 'banned' ? 'line-through' : 'none' }}
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
                label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Typography>

              {/* CVs */}
              <Typography
                variant="body2"
                fontWeight="600"
                color="#1e293b"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                {user.cvsCreated}
              </Typography>

              {/* Downloads */}
              <Typography
                variant="body2"
                fontWeight="600"
                color="#1e293b"
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                {user.downloads}
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
              {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}
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
        PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 200 } }}
      >
        <MenuItem onClick={() => handleViewUser()} sx={{ py: 1 }}>
          <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: '#667eea' }} /></ListItemIcon>
          <ListItemText primary="View Profile" primaryTypographyProps={{ fontSize: '0.9rem' }} />
        </MenuItem>

        <MenuItem onClick={handleCopyEmail} sx={{ py: 1 }}>
          <ListItemIcon><ContentCopyIcon fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon>
          <ListItemText primary="Copy Email" primaryTypographyProps={{ fontSize: '0.9rem' }} />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        {selectedUser?.plan === 'free' ? (
          <MenuItem onClick={handleUpgrade} sx={{ py: 1 }}>
            <ListItemIcon><ArrowUpwardIcon fontSize="small" sx={{ color: '#10b981' }} /></ListItemIcon>
            <ListItemText primary="Upgrade to Premium" primaryTypographyProps={{ fontSize: '0.9rem', color: '#10b981' }} />
          </MenuItem>
        ) : (
          <MenuItem onClick={handleDowngrade} sx={{ py: 1 }}>
            <ListItemIcon><ArrowDownwardIcon fontSize="small" sx={{ color: '#f59e0b' }} /></ListItemIcon>
            <ListItemText primary="Downgrade to Free" primaryTypographyProps={{ fontSize: '0.9rem', color: '#f59e0b' }} />
          </MenuItem>
        )}

        <MenuItem onClick={handleSuspend} sx={{ py: 1 }}>
          <ListItemIcon><PersonOffIcon fontSize="small" sx={{ color: '#f59e0b' }} /></ListItemIcon>
          <ListItemText
            primary={selectedUser?.status === 'suspended' ? 'Reactivate User' : 'Suspend User'}
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </MenuItem>

        <MenuItem onClick={handleBan} sx={{ py: 1 }}>
          <ListItemIcon>
            {selectedUser?.status === 'banned'
              ? <LockOpenIcon fontSize="small" sx={{ color: '#10b981' }} />
              : <BlockIcon fontSize="small" sx={{ color: '#ef4444' }} />}
          </ListItemIcon>
          <ListItemText
            primary={selectedUser?.status === 'banned' ? 'Unban User' : 'Ban User'}
            primaryTypographyProps={{ fontSize: '0.9rem', color: selectedUser?.status === 'banned' ? '#10b981' : '#ef4444' }}
          />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleDelete} sx={{ py: 1, '&:hover': { bgcolor: '#ef444410' } }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
          <ListItemText primary="Delete User" primaryTypographyProps={{ fontSize: '0.9rem', color: '#ef4444' }} />
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
                background: selectedUser.plan === 'premium'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                p: 3,
                color: '#ffffff',
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() => setViewDialogOpen(false)}
                sx={{ position: 'absolute', top: 8, right: 8, color: '#ffffff80', '&:hover': { color: '#ffffff' } }}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {selectedUser.name.charAt(0)}
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
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                    />
                    <Chip
                      label={selectedUser.status}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 600, fontSize: '0.7rem', height: 22 }}
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
                  { label: 'CVs', value: selectedUser.cvsCreated, icon: <DescriptionIcon sx={{ fontSize: 16 }} />, color: '#667eea' },
                  { label: 'Letters', value: selectedUser.lettersCreated, icon: <MailOutlineIcon sx={{ fontSize: 16 }} />, color: '#8b5cf6' },
                  { label: 'Downloads', value: selectedUser.downloads, icon: <DownloadIcon sx={{ fontSize: 16 }} />, color: '#10b981' },
                  { label: 'Templates', value: selectedUser.templatesUsed, icon: <DescriptionIcon sx={{ fontSize: 16 }} />, color: '#f59e0b' },
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
                    <Typography variant="h6" fontWeight="700" color="#1e293b">{stat.value}</Typography>
                    <Typography variant="caption" color="#94a3b8">{stat.label}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Details */}
              <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 1.5 }}>
                Account Details
              </Typography>
              {[
                { label: 'Joined', value: new Date(selectedUser.joinedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                { label: 'Last Active', value: selectedUser.lastActive },
                { label: 'Payment Method', value: selectedUser.paymentMethod || 'None' },
                { label: 'Total Spent', value: selectedUser.totalSpent },
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
                  <Typography variant="body2" color="#64748b">{detail.label}</Typography>
                  <Typography variant="body2" fontWeight="600" color="#1e293b">{detail.value}</Typography>
                </Box>
              ))}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              {selectedUser.plan === 'free' ? (
                <Button
                  size="small"
                  startIcon={<ArrowUpwardIcon />}
                  onClick={() => { setViewDialogOpen(false); handleUpgrade(); }}
                  sx={{ textTransform: 'none', color: '#10b981', fontWeight: 600 }}
                >
                  Upgrade
                </Button>
              ) : (
                <Button
                  size="small"
                  startIcon={<ArrowDownwardIcon />}
                  onClick={() => { setViewDialogOpen(false); handleDowngrade(); }}
                  sx={{ textTransform: 'none', color: '#f59e0b', fontWeight: 600 }}
                >
                  Downgrade
                </Button>
              )}
              <Button
                size="small"
                startIcon={<BlockIcon />}
                onClick={() => { setViewDialogOpen(false); handleBan(); }}
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
      <Dialog open={upgradeDialogOpen} onClose={() => setUpgradeDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Upgrade User to Premium</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Manually upgrade <strong>{selectedUser?.name}</strong> ({selectedUser?.email}) to Premium plan?
          </Typography>
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            This will give the user full premium access immediately.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setUpgradeDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleUpgradeConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
            Upgrade to Premium
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════ DOWNGRADE DIALOG ═══════════ */}
      <Dialog open={downgradeDialogOpen} onClose={() => setDowngradeDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Downgrade User to Free</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Downgrade <strong>{selectedUser?.name}</strong> to the Free plan?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
            This will remove all premium features immediately. The user will be limited to 3 CVs, PDF only, and watermarked exports.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDowngradeDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleDowngradeConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Downgrade
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════ BAN DIALOG ═══════════ */}
      <Dialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: selectedUser?.status === 'banned' ? '#10b981' : '#ef4444' }}>
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
          <Button onClick={() => setBanDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleBanConfirm}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: selectedUser?.status === 'banned' ? '#10b981' : '#ef4444',
              '&:hover': { bgcolor: selectedUser?.status === 'banned' ? '#059669' : '#dc2626' },
            }}
          >
            {selectedUser?.status === 'banned' ? 'Unban' : 'Ban'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════ DELETE DIALOG ═══════════ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon />
            Delete User Permanently
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            This will permanently delete <strong>{selectedUser?.name}</strong> and all their data including:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {['All CVs and motivation letters', 'Download history', 'Account data', 'Subscription (if any)'].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                <DeleteIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                <Typography variant="body2" color="#64748b">{item}</Typography>
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&.Mui-focused fieldset': { borderColor: '#ef4444' } } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setDeleteDialogOpen(false); setDeleteConfirmText(''); }} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleteConfirmText !== 'DELETE'}
            onClick={handleDeleteConfirm}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Delete Permanently
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