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
Avatar,
Badge,
Button,
Switch,
FormControlLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PaymentIcon from '@mui/icons-material/Payment';
import MailIcon from '@mui/icons-material/Mail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CircleIcon from '@mui/icons-material/Circle';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ForumIcon from '@mui/icons-material/Forum';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';

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

// ─── Notification Type Config ───
const NOTIFICATION_TYPES = {
new_user: {
label: 'New User Signup',
shortLabel: 'New User',
icon: <PersonAddIcon />,
color: '#667eea',
gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
bgLight: '#667eea12',
},
premium_request: {
label: 'Premium Request',
shortLabel: 'Premium',
icon: <WorkspacePremiumIcon />,
color: '#8b5cf6',
gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
bgLight: '#8b5cf612',
},
payment: {
label: 'Payment Submitted',
shortLabel: 'Payment',
icon: <PaymentIcon />,
color: '#10b981',
gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
bgLight: '#10b98112',
},
new_message: {
label: 'New Message',
shortLabel: 'Message',
icon: <MailIcon />,
color: '#f59e0b',
gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
bgLight: '#f59e0b12',
},
};

// ─── Mock Notifications ───
const INITIAL_NOTIFICATIONS = [
{
id: 1,
type: 'new_user',
title: 'New user registered',
message: 'John Smith has created a new account using email john@example.com',
userName: 'John Smith',
userEmail: 'john@example.com',
isRead: false,
isPinned: false,
createdAt: '2025-06-18T15:45:00',
metadata: { signupMethod: 'Email', plan: 'Free' },
},
{
id: 2,
type: 'payment',
title: 'Payment received',
message: 'Sarah Johnson has submitted a payment of $9.99 for Premium Monthly plan',
userName: 'Sarah Johnson',
userEmail: 'sarah@example.com',
isRead: false,
isPinned: false,
createdAt: '2025-06-18T15:30:00',
metadata: { amount: '$9.99', plan: 'Premium Monthly', transactionId: 'TXN-7842' },
},
{
id: 3,
type: 'premium_request',
title: 'Premium upgrade request',
message: 'Michael Chen has requested to upgrade to Premium plan',
userName: 'Michael Chen',
userEmail: 'michael@example.com',
isRead: false,
isPinned: true,
createdAt: '2025-06-18T14:20:00',
metadata: { currentPlan: 'Free', requestedPlan: 'Premium Annual' },
},
{
id: 4,
type: 'new_message',
title: 'New support message',
message: 'Emily Davis sent a message: "I need help with my CV template alignment issues..."',
userName: 'Emily Davis',
userEmail: 'emily@example.com',
isRead: false,
isPinned: false,
createdAt: '2025-06-18T13:10:00',
metadata: { category: 'Bug Report', priority: 'High' },
},
{
id: 5,
type: 'new_user',
title: 'New user registered',
message: 'Alex Wilson has created a new account using Google OAuth',
userName: 'Alex Wilson',
userEmail: 'alex@example.com',
isRead: true,
isPinned: false,
createdAt: '2025-06-18T11:00:00',
metadata: { signupMethod: 'Google', plan: 'Free' },
},
{
id: 6,
type: 'payment',
title: 'Payment received',
message: 'David Brown has submitted a payment of $79.99 for Premium Annual plan',
userName: 'David Brown',
userEmail: 'david@example.com',
isRead: true,
isPinned: false,
createdAt: '2025-06-18T09:45:00',
metadata: { amount: '$79.99', plan: 'Premium Annual', transactionId: 'TXN-7839' },
},
{
id: 7,
type: 'new_message',
title: 'New support message',
message: 'Lisa Anderson sent a message: "How do I change the font in my CV?"',
userName: 'Lisa Anderson',
userEmail: 'lisa@example.com',
isRead: true,
isPinned: false,
createdAt: '2025-06-17T16:30:00',
metadata: { category: 'General', priority: 'Low' },
},
{
id: 8,
type: 'premium_request',
title: 'Premium upgrade request',
message: 'Rachel Green has requested to upgrade to Premium plan',
userName: 'Rachel Green',
userEmail: 'rachel@example.com',
isRead: true,
isPinned: false,
createdAt: '2025-06-17T14:15:00',
metadata: { currentPlan: 'Free', requestedPlan: 'Premium Monthly' },
},
{
id: 9,
type: 'new_user',
title: 'New user registered',
message: 'Tom Harris has created a new account using email tom@example.com',
userName: 'Tom Harris',
userEmail: 'tom@example.com',
isRead: true,
isPinned: false,
createdAt: '2025-06-17T10:20:00',
metadata: { signupMethod: 'Email', plan: 'Free' },
},
{
id: 10,
type: 'payment',
title: 'Payment received',
message: 'Nina Patel has submitted a payment of $9.99 for Premium Monthly plan',
userName: 'Nina Patel',
userEmail: 'nina@example.com',
isRead: true,
isPinned: false,
createdAt: '2025-06-16T15:00:00',
metadata: { amount: '$9.99', plan: 'Premium Monthly', transactionId: 'TXN-7821' },
},
{
id: 11,
type: 'new_message',
title: 'New support message',
message: 'John Smith sent a message: "The PDF export is not working properly"',
userName: 'John Smith',
userEmail: 'john@example.com',
isRead: true,
isPinned: false,
createdAt: '2025-06-16T11:30:00',
metadata: { category: 'Bug Report', priority: 'High' },
},
{
id: 12,
type: 'new_user',
title: 'New user registered',
message: 'Karen White has created a new account using LinkedIn OAuth',
userName: 'Karen White',
userEmail: 'karen@example.com',
isRead: true,
isPinned: false,
createdAt: '2025-06-15T09:00:00',
metadata: { signupMethod: 'LinkedIn', plan: 'Free' },
},
{
id: 13,
type: 'premium_request',
title: 'Premium upgrade request',
message: 'Sam Taylor has requested to upgrade to Premium plan',
userName: 'Sam Taylor',
userEmail: 'sam@example.com',
isRead: true,
isPinned: false,
createdAt: '2025-06-14T13:45:00',
metadata: { currentPlan: 'Free', requestedPlan: 'Premium Annual' },
},
{
id: 14,
type: 'payment',
title: 'Payment failed',
message: 'James Lee payment of $9.99 has failed. Card declined.',
userName: 'James Lee',
userEmail: 'james@example.com',
isRead: false,
isPinned: true,
createdAt: '2025-06-18T16:00:00',
metadata: { amount: '$9.99', plan: 'Premium Monthly', transactionId: 'TXN-7845', status: 'failed' },
},
];

export default function AdminNotificationsPage() {
// ─── State ───
const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
const [searchQuery, setSearchQuery] = useState('');
const [activeTab, setActiveTab] = useState('all');
const [typeFilter, setTypeFilter] = useState('all');
const [sortBy, setSortBy] = useState('newest');
const [sortAnchorEl, setSortAnchorEl] = useState(null);
const [menuAnchorEl, setMenuAnchorEl] = useState(null);
const [menuTarget, setMenuTarget] = useState(null);

// Detail view
const [detailOpen, setDetailOpen] = useState(false);
const [detailTarget, setDetailTarget] = useState(null);

// Settings
const [settingsOpen, setSettingsOpen] = useState(false);
const [notifSettings, setNotifSettings] = useState({
new_user: true,
premium_request: true,
payment: true,
new_message: true,
sound: true,
desktop: true,
email: false,
});

// Dialogs
const [clearDialogOpen, setClearDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [deleteTarget, setDeleteTarget] = useState(null);

const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

// ─── Computed Stats ───
const totalNotifications = notifications.length;
const unreadCount = notifications.filter((n) => !n.isRead).length;
const newUserCount = notifications.filter((n) => n.type === 'new_user').length;
const premiumRequestCount = notifications.filter((n) => n.type === 'premium_request').length;
const paymentCount = notifications.filter((n) => n.type === 'payment').length;
const messageCount = notifications.filter((n) => n.type === 'new_message').length;

const todayCount = notifications.filter(
(n) => new Date(n.createdAt).toDateString() === new Date().toDateString()
).length;

const unreadByType = useMemo(() => {
const counts = { new_user: 0, premium_request: 0, payment: 0, new_message: 0 };
notifications.filter((n) => !n.isRead).forEach((n) => { counts[n.type] = (counts[n.type] || 0) + 1; });
return counts;
}, [notifications]);

// ─── Filtered ───
const filteredNotifications = useMemo(() => {
let result = notifications.filter((n) => {
const matchesSearch =
n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
n.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
n.userEmail.toLowerCase().includes(searchQuery.toLowerCase());



  const matchesTab =
    activeTab === 'all' ||
    (activeTab === 'unread' && !n.isRead) ||
    (activeTab === 'pinned' && n.isPinned) ||
    activeTab === n.type;

  const matchesType = typeFilter === 'all' || n.type === typeFilter;

  return matchesSearch && matchesTab && matchesType;
});

result.sort((a, b) => {
  if (a.isPinned && !b.isPinned) return -1;
  if (!a.isPinned && b.isPinned) return 1;
  if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
  if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
  return 0;
});

return result;
}, [notifications, searchQuery, activeTab, typeFilter, sortBy]);

// ─── Group by date ───
const groupedNotifications = useMemo(() => {
const groups = {};
const today = new Date().toDateString();
const yesterday = new Date(Date.now() - 86400000).toDateString();



filteredNotifications.forEach((n) => {
  const dateStr = new Date(n.createdAt).toDateString();
  let label;
  if (dateStr === today) label = 'Today';
  else if (dateStr === yesterday) label = 'Yesterday';
  else label = new Date(n.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (!groups[label]) groups[label] = [];
  groups[label].push(n);
});

return groups;
}, [filteredNotifications]);

// ─── Handlers ───
const handleMarkAsRead = (notif) => {
setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)));
};

const handleMarkAsUnread = (notif) => {
setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isRead: false } : n)));
};

const handleToggleRead = (notif) => {
if (notif.isRead) handleMarkAsUnread(notif);
else handleMarkAsRead(notif);
handleMenuClose();
};

const handleTogglePin = (notif) => {
setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isPinned: !n.isPinned } : n)));
handleMenuClose();
setSnackbar({ open: true, message: notif.isPinned ? 'Notification unpinned.' : 'Notification pinned.', severity: 'info' });
};

const handleMarkAllAsRead = () => {
setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
setSnackbar({ open: true, message: 'All notifications marked as read.', severity: 'success' });
};

const handleClearAllRead = () => {
setNotifications((prev) => prev.filter((n) => !n.isRead || n.isPinned));
setClearDialogOpen(false);
setSnackbar({ open: true, message: 'Read notifications cleared.', severity: 'success' });
};

const handleDeleteNotification = (notif) => {
setDeleteTarget(notif);
setDeleteDialogOpen(true);
handleMenuClose();
};

const handleDeleteConfirm = () => {
setNotifications((prev) => prev.filter((n) => n.id !== deleteTarget.id));
setDeleteDialogOpen(false);
setSnackbar({ open: true, message: 'Notification deleted.', severity: 'warning' });
};

const handleViewDetail = (notif) => {
setDetailTarget(notif);
setDetailOpen(true);
if (!notif.isRead) handleMarkAsRead(notif);
handleMenuClose();
};

const handleMenuOpen = (e, notif) => {
e.stopPropagation();
setMenuAnchorEl(e.currentTarget);
setMenuTarget(notif);
};

const handleMenuClose = () => {
setMenuAnchorEl(null);
setMenuTarget(null);
};

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
🔔 Notifications
</Typography>
<Typography variant="body2" color="#64748b">
Stay updated with user activity and system alerts
</Typography>
</Box>



    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
      {unreadCount > 0 && (
        <Chip
          icon={<NotificationsActiveIcon sx={{ fontSize: 16 }} />}
          label={`${unreadCount} unread`}
          sx={{ fontWeight: 600, bgcolor: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}
        />
      )}
      <Tooltip title="Mark all as read">
        <span>
          <IconButton
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}
          >
            <DoneAllIcon sx={{ fontSize: 20, color: unreadCount > 0 ? '#667eea' : '#cbd5e1' }} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Notification Settings">
        <IconButton
          onClick={() => setSettingsOpen(true)}
          sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}
        >
          <SettingsIcon sx={{ fontSize: 20, color: '#64748b' }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Refresh">
        <IconButton sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}>
          <RefreshIcon sx={{ fontSize: 20, color: '#64748b' }} />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>

  {/* ─── Stats Cards ─── */}
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(5, 1fr)' },
      gap: 2,
      mb: 4,
    }}
  >
    {[
      {
        label: 'Unread',
        value: unreadCount,
        sub: `${todayCount} today`,
        icon: <NotificationsActiveIcon />,
        color: '#ef4444',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      },
      {
        label: 'New Users',
        value: newUserCount,
        sub: `${unreadByType.new_user} unread`,
        icon: <PersonAddIcon />,
        color: '#667eea',
        gradient: NOTIFICATION_TYPES.new_user.gradient,
      },
      {
        label: 'Premium Requests',
        value: premiumRequestCount,
        sub: `${unreadByType.premium_request} unread`,
        icon: <WorkspacePremiumIcon />,
        color: '#8b5cf6',
        gradient: NOTIFICATION_TYPES.premium_request.gradient,
      },
      {
        label: 'Payments',
        value: paymentCount,
        sub: `${unreadByType.payment} unread`,
        icon: <PaymentIcon />,
        color: '#10b981',
        gradient: NOTIFICATION_TYPES.payment.gradient,
      },
      {
        label: 'Messages',
        value: messageCount,
        sub: `${unreadByType.new_message} unread`,
        icon: <MailIcon />,
        color: '#f59e0b',
        gradient: NOTIFICATION_TYPES.new_message.gradient,
      },
    ].map((stat, i) => (
      <Box
        key={i}
        sx={{
          bgcolor: '#ffffff',
          p: 2.5,
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: stat.gradient,
            opacity: 0.08,
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              background: stat.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              '& .MuiSvgIcon-root': { fontSize: 22 },
            }}
          >
            {stat.icon}
          </Box>
        </Box>
        <Typography variant="h5" fontWeight="800" color="#1e293b" sx={{ mb: 0.3 }}>
          {stat.value}
        </Typography>
        <Typography variant="body2" fontWeight="600" color="#64748b">
          {stat.label}
        </Typography>
        <Typography variant="caption" color="#94a3b8">
          {stat.sub}
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
      '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 40 },
      '& .Mui-selected': { color: '#667eea' },
      '& .MuiTabs-indicator': { backgroundColor: '#667eea', height: 3, borderRadius: '3px 3px 0 0' },
    }}
  >
    <Tab label={`All (${totalNotifications})`} value="all" />
    <Tab
      label={
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}
        >
          <Box sx={{ pr: 1.5 }}>Unread</Box>
        </Badge>
      }
      value="unread"
    />
    <Tab
      icon={<PersonAddIcon sx={{ fontSize: 16 }} />}
      iconPosition="start"
      label={`New Users (${newUserCount})`}
      value="new_user"
    />
    <Tab
      icon={<WorkspacePremiumIcon sx={{ fontSize: 16 }} />}
      iconPosition="start"
      label={`Premium (${premiumRequestCount})`}
      value="premium_request"
    />
    <Tab
      icon={<PaymentIcon sx={{ fontSize: 16 }} />}
      iconPosition="start"
      label={`Payments (${paymentCount})`}
      value="payment"
    />
    <Tab
      icon={<MailIcon sx={{ fontSize: 16 }} />}
      iconPosition="start"
      label={`Messages (${messageCount})`}
      value="new_message"
    />
    <Tab label="Pinned" value="pinned" />
  </Tabs>

  {/* ─── Search & Filters ─── */}
  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
    <TextField
      placeholder="Search notifications..."
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

    <FormControl size="small" sx={{ minWidth: 160 }}>
      <Select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        displayEmpty
        sx={{
          borderRadius: 2,
          bgcolor: '#ffffff',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
        }}
      >
        <MenuItem value="all">All Types</MenuItem>
        {Object.entries(NOTIFICATION_TYPES).map(([key, cfg]) => (
          <MenuItem key={key} value={key}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: cfg.color }}>
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

    <Box sx={{ flex: 1 }} />

    <Button
      size="small"
      startIcon={<ClearAllIcon />}
      onClick={() => setClearDialogOpen(true)}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        color: '#94a3b8',
        borderRadius: 2,
        '&:hover': { bgcolor: '#f1f5f9', color: '#64748b' },
      }}
    >
      Clear Read
    </Button>
  </Box>

  {/* Results */}
  <Typography variant="body2" color="#94a3b8" sx={{ mb: 2 }}>
    {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
  </Typography>

  {/* ─── Notification List (Grouped by Date) ─── */}
  {filteredNotifications.length === 0 ? (
    <Box
      sx={{
        textAlign: 'center',
        py: 10,
        bgcolor: '#ffffff',
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <NotificationsNoneIcon sx={{ fontSize: 56, color: '#e2e8f0', mb: 2 }} />
      <Typography variant="h6" fontWeight="600" color="#94a3b8">
        No notifications
      </Typography>
      <Typography variant="body2" color="#cbd5e1" sx={{ mt: 0.5 }}>
        You&apos;re all caught up! 🎉
      </Typography>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {Object.entries(groupedNotifications).map(([dateLabel, notifs]) => (
        <Box key={dateLabel}>
          {/* Date Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
            <Typography variant="body2" fontWeight="700" color="#64748b">
              {dateLabel}
            </Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: '#e2e8f0' }} />
            <Chip
              label={`${notifs.length}`}
              size="small"
              sx={{ fontWeight: 600, fontSize: '0.65rem', height: 20, bgcolor: '#f1f5f9', color: '#64748b' }}
            />
          </Box>

          {/* Notifications */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            {notifs.map((notif, index) => {
              const typeConfig = NOTIFICATION_TYPES[notif.type];
              return (
                <Box
                  key={notif.id}
                  onClick={() => handleViewDetail(notif)}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    pr: 1.5,
                    cursor: 'pointer',
                    borderBottom:
                      index < notifs.length - 1 ? '1px solid #f1f5f9' : 'none',
                    bgcolor: !notif.isRead ? '#f0f4ff' : 'transparent',
                    borderLeft: !notif.isRead
                      ? `3px solid ${typeConfig.color}`
                      : '3px solid transparent',
                    transition: 'all 0.15s ease',
                    '&:hover': { bgcolor: !notif.isRead ? '#e8edff' : '#f8fafc' },
                    position: 'relative',
                  }}
                >
                  {/* Pinned indicator */}
                  {notif.isPinned && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 42,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#f59e0b',
                      }}
                    />
                  )}

                  {/* Icon */}
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      background: typeConfig.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                      '& .MuiSvgIcon-root': { fontSize: 22 },
                    }}
                  >
                    {typeConfig.icon}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          fontWeight={notif.isRead ? 600 : 700}
                          color="#1e293b"
                        >
                          {notif.title}
                        </Typography>
                        {!notif.isRead && (
                          <CircleIcon sx={{ fontSize: 8, color: typeConfig.color }} />
                        )}
                      </Box>
                      <Typography variant="caption" color="#94a3b8" sx={{ flexShrink: 0, ml: 1 }}>
                        {formatDate(notif.createdAt)}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="#64748b"
                      sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {notif.message}
                    </Typography>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Chip
                        label={typeConfig.shortLabel}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.6rem',
                          height: 20,
                          bgcolor: typeConfig.bgLight,
                          color: typeConfig.color,
                        }}
                      />

                      <Chip
                        avatar={
                          <Avatar
                            sx={{
                              width: 16,
                              height: 16,
                              fontSize: '0.5rem',
                              bgcolor: `${typeConfig.color}30`,
                              color: typeConfig.color,
                            }}
                          >
                            {getInitials(notif.userName)}
                          </Avatar>
                        }
                        label={notif.userName}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.65rem',
                          height: 20,
                          bgcolor: '#f1f5f9',
                          color: '#64748b',
                        }}
                      />

                      {/* Metadata chips */}
                      {notif.type === 'payment' && notif.metadata?.amount && (
                        <Chip
                          label={notif.metadata.amount}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.6rem',
                            height: 20,
                            bgcolor:
                              notif.metadata?.status === 'failed' ? '#ef444415' : '#10b98115',
                            color:
                              notif.metadata?.status === 'failed' ? '#ef4444' : '#10b981',
                          }}
                        />
                      )}
                      {notif.type === 'premium_request' && notif.metadata?.requestedPlan && (
                        <Chip
                          label={notif.metadata.requestedPlan}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.6rem',
                            height: 20,
                            bgcolor: '#8b5cf612',
                            color: '#8b5cf6',
                          }}
                        />
                      )}
                      {notif.type === 'new_message' && notif.metadata?.priority && (
                        <Chip
                          label={notif.metadata.priority}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.6rem',
                            height: 20,
                            bgcolor:
                              notif.metadata.priority === 'High'
                                ? '#ef444415'
                                : '#94a3b815',
                            color:
                              notif.metadata.priority === 'High' ? '#ef4444' : '#64748b',
                          }}
                        />
                      )}
                      {notif.type === 'new_user' && notif.metadata?.signupMethod && (
                        <Chip
                          label={`via ${notif.metadata.signupMethod}`}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.6rem',
                            height: 20,
                            bgcolor: '#f1f5f9',
                            color: '#94a3b8',
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Menu */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, notif)}
                    sx={{ alignSelf: 'flex-start', mt: 0.3 }}
                  >
                    <MoreVertIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  )}

  {/* ═══════════ CONTEXT MENU ═══════════ */}
  <Menu
    anchorEl={menuAnchorEl}
    open={Boolean(menuAnchorEl)}
    onClose={handleMenuClose}
    PaperProps={{
      sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 200 },
    }}
  >
    <MenuItem onClick={() => handleViewDetail(menuTarget)} sx={{ py: 1 }}>
      <ListItemIcon>
        <VisibilityIcon fontSize="small" sx={{ color: '#667eea' }} />
      </ListItemIcon>
      <ListItemText primary="View Details" />
    </MenuItem>

    <MenuItem onClick={() => handleToggleRead(menuTarget)} sx={{ py: 1 }}>
      <ListItemIcon>
        {menuTarget?.isRead ? (
          <MarkEmailUnreadIcon fontSize="small" sx={{ color: '#f59e0b' }} />
        ) : (
          <MarkEmailReadIcon fontSize="small" sx={{ color: '#10b981' }} />
        )}
      </ListItemIcon>
      <ListItemText primary={menuTarget?.isRead ? 'Mark as Unread' : 'Mark as Read'} />
    </MenuItem>

    <MenuItem onClick={() => handleTogglePin(menuTarget)} sx={{ py: 1 }}>
      <ListItemIcon>
        {menuTarget?.isPinned ? (
          <StarIcon fontSize="small" sx={{ color: '#f59e0b' }} />
        ) : (
          <StarIcon fontSize="small" sx={{ color: '#cbd5e1' }} />
        )}
      </ListItemIcon>
      <ListItemText primary={menuTarget?.isPinned ? 'Unpin' : 'Pin'} />
    </MenuItem>

    <Divider sx={{ my: 0.5 }} />

    <MenuItem
      onClick={() => handleDeleteNotification(menuTarget)}
      sx={{ py: 1, '&:hover': { bgcolor: '#ef444410' } }}
    >
      <ListItemIcon>
        <DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} />
      </ListItemIcon>
      <ListItemText primary="Delete" primaryTypographyProps={{ color: '#ef4444' }} />
    </MenuItem>
  </Menu>

  {/* ═══════════ DETAIL DIALOG ═══════════ */}
  <Dialog
    open={detailOpen}
    onClose={() => setDetailOpen(false)}
    maxWidth="sm"
    fullWidth
    PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
  >
    {detailTarget && (() => {
      const typeConfig = NOTIFICATION_TYPES[detailTarget.type];
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
                  {detailTarget.title}
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
            {/* User Info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                borderRadius: 2,
                bgcolor: '#f8fafc',
                mb: 2.5,
              }}
            >
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: `${typeConfig.color}20`,
                  color: typeConfig.color,
                  fontWeight: 700,
                }}
              >
                {getInitials(detailTarget.userName)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1e293b">
                  {detailTarget.userName}
                </Typography>
                <Typography variant="caption" color="#94a3b8">
                  {detailTarget.userEmail}
                </Typography>
              </Box>
            </Box>

            {/* Message */}
            <Typography variant="body2" color="#1e293b" sx={{ mb: 2.5, lineHeight: 1.7 }}>
              {detailTarget.message}
            </Typography>

            {/* Metadata */}
            {detailTarget.metadata && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: typeConfig.bgLight,
                  border: `1px solid ${typeConfig.color}20`,
                  mb: 2,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="700"
                  color={typeConfig.color}
                  sx={{ mb: 1, display: 'block' }}
                >
                  DETAILS
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1.5,
                  }}
                >
                  {Object.entries(detailTarget.metadata).map(([key, value]) => (
                    <Box key={key}>
                      <Typography variant="caption" color="#94a3b8" sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </Typography>
                      <Typography variant="body2" fontWeight="600" color="#1e293b">
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Timestamp */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{formatFullDate(detailTarget.createdAt)}</Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
            <Button
              onClick={() => {
                handleDeleteNotification(detailTarget);
                setDetailOpen(false);
              }}
              sx={{ textTransform: 'none', color: '#ef4444', fontWeight: 600 }}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={() => setDetailOpen(false)}
                sx={{ textTransform: 'none', color: '#64748b' }}
              >
                Close
              </Button>
              {detailTarget.type === 'new_message' && (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#5a6fd6' },
                  }}
                >
                  Go to Messages
                </Button>
              )}
              {detailTarget.type === 'premium_request' && (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#8b5cf6',
                    '&:hover': { bgcolor: '#7c3aed' },
                  }}
                >
                  Review Request
                </Button>
              )}
              {detailTarget.type === 'payment' && (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' },
                  }}
                >
                  View Payment
                </Button>
              )}
              {detailTarget.type === 'new_user' && (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#5a6fd6' },
                  }}
                >
                  View User
                </Button>
              )}
            </Box>
          </DialogActions>
        </>
      );
    })()}
  </Dialog>

  {/* ═══════════ SETTINGS DIALOG ═══════════ */}
  <Dialog
    open={settingsOpen}
    onClose={() => setSettingsOpen(false)}
    maxWidth="xs"
    fullWidth
    PaperProps={{ sx: { borderRadius: 3 } }}
  >
    <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
      <SettingsIcon sx={{ color: '#667eea' }} />
      Notification Settings
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="#64748b" sx={{ mb: 2.5 }}>
        Choose which notifications you want to receive
      </Typography>

      {/* Notification Types */}
      <Typography variant="caption" fontWeight="700" color="#94a3b8" sx={{ mb: 1.5, display: 'block' }}>
        NOTIFICATION TYPES
      </Typography>

      {Object.entries(NOTIFICATION_TYPES).map(([key, cfg]) => (
        <Box
          key={key}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 2,
            mb: 1,
            bgcolor: notifSettings[key] ? `${cfg.color}08` : '#f8fafc',
            border: `1px solid ${notifSettings[key] ? `${cfg.color}20` : '#f1f5f9'}`,
            transition: 'all 0.2s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: cfg.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                '& .MuiSvgIcon-root': { fontSize: 16 },
              }}
            >
              {cfg.icon}
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1e293b">
                {cfg.label}
              </Typography>
            </Box>
          </Box>
          <Switch
            checked={notifSettings[key]}
            onChange={(e) =>
              setNotifSettings((prev) => ({ ...prev, [key]: e.target.checked }))
            }
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: cfg.color },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: cfg.color,
              },
            }}
          />
        </Box>
      ))}

      <Divider sx={{ my: 2.5 }} />

      {/* Delivery preferences */}
      <Typography variant="caption" fontWeight="700" color="#94a3b8" sx={{ mb: 1.5, display: 'block' }}>
        DELIVERY
      </Typography>

      {[
        {
          key: 'sound',
          label: 'Sound Alerts',
          desc: 'Play a sound for new notifications',
          icon: notifSettings.sound ? (
            <VolumeUpIcon sx={{ fontSize: 18 }} />
          ) : (
            <VolumeOffIcon sx={{ fontSize: 18 }} />
          ),
        },
        {
          key: 'desktop',
          label: 'Desktop Notifications',
          desc: 'Show browser push notifications',
          icon: <NotificationsActiveIcon sx={{ fontSize: 18 }} />,
        },
        {
          key: 'email',
          label: 'Email Notifications',
          desc: 'Receive email for important alerts',
          icon: <MailIcon sx={{ fontSize: 18 }} />,
        },
      ].map((pref) => (
        <Box
          key={pref.key}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 2,
            mb: 1,
            bgcolor: '#f8fafc',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ color: '#64748b' }}>{pref.icon}</Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1e293b">
                {pref.label}
              </Typography>
              <Typography variant="caption" color="#94a3b8">
                {pref.desc}
              </Typography>
            </Box>
          </Box>
          <Switch
            checked={notifSettings[pref.key]}
            onChange={(e) =>
              setNotifSettings((prev) => ({ ...prev, [pref.key]: e.target.checked }))
            }
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#667eea' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#667eea',
              },
            }}
          />
        </Box>
      ))}
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={() => setSettingsOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setSettingsOpen(false);
          setSnackbar({
            open: true,
            message: 'Notification settings saved!',
            severity: 'success',
          });
        }}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          bgcolor: '#667eea',
          '&:hover': { bgcolor: '#5a6fd6' },
        }}
      >
        Save Settings
      </Button>
    </DialogActions>
  </Dialog>

  {/* ═══════════ CLEAR READ DIALOG ═══════════ */}
  <Dialog
    open={clearDialogOpen}
    onClose={() => setClearDialogOpen(false)}
    PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
  >
    <DialogTitle sx={{ fontWeight: 700, color: '#f59e0b' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon /> Clear Read Notifications
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="#64748b">
        This will remove all read notifications (pinned notifications will be kept). This action
        cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button
        onClick={() => setClearDialogOpen(false)}
        sx={{ textTransform: 'none', color: '#64748b' }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleClearAllRead}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          bgcolor: '#f59e0b',
          '&:hover': { bgcolor: '#d97706' },
        }}
      >
        Clear Read
      </Button>
    </DialogActions>
  </Dialog>

  {/* ═══════════ DELETE DIALOG ═══════════ */}
  <Dialog
    open={deleteDialogOpen}
    onClose={() => setDeleteDialogOpen(false)}
    PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
  >
    <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon /> Delete Notification
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="#64748b">
        Delete this notification? This action cannot be undone.
      </Typography>
      {deleteTarget && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="body2" fontWeight="600" color="#1e293b">
            {deleteTarget.title}
          </Typography>
          <Typography variant="caption" color="#94a3b8">
            {deleteTarget.message}
          </Typography>
        </Box>
      )}
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button
        onClick={() => setDeleteDialogOpen(false)}
        sx={{ textTransform: 'none', color: '#64748b' }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleDeleteConfirm}
        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>

  {/* ═══════════ SNACKBAR ═══════════ */}
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






