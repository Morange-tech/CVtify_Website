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
Tabs,
Tab,
Select,
FormControl,
InputLabel,
Avatar,
LinearProgress,
Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import BrushIcon from '@mui/icons-material/Brush';
import StarIcon from '@mui/icons-material/Star';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// ─── Mock Data ───
const MOCK_DOWNLOADS = [
{ id: 1, userName: 'John Smith', userEmail: 'john@example.com', userAvatar: null, cvTitle: 'Software Engineer CV', templateName: 'Professional', templateCategory: 'professional', format: 'PDF', fileSize: '245 KB', downloadedAt: '2025-06-18T14:30:00', isPremiumUser: true },
{ id: 2, userName: 'Sarah Johnson', userEmail: 'sarah@example.com', userAvatar: null, cvTitle: 'Marketing Manager Resume', templateName: 'Modern Creative', templateCategory: 'creative', format: 'PDF', fileSize: '312 KB', downloadedAt: '2025-06-18T13:15:00', isPremiumUser: false },
{ id: 3, userName: 'Michael Chen', userEmail: 'michael@example.com', userAvatar: null, cvTitle: 'Data Scientist CV', templateName: 'Tech Pro', templateCategory: 'professional', format: 'PDF', fileSize: '198 KB', downloadedAt: '2025-06-18T12:45:00', isPremiumUser: true },
{ id: 4, userName: 'Emily Davis', userEmail: 'emily@example.com', userAvatar: null, cvTitle: 'UX Designer Portfolio', templateName: 'Modern Creative', templateCategory: 'creative', format: 'PDF', fileSize: '420 KB', downloadedAt: '2025-06-18T11:20:00', isPremiumUser: true },
{ id: 5, userName: 'Alex Wilson', userEmail: 'alex@example.com', userAvatar: null, cvTitle: 'Project Manager CV', templateName: 'Executive', templateCategory: 'executive', format: 'PDF', fileSize: '267 KB', downloadedAt: '2025-06-18T10:05:00', isPremiumUser: false },
{ id: 6, userName: 'Lisa Anderson', userEmail: 'lisa@example.com', userAvatar: null, cvTitle: 'Graphic Designer Resume', templateName: 'Modern Creative', templateCategory: 'creative', format: 'PDF', fileSize: '380 KB', downloadedAt: '2025-06-17T16:30:00', isPremiumUser: false },
{ id: 7, userName: 'John Smith', userEmail: 'john@example.com', userAvatar: null, cvTitle: 'Backend Developer CV', templateName: 'Tech Pro', templateCategory: 'professional', format: 'PDF', fileSize: '210 KB', downloadedAt: '2025-06-17T15:00:00', isPremiumUser: true },
{ id: 8, userName: 'David Brown', userEmail: 'david@example.com', userAvatar: null, cvTitle: 'CEO Resume', templateName: 'Executive', templateCategory: 'executive', format: 'PDF', fileSize: '290 KB', downloadedAt: '2025-06-17T14:20:00', isPremiumUser: true },
{ id: 9, userName: 'Sarah Johnson', userEmail: 'sarah@example.com', userAvatar: null, cvTitle: 'Content Writer CV', templateName: 'Minimal Clean', templateCategory: 'ats-optimized', format: 'PDF', fileSize: '175 KB', downloadedAt: '2025-06-17T12:10:00', isPremiumUser: false },
{ id: 10, userName: 'Rachel Green', userEmail: 'rachel@example.com', userAvatar: null, cvTitle: 'Intern Resume', templateName: 'Fresh Graduate', templateCategory: 'simple', format: 'PDF', fileSize: '145 KB', downloadedAt: '2025-06-17T10:30:00', isPremiumUser: false },
{ id: 11, userName: 'Michael Chen', userEmail: 'michael@example.com', userAvatar: null, cvTitle: 'ML Engineer CV', templateName: 'Tech Pro', templateCategory: 'professional', format: 'PDF', fileSize: '225 KB', downloadedAt: '2025-06-16T17:45:00', isPremiumUser: true },
{ id: 12, userName: 'Emily Davis', userEmail: 'emily@example.com', userAvatar: null, cvTitle: 'Product Designer CV', templateName: 'Modern Creative', templateCategory: 'creative', format: 'PDF', fileSize: '395 KB', downloadedAt: '2025-06-16T14:30:00', isPremiumUser: true },
{ id: 13, userName: 'Tom Harris', userEmail: 'tom@example.com', userAvatar: null, cvTitle: 'Sales Executive CV', templateName: 'Professional', templateCategory: 'professional', format: 'PDF', fileSize: '230 KB', downloadedAt: '2025-06-16T11:15:00', isPremiumUser: false },
{ id: 14, userName: 'John Smith', userEmail: 'john@example.com', userAvatar: null, cvTitle: 'Full Stack Dev CV', templateName: 'Professional', templateCategory: 'professional', format: 'PDF', fileSize: '255 KB', downloadedAt: '2025-06-15T16:00:00', isPremiumUser: true },
{ id: 15, userName: 'Nina Patel', userEmail: 'nina@example.com', userAvatar: null, cvTitle: 'Research Assistant CV', templateName: 'Minimal Clean', templateCategory: 'ats-optimized', format: 'PDF', fileSize: '160 KB', downloadedAt: '2025-06-15T09:30:00', isPremiumUser: false },
{ id: 16, userName: 'Alex Wilson', userEmail: 'alex@example.com', userAvatar: null, cvTitle: 'Scrum Master Resume', templateName: 'Professional', templateCategory: 'professional', format: 'PDF', fileSize: '240 KB', downloadedAt: '2025-06-14T13:20:00', isPremiumUser: false },
{ id: 17, userName: 'David Brown', userEmail: 'david@example.com', userAvatar: null, cvTitle: 'VP Operations Resume', templateName: 'Executive', templateCategory: 'executive', format: 'PDF', fileSize: '310 KB', downloadedAt: '2025-06-14T10:45:00', isPremiumUser: true },
{ id: 18, userName: 'Lisa Anderson', userEmail: 'lisa@example.com', userAvatar: null, cvTitle: 'Brand Designer CV', templateName: 'Modern Creative', templateCategory: 'creative', format: 'PDF', fileSize: '365 KB', downloadedAt: '2025-06-13T15:30:00', isPremiumUser: false },
{ id: 19, userName: 'Sarah Johnson', userEmail: 'sarah@example.com', userAvatar: null, cvTitle: 'Social Media CV', templateName: 'Modern Creative', templateCategory: 'creative', format: 'PDF', fileSize: '285 KB', downloadedAt: '2025-06-13T11:00:00', isPremiumUser: false },
{ id: 20, userName: 'Rachel Green', userEmail: 'rachel@example.com', userAvatar: null, cvTitle: 'Junior Dev Resume', templateName: 'Fresh Graduate', templateCategory: 'simple', format: 'PDF', fileSize: '155 KB', downloadedAt: '2025-06-12T14:15:00', isPremiumUser: false },
];

const TEMPLATE_COLORS = {
professional: '#667eea',
creative: '#ec4899',
executive: '#8b5cf6',
'ats-optimized': '#10b981',
simple: '#06b6d4',
academic: '#f59e0b',
};

const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

const formatDate = (dateStr) => {
const date = new Date(dateStr);
const now = new Date();
const diffMs = now - date;
const diffMins = Math.floor(diffMs / 60000);
const diffHours = Math.floor(diffMs / 3600000);
const diffDays = Math.floor(diffMs / 86400000);

if (diffMins < 60) return `${diffMins}m ago`;
if (diffHours < 24) return `${diffHours}h ago`;
if (diffDays < 7) return `${diffDays}d ago`;
return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatFullDate = (dateStr) => {
return new Date(dateStr).toLocaleDateString('en-US', {
weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
});
};

export default function AdminDownloadsPage() {
const [searchQuery, setSearchQuery] = useState('');
const [activeTab, setActiveTab] = useState('all');
const [dateFilter, setDateFilter] = useState('all');
const [templateFilter, setTemplateFilter] = useState('all');
const [sortBy, setSortBy] = useState('recent');
const [sortAnchorEl, setSortAnchorEl] = useState(null);
const [viewMode, setViewMode] = useState('activity');

// ─── Computed Analytics ───
const totalDownloads = MOCK_DOWNLOADS.length;

// Most downloaded CV
const cvDownloadCounts = useMemo(() => {
const counts = {};
MOCK_DOWNLOADS.forEach((d) => {
counts[d.cvTitle] = (counts[d.cvTitle] || 0) + 1;
});
return Object.entries(counts)
.map(([title, count]) => ({ title, count }))
.sort((a, b) => b.count - a.count);
}, []);

// Most used template
const templateUsageCounts = useMemo(() => {
const counts = {};
MOCK_DOWNLOADS.forEach((d) => {
if (!counts[d.templateName]) {
counts[d.templateName] = { count: 0, category: d.templateCategory };
}
counts[d.templateName].count += 1;
});
return Object.entries(counts)
.map(([name, data]) => ({ name, count: data.count, category: data.category }))
.sort((a, b) => b.count - a.count);
}, []);

// Downloads per user
const userDownloadCounts = useMemo(() => {
const counts = {};
MOCK_DOWNLOADS.forEach((d) => {
if (!counts[d.userEmail]) {
counts[d.userEmail] = {
name: d.userName,
email: d.userEmail,
isPremium: d.isPremiumUser,
count: 0,
lastDownload: d.downloadedAt,
cvs: new Set(),
};
}
counts[d.userEmail].count += 1;
counts[d.userEmail].cvs.add(d.cvTitle);
if (new Date(d.downloadedAt) > new Date(counts[d.userEmail].lastDownload)) {
counts[d.userEmail].lastDownload = d.downloadedAt;
}
});
return Object.values(counts)
.map((u) => ({ ...u, uniqueCVs: u.cvs.size }))
.sort((a, b) => b.count - a.count);
}, []);

const maxUserDownloads = Math.max(...userDownloadCounts.map((u) => u.count));
const maxTemplateUsage = Math.max(...templateUsageCounts.map((t) => t.count));

// Today's downloads
const today = new Date().toDateString();
const todayDownloads = MOCK_DOWNLOADS.filter((d) => new Date(d.downloadedAt).toDateString() === today).length;

// This week
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);
const weekDownloads = MOCK_DOWNLOADS.filter((d) => new Date(d.downloadedAt) >= weekAgo).length;

// Unique templates used
const uniqueTemplates = new Set(MOCK_DOWNLOADS.map((d) => d.templateName)).size;

// ─── Filter Downloads ───
const filteredDownloads = useMemo(() => {
return MOCK_DOWNLOADS.filter((d) => {
const matchesSearch =
d.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
d.cvTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
d.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
d.userEmail.toLowerCase().includes(searchQuery.toLowerCase());



  const matchesTab =
    activeTab === 'all' ||
    (activeTab === 'premium' && d.isPremiumUser) ||
    (activeTab === 'free' && !d.isPremiumUser);

  const matchesTemplate = templateFilter === 'all' || d.templateName === templateFilter;

  let matchesDate = true;
  if (dateFilter === 'today') {
    matchesDate = new Date(d.downloadedAt).toDateString() === today;
  } else if (dateFilter === 'week') {
    matchesDate = new Date(d.downloadedAt) >= weekAgo;
  } else if (dateFilter === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    matchesDate = new Date(d.downloadedAt) >= monthAgo;
  }

  return matchesSearch && matchesTab && matchesTemplate && matchesDate;
});
}, [searchQuery, activeTab, templateFilter, dateFilter]);

// Unique template names for filter
const templateNames = [...new Set(MOCK_DOWNLOADS.map((d) => d.templateName))].sort();

return (
<Box sx={{ p: { xs: 2, md: 4 } }}>
{/* ─── Header ─── */}
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
<Box>
<Typography variant="h4" fontWeight="700" color="#1e293b">
📥 Downloads Monitoring
</Typography>
<Typography variant="body2" color="#64748b">
Track download activity, popular templates, and user engagement
</Typography>
</Box>
<Box sx={{ display: 'flex', gap: 1.5 }}>
<Button
variant="outlined"
startIcon={<FileDownloadIcon />}
sx={{
textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3,
borderColor: '#e2e8f0', color: '#64748b',
'&:hover': { borderColor: '#667eea', color: '#667eea', bgcolor: '#667eea08' },
}}
>
Export CSV
</Button>
<Tooltip title="Refresh">
<IconButton sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}>
<RefreshIcon sx={{ fontSize: 20, color: '#64748b' }} />
</IconButton>
</Tooltip>
</Box>
</Box>



  {/* ─── Stats Cards ─── */}
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
    {[
      {
        label: 'Total Downloads',
        value: totalDownloads,
        sub: `${todayDownloads} today`,
        icon: <DownloadIcon />,
        color: '#667eea',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      {
        label: 'This Week',
        value: weekDownloads,
        sub: `${((weekDownloads / totalDownloads) * 100).toFixed(0)}% of total`,
        icon: <TrendingUpIcon />,
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
      {
        label: 'Unique Users',
        value: userDownloadCounts.length,
        sub: `avg ${(totalDownloads / userDownloadCounts.length).toFixed(1)} downloads/user`,
        icon: <PeopleIcon />,
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      },
      {
        label: 'Templates Used',
        value: uniqueTemplates,
        sub: `Most: ${templateUsageCounts[0]?.name}`,
        icon: <BrushIcon />,
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      },
    ].map((stat, i) => (
      <Box
        key={i}
        sx={{
          bgcolor: '#ffffff', p: 2.5, borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
          position: 'relative', overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', background: stat.gradient, opacity: 0.08 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ width: 42, height: 42, borderRadius: 2, background: stat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', '& .MuiSvgIcon-root': { fontSize: 22 } }}>
            {stat.icon}
          </Box>
        </Box>
        <Typography variant="h5" fontWeight="800" color="#1e293b" sx={{ mb: 0.3 }}>{stat.value}</Typography>
        <Typography variant="body2" fontWeight="600" color="#64748b">{stat.label}</Typography>
        <Typography variant="caption" color="#94a3b8">{stat.sub}</Typography>
      </Box>
    ))}
  </Box>

  {/* ─── View Tabs ─── */}
  <Tabs
    value={viewMode}
    onChange={(e, v) => setViewMode(v)}
    sx={{
      mb: 3,
      '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 40 },
      '& .Mui-selected': { color: '#667eea' },
      '& .MuiTabs-indicator': { backgroundColor: '#667eea', height: 3, borderRadius: '3px 3px 0 0' },
    }}
  >
    <Tab icon={<ViewListIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Recent Activity" value="activity" />
    <Tab icon={<EmojiEventsIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Top CVs" value="top-cvs" />
    <Tab icon={<BrushIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Template Usage" value="templates" />
    <Tab icon={<PeopleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Per User" value="users" />
  </Tabs>

  {/* ═══════════════════════════════════════ */}
  {/* ─── VIEW: RECENT ACTIVITY ─── */}
  {/* ═══════════════════════════════════════ */}
  {viewMode === 'activity' && (
    <>
      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search by user, CV, or template..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#ffffff', '&.Mui-focused fieldset': { borderColor: '#667eea' } } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Time Range</InputLabel>
          <Select value={dateFilter} label="Time Range" onChange={(e) => setDateFilter(e.target.value)} sx={{ borderRadius: 2, bgcolor: '#ffffff', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}>
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Template</InputLabel>
          <Select value={templateFilter} label="Template" onChange={(e) => setTemplateFilter(e.target.value)} sx={{ borderRadius: 2, bgcolor: '#ffffff', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' } }}>
            <MenuItem value="all">All Templates</MenuItem>
            {templateNames.map((name) => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          sx={{
            minHeight: 36,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', minHeight: 36, py: 0 },
            '& .Mui-selected': { color: '#667eea' },
            '& .MuiTabs-indicator': { backgroundColor: '#667eea' },
          }}
        >
          <Tab label="All" value="all" />
          <Tab label="Premium" value="premium" />
          <Tab label="Free" value="free" />
        </Tabs>
      </Box>

      {/* Results count */}
      <Typography variant="body2" color="#94a3b8" sx={{ mb: 2 }}>
        Showing {filteredDownloads.length} download{filteredDownloads.length !== 1 ? 's' : ''}
      </Typography>

      {/* Activity List */}
      {filteredDownloads.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <DownloadIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
          <Typography variant="h6" fontWeight="600" color="#94a3b8">No downloads found</Typography>
          <Typography variant="body2" color="#cbd5e1">Try adjusting your filters</Typography>
        </Box>
      ) : (
        <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {/* Table Header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 0.8fr 1fr', gap: 2, p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['USER', 'CV / DOCUMENT', 'TEMPLATE', 'SIZE', 'DOWNLOADED'].map((h) => (
              <Typography key={h} variant="caption" fontWeight="700" color="#64748b" letterSpacing="0.05em">{h}</Typography>
            ))}
          </Box>

          {filteredDownloads.map((download, index) => {
            const templateColor = TEMPLATE_COLORS[download.templateCategory] || '#64748b';
            return (
              <Box
                key={download.id}
                sx={{
                  display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 0.8fr 1fr',
                  gap: 2, p: 2, alignItems: 'center',
                  borderBottom: index < filteredDownloads.length - 1 ? '1px solid #f1f5f9' : 'none',
                  transition: 'background 0.15s ease',
                  '&:hover': { bgcolor: '#f8fafc' },
                }}
              >
                {/* User */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: download.isPremiumUser ? '#8b5cf620' : '#667eea15', color: download.isPremiumUser ? '#8b5cf6' : '#667eea', fontSize: '0.8rem', fontWeight: 700 }}>
                    {getInitials(download.userName)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>{download.userName}</Typography>
                      {download.isPremiumUser && (
                        <WorkspacePremiumIcon sx={{ fontSize: 14, color: '#8b5cf6' }} />
                      )}
                    </Box>
                    <Typography variant="caption" color="#94a3b8" noWrap>{download.userEmail}</Typography>
                  </Box>
                </Box>

                {/* CV */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <PictureAsPdfIcon sx={{ fontSize: 20, color: '#ef4444', flexShrink: 0 }} />
                  <Typography variant="body2" fontWeight="500" color="#1e293b" noWrap>{download.cvTitle}</Typography>
                </Box>

                {/* Template */}
                <Chip
                  label={download.templateName}
                  size="small"
                  sx={{
                    fontWeight: 600, fontSize: '0.7rem', height: 24, width: 'fit-content',
                    bgcolor: `${templateColor}15`, color: templateColor,
                    borderLeft: `3px solid ${templateColor}`,
                    borderRadius: '0 12px 12px 0',
                  }}
                />

                {/* Size */}
                <Typography variant="body2" color="#64748b">{download.fileSize}</Typography>

                {/* Time */}
                <Tooltip title={formatFullDate(download.downloadedAt)} arrow>
                  <Typography variant="body2" color="#94a3b8" sx={{ cursor: 'default' }}>
                    {formatDate(download.downloadedAt)}
                  </Typography>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  )}

  {/* ═══════════════════════════════════════ */}
  {/* ─── VIEW: TOP CVs ─── */}
  {/* ═══════════════════════════════════════ */}
  {viewMode === 'top-cvs' && (
    <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
        <Typography variant="h6" fontWeight="700" color="#1e293b">
          🏆 Most Downloaded CVs
        </Typography>
        <Typography variant="body2" color="#94a3b8">Ranked by total number of downloads</Typography>
      </Box>

      {cvDownloadCounts.map((cv, index) => {
        const percentage = (cv.count / cvDownloadCounts[0].count) * 100;
        const isTop3 = index < 3;
        const medals = ['🥇', '🥈', '🥉'];
        return (
          <Box
            key={cv.title}
            sx={{
              display: 'flex', alignItems: 'center', gap: 2, p: 2.5, px: 3,
              borderBottom: index < cvDownloadCounts.length - 1 ? '1px solid #f1f5f9' : 'none',
              transition: 'background 0.15s ease',
              '&:hover': { bgcolor: '#f8fafc' },
            }}
          >
            {/* Rank */}
            <Box sx={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
              {isTop3 ? (
                <Typography fontSize="1.5rem">{medals[index]}</Typography>
              ) : (
                <Typography variant="body1" fontWeight="700" color="#94a3b8">#{index + 1}</Typography>
              )}
            </Box>

            {/* CV Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" fontWeight="600" color="#1e293b" noWrap>{cv.title}</Typography>
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    flex: 1, height: 8, borderRadius: 4, bgcolor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: isTop3
                        ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                        : '#94a3b8',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Count */}
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Typography variant="h6" fontWeight="800" color={isTop3 ? '#667eea' : '#64748b'}>
                {cv.count}
              </Typography>
              <Typography variant="caption" color="#94a3b8">downloads</Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  )}

  {/* ═══════════════════════════════════════ */}
  {/* ─── VIEW: TEMPLATE USAGE ─── */}
  {/* ═══════════════════════════════════════ */}
  {viewMode === 'templates' && (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      {/* Template Ranking */}
      <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" fontWeight="700" color="#1e293b">🎨 Template Popularity</Typography>
          <Typography variant="body2" color="#94a3b8">Templates ranked by download count</Typography>
        </Box>

        {templateUsageCounts.map((template, index) => {
          const percentage = (template.count / maxTemplateUsage) * 100;
          const color = TEMPLATE_COLORS[template.category] || '#64748b';
          return (
            <Box
              key={template.name}
              sx={{
                p: 2.5, px: 3,
                borderBottom: index < templateUsageCounts.length - 1 ? '1px solid #f1f5f9' : 'none',
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
                  <Typography variant="body2" fontWeight="600" color="#1e293b">{template.name}</Typography>
                  {index === 0 && <Chip label="Most Used" size="small" sx={{ fontWeight: 700, fontSize: '0.6rem', height: 20, bgcolor: '#f59e0b20', color: '#f59e0b' }} />}
                </Box>
                <Typography variant="body2" fontWeight="700" color={color}>{template.count}</Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 10, borderRadius: 5, bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: color },
                }}
              />

              <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5, display: 'block' }}>
                {((template.count / totalDownloads) * 100).toFixed(1)}% of all downloads
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Template Distribution Visual */}
      <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', p: 3 }}>
        <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ mb: 1 }}>📊 Distribution Overview</Typography>
        <Typography variant="body2" color="#94a3b8" sx={{ mb: 3 }}>Visual breakdown of template usage</Typography>

        {/* Simple visual bars */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {templateUsageCounts.map((template) => {
            const color = TEMPLATE_COLORS[template.category] || '#64748b';
            const pct = ((template.count / totalDownloads) * 100).toFixed(1);
            return (
              <Box key={template.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" fontWeight="600" color="#1e293b">{template.name}</Typography>
                  <Typography variant="body2" fontWeight="700" color={color}>{pct}%</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1, height: 28, bgcolor: '#f1f5f9', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                    <Box
                      sx={{
                        width: `${pct}%`, height: '100%', borderRadius: 2,
                        background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'width 0.6s ease',
                      }}
                    >
                      {parseFloat(pct) > 15 && (
                        <Typography variant="caption" fontWeight="700" color="#ffffff" fontSize="0.65rem">
                          {template.count} downloads
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Summary */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#667eea08', border: '1px solid #667eea20', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="800" color="#667eea">{uniqueTemplates}</Typography>
            <Typography variant="caption" color="#64748b">Active Templates</Typography>
          </Box>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#10b98108', border: '1px solid #10b98120', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="800" color="#10b981">{(totalDownloads / uniqueTemplates).toFixed(1)}</Typography>
            <Typography variant="caption" color="#64748b">Avg Downloads/Template</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )}

  {/* ═══════════════════════════════════════ */}
  {/* ─── VIEW: PER USER ─── */}
  {/* ═══════════════════════════════════════ */}
  {viewMode === 'users' && (
    <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" fontWeight="700" color="#1e293b">👥 Downloads Per User</Typography>
          <Typography variant="body2" color="#94a3b8">Individual user download activity</Typography>
        </Box>
        <Chip label={`${userDownloadCounts.length} users`} size="small" sx={{ fontWeight: 600, bgcolor: '#667eea15', color: '#667eea' }} />
      </Box>

      {/* Table Header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1.5fr', gap: 2, p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        {['USER', 'DOWNLOADS', 'UNIQUE CVs', 'TYPE', 'LAST DOWNLOAD'].map((h) => (
          <Typography key={h} variant="caption" fontWeight="700" color="#64748b" letterSpacing="0.05em">{h}</Typography>
        ))}
      </Box>

      {userDownloadCounts.map((user, index) => {
        const percentage = (user.count / maxUserDownloads) * 100;
        return (
          <Box
            key={user.email}
            sx={{
              display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1.5fr',
              gap: 2, p: 2, px: 3, alignItems: 'center',
              borderBottom: index < userDownloadCounts.length - 1 ? '1px solid #f1f5f9' : 'none',
              '&:hover': { bgcolor: '#f8fafc' },
            }}
          >
            {/* User */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: user.isPremium ? '#8b5cf620' : '#667eea15', color: user.isPremium ? '#8b5cf6' : '#667eea', fontSize: '0.85rem', fontWeight: 700 }}>
                  {getInitials(user.name)}
                </Avatar>
                {index < 3 && (
                  <Box sx={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', bgcolor: index === 0 ? '#f59e0b' : index === 1 ? '#94a3b8' : '#cd7f32', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ffffff' }}>
                    <Typography fontSize="0.5rem" fontWeight="800" color="#ffffff">{index + 1}</Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>{user.name}</Typography>
                  {user.isPremium && <WorkspacePremiumIcon sx={{ fontSize: 14, color: '#8b5cf6' }} />}
                </Box>
                <Typography variant="caption" color="#94a3b8" noWrap>{user.email}</Typography>
              </Box>
            </Box>

            {/* Downloads with bar */}
            <Box>
              <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 0.5 }}>{user.count}</Typography>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 4, borderRadius: 2, bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2,
                    background: index === 0 ? 'linear-gradient(90deg, #667eea, #764ba2)' : '#94a3b8',
                  },
                }}
              />
            </Box>

            {/* Unique CVs */}
            <Typography variant="body2" fontWeight="600" color="#64748b">{user.uniqueCVs}</Typography>

            {/* Premium/Free */}
            <Chip
              label={user.isPremium ? 'Premium' : 'Free'}
              size="small"
              sx={{
                fontWeight: 600, fontSize: '0.65rem', height: 22, width: 'fit-content',
                bgcolor: user.isPremium ? '#8b5cf615' : '#10b98115',
                color: user.isPremium ? '#8b5cf6' : '#10b981',
              }}
            />

            {/* Last Download */}
            <Tooltip title={formatFullDate(user.lastDownload)} arrow>
              <Typography variant="body2" color="#94a3b8" sx={{ cursor: 'default' }}>
                {formatDate(user.lastDownload)}
              </Typography>
            </Tooltip>
          </Box>
        );
      })}
    </Box>
  )}
</Box>
);
}