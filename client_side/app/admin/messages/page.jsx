'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
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
Badge,
Button,
Collapse,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import MailIcon from '@mui/icons-material/Mail';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingIcon from '@mui/icons-material/Pending';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FlagIcon from '@mui/icons-material/Flag';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LabelIcon from '@mui/icons-material/Label';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ForumIcon from '@mui/icons-material/Forum';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BugReportIcon from '@mui/icons-material/BugReport';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// ─── Helpers ───
const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

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
weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
hour: '2-digit', minute: '2-digit',
});

// ─── Category / Priority Config ───
const TICKET_CATEGORIES = [
{ value: 'general', label: 'General', icon: <HelpOutlineIcon sx={{ fontSize: 16 }} />, color: '#667eea' },
{ value: 'bug', label: 'Bug Report', icon: <BugReportIcon sx={{ fontSize: 16 }} />, color: '#ef4444' },
{ value: 'billing', label: 'Billing', icon: <PaymentIcon sx={{ fontSize: 16 }} />, color: '#f59e0b' },
{ value: 'feature', label: 'Feature Request', icon: <BuildIcon sx={{ fontSize: 16 }} />, color: '#8b5cf6' },
{ value: 'account', label: 'Account', icon: <PersonIcon sx={{ fontSize: 16 }} />, color: '#06b6d4' },
{ value: 'template', label: 'Templates', icon: <LabelIcon sx={{ fontSize: 16 }} />, color: '#ec4899' },
];

const PRIORITY_CONFIG = {
low: { label: 'Low', color: '#10b981', bgcolor: '#10b98115' },
medium: { label: 'Medium', color: '#f59e0b', bgcolor: '#f59e0b15' },
high: { label: 'High', color: '#ef4444', bgcolor: '#ef444415' },
urgent: { label: 'Urgent', color: '#dc2626', bgcolor: '#dc262615' },
};

const STATUS_CONFIG = {
open: { label: 'Open', color: '#667eea', bgcolor: '#667eea15', icon: <MailIcon sx={{ fontSize: 16 }} /> },
'in-progress': { label: 'In Progress', color: '#f59e0b', bgcolor: '#f59e0b15', icon: <PendingIcon sx={{ fontSize: 16 }} /> },
resolved: { label: 'Resolved', color: '#10b981', bgcolor: '#10b98115', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
closed: { label: 'Closed', color: '#94a3b8', bgcolor: '#94a3b815', icon: <DoneAllIcon sx={{ fontSize: 16 }} /> },
};

const getCategoryConfig = (val) => TICKET_CATEGORIES.find((c) => c.value === val) || TICKET_CATEGORIES[0];

// ─── Mock Messages ───
const INITIAL_MESSAGES = [
{
id: 1,
userName: 'John Smith',
userEmail: 'john@example.com',
isPremiumUser: true,
subject: 'Cannot download my CV as PDF',
category: 'bug',
priority: 'high',
status: 'open',
isRead: false,
isStarred: true,
createdAt: '2025-06-18T14:30:00',
updatedAt: '2025-06-18T14:30:00',
conversation: [
{
id: 'msg-1-1',
sender: 'user',
senderName: 'John Smith',
message: "Hi, I've been trying to download my CV as a PDF but keep getting an error message saying 'Export failed'. I've tried multiple times with different browsers (Chrome and Firefox). This is urgent as I have a job application deadline tomorrow. Please help!",
timestamp: '2025-06-18T14:30:00',
attachments: [],
},
],
},
{
id: 2,
userName: 'Sarah Johnson',
userEmail: 'sarah@example.com',
isPremiumUser: false,
subject: 'How to upgrade to Premium?',
category: 'billing',
priority: 'medium',
status: 'in-progress',
isRead: true,
isStarred: false,
createdAt: '2025-06-18T10:15:00',
updatedAt: '2025-06-18T12:30:00',
conversation: [
{
id: 'msg-2-1',
sender: 'user',
senderName: 'Sarah Johnson',
message: "Hello! I'd like to upgrade to the Premium plan. Can you tell me what payment methods you accept? Also, is there a student discount available?",
timestamp: '2025-06-18T10:15:00',
attachments: [],
},
{
id: 'msg-2-2',
sender: 'admin',
senderName: 'Support Team',
message: "Hi Sarah! Thanks for your interest in Premium. We accept all major credit cards, PayPal, and bank transfers. Unfortunately, we don't have a student discount at the moment, but we do have a 20% off annual plan. Would you like me to send you the details?",
timestamp: '2025-06-18T12:30:00',
attachments: [],
},
],
},
{
id: 3,
userName: 'Michael Chen',
userEmail: 'michael@example.com',
isPremiumUser: true,
subject: 'Feature Request: Add QR code to CV',
category: 'feature',
priority: 'low',
status: 'open',
isRead: true,
isStarred: false,
createdAt: '2025-06-17T16:45:00',
updatedAt: '2025-06-17T16:45:00',
conversation: [
{
id: 'msg-3-1',
sender: 'user',
senderName: 'Michael Chen',
message: 'It would be great if you could add an option to include a QR code in the CV that links to a portfolio or LinkedIn profile. Many modern CVs include this feature. Thanks for considering!',
timestamp: '2025-06-17T16:45:00',
attachments: [],
},
],
},
{
id: 4,
userName: 'Emily Davis',
userEmail: 'emily@example.com',
isPremiumUser: true,
subject: 'Template colors not saving',
category: 'bug',
priority: 'medium',
status: 'resolved',
isRead: true,
isStarred: false,
createdAt: '2025-06-16T09:20:00',
updatedAt: '2025-06-17T11:00:00',
conversation: [
{
id: 'msg-4-1',
sender: 'user',
senderName: 'Emily Davis',
message: "When I customize the colors in the \"Modern Creative\" template, the changes don't save after I close the editor. I have to redo them every time I open my CV.",
timestamp: '2025-06-16T09:20:00',
attachments: [],
},
{
id: 'msg-4-2',
sender: 'admin',
senderName: 'Support Team',
message: "Hi Emily, thanks for reporting this. We've identified the issue – it was a caching problem. We've deployed a fix. Could you try again and let us know if it works?",
timestamp: '2025-06-16T15:30:00',
attachments: [],
},
{
id: 'msg-4-3',
sender: 'user',
senderName: 'Emily Davis',
message: "Yes! It's working perfectly now. Thank you for the quick fix! 🎉",
timestamp: '2025-06-17T11:00:00',
attachments: [],
},
],
},
{
id: 5,
userName: 'Alex Wilson',
userEmail: 'alex@example.com',
isPremiumUser: false,
subject: "Can't reset my password",
category: 'account',
priority: 'high',
status: 'open',
isRead: false,
isStarred: false,
createdAt: '2025-06-18T08:00:00',
updatedAt: '2025-06-18T08:00:00',
conversation: [
{
id: 'msg-5-1',
sender: 'user',
senderName: 'Alex Wilson',
message: "I'm trying to reset my password but I never receive the reset email. I've checked spam folder too. My email is alex@example.com. Please help, I can't access my account!",
timestamp: '2025-06-18T08:00:00',
attachments: [],
},
],
},
{
id: 6,
userName: 'Lisa Anderson',
userEmail: 'lisa@example.com',
isPremiumUser: false,
subject: 'Love the new templates!',
category: 'general',
priority: 'low',
status: 'closed',
isRead: true,
isStarred: true,
createdAt: '2025-06-15T14:00:00',
updatedAt: '2025-06-15T16:20:00',
conversation: [
{
id: 'msg-6-1',
sender: 'user',
senderName: 'Lisa Anderson',
message: 'Just wanted to say the new templates you added last week are amazing! The "Modern Creative" one helped me get an interview. Keep up the great work! 😊',
timestamp: '2025-06-15T14:00:00',
attachments: [],
},
{
id: 'msg-6-2',
sender: 'admin',
senderName: 'Support Team',
message: "Thank you so much Lisa! We're thrilled to hear that! Good luck with your interview – we're rooting for you! 🎉",
timestamp: '2025-06-15T16:20:00',
attachments: [],
},
],
},
{
id: 7,
userName: 'David Brown',
userEmail: 'david@example.com',
isPremiumUser: true,
subject: 'Premium template "Executive" has alignment issues',
category: 'template',
priority: 'medium',
status: 'in-progress',
isRead: true,
isStarred: false,
createdAt: '2025-06-17T11:30:00',
updatedAt: '2025-06-18T09:00:00',
conversation: [
{
id: 'msg-7-1',
sender: 'user',
senderName: 'David Brown',
message: 'The "Executive" template has some text alignment issues in the experience section. When I add more than 3 bullet points, they overlap with the next section.',
timestamp: '2025-06-17T11:30:00',
attachments: [],
},
{
id: 'msg-7-2',
sender: 'admin',
senderName: 'Support Team',
message: "Hi David, thanks for the detailed report. We've reproduced the issue and our design team is working on a fix. We expect it to be resolved within 24 hours.",
timestamp: '2025-06-18T09:00:00',
attachments: [],
},
],
},
{
id: 8,
userName: 'Nina Patel',
userEmail: 'nina@example.com',
isPremiumUser: false,
subject: 'Billing charged twice',
category: 'billing',
priority: 'urgent',
status: 'open',
isRead: false,
isStarred: true,
createdAt: '2025-06-18T15:45:00',
updatedAt: '2025-06-18T15:45:00',
conversation: [
{
id: 'msg-8-1',
sender: 'user',
senderName: 'Nina Patel',
message: 'I was charged twice for the Premium subscription! Transaction IDs: TXN-4521 and TXN-4522. Both for $9.99 on June 18. Please refund the duplicate charge immediately!',
timestamp: '2025-06-18T15:45:00',
attachments: [],
},
],
},
];

export default function AdminMessagesPage() {
// ─── State ───
const [messages, setMessages] = useState(INITIAL_MESSAGES);
const [searchQuery, setSearchQuery] = useState('');
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

const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

const replyInputRef = useRef(null);
const conversationEndRef = useRef(null);

// ─── Computed Stats ───
const totalMessages = messages.length;
const openMessages = messages.filter((m) => m.status === 'open').length;
const inProgressMessages = messages.filter((m) => m.status === 'in-progress').length;
const resolvedMessages = messages.filter((m) => m.status === 'resolved').length;
const closedMessages = messages.filter((m) => m.status === 'closed').length;
const unreadMessages = messages.filter((m) => !m.isRead).length;
const starredMessages = messages.filter((m) => m.isStarred).length;
const urgentMessages = messages.filter((m) => m.priority === 'urgent' || m.priority === 'high').length;

// ─── Filtered ───
const filteredMessages = useMemo(() => {
let result = messages.filter((m) => {
const matchesSearch =
m.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
m.userEmail.toLowerCase().includes(searchQuery.toLowerCase());



  const matchesTab =
    activeTab === 'all' ||
    (activeTab === 'open' && m.status === 'open') ||
    (activeTab === 'in-progress' && m.status === 'in-progress') ||
    (activeTab === 'resolved' && m.status === 'resolved') ||
    (activeTab === 'closed' && m.status === 'closed') ||
    (activeTab === 'unread' && !m.isRead) ||
    (activeTab === 'starred' && m.isStarred);

  const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
  const matchesPriority = priorityFilter === 'all' || m.priority === priorityFilter;

  return matchesSearch && matchesTab && matchesCategory && matchesPriority;
});

result.sort((a, b) => {
  if (sortBy === 'newest') return new Date(b.updatedAt) - new Date(a.updatedAt);
  if (sortBy === 'oldest') return new Date(a.updatedAt) - new Date(b.updatedAt);
  if (sortBy === 'priority') {
    const order = { urgent: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  }
  return 0;
});

return result;
}, [messages, searchQuery, activeTab, categoryFilter, priorityFilter, sortBy]);

// ─── Scroll to bottom on new message ───
useEffect(() => {
if (conversationEndRef.current) {
conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
}
}, [selectedMessage?.conversation?.length]);

// ─── Handlers ───
const handleSelectMessage = (msg) => {
setSelectedMessage(msg);
setReplyText('');
if (!msg.isRead) {
setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, isRead: true } : m));
}
};

const handleBackToList = () => {
setSelectedMessage(null);
setReplyText('');
};

const handleSendReply = () => {
if (!replyText.trim() || !selectedMessage) return;



const newReply = {
  id: `msg-${selectedMessage.id}-${Date.now()}`,
  sender: 'admin',
  senderName: 'Support Team',
  message: replyText.trim(),
  timestamp: new Date().toISOString(),
  attachments: [],
};

setMessages((prev) =>
  prev.map((m) =>
    m.id === selectedMessage.id
      ? {
          ...m,
          conversation: [...m.conversation, newReply],
          updatedAt: new Date().toISOString(),
          status: m.status === 'open' ? 'in-progress' : m.status,
        }
      : m
  )
);

setSelectedMessage((prev) => ({
  ...prev,
  conversation: [...prev.conversation, newReply],
  updatedAt: new Date().toISOString(),
  status: prev.status === 'open' ? 'in-progress' : prev.status,
}));

setReplyText('');
setSnackbar({ open: true, message: 'Reply sent successfully!', severity: 'success' });
};

const handleMarkAsResolved = (msg) => {
const target = msg || selectedMessage;
if (!target) return;



setMessages((prev) =>
  prev.map((m) => m.id === target.id ? { ...m, status: 'resolved', updatedAt: new Date().toISOString() } : m)
);

if (selectedMessage?.id === target.id) {
  setSelectedMessage((prev) => ({ ...prev, status: 'resolved', updatedAt: new Date().toISOString() }));
}

handleMenuClose();
setSnackbar({ open: true, message: `"${target.subject}" marked as resolved.`, severity: 'success' });
};

const handleChangeStatus = (msg, newStatus) => {
const target = msg || selectedMessage;
if (!target) return;



setMessages((prev) =>
  prev.map((m) => m.id === target.id ? { ...m, status: newStatus, updatedAt: new Date().toISOString() } : m)
);

if (selectedMessage?.id === target.id) {
  setSelectedMessage((prev) => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
}

handleMenuClose();
setSnackbar({ open: true, message: `Status changed to "${STATUS_CONFIG[newStatus].label}".`, severity: 'info' });
};

const handleToggleStar = (msg) => {
setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, isStarred: !m.isStarred } : m));
if (selectedMessage?.id === msg.id) {
setSelectedMessage((prev) => ({ ...prev, isStarred: !prev.isStarred }));
}
};

const handleToggleRead = (msg) => {
setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, isRead: !m.isRead } : m));
handleMenuClose();
};

const handleDeleteOpen = (msg) => {
setDeleteTarget(msg);
setDeleteDialogOpen(true);
handleMenuClose();
};

const handleDeleteConfirm = () => {
setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
if (selectedMessage?.id === deleteTarget.id) setSelectedMessage(null);
setDeleteDialogOpen(false);
setSnackbar({ open: true, message: 'Message deleted.', severity: 'warning' });
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

// ─── Render ───
return (
<Box sx={{ p: { xs: 2, md: 4 } }}>
{/* ─── Header ─── */}
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
<Box>
<Typography variant="h4" fontWeight="700" color="#1e293b">📩 Support & Messages</Typography>
<Typography variant="body2" color="#64748b">Manage user inquiries, reply, and resolve tickets</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1.5 }}>
{unreadMessages > 0 && (
<Chip
icon={<MailIcon sx={{ fontSize: 16 }} />}
label={`{${unreadMessages} unread}`}
sx={{ fontWeight: 600, bgcolor: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}
/>
)}
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
      { label: 'Total', value: totalMessages, icon: <ForumIcon />, color: '#667eea' },
      { label: 'Open', value: openMessages, icon: <MailIcon />, color: '#3b82f6' },
      { label: 'In Progress', value: inProgressMessages, icon: <PendingIcon />, color: '#f59e0b' },
      { label: 'Resolved', value: resolvedMessages, icon: <CheckCircleIcon />, color: '#10b981' },
      { label: 'Unread', value: unreadMessages, icon: <MarkEmailUnreadIcon />, color: '#ef4444' },
      { label: 'Urgent/High', value: urgentMessages, icon: <PriorityHighIcon />, color: '#dc2626' },
    ].map((stat, i) => (
      <Box
        key={i}
        sx={{
          bgcolor: '#ffffff', p: 2, borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', gap: 1.5,
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
        }}
      >
        <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, '& .MuiSvgIcon-root': { fontSize: 20 } }}>
          {stat.icon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ lineHeight: 1.2 }}>{stat.value}</Typography>
          <Typography variant="caption" color="#94a3b8">{stat.label}</Typography>
        </Box>
      </Box>
    ))}
  </Box>

  {/* ─── Main Content ─── */}
  <Box sx={{ display: 'flex', gap: 3, height: { md: 'calc(100vh - 380px)' }, minHeight: 500, flexDirection: { xs: 'column', md: 'row' } }}>

    {/* ─── LEFT: Message List ─── */}
    <Box
      sx={{
        width: { xs: '100%', md: selectedMessage ? 380 : '100%' },
        minWidth: { md: selectedMessage ? 380 : 'auto' },
        display: { xs: selectedMessage ? 'none' : 'flex', md: 'flex' },
        flexDirection: 'column',
        bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden', transition: 'width 0.3s ease',
      }}
    >
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: '1px solid #f1f5f9', minHeight: 42,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', minHeight: 42, py: 0 },
          '& .Mui-selected': { color: '#667eea' },
          '& .MuiTabs-indicator': { backgroundColor: '#667eea' },
        }}
      >
        <Tab label={`All (${totalMessages})`} value="all" />
        <Tab
          label={
            <Badge badgeContent={openMessages} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16, bgcolor: '#667eea' } }}>
              <Box sx={{ pr: 1.5 }}>Open</Box>
            </Badge>
          }
          value="open"
        />
        <Tab label={`In Progress (${inProgressMessages})`} value="in-progress" />
        <Tab label={`Resolved (${resolvedMessages})`} value="resolved" />
        <Tab
          label={
            <Badge badgeContent={unreadMessages} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>
              <Box sx={{ pr: 1.5 }}>Unread</Box>
            </Badge>
          }
          value="unread"
        />
        <Tab label={`Starred (${starredMessages})`} value="starred" />
      </Tabs>

      {/* Search & Filters */}
      <Box sx={{ p: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap', borderBottom: '1px solid #f1f5f9' }}>
        <TextField
          placeholder="Search messages..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc', height: 36, '&.Mui-focused fieldset': { borderColor: '#667eea' } } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment> }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2, bgcolor: '#f8fafc', height: 36, fontSize: '0.8rem', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
          >
            <MenuItem value="all"><Typography variant="body2">All Categories</Typography></MenuItem>
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
            sx={{ borderRadius: 2, bgcolor: '#f8fafc', height: 36, fontSize: '0.8rem', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}
          >
            <MenuItem value="all"><Typography variant="body2">All Priority</Typography></MenuItem>
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
              <MenuItem key={key} value={key}>
                <Typography variant="body2" sx={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton size="small" onClick={(e) => setSortAnchorEl(e.currentTarget)} sx={{ bgcolor: '#f8fafc', borderRadius: 2, width: 36, height: 36 }}>
          <SortIcon sx={{ fontSize: 18, color: '#64748b' }} />
        </IconButton>

        <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)}>
          {[
            { label: 'Newest First', value: 'newest' },
            { label: 'Oldest First', value: 'oldest' },
            { label: 'Priority', value: 'priority' },
          ].map((opt) => (
            <MenuItem key={opt.value} selected={sortBy === opt.value} onClick={() => { setSortBy(opt.value); setSortAnchorEl(null); }}>
              {opt.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Message List */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredMessages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <InboxIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
            <Typography variant="body1" fontWeight="600" color="#94a3b8">No messages found</Typography>
            <Typography variant="caption" color="#cbd5e1">Try adjusting your filters</Typography>
          </Box>
        ) : (
          filteredMessages.map((msg) => {
            const catConfig = getCategoryConfig(msg.category);
            const priorityConfig = PRIORITY_CONFIG[msg.priority];
            const statusConfig = STATUS_CONFIG[msg.status];
            const isSelected = selectedMessage?.id === msg.id;
            const lastMsg = msg.conversation[msg.conversation.length - 1];

            return (
              <Box
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                sx={{
                  p: 2, cursor: 'pointer',
                  borderBottom: '1px solid #f1f5f9',
                  borderLeft: isSelected ? '3px solid #667eea' : '3px solid transparent',
                  bgcolor: isSelected ? '#667eea08' : !msg.isRead ? '#f0f4ff' : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': { bgcolor: isSelected ? '#667eea08' : '#f8fafc' },
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {/* Star */}
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleToggleStar(msg); }}
                    sx={{ alignSelf: 'flex-start', mt: 0.3, p: 0.3 }}
                  >
                    {msg.isStarred ? (
                      <StarIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    ) : (
                      <StarBorderIcon sx={{ fontSize: 18, color: '#cbd5e1' }} />
                    )}
                  </IconButton>

                  {/* Avatar */}
                  <Avatar sx={{ width: 36, height: 36, bgcolor: msg.isPremiumUser ? '#8b5cf620' : '#667eea15', color: msg.isPremiumUser ? '#8b5cf6' : '#667eea', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                    {getInitials(msg.userName)}
                  </Avatar>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" fontWeight={msg.isRead ? 600 : 700} color="#1e293b" noWrap>
                          {msg.userName}
                        </Typography>
                        {msg.isPremiumUser && <WorkspacePremiumIcon sx={{ fontSize: 14, color: '#8b5cf6' }} />}
                      </Box>
                      <Typography variant="caption" color="#94a3b8" sx={{ flexShrink: 0 }}>
                        {formatDate(msg.updatedAt)}
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

                    <Typography variant="caption" color="#94a3b8" noWrap sx={{ display: 'block', mb: 1 }}>
                      {lastMsg.sender === 'admin' ? '↩ You: ' : ''}{lastMsg.message}
                    </Typography>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Chip
                        icon={catConfig.icon}
                        label={catConfig.label}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.6rem', height: 20, bgcolor: `${catConfig.color}15`, color: catConfig.color, '& .MuiChip-icon': { ml: 0.5 } }}
                      />
                      <Chip
                        label={priorityConfig.label}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.6rem', height: 20, bgcolor: priorityConfig.bgcolor, color: priorityConfig.color }}
                      />
                      <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.6rem', height: 20, bgcolor: statusConfig.bgcolor, color: statusConfig.color, '& .MuiChip-icon': { ml: 0.5, color: statusConfig.color } }}
                      />
                      {msg.conversation.length > 1 && (
                        <Chip
                          label={`${msg.conversation.length} msgs`}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: '0.6rem', height: 20, bgcolor: '#f1f5f9', color: '#64748b' }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Menu */}
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, msg)} sx={{ alignSelf: 'flex-start', p: 0.3 }}>
                    <MoreVertIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
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
          flex: 1, display: 'flex', flexDirection: 'column',
          bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton onClick={handleBackToList} sx={{ display: { md: 'none' }, mr: 0.5 }}>
                <ArrowBackIcon />
              </IconButton>
              <Avatar sx={{ width: 42, height: 42, bgcolor: selectedMessage.isPremiumUser ? '#8b5cf620' : '#667eea15', color: selectedMessage.isPremiumUser ? '#8b5cf6' : '#667eea', fontWeight: 700 }}>
                {getInitials(selectedMessage.userName)}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body1" fontWeight="700" color="#1e293b">{selectedMessage.userName}</Typography>
                  {selectedMessage.isPremiumUser && <WorkspacePremiumIcon sx={{ fontSize: 16, color: '#8b5cf6' }} />}
                </Box>
                <Typography variant="caption" color="#94a3b8">{selectedMessage.userEmail}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={() => handleToggleStar(selectedMessage)}>
                {selectedMessage.isStarred ? <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} /> : <StarBorderIcon sx={{ color: '#cbd5e1', fontSize: 20 }} />}
              </IconButton>
              <IconButton size="small" onClick={(e) => handleMenuOpen(e, selectedMessage)}>
                <MoreVertIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ mb: 1 }}>
            {selectedMessage.subject}
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
            {(() => {
              const catCfg = getCategoryConfig(selectedMessage.category);
              const priCfg = PRIORITY_CONFIG[selectedMessage.priority];
              const staCfg = STATUS_CONFIG[selectedMessage.status];
              return (
                <>
                  <Chip icon={catCfg.icon} label={catCfg.label} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24, bgcolor: `${catCfg.color}15`, color: catCfg.color, '& .MuiChip-icon': { ml: 0.5 } }} />
                  <Chip label={priCfg.label} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24, bgcolor: priCfg.bgcolor, color: priCfg.color }} />
                  <Chip icon={staCfg.icon} label={staCfg.label} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24, bgcolor: staCfg.bgcolor, color: staCfg.color, '& .MuiChip-icon': { ml: 0.5, color: staCfg.color } }} />
                  <Chip label={formatDate(selectedMessage.createdAt)} size="small" icon={<AccessTimeIcon sx={{ fontSize: 14 }} />} sx={{ fontWeight: 500, fontSize: '0.7rem', height: 24, bgcolor: '#f1f5f9', color: '#64748b', '& .MuiChip-icon': { ml: 0.5, color: '#94a3b8' } }} />
                </>
              );
            })()}
          </Box>
        </Box>

        {/* Conversation */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#f8fafc' }}>
          {selectedMessage.conversation.map((entry) => {
            const isAdmin = entry.sender === 'admin';
            return (
              <Box
                key={entry.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isAdmin ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                  {!isAdmin && (
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.6rem', fontWeight: 700, bgcolor: '#667eea20', color: '#667eea' }}>
                      {getInitials(entry.senderName)}
                    </Avatar>
                  )}
                  <Typography variant="caption" fontWeight="600" color={isAdmin ? '#667eea' : '#1e293b'}>
                    {entry.senderName}
                  </Typography>
                  <Typography variant="caption" color="#94a3b8">{formatDate(entry.timestamp)}</Typography>
                  {isAdmin && (
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.6rem', fontWeight: 700, bgcolor: '#667eea20', color: '#667eea' }}>
                      <SupportAgentIcon sx={{ fontSize: 14 }} />
                    </Avatar>
                  )}
                </Box>

                <Box
                  sx={{
                    p: 2, borderRadius: 2.5,
                    bgcolor: isAdmin ? '#667eea' : '#ffffff',
                    color: isAdmin ? '#ffffff' : '#1e293b',
                    boxShadow: isAdmin ? '0 2px 8px rgba(102,126,234,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
                    borderTopRightRadius: isAdmin ? 4 : 20,
                    borderTopLeftRadius: isAdmin ? 20 : 4,
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {entry.message}
                  </Typography>
                </Box>

                <Tooltip title={formatFullDate(entry.timestamp)} arrow>
                  <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.3, cursor: 'default', px: 0.5 }}>
                    {formatFullDate(entry.timestamp)}
                  </Typography>
                </Tooltip>
              </Box>
            );
          })}
          <div ref={conversationEndRef} />
        </Box>

        {/* Status Actions */}
        {selectedMessage.status !== 'resolved' && selectedMessage.status !== 'closed' && (
          <Box sx={{ px: 2.5, py: 1, borderTop: '1px solid #f1f5f9', bgcolor: '#f8fafc', display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={() => handleMarkAsResolved(selectedMessage)}
              sx={{ textTransform: 'none', fontWeight: 600, color: '#10b981', borderRadius: 2, '&:hover': { bgcolor: '#10b98110' } }}
            >
              Mark as Resolved
            </Button>
            {selectedMessage.status === 'open' && (
              <Button
                size="small"
                startIcon={<PendingIcon />}
                onClick={() => handleChangeStatus(selectedMessage, 'in-progress')}
                sx={{ textTransform: 'none', fontWeight: 600, color: '#f59e0b', borderRadius: 2, '&:hover': { bgcolor: '#f59e0b10' } }}
              >
                Mark In Progress
              </Button>
            )}
          </Box>
        )}

        {selectedMessage.status === 'resolved' && (
          <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid #f1f5f9', bgcolor: '#10b98108', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
              <Typography variant="body2" fontWeight="600" color="#10b981">This ticket is resolved</Typography>
            </Box>
            <Button
              size="small"
              onClick={() => handleChangeStatus(selectedMessage, 'closed')}
              sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b', borderRadius: 2 }}
            >
              Close Ticket
            </Button>
          </Box>
        )}

        {selectedMessage.status === 'closed' && (
          <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid #f1f5f9', bgcolor: '#94a3b808', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DoneAllIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
              <Typography variant="body2" fontWeight="600" color="#94a3b8">This ticket is closed</Typography>
            </Box>
            <Button
              size="small"
              onClick={() => handleChangeStatus(selectedMessage, 'open')}
              sx={{ textTransform: 'none', fontWeight: 600, color: '#667eea', borderRadius: 2 }}
            >
              Reopen
            </Button>
          </Box>
        )}

        {/* Reply Box */}
        {selectedMessage.status !== 'closed' && (
          <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9', bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                inputRef={replyInputRef}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5, bgcolor: '#f8fafc',
                    '&.Mui-focused fieldset': { borderColor: '#667eea' },
                  },
                }}
              />
              <Tooltip title="Send reply (Enter)">
                <span>
                  <IconButton
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    sx={{
                      width: 44, height: 44, borderRadius: 2,
                      bgcolor: replyText.trim() ? '#667eea' : '#e2e8f0',
                      color: '#ffffff',
                      '&:hover': { bgcolor: replyText.trim() ? '#5a6fd6' : '#e2e8f0' },
                      '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
                    }}
                  >
                    <SendIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5, display: 'block' }}>
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
          flex: 1, display: { xs: 'none', md: 'flex' },
          alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <SupportAgentIcon sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }} />
        <Typography variant="h6" fontWeight="600" color="#94a3b8">Select a message</Typography>
        <Typography variant="body2" color="#cbd5e1" sx={{ mt: 0.5 }}>Choose a conversation from the list to view and reply</Typography>
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
    <MenuItem onClick={() => { handleToggleRead(menuTarget); }} sx={{ py: 1 }}>
      <ListItemIcon>
        {menuTarget?.isRead ? <MarkEmailUnreadIcon fontSize="small" sx={{ color: '#667eea' }} /> : <MarkEmailReadIcon fontSize="small" sx={{ color: '#667eea' }} />}
      </ListItemIcon>
      <ListItemText primary={menuTarget?.isRead ? 'Mark as Unread' : 'Mark as Read'} />
    </MenuItem>

    {menuTarget?.status !== 'resolved' && menuTarget?.status !== 'closed' && (
      <MenuItem onClick={() => handleMarkAsResolved(menuTarget)} sx={{ py: 1 }}>
        <ListItemIcon><CheckCircleIcon fontSize="small" sx={{ color: '#10b981' }} /></ListItemIcon>
        <ListItemText primary="Mark as Resolved" primaryTypographyProps={{ color: '#10b981' }} />
      </MenuItem>
    )}

    {menuTarget?.status === 'resolved' && (
      <MenuItem onClick={() => handleChangeStatus(menuTarget, 'closed')} sx={{ py: 1 }}>
        <ListItemIcon><DoneAllIcon fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon>
        <ListItemText primary="Close Ticket" />
      </MenuItem>
    )}

    {(menuTarget?.status === 'resolved' || menuTarget?.status === 'closed') && (
      <MenuItem onClick={() => handleChangeStatus(menuTarget, 'open')} sx={{ py: 1 }}>
        <ListItemIcon><MailIcon fontSize="small" sx={{ color: '#667eea' }} /></ListItemIcon>
        <ListItemText primary="Reopen Ticket" />
      </MenuItem>
    )}

    <Divider sx={{ my: 0.5 }} />

    {/* Change Status Submenu */}
    <Typography variant="caption" color="#94a3b8" sx={{ px: 2, py: 0.5, display: 'block' }}>Change Status</Typography>
    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
      <MenuItem
        key={key}
        selected={menuTarget?.status === key}
        onClick={() => handleChangeStatus(menuTarget, key)}
        sx={{ py: 0.8, pl: 3 }}
      >
        <ListItemIcon sx={{ minWidth: 28, color: cfg.color }}>{cfg.icon}</ListItemIcon>
        <ListItemText primary={cfg.label} primaryTypographyProps={{ fontSize: '0.85rem', color: cfg.color, fontWeight: menuTarget?.status === key ? 700 : 400 }} />
      </MenuItem>
    ))}

    <Divider sx={{ my: 0.5 }} />

    <MenuItem onClick={() => handleDeleteOpen(menuTarget)} sx={{ py: 1, '&:hover': { bgcolor: '#ef444410' } }}>
      <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
      <ListItemText primary="Delete" primaryTypographyProps={{ color: '#ef4444' }} />
    </MenuItem>
  </Menu>

  {/* ═══════════ DELETE DIALOG ═══════════ */}
  <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
    <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><WarningAmberIcon /> Delete Message</Box>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="#64748b">
        Delete the message <strong>&quot;{deleteTarget?.subject}&quot;</strong> from <strong>{deleteTarget?.userName}</strong>?
      </Typography>
      <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
        This action cannot be undone. The entire conversation will be permanently deleted.
      </Alert>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
      <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
        Delete Message
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






