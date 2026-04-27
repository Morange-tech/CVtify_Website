'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  Avatar,
  Badge,
  Button,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingIcon from '@mui/icons-material/Pending';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LabelIcon from '@mui/icons-material/Label';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ForumIcon from '@mui/icons-material/Forum';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BugReportIcon from '@mui/icons-material/BugReport';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  fetchMessages as fetchMessagesApi,
  fetchMessageById as fetchMessageByIdApi,
  sendReply as sendReplyApi,
  updateMessageStatus as updateMessageStatusApi,
  toggleRead as toggleReadApi,
  toggleStar as toggleStarApi,
  deleteMessage as deleteMessageApi,
  fetchStats as fetchStatsApi,
} from '../../hooks/useMessage';
// ─── Helpers ───
const getInitials = (name) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
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
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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

// ─── Category / Priority Config ───
const TICKET_CATEGORIES = [
  {
    value: 'general',
    label: 'General',
    icon: <HelpOutlineIcon sx={{ fontSize: 16 }} />,
    color: '#667eea',
  },
  {
    value: 'bug',
    label: 'Bug Report',
    icon: <BugReportIcon sx={{ fontSize: 16 }} />,
    color: '#ef4444',
  },
  {
    value: 'billing',
    label: 'Billing',
    icon: <PaymentIcon sx={{ fontSize: 16 }} />,
    color: '#f59e0b',
  },
  {
    value: 'feature',
    label: 'Feature Request',
    icon: <BuildIcon sx={{ fontSize: 16 }} />,
    color: '#8b5cf6',
  },
  {
    value: 'account',
    label: 'Account',
    icon: <PersonIcon sx={{ fontSize: 16 }} />,
    color: '#06b6d4',
  },
  {
    value: 'template',
    label: 'Templates',
    icon: <LabelIcon sx={{ fontSize: 16 }} />,
    color: '#ec4899',
  },
];

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#10b981', bgcolor: '#10b98115' },
  medium: { label: 'Medium', color: '#f59e0b', bgcolor: '#f59e0b15' },
  high: { label: 'High', color: '#ef4444', bgcolor: '#ef444415' },
  urgent: { label: 'Urgent', color: '#dc2626', bgcolor: '#dc262615' },
};

const STATUS_CONFIG = {
  open: {
    label: 'Open',
    color: '#667eea',
    bgcolor: '#667eea15',
    icon: <MailIcon sx={{ fontSize: 16 }} />,
  },
  'in-progress': {
    label: 'In Progress',
    color: '#f59e0b',
    bgcolor: '#f59e0b15',
    icon: <PendingIcon sx={{ fontSize: 16 }} />,
  },
  resolved: {
    label: 'Resolved',
    color: '#10b981',
    bgcolor: '#10b98115',
    icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
  },
  closed: {
    label: 'Closed',
    color: '#94a3b8',
    bgcolor: '#94a3b815',
    icon: <DoneAllIcon sx={{ fontSize: 16 }} />,
  },
};

const getCategoryConfig = (val) =>
  TICKET_CATEGORIES.find((c) => c.value === val) || TICKET_CATEGORIES[0];


// ─── Loading Skeleton Components ───
function MessageListSkeleton() {
  return (
    <Box>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Skeleton variant="circular" width={36} height={36} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={18} />
              <Skeleton variant="text" width="40%" height={16} />
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                <Skeleton variant="rounded" width={70} height={20} sx={{ borderRadius: 10 }} />
                <Skeleton variant="rounded" width={50} height={20} sx={{ borderRadius: 10 }} />
                <Skeleton variant="rounded" width={60} height={20} sx={{ borderRadius: 10 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function StatsSkeleton() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr 1fr',
          sm: '1fr 1fr 1fr',
          md: 'repeat(6, 1fr)',
        },
        gap: 2,
        mb: 4,
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Box
          key={i}
          sx={{
            bgcolor: '#ffffff',
            p: 2,
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Skeleton variant="rounded" width={38} height={38} sx={{ borderRadius: 2 }} />
          <Box>
            <Skeleton variant="text" width={30} height={28} />
            <Skeleton variant="text" width={50} height={16} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function ConversationSkeleton() {
  return (
    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: i % 2 === 0 ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            alignSelf: i % 2 === 0 ? 'flex-end' : 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={80} height={16} />
            <Skeleton variant="text" width={40} height={16} />
          </Box>
          <Skeleton
            variant="rounded"
            width={300}
            height={60}
            sx={{ borderRadius: 2.5 }}
          />
        </Box>
      ))}
    </Box>
  );
}

// ─── Main Component ───
export default function AdminMessagesPage() {
  // ─── State ───
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    unread: 0,
    starred: 0,
    urgent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuTarget, setMenuTarget] = useState(null);

  // Conversation view
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const replyInputRef = useRef(null);
  const conversationEndRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // ─── Debounced Search ───
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // ─── Fetch Messages ───
  const fetchMessages = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        setError(null);

        const tabToStatus = {
          all: 'all',
          open: 'open',
          'in-progress': 'in-progress',
          resolved: 'resolved',
          closed: 'closed',
          unread: 'unread',
          starred: 'starred',
        };

        const [messagesData, statsData] = await Promise.all([
          fetchMessagesApi({
            status: tabToStatus[activeTab],
            category: categoryFilter,
            priority: priorityFilter,
            search: debouncedSearch,
            sort: sortBy,
          }),
          fetchStatsApi(),
        ]);

        setMessages(messagesData.messages || messagesData.data || messagesData || []);
        setStats(
          statsData || {
            total: 0,
            open: 0,
            inProgress: 0,
            resolved: 0,
            closed: 0,
            unread: 0,
            starred: 0,
            urgent: 0,
          }
        );
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError(err.message);
        setSnackbar({
          open: true,
          message: `Failed to load messages: ${err.message}`,
          severity: 'error',
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeTab, categoryFilter, priorityFilter, debouncedSearch, sortBy]
  );

  // ─── Initial Load & Refetch on Filter Change ───
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ─── Polling for Real-time Updates (every 30s) ───
  useEffect(() => {
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(false);
    }, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchMessages]);

  // ─── Scroll to bottom on new message ───
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMessage?.conversation?.length]);

  // ─── Handlers ───
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages(false);
    setSnackbar({
      open: true,
      message: 'Messages refreshed!',
      severity: 'success',
    });
  };

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    setReplyText('');

    // Fetch full conversation details
    try {
      setConversationLoading(true);
      const fullMessage = await fetchMessageByIdApi(msg.id || msg._id);
      setSelectedMessage(fullMessage.message || fullMessage.data || fullMessage);

      // Mark as read if unread
      if (!msg.isRead) {
        await toggleReadApi(msg.id || msg._id, true);
        setMessages((prev) =>
          prev.map((m) =>
            (m.id || m._id) === (msg.id || msg._id) ? { ...m, isRead: true } : m
          )
        );
        setStats((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
        }));
      }
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load conversation details',
        severity: 'error',
      });
    } finally {
      setConversationLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage || sendingReply) return;

    const messageId = selectedMessage.id || selectedMessage._id;

    try {
      setSendingReply(true);
      const result = await sendReplyApi(messageId, replyText.trim());

      const newReply = result.reply ||
        result.data || {
        id: `msg-${messageId}-${Date.now()}`,
        sender: 'admin',
        senderName: 'Support Team',
        message: replyText.trim(),
        timestamp: new Date().toISOString(),
        attachments: [],
      };

      // Update selected message conversation
      setSelectedMessage((prev) => ({
        ...prev,
        conversation: [...(prev.conversation || []), newReply],
        updatedAt: new Date().toISOString(),
        status: prev.status === 'open' ? 'in-progress' : prev.status,
      }));

      // Update message list
      setMessages((prev) =>
        prev.map((m) =>
          (m.id || m._id) === messageId
            ? {
              ...m,
              updatedAt: new Date().toISOString(),
              status: m.status === 'open' ? 'in-progress' : m.status,
              lastMessage: replyText.trim(),
              lastSender: 'admin',
            }
            : m
        )
      );

      setReplyText('');
      setSnackbar({
        open: true,
        message: 'Reply sent successfully!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Failed to send reply:', err);
      setSnackbar({
        open: true,
        message: `Failed to send reply: ${err.message}`,
        severity: 'error',
      });
    } finally {
      setSendingReply(false);
    }
  };

  const handleMarkAsResolved = async (msg) => {
    const target = msg || selectedMessage;
    if (!target) return;

    const messageId = target.id || target._id;

    try {
      await updateMessageStatusApi(messageId, 'resolved');

      setMessages((prev) =>
        prev.map((m) =>
          (m.id || m._id) === messageId
            ? { ...m, status: 'resolved', updatedAt: new Date().toISOString() }
            : m
        )
      );

      if (
        selectedMessage &&
        (selectedMessage.id || selectedMessage._id) === messageId
      ) {
        setSelectedMessage((prev) => ({
          ...prev,
          status: 'resolved',
          updatedAt: new Date().toISOString(),
        }));
      }

      // Update stats
      setStats((prev) => ({
        ...prev,
        open: target.status === 'open' ? Math.max(0, prev.open - 1) : prev.open,
        inProgress:
          target.status === 'in-progress'
            ? Math.max(0, prev.inProgress - 1)
            : prev.inProgress,
        resolved: prev.resolved + 1,
      }));

      handleMenuClose();
      setSnackbar({
        open: true,
        message: `"${target.subject}" marked as resolved.`,
        severity: 'success',
      });
    } catch (err) {
      console.error('Failed to update status:', err);
      setSnackbar({
        open: true,
        message: `Failed to update status: ${err.message}`,
        severity: 'error',
      });
    }
  };

  const handleChangeStatus = async (msg, newStatus) => {
    const target = msg || selectedMessage;
    if (!target) return;

    const messageId = target.id || target._id;

    try {
      await updateMessageStatusApi(messageId, newStatus);

      setMessages((prev) =>
        prev.map((m) =>
          (m.id || m._id) === messageId
            ? { ...m, status: newStatus, updatedAt: new Date().toISOString() }
            : m
        )
      );

      if (
        selectedMessage &&
        (selectedMessage.id || selectedMessage._id) === messageId
      ) {
        setSelectedMessage((prev) => ({
          ...prev,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }));
      }

      handleMenuClose();

      // Refresh stats after status change
      try {
        const statsData = await fetchStatsApi();
        setStats(statsData);
      } catch {
        // Silently fail stats refresh
      }

      setSnackbar({
        open: true,
        message: `Status changed to "${STATUS_CONFIG[newStatus].label}".`,
        severity: 'info',
      });
    } catch (err) {
      console.error('Failed to change status:', err);
      setSnackbar({
        open: true,
        message: `Failed to change status: ${err.message}`,
        severity: 'error',
      });
    }
  };

  const handleToggleStar = async (msg) => {
    const messageId = msg.id || msg._id;
    const newStarred = !msg.isStarred;

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) =>
        (m.id || m._id) === messageId ? { ...m, isStarred: newStarred } : m
      )
    );

    if (
      selectedMessage &&
      (selectedMessage.id || selectedMessage._id) === messageId
    ) {
      setSelectedMessage((prev) => ({ ...prev, isStarred: newStarred }));
    }

    try {
      await toggleStarApi(messageId, newStarred);
      setStats((prev) => ({
        ...prev,
        starred: newStarred ? prev.starred + 1 : Math.max(0, prev.starred - 1),
      }));
    } catch (err) {
      // Revert optimistic update
      setMessages((prev) =>
        prev.map((m) =>
          (m.id || m._id) === messageId
            ? { ...m, isStarred: !newStarred }
            : m
        )
      );
      if (
        selectedMessage &&
        (selectedMessage.id || selectedMessage._id) === messageId
      ) {
        setSelectedMessage((prev) => ({ ...prev, isStarred: !newStarred }));
      }
      setSnackbar({
        open: true,
        message: 'Failed to update star status',
        severity: 'error',
      });
    }
  };

  const handleToggleRead = async (msg) => {
    const messageId = msg.id || msg._id;
    const newRead = !msg.isRead;

    // Optimistic update
    setMessages((prev) =>
      prev.map((m) =>
        (m.id || m._id) === messageId ? { ...m, isRead: newRead } : m
      )
    );

    try {
      await toggleReadApi(messageId, newRead);
      setStats((prev) => ({
        ...prev,
        unread: newRead
          ? Math.max(0, prev.unread - 1)
          : prev.unread + 1,
      }));
    } catch (err) {
      // Revert
      setMessages((prev) =>
        prev.map((m) =>
          (m.id || m._id) === messageId ? { ...m, isRead: !newRead } : m
        )
      );
      setSnackbar({
        open: true,
        message: 'Failed to update read status',
        severity: 'error',
      });
    }

    handleMenuClose();
  };

  const handleDeleteOpen = (msg) => {
    setDeleteTarget(msg);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) return;

    const messageId = deleteTarget.id || deleteTarget._id;

    try {
      setDeleting(true);
      await deleteMessageApi(messageId);

      setMessages((prev) =>
        prev.filter((m) => (m.id || m._id) !== messageId)
      );

      if (
        selectedMessage &&
        (selectedMessage.id || selectedMessage._id) === messageId
      ) {
        setSelectedMessage(null);
      }

      setDeleteDialogOpen(false);
      setDeleteTarget(null);

      // Refresh stats
      try {
        const statsData = await fetchStatsApi();
        setStats(statsData);
      } catch {
        // Silently fail
      }

      setSnackbar({
        open: true,
        message: 'Message deleted.',
        severity: 'warning',
      });
    } catch (err) {
      console.error('Failed to delete message:', err);
      setSnackbar({
        open: true,
        message: `Failed to delete message: ${err.message}`,
        severity: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleMenuOpen = (e, msg) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
    setMenuTarget(msg);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuTarget(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  // ─── Computed values from messages for list display ───
  const filteredMessages = useMemo(() => {
    // Server already filters, but we can do additional client-side filtering if needed
    return messages;
  }, [messages]);

  // ─── Render ───
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
            📩 Support & Messages
          </Typography>
          <Typography variant="body2" color="#64748b">
            Manage user inquiries, reply, and resolve tickets
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {stats.unread > 0 && (
            <Chip
              icon={<MailIcon sx={{ fontSize: 16 }} />}
              label={`${stats.unread} unread`}
              sx={{
                fontWeight: 600,
                bgcolor: '#ef444415',
                color: '#ef4444',
                border: '1px solid #ef444430',
              }}
            />
          )}
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
              {refreshing ? (
                <CircularProgress size={20} sx={{ color: '#64748b' }} />
              ) : (
                <RefreshIcon sx={{ fontSize: 20, color: '#64748b' }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ─── Error Banner ─── */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchMessages()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* ─── Stats ─── */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr 1fr',
              sm: '1fr 1fr 1fr',
              md: 'repeat(6, 1fr)',
            },
            gap: 2,
            mb: 4,
          }}
        >
          {[
            {
              label: 'Total',
              value: stats.total,
              icon: <ForumIcon />,
              color: '#667eea',
            },
            {
              label: 'Open',
              value: stats.open,
              icon: <MailIcon />,
              color: '#3b82f6',
            },
            {
              label: 'In Progress',
              value: stats.inProgress,
              icon: <PendingIcon />,
              color: '#f59e0b',
            },
            {
              label: 'Resolved',
              value: stats.resolved,
              icon: <CheckCircleIcon />,
              color: '#10b981',
            },
            {
              label: 'Unread',
              value: stats.unread,
              icon: <MarkEmailUnreadIcon />,
              color: '#ef4444',
            },
            {
              label: 'Urgent/High',
              value: stats.urgent,
              icon: <PriorityHighIcon />,
              color: '#dc2626',
            },
          ].map((stat, i) => (
            <Box
              key={i}
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
      )}

      {/* ─── Main Content ─── */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          height: { md: 'calc(100vh - 380px)' },
          minHeight: 500,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* ─── LEFT: Message List ─── */}
        <Box
          sx={{
            width: { xs: '100%', md: selectedMessage ? 380 : '100%' },
            minWidth: { md: selectedMessage ? 380 : 'auto' },
            display: {
              xs: selectedMessage ? 'none' : 'flex',
              md: 'flex',
            },
            flexDirection: 'column',
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'width 0.3s ease',
          }}
        >
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #f1f5f9',
              minHeight: 42,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                minHeight: 42,
                py: 0,
              },
              '& .Mui-selected': { color: '#667eea' },
              '& .MuiTabs-indicator': { backgroundColor: '#667eea' },
            }}
          >
            <Tab label={`All (${stats.total})`} value="all" />
            <Tab
              label={
                <Badge
                  badgeContent={stats.open}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      height: 16,
                      minWidth: 16,
                      bgcolor: '#667eea',
                    },
                  }}
                >
                  <Box sx={{ pr: 1.5 }}>Open</Box>
                </Badge>
              }
              value="open"
            />
            <Tab
              label={`In Progress (${stats.inProgress})`}
              value="in-progress"
            />
            <Tab label={`Resolved (${stats.resolved})`} value="resolved" />
            <Tab
              label={
                <Badge
                  badgeContent={stats.unread}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      height: 16,
                      minWidth: 16,
                    },
                  }}
                >
                  <Box sx={{ pr: 1.5 }}>Unread</Box>
                </Badge>
              }
              value="unread"
            />
            <Tab label={`Starred (${stats.starred})`} value="starred" />
          </Tabs>

          {/* Search & Filters */}
          <Box
            sx={{
              p: 1.5,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <TextField
              placeholder="Search messages..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  height: 36,
                  '&.Mui-focused fieldset': { borderColor: '#667eea' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      sx={{ p: 0.3 }}
                    >
                      <CloseIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  height: 36,
                  fontSize: '0.8rem',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }}
              >
                <MenuItem value="all">
                  <Typography variant="body2">All Categories</Typography>
                </MenuItem>
                {TICKET_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {cat.icon}
                      <Typography variant="body2">{cat.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  height: 36,
                  fontSize: '0.8rem',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }}
              >
                <MenuItem value="all">
                  <Typography variant="body2">All Priority</Typography>
                </MenuItem>
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <MenuItem key={key} value={key}>
                    <Typography
                      variant="body2"
                      sx={{ color: cfg.color, fontWeight: 600 }}
                    >
                      {cfg.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton
              size="small"
              onClick={(e) => setSortAnchorEl(e.currentTarget)}
              sx={{
                bgcolor: '#f8fafc',
                borderRadius: 2,
                width: 36,
                height: 36,
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
                { label: 'Priority', value: 'priority' },
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

          {/* Message List */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <MessageListSkeleton />
            ) : filteredMessages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <InboxIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                <Typography variant="body1" fontWeight="600" color="#94a3b8">
                  No messages found
                </Typography>
                <Typography variant="caption" color="#cbd5e1">
                  Try adjusting your filters
                </Typography>
              </Box>
            ) : (
              filteredMessages.map((msg) => {
                const msgId = msg.id || msg._id;
                const catConfig = getCategoryConfig(msg.category);
                const priorityConfig =
                  PRIORITY_CONFIG[msg.priority] || PRIORITY_CONFIG.medium;
                const statusConfig =
                  STATUS_CONFIG[msg.status] || STATUS_CONFIG.open;
                const isSelected =
                  selectedMessage &&
                  (selectedMessage.id || selectedMessage._id) === msgId;
                const lastMsg =
                  msg.conversation && msg.conversation.length > 0
                    ? msg.conversation[msg.conversation.length - 1]
                    : null;

                return (
                  <Box
                    key={msgId}
                    onClick={() => handleSelectMessage(msg)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      borderLeft: isSelected
                        ? '3px solid #667eea'
                        : '3px solid transparent',
                      bgcolor: isSelected
                        ? '#667eea08'
                        : !msg.isRead
                          ? '#f0f4ff'
                          : 'transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: isSelected ? '#667eea08' : '#f8fafc',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      {/* Star */}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStar(msg);
                        }}
                        sx={{ alignSelf: 'flex-start', mt: 0.3, p: 0.3 }}
                      >
                        {msg.isStarred ? (
                          <StarIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                        ) : (
                          <StarBorderIcon
                            sx={{ fontSize: 18, color: '#cbd5e1' }}
                          />
                        )}
                      </IconButton>

                      {/* Avatar */}
                      <Avatar
                        src={msg.userAvatar || msg.avatar}
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: msg.isPremiumUser
                            ? '#8b5cf620'
                            : '#667eea15',
                          color: msg.isPremiumUser ? '#8b5cf6' : '#667eea',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(msg.userName || msg.name || 'Unknown')}
                      </Avatar>

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
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              fontWeight={msg.isRead ? 600 : 700}
                              color="#1e293b"
                              noWrap
                            >
                              {msg.userName || msg.name || 'Unknown User'}
                            </Typography>
                            {msg.isPremiumUser && (
                              <WorkspacePremiumIcon
                                sx={{ fontSize: 14, color: '#8b5cf6' }}
                              />
                            )}
                          </Box>
                          <Typography
                            variant="caption"
                            color="#94a3b8"
                            sx={{ flexShrink: 0 }}
                          >
                            {formatDate(msg.updatedAt || msg.createdAt)}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          fontWeight={msg.isRead ? 500 : 700}
                          color="#1e293b"
                          noWrap
                          sx={{ mb: 0.3 }}
                        >
                          {msg.subject}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="#94a3b8"
                          noWrap
                          sx={{ display: 'block', mb: 1 }}
                        >
                          {lastMsg
                            ? `${lastMsg.sender === 'admin' ? '↩ You: ' : ''}${lastMsg.message}`
                            : msg.lastMessage || msg.preview || ''}
                        </Typography>

                        {/* Tags */}
                        <Box
                          sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}
                        >
                          <Chip
                            icon={catConfig.icon}
                            label={catConfig.label}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.6rem',
                              height: 20,
                              bgcolor: `${catConfig.color}15`,
                              color: catConfig.color,
                              '& .MuiChip-icon': { ml: 0.5 },
                            }}
                          />
                          <Chip
                            label={priorityConfig.label}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.6rem',
                              height: 20,
                              bgcolor: priorityConfig.bgcolor,
                              color: priorityConfig.color,
                            }}
                          />
                          <Chip
                            icon={statusConfig.icon}
                            label={statusConfig.label}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.6rem',
                              height: 20,
                              bgcolor: statusConfig.bgcolor,
                              color: statusConfig.color,
                              '& .MuiChip-icon': {
                                ml: 0.5,
                                color: statusConfig.color,
                              },
                            }}
                          />
                          {msg.conversation && msg.conversation.length > 1 && (
                            <Chip
                              label={`${msg.conversation.length} msgs`}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.6rem',
                                height: 20,
                                bgcolor: '#f1f5f9',
                                color: '#64748b',
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      {/* Menu */}
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, msg)}
                        sx={{ alignSelf: 'flex-start', p: 0.3 }}
                      >
                        <MoreVertIcon
                          sx={{ fontSize: 18, color: '#94a3b8' }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        {/* ─── RIGHT: Conversation View ─── */}
        {selectedMessage && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                >
                  <IconButton
                    onClick={handleBackToList}
                    sx={{ display: { md: 'none' }, mr: 0.5 }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Avatar
                    src={
                      selectedMessage.userAvatar || selectedMessage.avatar
                    }
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: selectedMessage.isPremiumUser
                        ? '#8b5cf620'
                        : '#667eea15',
                      color: selectedMessage.isPremiumUser
                        ? '#8b5cf6'
                        : '#667eea',
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(
                      selectedMessage.userName ||
                      selectedMessage.name ||
                      'Unknown'
                    )}
                  </Avatar>
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight="700"
                        color="#1e293b"
                      >
                        {selectedMessage.userName ||
                          selectedMessage.name ||
                          'Unknown User'}
                      </Typography>
                      {selectedMessage.isPremiumUser && (
                        <WorkspacePremiumIcon
                          sx={{ fontSize: 16, color: '#8b5cf6' }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="#94a3b8">
                      {selectedMessage.userEmail || selectedMessage.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => toggleStarApi(selectedMessage)}
                  >
                    {selectedMessage.isStarred ? (
                      <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                    ) : (
                      <StarBorderIcon
                        sx={{ color: '#cbd5e1', fontSize: 20 }}
                      />
                    )}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, selectedMessage)}
                  >
                    <MoreVertIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                  </IconButton>
                </Box>
              </Box>

              <Typography
                variant="h6"
                fontWeight="700"
                color="#1e293b"
                sx={{ mb: 1 }}
              >
                {selectedMessage.subject}
              </Typography>

              <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                {(() => {
                  const catCfg = getCategoryConfig(
                    selectedMessage.category
                  );
                  const priCfg =
                    PRIORITY_CONFIG[selectedMessage.priority] ||
                    PRIORITY_CONFIG.medium;
                  const staCfg =
                    STATUS_CONFIG[selectedMessage.status] ||
                    STATUS_CONFIG.open;
                  return (
                    <>
                      <Chip
                        icon={catCfg.icon}
                        label={catCfg.label}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 24,
                          bgcolor: `${catCfg.color}15`,
                          color: catCfg.color,
                          '& .MuiChip-icon': { ml: 0.5 },
                        }}
                      />
                      <Chip
                        label={priCfg.label}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 24,
                          bgcolor: priCfg.bgcolor,
                          color: priCfg.color,
                        }}
                      />
                      <Chip
                        icon={staCfg.icon}
                        label={staCfg.label}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 24,
                          bgcolor: staCfg.bgcolor,
                          color: staCfg.color,
                          '& .MuiChip-icon': {
                            ml: 0.5,
                            color: staCfg.color,
                          },
                        }}
                      />
                      <Chip
                        label={formatDate(selectedMessage.createdAt)}
                        size="small"
                        icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          height: 24,
                          bgcolor: '#f1f5f9',
                          color: '#64748b',
                          '& .MuiChip-icon': {
                            ml: 0.5,
                            color: '#94a3b8',
                          },
                        }}
                      />
                    </>
                  );
                })()}
              </Box>
            </Box>

            {/* Conversation */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                bgcolor: '#f8fafc',
              }}
            >
              {conversationLoading ? (
                <ConversationSkeleton />
              ) : selectedMessage.conversation &&
                selectedMessage.conversation.length > 0 ? (
                selectedMessage.conversation.map((entry) => {
                  const isAdmin = entry.sender === 'admin';
                  return (
                    <Box
                      key={entry.id || entry._id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.8,
                          mb: 0.5,
                        }}
                      >
                        {!isAdmin && (
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              bgcolor: '#667eea20',
                              color: '#667eea',
                            }}
                          >
                            {getInitials(
                              entry.senderName || 'User'
                            )}
                          </Avatar>
                        )}
                        <Typography
                          variant="caption"
                          fontWeight="600"
                          color={isAdmin ? '#667eea' : '#1e293b'}
                        >
                          {entry.senderName || (isAdmin ? 'Support Team' : 'User')}
                        </Typography>
                        <Typography variant="caption" color="#94a3b8">
                          {formatDate(entry.timestamp || entry.createdAt)}
                        </Typography>
                        {isAdmin && (
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              bgcolor: '#667eea20',
                              color: '#667eea',
                            }}
                          >
                            <SupportAgentIcon sx={{ fontSize: 14 }} />
                          </Avatar>
                        )}
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          bgcolor: isAdmin ? '#667eea' : '#ffffff',
                          color: isAdmin ? '#ffffff' : '#1e293b',
                          boxShadow: isAdmin
                            ? '0 2px 8px rgba(102,126,234,0.3)'
                            : '0 1px 3px rgba(0,0,0,0.08)',
                          borderTopRightRadius: isAdmin ? 4 : 20,
                          borderTopLeftRadius: isAdmin ? 20 : 4,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {entry.message || entry.content || entry.text}
                        </Typography>
                      </Box>

                      <Tooltip
                        title={formatFullDate(
                          entry.timestamp || entry.createdAt
                        )}
                        arrow
                      >
                        <Typography
                          variant="caption"
                          color="#94a3b8"
                          sx={{
                            mt: 0.3,
                            cursor: 'default',
                            px: 0.5,
                          }}
                        >
                          {formatFullDate(
                            entry.timestamp || entry.createdAt
                          )}
                        </Typography>
                      </Tooltip>
                    </Box>
                  );
                })
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="#94a3b8">
                    No messages in this conversation yet.
                  </Typography>
                </Box>
              )}
              <div ref={conversationEndRef} />
            </Box>

            {/* Status Actions */}
            {selectedMessage.status !== 'resolved' &&
              selectedMessage.status !== 'closed' && (
                <Box
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderTop: '1px solid #f1f5f9',
                    bgcolor: '#f8fafc',
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() => handleMarkAsResolved(selectedMessage)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#10b981',
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#10b98110' },
                    }}
                  >
                    Mark as Resolved
                  </Button>
                  {selectedMessage.status === 'open' && (
                    <Button
                      size="small"
                      startIcon={<PendingIcon />}
                      onClick={() =>
                        handleChangeStatus(selectedMessage, 'in-progress')
                      }
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#f59e0b',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#f59e0b10' },
                      }}
                    >
                      Mark In Progress
                    </Button>
                  )}
                </Box>
              )}

            {selectedMessage.status === 'resolved' && (
              <Box
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderTop: '1px solid #f1f5f9',
                  bgcolor: '#10b98108',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <CheckCircleIcon
                    sx={{ color: '#10b981', fontSize: 20 }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="#10b981"
                  >
                    This ticket is resolved
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() =>
                    handleChangeStatus(selectedMessage, 'closed')
                  }
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#64748b',
                    borderRadius: 2,
                  }}
                >
                  Close Ticket
                </Button>
              </Box>
            )}

            {selectedMessage.status === 'closed' && (
              <Box
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderTop: '1px solid #f1f5f9',
                  bgcolor: '#94a3b808',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <DoneAllIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="#94a3b8"
                  >
                    This ticket is closed
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() =>
                    handleChangeStatus(selectedMessage, 'open')
                  }
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#667eea',
                    borderRadius: 2,
                  }}
                >
                  Reopen
                </Button>
              </Box>
            )}

            {/* Reply Box */}
            {selectedMessage.status !== 'closed' && (
              <Box
                sx={{
                  p: 2,
                  borderTop: '1px solid #f1f5f9',
                  bgcolor: '#ffffff',
                }}
              >
                <Box
                  sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}
                >
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    inputRef={replyInputRef}
                    disabled={sendingReply}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        bgcolor: '#f8fafc',
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  />
                  <Tooltip title="Send reply (Enter)">
                    <span>
                      <IconButton
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || sendingReply}
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor:
                            replyText.trim() && !sendingReply
                              ? '#667eea'
                              : '#e2e8f0',
                          color: '#ffffff',
                          '&:hover': {
                            bgcolor:
                              replyText.trim() && !sendingReply
                                ? '#5a6fd6'
                                : '#e2e8f0',
                          },
                          '&.Mui-disabled': {
                            bgcolor: '#e2e8f0',
                            color: '#94a3b8',
                          },
                        }}
                      >
                        {sendingReply ? (
                          <CircularProgress
                            size={20}
                            sx={{ color: '#94a3b8' }}
                          />
                        ) : (
                          <SendIcon sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
                <Typography
                  variant="caption"
                  color="#94a3b8"
                  sx={{ mt: 0.5, display: 'block' }}
                >
                  Press Enter to send · Shift+Enter for new line
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Empty State (no message selected on desktop) */}
        {!selectedMessage && (
          <Box
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <SupportAgentIcon
              sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }}
            />
            <Typography variant="h6" fontWeight="600" color="#94a3b8">
              Select a message
            </Typography>
            <Typography
              variant="body2"
              color="#cbd5e1"
              sx={{ mt: 0.5 }}
            >
              Choose a conversation from the list to view and reply
            </Typography>
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
        <MenuItem
          onClick={() => {
            handleToggleRead(menuTarget);
          }}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            {menuTarget?.isRead ? (
              <MarkEmailUnreadIcon
                fontSize="small"
                sx={{ color: '#667eea' }}
              />
            ) : (
              <MarkEmailReadIcon
                fontSize="small"
                sx={{ color: '#667eea' }}
              />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              menuTarget?.isRead ? 'Mark as Unread' : 'Mark as Read'
            }
          />
        </MenuItem>

        {menuTarget?.status !== 'resolved' &&
          menuTarget?.status !== 'closed' && (
            <MenuItem
              onClick={() => handleMarkAsResolved(menuTarget)}
              sx={{ py: 1 }}
            >
              <ListItemIcon>
                <CheckCircleIcon
                  fontSize="small"
                  sx={{ color: '#10b981' }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Mark as Resolved"
                primaryTypographyProps={{ color: '#10b981' }}
              />
            </MenuItem>
          )}

        {menuTarget?.status === 'resolved' && (
          <MenuItem
            onClick={() => handleChangeStatus(menuTarget, 'closed')}
            sx={{ py: 1 }}
          >
            <ListItemIcon>
              <DoneAllIcon fontSize="small" sx={{ color: '#64748b' }} />
            </ListItemIcon>
            <ListItemText primary="Close Ticket" />
          </MenuItem>
        )}

        {(menuTarget?.status === 'resolved' ||
          menuTarget?.status === 'closed') && (
            <MenuItem
              onClick={() => handleChangeStatus(menuTarget, 'open')}
              sx={{ py: 1 }}
            >
              <ListItemIcon>
                <MailIcon fontSize="small" sx={{ color: '#667eea' }} />
              </ListItemIcon>
              <ListItemText primary="Reopen Ticket" />
            </MenuItem>
          )}

        <Divider sx={{ my: 0.5 }} />

        <Typography
          variant="caption"
          color="#94a3b8"
          sx={{ px: 2, py: 0.5, display: 'block' }}
        >
          Change Status
        </Typography>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <MenuItem
            key={key}
            selected={menuTarget?.status === key}
            onClick={() => handleChangeStatus(menuTarget, key)}
            sx={{ py: 0.8, pl: 3 }}
          >
            <ListItemIcon sx={{ minWidth: 28, color: cfg.color }}>
              {cfg.icon}
            </ListItemIcon>
            <ListItemText
              primary={cfg.label}
              primaryTypographyProps={{
                fontSize: '0.85rem',
                color: cfg.color,
                fontWeight: menuTarget?.status === key ? 700 : 400,
              }}
            />
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => handleDeleteOpen(menuTarget)}
          sx={{ py: 1, '&:hover': { bgcolor: '#ef444410' } }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ color: '#ef4444' }}
          />
        </MenuItem>
      </Menu>

      {/* ═══════════ DELETE DIALOG ═══════════ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon /> Delete Message
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Delete the message{' '}
            <strong>&quot;{deleteTarget?.subject}&quot;</strong> from{' '}
            <strong>
              {deleteTarget?.userName ||
                deleteTarget?.name ||
                'Unknown User'}
            </strong>
            ?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
            This action cannot be undone. The entire conversation will be
            permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            sx={{ textTransform: 'none', color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            {deleting ? 'Deleting...' : 'Delete Message'}
          </Button>
        </DialogActions>
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
    </Box>
  );
}