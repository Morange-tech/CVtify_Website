// app/(dashboard)/my-cvs/page.jsx
'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import SortIcon from '@mui/icons-material/Sort';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth'; // adjust path as needed
import HistoryIcon from '@mui/icons-material/History';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';


export default function MyCvsPage() {
  const router = useRouter();

  const { user } = useAuth();
  const isPremium = user?.plan === 'premium';

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCv, setSelectedCv] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [sortBy, setSortBy] = useState('lastEdited'); // 'lastEdited', 'name', 'created'
  const [sortAnchorEl, setSortAnchorEl] = useState(null);

  // Mock CV data — replace with API data later
  const [cvs, setCvs] = useState([
    {
      id: 1,
      title: 'Software Developer CV',
      template: 'Professional',
      lastEdited: '2 hours ago',
      createdAt: '2 weeks ago',
      status: 'complete',
      downloads: 5,
      thumbnail: null,
    },
    {
      id: 2,
      title: 'UX Designer Resume',
      template: 'Modern',
      lastEdited: '3 days ago',
      createdAt: '1 month ago',
      status: 'complete',
      downloads: 4,
      thumbnail: null,
    },
    {
      id: 3,
      title: 'Project Manager CV',
      template: 'Classic',
      lastEdited: '1 week ago',
      createdAt: '3 weeks ago',
      status: 'draft',
      downloads: 0,
      thumbnail: null,
    },
    {
      id: 4,
      title: 'Data Analyst Resume',
      template: 'Minimal',
      lastEdited: '5 days ago',
      createdAt: '2 months ago',
      status: 'complete',
      downloads: 2,
      thumbnail: null,
    },
  ]);

  // Filter CVs based on search
  const filteredCvs = cvs.filter((cv) =>
    cv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Menu handlers
  const handleMenuOpen = (event, cv) => {
    setAnchorEl(event.currentTarget);
    setSelectedCv(cv);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Actions
  const handleView = () => {
    handleMenuClose();
    // router.push(`/cv/${selectedCv.id}/view`);
  };

  const handleEdit = () => {
    handleMenuClose();
    // router.push(`/cv/${selectedCv.id}/edit`);
  };

  const handleDuplicate = () => {
    const duplicate = {
      ...selectedCv,
      id: Date.now(),
      title: `${selectedCv.title} (Copy)`,
      lastEdited: 'Just now',
      createdAt: 'Just now',
      downloads: 0,
    };
    setCvs((prev) => [duplicate, ...prev]);
    handleMenuClose();
  };

  const handleRenameOpen = () => {
    setNewName(selectedCv.title);
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleRenameConfirm = () => {
    setCvs((prev) =>
      prev.map((cv) =>
        cv.id === selectedCv.id ? { ...cv, title: newName, lastEdited: 'Just now' } : cv
      )
    );
    setRenameDialogOpen(false);
  };

  const handleShareOpen = () => {
    setShareDialogOpen(true);
    handleMenuClose();
  };

  const handleDownload = () => {
    handleMenuClose();
    // API call to download PDF
  };

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    setCvs((prev) => prev.filter((cv) => cv.id !== selectedCv.id));
    setDeleteDialogOpen(false);
    setSelectedCv(null);
  };

  const handleCreateCv = () => {
    router.push('/templates');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://cvtify.com/cv/${selectedCv?.id}/view`);
    setShareDialogOpen(false);
  };

  // Add this handler with your other handlers
  const handleVersionHistory = () => {
    handleMenuClose();
    setVersionHistoryOpen(true);
    // TODO: Open version history modal/page
    console.log('Version history for:', selectedCv?.title);
  };

  // Change the CV limit based on plan
  const CV_LIMIT = isPremium ? Infinity : 3;
  const isLimitReached = !isPremium && cvs.length >= CV_LIMIT;

  // Menu items for context menu
  const menuItems = [
    { label: 'View', icon: <VisibilityIcon fontSize="small" />, action: handleView, color: '#667eea' },
    { label: 'Edit', icon: <EditIcon fontSize="small" />, action: handleEdit, color: '#667eea' },
    { label: 'Rename', icon: <DriveFileRenameOutlineIcon fontSize="small" />, action: handleRenameOpen, color: '#64748b' },
    { label: 'Duplicate', icon: <ContentCopyIcon fontSize="small" />, action: handleDuplicate, color: '#64748b' },
    { label: 'Share', icon: <ShareIcon fontSize="small" />, action: handleShareOpen, color: '#64748b' },
    { label: 'Download', icon: <DownloadIcon fontSize="small" />, action: handleDownload, color: '#10b981' },
    { divider: true },

    // ✅ Premium-only: Version History
    ...(isPremium
      ? [
        { divider: true },
        {
          label: 'Version History',
          icon: <HistoryIcon fontSize="small" />,
          action: handleVersionHistory,
          color: '#667eea',
        },
      ]
      : []),

    { divider: true },
    { label: 'Delete', icon: <DeleteIcon fontSize="small" />, action: handleDeleteOpen, color: '#ef4444' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
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
            My CVs
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
            <Typography variant="body2" color="#64748b">
              {cvs.length} {cvs.length === 1 ? 'CV' : 'CVs'} created
            </Typography>
            <Chip
              label={`${cvs.length}/3 used`}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.75rem',
                bgcolor: cvs.length >= 3 ? '#ef444420' : '#667eea15',
                color: cvs.length >= 3 ? '#ef4444' : '#667eea',
                border: `1px solid ${cvs.length >= 3 ? '#ef444440' : '#667eea30'}`,
              }}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCv}
          disabled={isLimitReached}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1.2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          {isLimitReached ? 'Limit Reached' : 'Create New CV'}
        </Button>
      </Box>

      {/* Search & Filters Bar */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        {/* Search */}
        <TextField
          placeholder="Search CVs..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#ffffff',
              '&.Mui-focused fieldset': {
                borderColor: '#667eea',
              },
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
            '&:hover': { bgcolor: '#f8fafc' },
          }}
        >
          Sort
        </Button>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
        >
          {[
            { label: 'Last Edited', value: 'lastEdited' },
            { label: 'Name (A-Z)', value: 'name' },
            { label: 'Date Created', value: 'created' },
          ].map((option) => (
            <MenuItem
              key={option.value}
              selected={sortBy === option.value}
              onClick={() => {
                setSortBy(option.value);
                setSortAnchorEl(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        {/* View Toggle */}
        <Box sx={{ display: 'flex', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <IconButton
            size="small"
            onClick={() => setViewMode('grid')}
            sx={{
              borderRadius: '8px 0 0 8px',
              bgcolor: viewMode === 'grid' ? '#667eea15' : 'transparent',
              color: viewMode === 'grid' ? '#667eea' : '#94a3b8',
            }}
          >
            <GridViewIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setViewMode('list')}
            sx={{
              borderRadius: '0 8px 8px 0',
              bgcolor: viewMode === 'list' ? '#667eea15' : 'transparent',
              color: viewMode === 'list' ? '#667eea' : '#94a3b8',
            }}
          >
            <ViewListIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* ✅ Premium: Folders */}
      {isPremium && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="700" color="#1e293b">
              📁 Folders
            </Typography>
            <Button
              size="small"
              startIcon={<CreateNewFolderIcon />}
              sx={{
                textTransform: 'none',
                color: '#667eea',
                fontWeight: 600,
                '&:hover': { bgcolor: '#667eea10' },
              }}
            >
              New Folder
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              pb: 1,
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 2 },
            }}
          >
            {[
              { name: 'All CVs', count: cvs.length, icon: '📄', active: true },
              { name: 'Tech Roles', count: 2, icon: '💻', active: false },
              { name: 'Management', count: 1, icon: '📊', active: false },
              { name: 'Design', count: 1, icon: '🎨', active: false },
            ].map((folder, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: folder.active ? '#667eea10' : '#ffffff',
                  border: `1px solid ${folder.active ? '#667eea40' : '#e2e8f0'}`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#667eea',
                    bgcolor: '#667eea08',
                  },
                }}
              >
                <Typography fontSize="1.1rem">{folder.icon}</Typography>
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color={folder.active ? '#667eea' : '#1e293b'}
                  >
                    {folder.name}
                  </Typography>
                  <Typography variant="caption" color="#94a3b8">
                    {folder.count} {folder.count === 1 ? 'CV' : 'CVs'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* In my-cvs: */}
      {isLimitReached && !isPremium && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: '#fef3c7',
            border: '1px solid #fcd34d',
          }}
        >
          <Typography variant="body2" color="#92400e">
            ⚠️ You&apos;ve reached the free plan limit of 3 CVs. Upgrade to create unlimited CVs.
          </Typography>
          <Button
            size="small"
            onClick={() => router.push('/upgrade')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: '#92400e',
              bgcolor: '#fcd34d',
              borderRadius: 2,
              '&:hover': { bgcolor: '#fbbf24' },
            }}
          >
            Upgrade
          </Button>
        </Box>
      )}

      {/* CV Grid/List */}
      {filteredCvs.length === 0 ? (
        /* Empty State */
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#667eea15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <DescriptionIcon sx={{ fontSize: 40, color: '#667eea' }} />
          </Box>
          <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>
            {searchQuery ? 'No CVs found' : 'No CVs yet'}
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
            {searchQuery
              ? 'Try a different search term'
              : "Create your first CV and start building your career"}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCv}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Create Your First CV
            </Button>
          )}
        </Box>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr',
            },
            gap: 3,
          }}
        >
          {filteredCvs.map((cv) => (
            <Box
              key={cv.id}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  '& .cv-actions': { opacity: 1 },
                },
              }}
            >
              {/* CV Thumbnail */}
              <Box
                sx={{
                  height: 200,
                  bgcolor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  borderBottom: '1px solid #e2e8f0',
                }}
                onClick={() => {
                  setSelectedCv(cv);
                  handleView();
                }}
              >
                <DescriptionIcon sx={{ fontSize: 60, color: '#cbd5e1' }} />

                {/* Hover Actions Overlay */}
                <Box
                  className="cv-actions"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f1f5f9' } }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCv(cv);
                        handleView();
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f1f5f9' } }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCv(cv);
                        handleEdit();
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f1f5f9' } }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCv(cv);
                        handleDownload();
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Status Badge */}
                {!isPremium ? (
                  <Chip
                    label={`${cvs.length}/${CV_LIMIT} used`}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      bgcolor: isLimitReached ? '#ef444420' : '#667eea15',
                      color: isLimitReached ? '#ef4444' : '#667eea',
                      border: `1px solid ${isLimitReached ? '#ef444440' : '#667eea30'}`,
                    }}
                  />
                ) : (
                  <Chip
                    label="Unlimited"
                    size="small"
                    icon={<span style={{ fontSize: '0.7rem' }}>⭐</span>}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      bgcolor: '#667eea15',
                      color: '#667eea',
                      border: '1px solid #667eea30',
                    }}
                  />
                )}
              </Box>

              {/* CV Info */}
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      color="#1e293b"
                      noWrap
                    >
                      {cv.title}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      {cv.template} template
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, cv)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="#94a3b8">
                    Edited {cv.lastEdited}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DownloadIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                    <Typography variant="caption" color="#94a3b8">
                      {cv.downloads}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}

          {/* Create New CV Card */}
          <Box
            onClick={cvs.length >= 3 ? null : handleCreateCv}
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              border: '2px dashed #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
              cursor: isLimitReached >= 3 ? 'not-allowed' : 'pointer',
              opacity: isLimitReached >= 3 ? 0.5 : 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#667eea',
                bgcolor: '#667eea08',
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#667eea15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <AddIcon sx={{ fontSize: 30, color: '#667eea' }} />
            </Box>
            <Typography variant="body1" fontWeight="600" color="#667eea">
              Create New CV
            </Typography>
            <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5 }}>
              Choose a template to get started
            </Typography>
          </Box>
        </Box>
      ) : (
        /* List View */
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* List Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: 2,
              p: 2,
              bgcolor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <Typography variant="caption" fontWeight="700" color="#64748b">
              NAME
            </Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">
              TEMPLATE
            </Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">
              STATUS
            </Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">
              LAST EDITED
            </Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">
              ACTIONS
            </Typography>
          </Box>

          {/* List Items */}
          {filteredCvs.map((cv, index) => (
            <Box
              key={cv.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: 2,
                p: 2,
                alignItems: 'center',
                borderBottom: index < filteredCvs.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#f8fafc',
                },
              }}
            >
              {/* Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 44,
                    borderRadius: 1,
                    bgcolor: '#667eea15',
                    border: '1px solid #667eea30',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 18, color: '#667eea' }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
                    {cv.title}
                  </Typography>
                  <Typography variant="caption" color="#94a3b8">
                    ⬇️ {cv.downloads} downloads
                  </Typography>
                </Box>
              </Box>

              {/* Template */}
              <Typography variant="body2" color="#64748b">
                {cv.template}
              </Typography>

              {/* Status */}
              {!isPremium ? (
                <Chip
                  label={`${cvs.length}/${CV_LIMIT} used`}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    bgcolor: isLimitReached ? '#ef444420' : '#667eea15',
                    color: isLimitReached ? '#ef4444' : '#667eea',
                    border: `1px solid ${isLimitReached ? '#ef444440' : '#667eea30'}`,
                  }}
                />
              ) : (
                <Chip
                  label="Unlimited"
                  size="small"
                  icon={<span style={{ fontSize: '0.7rem' }}>⭐</span>}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    bgcolor: '#667eea15',
                    color: '#667eea',
                    border: '1px solid #667eea30',
                  }}
                />
              )}

              {/* Last Edited */}
              <Typography variant="body2" color="#94a3b8">
                {cv.lastEdited}
              </Typography>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="View">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedCv(cv);
                      handleView();
                    }}
                  >
                    <VisibilityIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedCv(cv);
                      handleEdit();
                    }}
                  >
                    <EditIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, cv)}>
                  <MoreVertIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Bottom Create Button (Mobile) */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'block', md: 'none' },
        }}
      >
        <Button
          variant="contained"
          onClick={handleCreateCv}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            minWidth: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          }}
        >
          <AddIcon />
        </Button>
      </Box>

      {/* ===== CONTEXT MENU ===== */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            minWidth: 180,
          },
        }}
      >
        {menuItems.map((item, index) =>
          item.divider ? (
            <Divider key={index} sx={{ my: 0.5 }} />
          ) : (
            <MenuItem
              key={index}
              onClick={item.action}
              sx={{
                py: 1,
                '&:hover': {
                  bgcolor: `${item.color}10`,
                },
              }}
            >
              <ListItemIcon sx={{ color: item.color }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  color: item.color,
                }}
              />
            </MenuItem>
          )
        )}
      </Menu>

      {/* ===== DELETE DIALOG ===== */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete CV</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Are you sure you want to delete{' '}
            <strong>{selectedCv?.title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== RENAME DIALOG ===== */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Rename CV</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            label="CV Name"
            autoFocus
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': { borderColor: '#667eea' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRenameDialogOpen(false)}
            sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRenameConfirm}
            variant="contained"
            disabled={!newName.trim()}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: '#667eea',
              '&:hover': { bgcolor: '#5a6fd6' },
            }}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== SHARE DIALOG ===== */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Share CV</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            Share <strong>{selectedCv?.title}</strong> with others
          </Typography>
          <TextField
            fullWidth
            value={`https://cvtify.com/cv/${selectedCv?.id}/view`}
            InputProps={{
              readOnly: true,
              sx: { borderRadius: 2, bgcolor: '#f8fafc' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setShareDialogOpen(false)}
            sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}
          >
            Close
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="contained"
            startIcon={<ContentCopyIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: '#667eea',
              '&:hover': { bgcolor: '#5a6fd6' },
            }}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>
      {/* ===== VERSION HISTORY DIALOG (Premium) ===== */}
      {isPremium && (
        <Dialog
          open={versionHistoryOpen}
          onClose={() => setVersionHistoryOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            📋 Version History
            <Typography variant="body2" color="#64748b">
              {selectedCv?.title}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {[
              { version: 'v3 (Current)', date: '2 hours ago', change: 'Updated skills section' },
              { version: 'v2', date: '3 days ago', change: 'Added work experience' },
              { version: 'v1', date: '2 weeks ago', change: 'Initial creation' },
            ].map((v, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                  borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none',
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1e293b">
                    {v.version}
                  </Typography>
                  <Typography variant="caption" color="#94a3b8">
                    {v.change}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="#94a3b8" display="block">
                    {v.date}
                  </Typography>
                  {index > 0 && (
                    <Button
                      size="small"
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        color: '#667eea',
                        fontWeight: 600,
                        p: 0,
                        minWidth: 0,
                      }}
                    >
                      Restore
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setVersionHistoryOpen(false)}
              sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}