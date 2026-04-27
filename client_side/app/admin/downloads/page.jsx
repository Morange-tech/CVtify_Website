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
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  LinearProgress,
  Button,
  Skeleton,
  Snackbar,
  Alert,
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
import { adminApi } from '../../services/api';

// ─── Constants ───
const TEMPLATE_COLORS = {
  professional: '#667eea',
  creative: '#ec4899',
  executive: '#8b5cf6',
  'ats-optimized': '#10b981',
  simple: '#06b6d4',
  academic: '#f59e0b',
};

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
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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

// ─── Safe Accessors ───
const getDlId = (d) => d?.id || '';
const getDlUserName = (d) => d?.userName || d?.user?.name || 'Unknown';
const getDlUserEmail = (d) => d?.userEmail || d?.user?.email || '';
const getDlIsPremium = (d) =>
  d?.isPremiumUser ?? d?.isPremium ?? d?.user?.plan === 'premium' ?? false;
const getDlCvTitle = (d) => d?.cvTitle || d?.cv?.title || d?.documentTitle || 'Untitled';
const getDlTemplateName = (d) =>
  d?.templateName || d?.template?.name || d?.template || 'Unknown';
const getDlTemplateCategory = (d) =>
  d?.templateCategory || d?.template?.category || d?.templateName?.toLowerCase() || 'simple';
const getDlFileSize = (d) => d?.fileSize || d?.size || 'N/A';
const getDlDownloadedAt = (d) =>
  d?.downloadedAt || d?.downloaded_at || d?.createdAt || d?.created_at || null;

export default function AdminDownloadsPage() {
  // ─── State ───
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [viewMode, setViewMode] = useState('activity');

  // ─── Fetch Data ───
  const fetchDownloads = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      let response;
      if (typeof adminApi.getDownloads === 'function') {
        response = await adminApi.getDownloads();
      } else if (typeof adminApi.getDownloadActivity === 'function') {
        response = await adminApi.getDownloadActivity();
      } else if (typeof adminApi.getAnalytics === 'function') {
        response = await adminApi.getAnalytics();
      } else {
        console.warn(
          'No downloads API method found. Available adminApi methods:',
          Object.keys(adminApi).filter((k) => typeof adminApi[k] === 'function')
        );
        response = { data: [] };
      }

      const extractArray = (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.results)) return res.data.results;
        if (Array.isArray(res?.data?.downloads)) return res.data.downloads;
        if (Array.isArray(res?.data?.activity)) return res.data.activity;
        if (Array.isArray(res?.downloads)) return res.downloads;
        if (Array.isArray(res?.activity)) return res.activity;
        return [];
      };

      setDownloads(extractArray(response));
    } catch (error) {
      console.error('Failed to fetch downloads:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load download data. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  // ─── Computed Analytics ───
  const totalDownloads = downloads.length;

  // Most downloaded CV
  const cvDownloadCounts = useMemo(() => {
    const counts = {};
    downloads.forEach((d) => {
      const title = getDlCvTitle(d);
      counts[title] = (counts[title] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count);
  }, [downloads]);

  // Most used template
  const templateUsageCounts = useMemo(() => {
    const counts = {};
    downloads.forEach((d) => {
      const name = getDlTemplateName(d);
      const category = getDlTemplateCategory(d);
      if (!counts[name]) {
        counts[name] = { count: 0, category };
      }
      counts[name].count += 1;
    });
    return Object.entries(counts)
      .map(([name, data]) => ({ name, count: data.count, category: data.category }))
      .sort((a, b) => b.count - a.count);
  }, [downloads]);

  // Downloads per user
  const userDownloadCounts = useMemo(() => {
    const counts = {};
    downloads.forEach((d) => {
      const email = getDlUserEmail(d);
      if (!email) return;
      if (!counts[email]) {
        counts[email] = {
          name: getDlUserName(d),
          email,
          isPremium: getDlIsPremium(d),
          count: 0,
          lastDownload: getDlDownloadedAt(d),
          cvs: new Set(),
        };
      }
      counts[email].count += 1;
      counts[email].cvs.add(getDlCvTitle(d));
      const dlDate = getDlDownloadedAt(d);
      if (dlDate && new Date(dlDate) > new Date(counts[email].lastDownload)) {
        counts[email].lastDownload = dlDate;
      }
    });
    return Object.values(counts)
      .map((u) => ({ ...u, uniqueCVs: u.cvs.size }))
      .sort((a, b) => b.count - a.count);
  }, [downloads]);

  const maxUserDownloads = Math.max(...userDownloadCounts.map((u) => u.count), 1);
  const maxTemplateUsage = Math.max(...templateUsageCounts.map((t) => t.count), 1);

  // Today's downloads
  const today = new Date().toDateString();
  const todayDownloads = downloads.filter(
    (d) => {
      const dlDate = getDlDownloadedAt(d);
      return dlDate && new Date(dlDate).toDateString() === today;
    }
  ).length;

  // This week
  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);
  const weekDownloads = downloads.filter((d) => {
    const dlDate = getDlDownloadedAt(d);
    return dlDate && new Date(dlDate) >= weekAgo;
  }).length;

  // Unique templates used
  const uniqueTemplates = new Set(downloads.map((d) => getDlTemplateName(d))).size || 0;

  // ─── Filter Downloads ───
  const filteredDownloads = useMemo(() => {
    return downloads.filter((d) => {
      const userName = getDlUserName(d).toLowerCase();
      const cvTitle = getDlCvTitle(d).toLowerCase();
      const templateName = getDlTemplateName(d).toLowerCase();
      const userEmail = getDlUserEmail(d).toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        userName.includes(query) ||
        cvTitle.includes(query) ||
        templateName.includes(query) ||
        userEmail.includes(query);

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'premium' && getDlIsPremium(d)) ||
        (activeTab === 'free' && !getDlIsPremium(d));

      const matchesTemplate =
        templateFilter === 'all' || getDlTemplateName(d) === templateFilter;

      let matchesDate = true;
      const dlDate = getDlDownloadedAt(d);
      if (dlDate) {
        const downloadDate = new Date(dlDate);
        if (dateFilter === 'today') {
          matchesDate = downloadDate.toDateString() === today;
        } else if (dateFilter === 'week') {
          matchesDate = downloadDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = downloadDate >= monthAgo;
        }
      }

      return matchesSearch && matchesTab && matchesTemplate && matchesDate;
    });
  }, [downloads, searchQuery, activeTab, templateFilter, dateFilter, today, weekAgo]);

  // Unique template names for filter
  const templateNames = useMemo(
    () => [...new Set(downloads.map((d) => getDlTemplateName(d)))].filter(Boolean).sort(),
    [downloads]
  );

  // ─── Handlers ───
  const handleRefresh = () => {
    fetchDownloads(true);
  };

  const handleExport = async () => {
    try {
      setSnackbar({ open: true, message: 'Exporting downloads...', severity: 'info' });

      const headers = [
        'ID',
        'User',
        'Email',
        'Premium',
        'CV Title',
        'Template',
        'File Size',
        'Downloaded At',
      ];

      const csvRows = [
        headers.join(','),
        ...downloads.map((d) =>
          [
            `"${getDlId(d)}"`,
            `"${getDlUserName(d)}"`,
            `"${getDlUserEmail(d)}"`,
            getDlIsPremium(d) ? 'Yes' : 'No',
            `"${getDlCvTitle(d).replace(/"/g, '""')}"`,
            `"${getDlTemplateName(d)}"`,
            `"${getDlFileSize(d)}"`,
            `"${getDlDownloadedAt(d) || ''}"`,
          ].join(',')
        ),
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `downloads-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'Downloads exported successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Export failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to export downloads.',
        severity: 'error',
      });
    }
  };

  // ─── Loading Skeleton ───
  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={320} height={40} />
          <Skeleton variant="text" width={420} height={24} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={130} sx={{ borderRadius: 3 }} />
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
          {[...Array(6)].map((_, i) => (
            <Box key={i} sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="50%" height={20} />
                  <Skeleton variant="text" width="35%" height={16} />
                </Box>
                <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width={60} height={16} />
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
            onClick={handleExport}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#667eea',
                color: '#667eea',
                bgcolor: '#667eea08',
              },
            }}
          >
            Export CSV
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
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 4,
        }}
      >
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
            sub: `${totalDownloads > 0 ? ((weekDownloads / totalDownloads) * 100).toFixed(0) : 0}% of total`,
            icon: <TrendingUpIcon />,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
          {
            label: 'Unique Users',
            value: userDownloadCounts.length,
            sub: `avg ${userDownloadCounts.length > 0 ? (totalDownloads / userDownloadCounts.length).toFixed(1) : '0'} downloads/user`,
            icon: <PeopleIcon />,
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          },
          {
            label: 'Templates Used',
            value: uniqueTemplates,
            sub: `Most: ${templateUsageCounts[0]?.name || 'N/A'}`,
            icon: <BrushIcon />,
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
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
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              },
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: stat.gradient,
                opacity: 0.08,
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1,
              }}
            >
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

      {/* ─── View Tabs ─── */}
      <Tabs
        value={viewMode}
        onChange={(e, v) => setViewMode(v)}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            minHeight: 40,
          },
          '& .Mui-selected': { color: '#667eea' },
          '& .MuiTabs-indicator': {
            backgroundColor: '#667eea',
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        <Tab
          icon={<ViewListIcon sx={{ fontSize: 18 }} />}
          iconPosition="start"
          label="Recent Activity"
          value="activity"
        />
        <Tab
          icon={<EmojiEventsIcon sx={{ fontSize: 18 }} />}
          iconPosition="start"
          label="Top CVs"
          value="top-cvs"
        />
        <Tab
          icon={<BrushIcon sx={{ fontSize: 18 }} />}
          iconPosition="start"
          label="Template Usage"
          value="templates"
        />
        <Tab
          icon={<PeopleIcon sx={{ fontSize: 18 }} />}
          iconPosition="start"
          label="Per User"
          value="users"
        />
      </Tabs>

      {/* ═══════════════════════════════════════ */}
      {/* ─── VIEW: RECENT ACTIVITY ─── */}
      {/* ═══════════════════════════════════════ */}
      {viewMode === 'activity' && (
        <>
          {/* Filters */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Search by user, CV, or template..."
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

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>
                Time Range
              </InputLabel>
              <Select
                value={dateFilter}
                label="Time Range"
                onChange={(e) => setDateFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#ffffff',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>
                Template
              </InputLabel>
              <Select
                value={templateFilter}
                label="Template"
                onChange={(e) => setTemplateFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#ffffff',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }}
              >
                <MenuItem value="all">All Templates</MenuItem>
                {templateNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              sx={{
                minHeight: 36,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  minHeight: 36,
                  py: 0,
                },
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
            Showing {filteredDownloads.length} download
            {filteredDownloads.length !== 1 ? 's' : ''}
          </Typography>

          {/* Activity List */}
          {filteredDownloads.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                bgcolor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <DownloadIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
              <Typography variant="h6" fontWeight="600" color="#94a3b8">
                No downloads found
              </Typography>
              <Typography variant="body2" color="#cbd5e1">
                Try adjusting your filters
              </Typography>
            </Box>
          ) : (
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
                  display: { xs: 'none', md: 'grid' },
                  gridTemplateColumns: '2fr 2fr 1.2fr 0.8fr 1fr',
                  gap: 2,
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                {['USER', 'CV / DOCUMENT', 'TEMPLATE', 'SIZE', 'DOWNLOADED'].map((h) => (
                  <Typography
                    key={h}
                    variant="caption"
                    fontWeight="700"
                    color="#64748b"
                    letterSpacing="0.05em"
                  >
                    {h}
                  </Typography>
                ))}
              </Box>

              {filteredDownloads.map((download, index) => {
                const templateColor =
                  TEMPLATE_COLORS[getDlTemplateCategory(download)] || '#64748b';
                const isPremium = getDlIsPremium(download);

                return (
                  <Box
                    key={getDlId(download) || index}
                    sx={{
                      display: { xs: 'flex', md: 'grid' },
                      flexDirection: { xs: 'column', md: 'unset' },
                      gridTemplateColumns: '2fr 2fr 1.2fr 0.8fr 1fr',
                      gap: { xs: 1, md: 2 },
                      p: 2,
                      alignItems: { md: 'center' },
                      borderBottom:
                        index < filteredDownloads.length - 1
                          ? '1px solid #f1f5f9'
                          : 'none',
                      transition: 'background 0.15s ease',
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
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: isPremium ? '#8b5cf620' : '#667eea15',
                          color: isPremium ? '#8b5cf6' : '#667eea',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(getDlUserName(download))}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="#1e293b"
                            noWrap
                          >
                            {getDlUserName(download)}
                          </Typography>
                          {isPremium && (
                            <WorkspacePremiumIcon
                              sx={{ fontSize: 14, color: '#8b5cf6' }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="#94a3b8" noWrap>
                          {getDlUserEmail(download)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* CV */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        minWidth: 0,
                      }}
                    >
                      <PictureAsPdfIcon
                        sx={{ fontSize: 20, color: '#ef4444', flexShrink: 0 }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight="500"
                        color="#1e293b"
                        noWrap
                      >
                        {getDlCvTitle(download)}
                      </Typography>
                    </Box>

                    {/* Template */}
                    <Chip
                      label={getDlTemplateName(download)}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 24,
                        width: 'fit-content',
                        bgcolor: `${templateColor}15`,
                        color: templateColor,
                        borderLeft: `3px solid ${templateColor}`,
                        borderRadius: '0 12px 12px 0',
                      }}
                    />

                    {/* Size */}
                    <Typography variant="body2" color="#64748b">
                      {getDlFileSize(download)}
                    </Typography>

                    {/* Time */}
                    <Tooltip
                      title={formatFullDate(getDlDownloadedAt(download))}
                      arrow
                    >
                      <Typography
                        variant="body2"
                        color="#94a3b8"
                        sx={{ cursor: 'default' }}
                      >
                        {formatDate(getDlDownloadedAt(download))}
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
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="h6" fontWeight="700" color="#1e293b">
              🏆 Most Downloaded CVs
            </Typography>
            <Typography variant="body2" color="#94a3b8">
              Ranked by total number of downloads
            </Typography>
          </Box>

          {cvDownloadCounts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <DescriptionIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
              <Typography variant="body1" fontWeight="600" color="#94a3b8">
                No download data yet
              </Typography>
            </Box>
          ) : (
            cvDownloadCounts.map((cv, index) => {
              const maxCount = cvDownloadCounts[0]?.count || 1;
              const percentage = (cv.count / maxCount) * 100;
              const isTop3 = index < 3;
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <Box
                  key={cv.title}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2.5,
                    px: 3,
                    borderBottom:
                      index < cvDownloadCounts.length - 1
                        ? '1px solid #f1f5f9'
                        : 'none',
                    transition: 'background 0.15s ease',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  <Box sx={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                    {isTop3 ? (
                      <Typography fontSize="1.5rem">{medals[index]}</Typography>
                    ) : (
                      <Typography variant="body1" fontWeight="700" color="#94a3b8">
                        #{index + 1}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      color="#1e293b"
                      noWrap
                    >
                      {cv.title}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#f1f5f9',
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

                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography
                      variant="h6"
                      fontWeight="800"
                      color={isTop3 ? '#667eea' : '#64748b'}
                    >
                      {cv.count}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      downloads
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* ─── VIEW: TEMPLATE USAGE ─── */}
      {/* ═══════════════════════════════════════ */}
      {viewMode === 'templates' && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          {/* Template Ranking */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="h6" fontWeight="700" color="#1e293b">
                🎨 Template Popularity
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                Templates ranked by download count
              </Typography>
            </Box>

            {templateUsageCounts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <BrushIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
                <Typography variant="body1" fontWeight="600" color="#94a3b8">
                  No template data yet
                </Typography>
              </Box>
            ) : (
              templateUsageCounts.map((template, index) => {
                const percentage = (template.count / maxTemplateUsage) * 100;
                const color = TEMPLATE_COLORS[template.category] || '#64748b';
                return (
                  <Box
                    key={template.name}
                    sx={{
                      p: 2.5,
                      px: 3,
                      borderBottom:
                        index < templateUsageCounts.length - 1
                          ? '1px solid #f1f5f9'
                          : 'none',
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: color,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="#1e293b"
                        >
                          {template.name}
                        </Typography>
                        {index === 0 && (
                          <Chip
                            label="Most Used"
                            size="small"
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.6rem',
                              height: 20,
                              bgcolor: '#f59e0b20',
                              color: '#f59e0b',
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" fontWeight="700" color={color}>
                        {template.count}
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#f1f5f9',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          bgcolor: color,
                        },
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="#94a3b8"
                      sx={{ mt: 0.5, display: 'block' }}
                    >
                      {totalDownloads > 0
                        ? ((template.count / totalDownloads) * 100).toFixed(1)
                        : '0'}
                      % of all downloads
                    </Typography>
                  </Box>
                );
              })
            )}
          </Box>

          {/* Template Distribution Visual */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              p: 3,
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ mb: 1 }}>
              📊 Distribution Overview
            </Typography>
            <Typography variant="body2" color="#94a3b8" sx={{ mb: 3 }}>
              Visual breakdown of template usage
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {templateUsageCounts.map((template) => {
                const color = TEMPLATE_COLORS[template.category] || '#64748b';
                const pct =
                  totalDownloads > 0
                    ? ((template.count / totalDownloads) * 100).toFixed(1)
                    : '0';
                return (
                  <Box key={template.name}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 0.8,
                      }}
                    >
                      <Typography variant="body2" fontWeight="600" color="#1e293b">
                        {template.name}
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color={color}>
                        {pct}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          height: 28,
                          bgcolor: '#f1f5f9',
                          borderRadius: 2,
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${pct}%`,
                            height: '100%',
                            borderRadius: 2,
                            background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'width 0.6s ease',
                          }}
                        >
                          {parseFloat(pct) > 15 && (
                            <Typography
                              variant="caption"
                              fontWeight="700"
                              color="#ffffff"
                              fontSize="0.65rem"
                            >
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
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#667eea08',
                  border: '1px solid #667eea20',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" fontWeight="800" color="#667eea">
                  {uniqueTemplates}
                </Typography>
                <Typography variant="caption" color="#64748b">
                  Active Templates
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#10b98108',
                  border: '1px solid #10b98120',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" fontWeight="800" color="#10b981">
                  {uniqueTemplates > 0
                    ? (totalDownloads / uniqueTemplates).toFixed(1)
                    : '0'}
                </Typography>
                <Typography variant="caption" color="#64748b">
                  Avg Downloads/Template
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* ─── VIEW: PER USER ─── */}
      {/* ═══════════════════════════════════════ */}
      {viewMode === 'users' && (
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="700" color="#1e293b">
                👥 Downloads Per User
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                Individual user download activity
              </Typography>
            </Box>
            <Chip
              label={`${userDownloadCounts.length} users`}
              size="small"
              sx={{ fontWeight: 600, bgcolor: '#667eea15', color: '#667eea' }}
            />
          </Box>

          {userDownloadCounts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <PeopleIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
              <Typography variant="body1" fontWeight="600" color="#94a3b8">
                No user data yet
              </Typography>
            </Box>
          ) : (
            <>
              {/* Table Header */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'grid' },
                  gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1.5fr',
                  gap: 2,
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                {['USER', 'DOWNLOADS', 'UNIQUE CVs', 'TYPE', 'LAST DOWNLOAD'].map(
                  (h) => (
                    <Typography
                      key={h}
                      variant="caption"
                      fontWeight="700"
                      color="#64748b"
                      letterSpacing="0.05em"
                    >
                      {h}
                    </Typography>
                  )
                )}
              </Box>

              {userDownloadCounts.map((user, index) => {
                const percentage = (user.count / maxUserDownloads) * 100;
                return (
                  <Box
                    key={user.email}
                    sx={{
                      display: { xs: 'flex', md: 'grid' },
                      flexDirection: { xs: 'column', md: 'unset' },
                      gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1.5fr',
                      gap: { xs: 1, md: 2 },
                      p: 2,
                      px: 3,
                      alignItems: { md: 'center' },
                      borderBottom:
                        index < userDownloadCounts.length - 1
                          ? '1px solid #f1f5f9'
                          : 'none',
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
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: user.isPremium ? '#8b5cf620' : '#667eea15',
                            color: user.isPremium ? '#8b5cf6' : '#667eea',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        {index < 3 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -4,
                              right: -4,
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              bgcolor:
                                index === 0
                                  ? '#f59e0b'
                                  : index === 1
                                    ? '#94a3b8'
                                    : '#cd7f32',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid #ffffff',
                            }}
                          >
                            <Typography
                              fontSize="0.5rem"
                              fontWeight="800"
                              color="#ffffff"
                            >
                              {index + 1}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            color="#1e293b"
                            noWrap
                          >
                            {user.name}
                          </Typography>
                          {user.isPremium && (
                            <WorkspacePremiumIcon
                              sx={{ fontSize: 14, color: '#8b5cf6' }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="#94a3b8" noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Downloads with bar */}
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="700"
                        color="#1e293b"
                        sx={{ mb: 0.5 }}
                      >
                        {user.count}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: '#f1f5f9',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                            background:
                              index === 0
                                ? 'linear-gradient(90deg, #667eea, #764ba2)'
                                : '#94a3b8',
                          },
                        }}
                      />
                    </Box>

                    {/* Unique CVs */}
                    <Typography variant="body2" fontWeight="600" color="#64748b">
                      {user.uniqueCVs}
                    </Typography>

                    {/* Premium/Free */}
                    <Chip
                      label={user.isPremium ? 'Premium' : 'Free'}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 22,
                        width: 'fit-content',
                        bgcolor: user.isPremium ? '#8b5cf615' : '#10b98115',
                        color: user.isPremium ? '#8b5cf6' : '#10b981',
                      }}
                    />

                    {/* Last Download */}
                    <Tooltip title={formatFullDate(user.lastDownload)} arrow>
                      <Typography
                        variant="body2"
                        color="#94a3b8"
                        sx={{ cursor: 'default' }}
                      >
                        {formatDate(user.lastDownload)}
                      </Typography>
                    </Tooltip>
                  </Box>
                );
              })}
            </>
          )}
        </Box>
      )}

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