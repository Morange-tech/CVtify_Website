'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Alert,
  Snackbar,
  LinearProgress,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BrushIcon from '@mui/icons-material/Brush';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { adminApi } from '../../services/api';

export default function AdminCVsPage() {
  // ─── State ───
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedCv, setSelectedCv] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedCvs, setSelectedCvs] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [cvs, setCvs] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  // ─── Computed Stats ───
  const totalCvs = cvs.length;
  const completeCvs = cvs.filter((c) => c.status === 'complete').length;
  const draftCvs = cvs.filter((c) => c.status === 'draft').length;
  const totalDownloads = cvs.reduce((acc, c) => acc + c.downloads, 0);
  const premiumUserCvs = cvs.filter((c) => c.user.plan === 'premium').length;
  const freeUserCvs = cvs.filter((c) => c.user.plan === 'free').length;

  // Template usage stats
  const templateStats = (Array.isArray(templates) ? templates : [])
    .map((t) => ({
      ...t,
      count: cvs.filter((c) => c.templateId === t.id).length,
    }))
    .sort((a, b) => b.count - a.count);

  const maxTemplateCount = Math.max(...templateStats.map((t) => t.count), 1);

  // ─── Filter ───
  const filteredCvs = useMemo(() => {
    let result = cvs.filter((cv) => {
      const matchesSearch =
        cv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cv.user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'complete' && cv.status === 'complete') ||
        (activeTab === 'draft' && cv.status === 'draft');

      const matchesTemplate =
        templateFilter === 'all' || cv.templateId === parseInt(templateFilter);

      const matchesUser =
        userFilter === 'all' || cv.user.id === parseInt(userFilter);

      return matchesSearch && matchesTab && matchesTemplate && matchesUser;
    });

    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'downloads':
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [cvs, searchQuery, activeTab, templateFilter, userFilter, sortBy]);

  // ─── Pagination ───
  const totalPages = Math.ceil(filteredCvs.length / itemsPerPage);
  const paginatedCvs = filteredCvs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ─── Template Color Helper ───
  const getTemplateColor = (templateId) => {
    return templates.find((t) => t.id === templateId)?.color || '#64748b';
  };

  // ─── Handlers ───
  const handleMenuOpen = (event, cv) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCv(cv);
  };

  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleViewCv = (cv) => {
    setSelectedCv(cv || selectedCv);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteOpen = (cv) => {
    setSelectedCv(cv || selectedCv);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminApi.deleteCV(selectedCv.id);

      setCvs((prev) => prev.filter((c) => c.id !== selectedCv.id));
      setDeleteDialogOpen(false);

      setSnackbar({
        open: true,
        message: `"${selectedCv.title}" deleted.`,
        severity: 'warning',
      });
    } catch (error) {
      console.error('Delete failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete CV',
        severity: 'error',
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await adminApi.bulkDeleteCVs(selectedCvs);

      setCvs((prev) => prev.filter((c) => !selectedCvs.includes(c.id)));
      setSelectedCvs([]);
      setBulkDeleteDialogOpen(false);

      setSnackbar({
        open: true,
        message: `${selectedCvs.length} CVs deleted.`,
        severity: 'warning',
      });
    } catch (error) {
      console.error('Bulk delete failed:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete selected CVs',
        severity: 'error',
      });
    }
  };

  const handleToggleSelect = (cvId) => {
    setSelectedCvs((prev) =>
      prev.includes(cvId) ? prev.filter((id) => id !== cvId) : [...prev, cvId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCvs.length === paginatedCvs.length) {
      setSelectedCvs([]);
    } else {
      setSelectedCvs(paginatedCvs.map((c) => c.id));
    }
  };

  const handleFilterByUser = (userId) => {
    setUserFilter(String(userId));
    setViewDialogOpen(false);
    setCurrentPage(1);
  };

  const handleFilterByTemplate = (templateId) => {
    setTemplateFilter(String(templateId));
    setViewDialogOpen(false);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setTemplateFilter('all');
    setUserFilter('all');
    setSearchQuery('');
    setActiveTab('all');
    setCurrentPage(1);
  };

  const fetchAdminData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [cvsRes, templatesRes, usersRes] = await Promise.all([
        adminApi.getCVs(),
        adminApi.getTemplates(),
        adminApi.getUsers(),
      ]);

      const extractArray = (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.data?.results)) return res.data.results;
        return [];
      };

      setCvs(extractArray(cvsRes));
      setTemplates(extractArray(templatesRes));
      setUsersList(extractArray(usersRes));
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load admin data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const hasActiveFilters = templateFilter !== 'all' || userFilter !== 'all' || searchQuery;

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="#64748b">
          Loading CV data...
        </Typography>
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
            📄 CV Management
          </Typography>
          <Typography variant="body2" color="#64748b">
            Monitor and manage all CVs created on the platform
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {selectedCvs.length > 0 && (
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setBulkDeleteDialogOpen(true)}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            >
              Delete ({selectedCvs.length})
            </Button>
          )}
          <Button
            size="small"
            startIcon={<FileDownloadIcon />}
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
              onClick={() => fetchAdminData(true)}
              sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}
            >
              <RefreshIcon
                sx={{
                  fontSize: 20,
                  color: '#64748b',
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
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
          { label: 'Total CVs', value: totalCvs, icon: <DescriptionIcon />, color: '#667eea' },
          { label: 'Complete', value: completeCvs, icon: <DescriptionIcon />, color: '#10b981' },
          { label: 'Drafts', value: draftCvs, icon: <DescriptionIcon />, color: '#f59e0b' },
          { label: 'Downloads', value: totalDownloads, icon: <DownloadIcon />, color: '#8b5cf6' },
          { label: 'Premium CVs', value: premiumUserCvs, icon: <WorkspacePremiumIcon />, color: '#ec4899' },
          { label: 'Free CVs', value: freeUserCvs, icon: <PersonIcon />, color: '#64748b' },
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
              <Typography variant="caption" color="#94a3b8">{stat.label}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ─── Most Used Templates ─── */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          p: 3,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: '#667eea12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#667eea',
              }}
            >
              <BrushIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight="700" color="#1e293b">
              Most Used Templates
            </Typography>
          </Box>
          <Chip
            label={`${templates.length} templates`}
            size="small"
            sx={{ fontWeight: 600, bgcolor: '#667eea15', color: '#667eea' }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2,
          }}
        >
          {templateStats.map((template, index) => (
            <Box
              key={template.id}
              onClick={() => {
                setTemplateFilter(String(template.id));
                setCurrentPage(1);
              }}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: templateFilter === String(template.id) ? `${template.color}60` : '#e2e8f0',
                bgcolor: templateFilter === String(template.id) ? `${template.color}08` : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: template.color,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${template.color}20`,
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" fontWeight="700" color="#94a3b8">
                    #{index + 1}
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">
                    {template.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: 1,
                    bgcolor: template.color,
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="#64748b">
                  {template.count} CVs created
                </Typography>
                <Typography variant="caption" fontWeight="600" color={template.color}>
                  {totalCvs > 0 ? Math.round((template.count / totalCvs) * 100) : 0}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={(template.count / maxTemplateCount) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    bgcolor: template.color,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
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
        <Tab label={`All (${totalCvs})`} value="all" />
        <Tab label={`Complete (${completeCvs})`} value="complete" />
        <Tab label={`Drafts (${draftCvs})`} value="draft" />
      </Tabs>

      {/* ─── Search, Filters & Sort ─── */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <TextField
          placeholder="Search by title, user name, or email..."
          size="small"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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

        {/* Template Filter */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>Template</InputLabel>
          <Select
            value={templateFilter}
            label="Template"
            onChange={(e) => { setTemplateFilter(e.target.value); setCurrentPage(1); }}
            sx={{
              borderRadius: 2,
              bgcolor: '#ffffff',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
            }}
          >
            <MenuItem value="all">All Templates</MenuItem>
            {templates.map((t) => (
              <MenuItem key={t.id} value={String(t.id)}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: t.color }} />
                  {t.name}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* User Filter */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel sx={{ '&.Mui-focused': { color: '#667eea' } }}>User</InputLabel>
          <Select
            value={userFilter}
            label="User"
            onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
            sx={{
              borderRadius: 2,
              bgcolor: '#ffffff',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
            }}
          >
            <MenuItem value="all">All Users</MenuItem>
            {usersList.map((u) => (
              <MenuItem key={u.id} value={String(u.id)}>{u.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort */}
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

        <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)}>
          {[
            { label: 'Newest First', value: 'newest' },
            { label: 'Oldest First', value: 'oldest' },
            { label: 'Most Downloads', value: 'downloads' },
            { label: 'Title (A-Z)', value: 'title' },
          ].map((opt) => (
            <MenuItem key={opt.value} selected={sortBy === opt.value} onClick={() => { setSortBy(opt.value); setSortAnchorEl(null); }}>
              {opt.label}
            </MenuItem>
          ))}
        </Menu>

        {/* View Toggle */}
        <Box sx={{ display: 'flex', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <IconButton
            size="small"
            onClick={() => setViewMode('list')}
            sx={{
              borderRadius: '8px 0 0 8px',
              bgcolor: viewMode === 'list' ? '#667eea15' : 'transparent',
              color: viewMode === 'list' ? '#667eea' : '#94a3b8',
            }}
          >
            <ViewListIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setViewMode('grid')}
            sx={{
              borderRadius: '0 8px 8px 0',
              bgcolor: viewMode === 'grid' ? '#667eea15' : 'transparent',
              color: viewMode === 'grid' ? '#667eea' : '#94a3b8',
            }}
          >
            <GridViewIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="caption" color="#64748b" fontWeight="600">
            Active filters:
          </Typography>
          {templateFilter !== 'all' && (
            <Chip
              label={`Template: ${templates.find((t) => t.id === parseInt(templateFilter))?.name}`}
              size="small"
              onDelete={() => setTemplateFilter('all')}
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
          {userFilter !== 'all' && (
            <Chip
              label={`User: ${usersList.find((u) => u.id === parseInt(userFilter))?.name}`}
              size="small"
              onDelete={() => setUserFilter('all')}
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
          {searchQuery && (
            <Chip
              label={`Search: "${searchQuery}"`}
              size="small"
              onDelete={() => setSearchQuery('')}
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          )}
          <Button
            size="small"
            onClick={clearFilters}
            sx={{ textTransform: 'none', color: '#ef4444', fontWeight: 600, fontSize: '0.75rem' }}
          >
            Clear All
          </Button>
        </Box>
      )}

      {/* ─── CV Table / Grid ─── */}
      {viewMode === 'list' ? (
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
              gridTemplateColumns: { xs: 'auto 2fr 1fr 1fr auto', md: 'auto 2.5fr 1.5fr 1fr 1fr 1fr 1fr auto' },
              gap: 2,
              p: 2,
              bgcolor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              alignItems: 'center',
            }}
          >
            <Box
              onClick={handleSelectAll}
              sx={{
                width: 18,
                height: 18,
                borderRadius: 0.5,
                border: '2px solid',
                borderColor: selectedCvs.length === paginatedCvs.length && paginatedCvs.length > 0 ? '#667eea' : '#cbd5e1',
                bgcolor: selectedCvs.length === paginatedCvs.length && paginatedCvs.length > 0 ? '#667eea' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {selectedCvs.length === paginatedCvs.length && paginatedCvs.length > 0 && (
                <Typography sx={{ color: '#ffffff', fontSize: '0.6rem', fontWeight: 700 }}>✓</Typography>
              )}
            </Box>
            <Typography variant="caption" fontWeight="700" color="#64748b">CV TITLE</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">USER</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">TEMPLATE</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>STATUS</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>DOWNLOADS</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b" sx={{ display: { xs: 'none', md: 'block' } }}>CREATED</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b" textAlign="right">ACTIONS</Typography>
          </Box>

          {/* Rows */}
          {paginatedCvs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <DescriptionIcon sx={{ fontSize: 48, color: '#e2e8f0', mb: 2 }} />
              <Typography variant="body1" fontWeight="600" color="#94a3b8">No CVs found</Typography>
              <Typography variant="body2" color="#cbd5e1">Try adjusting your filters</Typography>
            </Box>
          ) : (
            paginatedCvs.map((cv, index) => (
              <Box
                key={cv.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'auto 2fr 1fr 1fr auto', md: 'auto 2.5fr 1.5fr 1fr 1fr 1fr 1fr auto' },
                  gap: 2,
                  p: 2,
                  alignItems: 'center',
                  borderBottom: index < paginatedCvs.length - 1 ? '1px solid #f1f5f9' : 'none',
                  transition: 'all 0.2s ease',
                  bgcolor: selectedCvs.includes(cv.id) ? '#667eea08' : 'transparent',
                  '&:hover': { bgcolor: selectedCvs.includes(cv.id) ? '#667eea12' : '#f8fafc' },
                }}
              >
                {/* Checkbox */}
                <Box
                  onClick={() => handleToggleSelect(cv.id)}
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: 0.5,
                    border: '2px solid',
                    borderColor: selectedCvs.includes(cv.id) ? '#667eea' : '#cbd5e1',
                    bgcolor: selectedCvs.includes(cv.id) ? '#667eea' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {selectedCvs.includes(cv.id) && (
                    <Typography sx={{ color: '#ffffff', fontSize: '0.6rem', fontWeight: 700 }}>✓</Typography>
                  )}
                </Box>

                {/* Title */}
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, cursor: 'pointer' }}
                  onClick={() => handleViewCv(cv)}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 46,
                      borderRadius: 1,
                      bgcolor: `${getTemplateColor(cv.templateId)}12`,
                      border: `1px solid ${getTemplateColor(cv.templateId)}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 18, color: getTemplateColor(cv.templateId) }} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
                      {cv.title}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      {cv.pages} page{cv.pages > 1 ? 's' : ''} • {cv.sections.length} sections
                    </Typography>
                  </Box>
                </Box>

                {/* User */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: cv.user.plan === 'premium' ? '#8b5cf6' : '#64748b', fontSize: '0.7rem', fontWeight: 700 }}>
                    {cv.user.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" fontWeight="600" color="#1e293b" noWrap>
                      {cv.user.name}
                    </Typography>
                    {cv.user.plan === 'premium' && (
                      <WorkspacePremiumIcon sx={{ fontSize: 12, color: '#8b5cf6', ml: 0.3, verticalAlign: 'middle' }} />
                    )}
                  </Box>
                </Box>

                {/* Template */}
                <Chip
                  label={cv.template}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    height: 22,
                    width: 'fit-content',
                    bgcolor: `${getTemplateColor(cv.templateId)}15`,
                    color: getTemplateColor(cv.templateId),
                  }}
                />

                {/* Status */}
                <Chip
                  label={cv.status === 'complete' ? 'Complete' : 'Draft'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    height: 22,
                    width: 'fit-content',
                    display: { xs: 'none', md: 'flex' },
                    bgcolor: cv.status === 'complete' ? '#10b98115' : '#f59e0b15',
                    color: cv.status === 'complete' ? '#10b981' : '#f59e0b',
                  }}
                />

                {/* Downloads */}
                <Typography variant="body2" fontWeight="600" color="#1e293b" sx={{ display: { xs: 'none', md: 'block' } }}>
                  {cv.downloads}
                </Typography>

                {/* Created */}
                <Typography variant="caption" color="#94a3b8" sx={{ display: { xs: 'none', md: 'block' } }}>
                  {new Date(cv.createdAt).toLocaleDateString()}
                </Typography>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                  <Tooltip title="View">
                    <IconButton onClick={(e) => handleMenuOpen(e, cv)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, cv)}>
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
                {Math.min(currentPage * itemsPerPage, filteredCvs.length)} of {filteredCvs.length}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <IconButton
                  size="small"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography variant="body2">{currentPage} / {totalPages}</Typography>
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
      ) : (
        /* ─── Grid View ─── */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {paginatedCvs.map((cv) => (
            <Box
              key={cv.id}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: selectedCvs.includes(cv.id) ? '2px solid #667eea' : '2px solid transparent',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' },
              }}
            >
              {/* CV Preview Header */}
              <Box
                sx={{
                  height: 100,
                  bgcolor: `${getTemplateColor(cv.templateId)}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => handleViewCv(cv)}
              >
                <DescriptionIcon sx={{ fontSize: 40, color: `${getTemplateColor(cv.templateId)}40` }} />

                {/* Status Badge */}
                <Chip
                  label={cv.status === 'complete' ? 'Complete' : 'Draft'}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    height: 22,
                    bgcolor: cv.status === 'complete' ? '#10b98120' : '#f59e0b20',
                    color: cv.status === 'complete' ? '#10b981' : '#f59e0b',
                  }}
                />

                {/* Checkbox */}
                <Box
                  onClick={(e) => { e.stopPropagation(); handleToggleSelect(cv.id); }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 20,
                    height: 20,
                    borderRadius: 0.5,
                    border: '2px solid',
                    borderColor: selectedCvs.includes(cv.id) ? '#667eea' : '#cbd5e180',
                    bgcolor: selectedCvs.includes(cv.id) ? '#667eea' : 'rgba(255,255,255,0.8)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedCvs.includes(cv.id) && (
                    <Typography sx={{ color: '#ffffff', fontSize: '0.6rem', fontWeight: 700 }}>✓</Typography>
                  )}
                </Box>
              </Box>

              {/* CV Info */}
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
                  {cv.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Avatar sx={{ width: 20, height: 20, bgcolor: cv.user.plan === 'premium' ? '#8b5cf6' : '#64748b', fontSize: '0.55rem' }}>
                    {cv.user.name.charAt(0)}
                  </Avatar>
                  <Typography variant="caption" color="#64748b" noWrap>
                    {cv.user.name}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={cv.template}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.6rem',
                      height: 20,
                      bgcolor: `${getTemplateColor(cv.templateId)}15`,
                      color: getTemplateColor(cv.templateId),
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DownloadIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                    <Typography variant="caption" color="#94a3b8">{cv.downloads}</Typography>
                  </Box>
                </Box>
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
      >
        <MenuItem onClick={() => handleViewCv(selectedCv)}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteOpen(selectedCv)}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* ═══════════ VIEW CV DIALOG ═══════════ */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedCv && (
          <>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${getTemplateColor(selectedCv.templateId)}20 0%, ${getTemplateColor(selectedCv.templateId)}05 100%)`,
                p: 3,
                borderBottom: `2px solid ${getTemplateColor(selectedCv.templateId)}30`,
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() => setViewDialogOpen(false)}
                sx={{ position: 'absolute', top: 8, right: 8, color: '#64748b' }}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 72,
                    borderRadius: 1.5,
                    bgcolor: `${getTemplateColor(selectedCv.templateId)}15`,
                    border: `1px solid ${getTemplateColor(selectedCv.templateId)}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 28, color: getTemplateColor(selectedCv.templateId) }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="700" color="#1e293b">
                    {selectedCv.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip label={selectedCv.template} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: `${getTemplateColor(selectedCv.templateId)}15`, color: getTemplateColor(selectedCv.templateId) }} />
                    <Chip label={selectedCv.status === 'complete' ? 'Complete' : 'Draft'} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: selectedCv.status === 'complete' ? '#10b98115' : '#f59e0b15', color: selectedCv.status === 'complete' ? '#10b981' : '#f59e0b' }} />
                  </Box>
                </Box>
              </Box>
            </Box>

            <DialogContent sx={{ p: 3 }}>
              {/* CV Stats */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
                {[
                  { label: 'Pages', value: selectedCv.pages, color: '#667eea' },
                  { label: 'Downloads', value: selectedCv.downloads, color: '#10b981' },
                  { label: 'Sections', value: selectedCv.sections.length, color: '#8b5cf6' },
                ].map((stat, i) => (
                  <Box key={i} sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: `${stat.color}08`, border: `1px solid ${stat.color}20` }}>
                    <Typography variant="h5" fontWeight="700" color="#1e293b">{stat.value}</Typography>
                    <Typography variant="caption" color="#94a3b8">{stat.label}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Owner Info */}
              <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 1.5 }}>
                Owner
              </Typography>
              <Box
                onClick={() => handleFilterByUser(selectedCv.user.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  mb: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#667eea', bgcolor: '#667eea08' },
                }}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: selectedCv.user.plan === 'premium' ? '#8b5cf6' : '#64748b', fontWeight: 700, fontSize: '0.85rem' }}>
                  {selectedCv.user.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" fontWeight="600" color="#1e293b">{selectedCv.user.name}</Typography>
                    {selectedCv.user.plan === 'premium' && <WorkspacePremiumIcon sx={{ fontSize: 14, color: '#8b5cf6' }} />}
                  </Box>
                  <Typography variant="caption" color="#94a3b8">{selectedCv.user.email}</Typography>
                </Box>
                <Chip
                  label={selectedCv.user.plan === 'premium' ? 'Premium' : 'Free'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    bgcolor: selectedCv.user.plan === 'premium' ? '#8b5cf615' : '#f1f5f9',
                    color: selectedCv.user.plan === 'premium' ? '#8b5cf6' : '#64748b',
                  }}
                />
              </Box>

              {/* Sections */}
              <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 1.5 }}>
                CV Sections
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {selectedCv.sections.map((section, i) => (
                  <Chip
                    key={i}
                    label={section}
                    size="small"
                    sx={{ fontWeight: 500, fontSize: '0.75rem', bgcolor: '#f1f5f9', color: '#64748b' }}
                  />
                ))}
              </Box>

              {/* Details */}
              <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 1.5 }}>
                Details
              </Typography>
              {[
                { label: 'Created', value: new Date(selectedCv.createdAt).toLocaleString() },
                { label: 'Last Edited', value: selectedCv.lastEdited },
                { label: 'Template', value: selectedCv.template },
              ].map((detail, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                  <Typography variant="body2" color="#64748b">{detail.label}</Typography>
                  <Typography variant="body2" fontWeight="600" color="#1e293b">{detail.value}</Typography>
                </Box>
              ))}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => { setViewDialogOpen(false); handleDeleteOpen(selectedCv); }}
                sx={{ textTransform: 'none', color: '#ef4444', fontWeight: 600 }}
              >
                Delete
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button onClick={() => setViewDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ═══════════ DELETE DIALOG ═══════════ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon />
            Delete CV
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Are you sure you want to delete <strong>&quot;{selectedCv?.title}&quot;</strong> by{' '}
            <strong>{selectedCv?.user.name}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
            This action cannot be undone. The CV and all associated data will be permanently removed.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Delete CV
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════ BULK DELETE DIALOG ═══════════ */}
      <Dialog open={bulkDeleteDialogOpen} onClose={() => setBulkDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon />
            Delete {selectedCvs.length} CVs
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Are you sure you want to delete <strong>{selectedCvs.length} CVs</strong>? This action cannot be undone.
          </Typography>
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
            All selected CVs and their associated data will be permanently removed.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setBulkDeleteDialogOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleBulkDelete} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
            Delete All Selected
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}