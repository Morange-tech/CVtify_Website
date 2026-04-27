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
  Skeleton,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ImageIcon from '@mui/icons-material/Image';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { adminApi } from '../../services/api';

// ─── Helpers ───
const parseAmount = (amount) => {
  if (typeof amount === 'number') return amount;
  if (typeof amount === 'string') {
    const cleaned = amount.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
};

const formatAmount = (amount) => {
  const num = parseAmount(amount);
  return `$${num.toFixed(2)}`;
};

const getTimeAgo = (dateStr) => {
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

export default function PaymentsPage() {
  // ─── State ───
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [proofZoom, setProofZoom] = useState(100);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── Fetch Payments ───
  const fetchPayments = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let response;
      if (typeof adminApi.getPayments === 'function') {
        response = await adminApi.getPayments();
      } else if (typeof adminApi.getPremiumRequests === 'function') {
        response = await adminApi.getPremiumRequests();
      } else if (typeof adminApi.getSubscriptions === 'function') {
        response = await adminApi.getSubscriptions();
      } else {
        console.warn(
          'No payments API method found. Available adminApi methods:',
          Object.keys(adminApi).filter((k) => typeof adminApi[k] === 'function')
        );
        response = { data: [] };
      }

      const extractArray = (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.results)) return res.data.results;
        if (Array.isArray(res?.data?.payments)) return res.data.payments;
        if (Array.isArray(res?.data?.requests)) return res.data.requests;
        if (Array.isArray(res?.data?.subscriptions)) return res.data.subscriptions;
        if (Array.isArray(res?.payments)) return res.payments;
        if (Array.isArray(res?.requests)) return res.requests;
        return [];
      };

      setPayments(extractArray(response));
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load payments. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // ─── Computed ───
  const totalPayments = payments.length;
  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const approvedPayments = payments.filter((p) => p.status === 'approved');
  const rejectedPayments = payments.filter((p) => p.status === 'rejected');
  const totalRevenue = approvedPayments.reduce(
    (acc, p) => acc + parseAmount(p.amount),
    0
  );
  const pendingAmount = pendingPayments.reduce(
    (acc, p) => acc + parseAmount(p.amount),
    0
  );

  // ─── Filter & Sort ───
  const filteredPayments = useMemo(() => {
    let result = payments.filter((p) => {
      const userName = p.user?.name || p.userName || '';
      const userEmail = p.user?.email || p.userEmail || '';
      const reference = p.reference || p.transactionRef || '';

      const matchesSearch =
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reference.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'all') return matchesSearch;
      return matchesSearch && p.status === activeTab;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.requestedAt || a.createdAt) - new Date(b.requestedAt || b.createdAt);
        case 'amount-desc':
          return parseAmount(b.amount) - parseAmount(a.amount);
        case 'name':
          return (a.user?.name || a.userName || '').localeCompare(b.user?.name || b.userName || '');
        case 'newest':
        default:
          return new Date(b.requestedAt || b.createdAt) - new Date(a.requestedAt || a.createdAt);
      }
    });

    return result;
  }, [payments, searchQuery, activeTab, sortBy]);

  // ─── Pagination ───
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ─── Safe Accessors ───
  const getUserName = (payment) => payment?.user?.name || payment?.userName || 'Unknown';
  const getUserEmail = (payment) => payment?.user?.email || payment?.userEmail || '';
  const getUserInitial = (payment) => getUserName(payment).charAt(0) || '?';
  const getReference = (payment) => payment?.reference || payment?.transactionRef || 'N/A';
  const getPlan = (payment) => payment?.plan || payment?.planName || 'Premium';
  const getPaymentMethod = (payment) => payment?.paymentMethod || payment?.method || 'N/A';
  const getProofImage = (payment) => payment?.proofImage || payment?.screenshot || null;
  const getRequestedAt = (payment) => payment?.requestedAt || payment?.createdAt || null;
  const getTimeAgoStr = (payment) => payment?.timeAgo || getTimeAgo(getRequestedAt(payment));
  const getAmountDisplay = (payment) => {
    if (typeof payment?.amount === 'string' && payment.amount.includes('$')) return payment.amount;
    return formatAmount(payment?.amount);
  };

  // ─── Status Helpers ───
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getStatusBg = (status) => `${getStatusColor(status)}15`;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <PendingIcon sx={{ fontSize: 16 }} />;
      case 'approved': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'rejected': return <CancelIcon sx={{ fontSize: 16 }} />;
      default: return null;
    }
  };

  // ─── Menu Handlers ───
  const handleMenuOpen = (event, payment) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment || selectedPayment);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleViewProof = (payment) => {
    setSelectedPayment(payment || selectedPayment);
    setProofZoom(100);
    setProofDialogOpen(true);
    handleMenuClose();
  };

  const handleApproveOpen = (payment) => {
    setSelectedPayment(payment || selectedPayment);
    setAdminNote('');
    setApproveDialogOpen(true);
    handleMenuClose();
  };

  const handleApproveConfirm = async () => {
    if (!selectedPayment) return;
    setActionLoading(true);
    try {
      if (typeof adminApi.approvePayment === 'function') {
        await adminApi.approvePayment(selectedPayment.id, { adminNote });
      } else if (typeof adminApi.approvePremiumRequest === 'function') {
        await adminApi.approvePremiumRequest(selectedPayment.id, { adminNote });
      } else if (typeof adminApi.updatePayment === 'function') {
        await adminApi.updatePayment(selectedPayment.id, { status: 'approved', adminNote });
      } else if (typeof adminApi.updateSubscription === 'function') {
        await adminApi.updateSubscription(selectedPayment.id, { status: 'approved', adminNote });
      } else {
        console.warn('No approve API method found');
      }

      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPayment.id
            ? {
                ...p,
                status: 'approved',
                processedAt: new Date().toISOString(),
                processedBy: 'Admin',
                adminNote: adminNote,
              }
            : p
        )
      );
      setApproveDialogOpen(false);
      setSnackbar({
        open: true,
        message: `Payment approved! ${getUserName(selectedPayment)} is now Premium.`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Approve failed:', error);
      setSnackbar({
        open: true,
        message: `Failed to approve payment. ${error?.response?.data?.message || 'Please try again.'}`,
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectOpen = (payment) => {
    setSelectedPayment(payment || selectedPayment);
    setRejectReason('');
    setRejectDialogOpen(true);
    handleMenuClose();
  };

  const handleRejectConfirm = async () => {
    if (!selectedPayment) return;
    setActionLoading(true);
    try {
      if (typeof adminApi.rejectPayment === 'function') {
        await adminApi.rejectPayment(selectedPayment.id, { adminNote: rejectReason });
      } else if (typeof adminApi.rejectPremiumRequest === 'function') {
        await adminApi.rejectPremiumRequest(selectedPayment.id, { adminNote: rejectReason });
      } else if (typeof adminApi.updatePayment === 'function') {
        await adminApi.updatePayment(selectedPayment.id, { status: 'rejected', adminNote: rejectReason });
      } else if (typeof adminApi.updateSubscription === 'function') {
        await adminApi.updateSubscription(selectedPayment.id, { status: 'rejected', adminNote: rejectReason });
      } else {
        console.warn('No reject API method found');
      }

      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPayment.id
            ? {
                ...p,
                status: 'rejected',
                processedAt: new Date().toISOString(),
                processedBy: 'Admin',
                adminNote: rejectReason,
              }
            : p
        )
      );
      setRejectDialogOpen(false);
      setSnackbar({
        open: true,
        message: `Payment from ${getUserName(selectedPayment)} rejected.`,
        severity: 'warning',
      });
    } catch (error) {
      console.error('Reject failed:', error);
      setSnackbar({
        open: true,
        message: `Failed to reject payment. ${error?.response?.data?.message || 'Please try again.'}`,
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyReference = (ref) => {
    if (!ref) return;
    navigator.clipboard.writeText(ref);
    handleMenuClose();
    setSnackbar({ open: true, message: 'Reference copied!', severity: 'success' });
  };

  const handleRefresh = () => {
    fetchPayments(true);
  };

  const handleExport = async () => {
    try {
      setSnackbar({ open: true, message: 'Exporting payments...', severity: 'info' });

      const headers = [
        'ID', 'User', 'Email', 'Amount', 'Plan', 'Payment Method',
        'Reference', 'Status', 'Requested At', 'Processed At', 'Processed By', 'Admin Note',
      ];

      const csvRows = [
        headers.join(','),
        ...payments.map((p) =>
          [
            `"${p.id || ''}"`,
            `"${getUserName(p)}"`,
            `"${getUserEmail(p)}"`,
            `"${getAmountDisplay(p)}"`,
            `"${getPlan(p)}"`,
            `"${getPaymentMethod(p)}"`,
            `"${getReference(p)}"`,
            `"${p.status || ''}"`,
            `"${getRequestedAt(p) || ''}"`,
            `"${p.processedAt || ''}"`,
            `"${p.processedBy || ''}"`,
            `"${(p.adminNote || '').replace(/"/g, '""')}"`,
          ].join(',')
        ),
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      setSnackbar({ open: true, message: 'Payments exported successfully!', severity: 'success' });
    } catch (error) {
      console.error('Export failed:', error);
      setSnackbar({ open: true, message: 'Failed to export payments.', severity: 'error' });
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
            gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr' },
            gap: 2,
            mb: 4,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={85} sx={{ borderRadius: 3 }} />
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
                  <Skeleton variant="text" width="55%" height={20} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
                <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width={70} height={26} sx={{ borderRadius: 2 }} />
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
            💳 Payment Management
          </Typography>
          <Typography variant="body2" color="#64748b">
            Review and manage premium upgrade payment requests
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
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
          gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr' },
          gap: 2,
          mb: 4,
        }}
      >
        {[
          { label: 'Total Requests', value: totalPayments, icon: <ReceiptIcon />, color: '#667eea' },
          {
            label: 'Pending',
            value: pendingPayments.length,
            icon: <PendingIcon />,
            color: '#f59e0b',
            urgent: pendingPayments.length > 0,
          },
          { label: 'Approved', value: approvedPayments.length, icon: <CheckCircleIcon />, color: '#10b981' },
          { label: 'Rejected', value: rejectedPayments.length, icon: <CancelIcon />, color: '#ef4444' },
          { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <AttachMoneyIcon />, color: '#8b5cf6' },
        ].map((stat, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: '#ffffff',
              p: 2.5,
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: stat.urgent ? '1px solid #f59e0b30' : '1px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                position: 'relative',
              }}
            >
              {stat.icon}
              {stat.urgent && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#ef4444',
                    border: '2px solid #ffffff',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
                      '70%': { boxShadow: '0 0 0 6px rgba(239,68,68,0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
                    },
                  }}
                />
              )}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ lineHeight: 1.2 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" color="#94a3b8">{stat.label}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ─── Pending Alert ─── */}
      {pendingPayments.length > 0 && (
        <Alert
          severity="warning"
          icon={<PendingIcon />}
          sx={{ mb: 3, borderRadius: 2, fontWeight: 500 }}
        >
          <strong>{pendingPayments.length} payment{pendingPayments.length > 1 ? 's' : ''}</strong>{' '}
          pending review (${pendingAmount.toFixed(2)} total). Please review and approve or reject.
        </Alert>
      )}

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
        <Tab label={`All (${totalPayments})`} value="all" />
        <Tab
          value="pending"
          label={
            <Badge
              badgeContent={pendingPayments.length}
              color="warning"
              sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}
            >
              <Box sx={{ pr: 1 }}>Pending</Box>
            </Badge>
          }
        />
        <Tab label={`Approved (${approvedPayments.length})`} value="approved" />
        <Tab label={`Rejected (${rejectedPayments.length})`} value="rejected" />
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
          placeholder="Search by name, email, or reference..."
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
            { label: 'Highest Amount', value: 'amount-desc' },
            { label: 'User Name (A-Z)', value: 'name' },
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

      {/* ─── Payments Table ─── */}
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
            gridTemplateColumns: { xs: '2fr 1fr 1fr auto', md: '2fr 1fr 1fr 1fr 1fr 1fr auto' },
            gap: 2,
            p: 2,
            bgcolor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="caption" fontWeight="700" color="#64748b">USER</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b">AMOUNT</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b">STATUS</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>METHOD</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>PROOF</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>DATE</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b" textAlign="right">ACTIONS</Typography>
        </Box>

        {/* Empty State */}
        {paginatedPayments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PaymentIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
            <Typography variant="body1" fontWeight="600" color="#94a3b8">
              No payments found
            </Typography>
            <Typography variant="body2" color="#cbd5e1">
              Try a different search or filter
            </Typography>
          </Box>
        ) : (
          paginatedPayments.map((payment, index) => (
            <Box
              key={payment.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '2fr 1fr 1fr auto', md: '2fr 1fr 1fr 1fr 1fr 1fr auto' },
                gap: 2,
                p: 2,
                alignItems: 'center',
                borderBottom: index < paginatedPayments.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'all 0.2s ease',
                bgcolor: payment.status === 'pending' ? '#fffbeb' : 'transparent',
                '&:hover': { bgcolor: payment.status === 'pending' ? '#fef3c7' : '#f8fafc' },
              }}
            >
              {/* User */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, cursor: 'pointer' }}
                onClick={() => handleViewPayment(payment)}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: getStatusColor(payment.status),
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {getUserInitial(payment)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
                    {getUserName(payment)}
                  </Typography>
                  <Typography variant="caption" color="#94a3b8" noWrap>
                    {getPlan(payment)} Plan • {getReference(payment)}
                  </Typography>
                </Box>
              </Box>

              {/* Amount */}
              <Typography variant="body2" fontWeight="700" color="#1e293b">
                {getAmountDisplay(payment)}
              </Typography>

              {/* Status */}
              <Chip
                icon={getStatusIcon(payment.status)}
                label={(payment.status || 'unknown').charAt(0).toUpperCase() + (payment.status || 'unknown').slice(1)}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 26,
                  width: 'fit-content',
                  bgcolor: getStatusBg(payment.status),
                  color: getStatusColor(payment.status),
                  '& .MuiChip-icon': { color: getStatusColor(payment.status) },
                }}
              />

              {/* Method */}
              <Typography variant="body2" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>
                {getPaymentMethod(payment)}
              </Typography>

              {/* Proof */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {getProofImage(payment) ? (
                  <Tooltip title="View Proof">
                    <IconButton
                      size="small"
                      onClick={() => handleViewProof(payment)}
                      sx={{ color: '#667eea', '&:hover': { bgcolor: '#667eea10' } }}
                    >
                      <ImageIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Chip
                    label="No proof"
                    size="small"
                    sx={{ height: 22, fontSize: '0.65rem', bgcolor: '#ef444415', color: '#ef4444', fontWeight: 600 }}
                  />
                )}
              </Box>

              {/* Date */}
              <Typography variant="body2" color="#94a3b8" sx={{ display: { xs: 'none', md: 'block' } }}>
                {getTimeAgoStr(payment)}
              </Typography>

              {/* Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                {payment.status === 'pending' && (
                  <>
                    <Tooltip title="Approve">
                      <IconButton
                        size="small"
                        onClick={() => handleApproveOpen(payment)}
                        sx={{ color: '#10b981', '&:hover': { bgcolor: '#10b98115' } }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        size="small"
                        onClick={() => handleRejectOpen(payment)}
                        sx={{ color: '#ef4444', '&:hover': { bgcolor: '#ef444415' } }}
                      >
                        <CancelIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, payment)}>
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
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
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
        <MenuItem onClick={() => handleViewPayment(selectedPayment)} sx={{ py: 1 }}>
          <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: '#667eea' }} /></ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>

        {getProofImage(selectedPayment) && (
          <MenuItem onClick={() => handleViewProof(selectedPayment)} sx={{ py: 1 }}>
            <ListItemIcon><ImageIcon fontSize="small" sx={{ color: '#8b5cf6' }} /></ListItemIcon>
            <ListItemText primary="View Proof" />
          </MenuItem>
        )}

        <MenuItem onClick={() => handleCopyReference(getReference(selectedPayment))} sx={{ py: 1 }}>
          <ListItemIcon><ContentCopyIcon fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon>
          <ListItemText primary="Copy Reference" />
        </MenuItem>

        {selectedPayment?.status === 'pending' && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => handleApproveOpen(selectedPayment)} sx={{ py: 1 }}>
              <ListItemIcon><CheckCircleIcon fontSize="small" sx={{ color: '#10b981' }} /></ListItemIcon>
              <ListItemText primary="Approve" primaryTypographyProps={{ color: '#10b981' }} />
            </MenuItem>
            <MenuItem onClick={() => handleRejectOpen(selectedPayment)} sx={{ py: 1 }}>
              <ListItemIcon><CancelIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
              <ListItemText primary="Reject" primaryTypographyProps={{ color: '#ef4444' }} />
            </MenuItem>
          </>
        )}
      </Menu>

      {/* ═══════════ VIEW PAYMENT DIALOG ═══════════ */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedPayment && (
          <>
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${getStatusColor(selectedPayment.status)}20 0%, ${getStatusColor(selectedPayment.status)}05 100%)`,
                borderBottom: `2px solid ${getStatusColor(selectedPayment.status)}30`,
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() => setViewDialogOpen(false)}
                sx={{ position: 'absolute', top: 8, right: 8, color: '#64748b' }}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: getStatusColor(selectedPayment.status),
                    fontWeight: 700,
                  }}
                >
                  {getUserInitial(selectedPayment)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700" color="#1e293b">
                    {getUserName(selectedPayment)}
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    {getUserEmail(selectedPayment)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  icon={getStatusIcon(selectedPayment.status)}
                  label={(selectedPayment.status || 'unknown').charAt(0).toUpperCase() + (selectedPayment.status || 'unknown').slice(1)}
                  sx={{
                    fontWeight: 600,
                    bgcolor: getStatusBg(selectedPayment.status),
                    color: getStatusColor(selectedPayment.status),
                    '& .MuiChip-icon': { color: getStatusColor(selectedPayment.status) },
                  }}
                />
                <Chip
                  label={`${getPlan(selectedPayment)} Plan`}
                  sx={{ fontWeight: 600, bgcolor: '#667eea15', color: '#667eea' }}
                />
              </Box>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              {/* Amount Highlight */}
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="caption" color="#94a3b8">Amount</Typography>
                <Typography variant="h3" fontWeight="800" color="#1e293b">
                  {getAmountDisplay(selectedPayment)}
                </Typography>
              </Box>

              {/* Details Grid */}
              {[
                { label: 'Reference', value: getReference(selectedPayment) },
                { label: 'Payment Method', value: getPaymentMethod(selectedPayment) },
                {
                  label: 'Requested',
                  value: getRequestedAt(selectedPayment)
                    ? new Date(getRequestedAt(selectedPayment)).toLocaleString()
                    : 'N/A',
                },
                ...(selectedPayment.processedAt
                  ? [
                      { label: 'Processed', value: new Date(selectedPayment.processedAt).toLocaleString() },
                      { label: 'Processed By', value: selectedPayment.processedBy || 'N/A' },
                    ]
                  : []),
              ].map((detail, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.2,
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <Typography variant="body2" color="#64748b">{detail.label}</Typography>
                  <Typography variant="body2" fontWeight="600" color="#1e293b">{detail.value}</Typography>
                </Box>
              ))}

              {/* Admin Note */}
              {selectedPayment.adminNote && (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Typography variant="caption" fontWeight="600" color="#64748b">Admin Note</Typography>
                  <Typography variant="body2" color="#1e293b" sx={{ mt: 0.5 }}>
                    {selectedPayment.adminNote}
                  </Typography>
                </Box>
              )}

              {/* Proof Image */}
              {getProofImage(selectedPayment) && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1 }}>
                    Payment Proof
                  </Typography>
                  <Box
                    onClick={() => { setViewDialogOpen(false); handleViewProof(selectedPayment); }}
                    sx={{
                      width: '100%',
                      height: 200,
                      borderRadius: 2,
                      bgcolor: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      '&:hover': { borderColor: '#667eea', '& .zoom-overlay': { opacity: 1 } },
                    }}
                  >
                    {getProofImage(selectedPayment)?.startsWith('http') ? (
                      <Box
                        component="img"
                        src={getProofImage(selectedPayment)}
                        alt="Payment proof"
                        sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <ImageIcon sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    )}
                    <Box
                      className="zoom-overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ffffff' }}>
                        <FullscreenIcon />
                        <Typography variant="body2" fontWeight="600">View Full Size</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              {selectedPayment.status === 'pending' && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => { setViewDialogOpen(false); handleApproveOpen(selectedPayment); }}
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
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => { setViewDialogOpen(false); handleRejectOpen(selectedPayment); }}
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                  >
                    Reject
                  </Button>
                </>
              )}
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

      {/* ═══════════ PROOF IMAGE DIALOG ═══════════ */}
      <Dialog
        open={proofDialogOpen}
        onClose={() => setProofDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {selectedPayment && (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                bgcolor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight="700" color="#1e293b">
                  Payment Proof — {getUserName(selectedPayment)}
                </Typography>
                <Typography variant="caption" color="#94a3b8">
                  {getReference(selectedPayment)} • {getPaymentMethod(selectedPayment)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Tooltip title="Zoom Out">
                  <IconButton
                    size="small"
                    onClick={() => setProofZoom((z) => Math.max(z - 25, 50))}
                    disabled={proofZoom <= 50}
                  >
                    <ZoomOutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography
                  variant="caption"
                  fontWeight="600"
                  color="#64748b"
                  sx={{ minWidth: 40, textAlign: 'center' }}
                >
                  {proofZoom}%
                </Typography>
                <Tooltip title="Zoom In">
                  <IconButton
                    size="small"
                    onClick={() => setProofZoom((z) => Math.min(z + 25, 200))}
                    disabled={proofZoom >= 200}
                  >
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <IconButton onClick={() => setProofDialogOpen(false)} sx={{ ml: 1 }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                height: '70vh',
                overflow: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#1e293b',
                p: 3,
              }}
            >
              {getProofImage(selectedPayment) ? (
                <Box
                  sx={{
                    transform: `scale(${proofZoom / 100})`,
                    transition: 'transform 0.2s ease',
                    maxWidth: '100%',
                  }}
                >
                  {getProofImage(selectedPayment)?.startsWith('http') ? (
                    <Box
                      component="img"
                      src={getProofImage(selectedPayment)}
                      alt="Payment proof screenshot"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '65vh',
                        objectFit: 'contain',
                        borderRadius: 2,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: { xs: 300, md: 500 },
                        height: { xs: 400, md: 650 },
                        bgcolor: '#ffffff',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Box sx={{ textAlign: 'center', color: '#94a3b8' }}>
                        <ImageIcon sx={{ fontSize: 60, mb: 1 }} />
                        <Typography variant="body2">Payment Screenshot</Typography>
                        <Typography variant="caption">{getProofImage(selectedPayment)}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography color="#94a3b8">No proof image available</Typography>
              )}
            </Box>

            {/* Bottom Actions */}
            {selectedPayment.status === 'pending' && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1.5,
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => { setProofDialogOpen(false); handleApproveOpen(selectedPayment); }}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' },
                  }}
                >
                  Approve Payment
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => { setProofDialogOpen(false); handleRejectOpen(selectedPayment); }}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                  Reject
                </Button>
              </Box>
            )}
          </>
        )}
      </Dialog>

      {/* ═══════════ APPROVE DIALOG ═══════════ */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => !actionLoading && setApproveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#10b981' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon />
            Approve Payment
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            Approve payment from <strong>{getUserName(selectedPayment)}</strong> for{' '}
            <strong>{getAmountDisplay(selectedPayment)}</strong> ({getPlan(selectedPayment)} Plan)?
          </Typography>

          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            This will activate Premium for <strong>{getUserName(selectedPayment)}</strong> immediately.
          </Alert>

          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', mb: 2 }}>
            {[
              { label: 'User', value: getUserEmail(selectedPayment) },
              { label: 'Amount', value: getAmountDisplay(selectedPayment) },
              { label: 'Method', value: getPaymentMethod(selectedPayment) },
              { label: 'Reference', value: getReference(selectedPayment) },
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8 }}>
                <Typography variant="caption" color="#94a3b8">{item.label}</Typography>
                <Typography variant="caption" fontWeight="600" color="#1e293b">{item.value}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1 }}>
            Admin Note (optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Add a note about this approval..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            disabled={actionLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': { borderColor: '#10b981' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setApproveDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#64748b' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={
              actionLoading
                ? <CircularProgress size={16} color="inherit" />
                : <CheckCircleIcon />
            }
            onClick={handleApproveConfirm}
            disabled={actionLoading}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
            }}
          >
            {actionLoading ? 'Approving...' : 'Approve & Activate Premium'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════ REJECT DIALOG ═══════════ */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => !actionLoading && setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon />
            Reject Payment
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            Reject payment from <strong>{getUserName(selectedPayment)}</strong> for{' '}
            <strong>{getAmountDisplay(selectedPayment)}</strong>?
          </Typography>

          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            The user will be notified that their payment was rejected and they will remain on the Free plan.
          </Alert>

          <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ mb: 1 }}>
            Rejection Reason <Typography component="span" color="#ef4444">*</Typography>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Explain why this payment is being rejected (e.g., unclear proof, wrong amount, etc.)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            disabled={actionLoading}
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
            onClick={() => setRejectDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#64748b' }}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={
              actionLoading
                ? <CircularProgress size={16} color="inherit" />
                : <CancelIcon />
            }
            disabled={!rejectReason.trim() || actionLoading}
            onClick={handleRejectConfirm}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            {actionLoading ? 'Rejecting...' : 'Reject Payment'}
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