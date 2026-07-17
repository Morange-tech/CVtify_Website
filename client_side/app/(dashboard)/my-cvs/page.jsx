// app/(dashboard)/my-cvs/page.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  Skeleton,
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
  Tooltip,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Plus,
  MoreVertical,
  Search,
  Pencil,
  Trash2,
  Copy,
  Eye,
  Share2,
  Download,
  PenLine,
  FileText,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  History,
  FolderPlus,
  AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import useMyCvs from '../../hooks/useMyCvs';
import { templateComponents } from '../../lib/templateComponents';
import { exportElementToPdf } from '../../lib/exportCvPdf';
import useDownloads from '../../hooks/useDownloads';

export default function MyCvsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isPremium = user?.plan === 'premium' || user?.subscription_plan === 'premium' || user?.is_premium;

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCv, setSelectedCv] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [sortBy, setSortBy] = useState('lastEdited');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewCv, setPreviewCv] = useState(null);
  const [downloadingCv, setDownloadingCv] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const downloadRef = useRef(null);

  const {
    cvs,
    meta,
    loading,
    actionLoading,
    error,
    renameCv,
    deleteCv,
    duplicateCv,
    shareCv,
    downloadCv,
  } = useMyCvs({
    search: searchQuery,
    sort: sortBy,
  });
  const { createDownloadHistory } = useDownloads({ autoFetch: false });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDownloadPdf = async (cv) => {
    if (!cv) return;
    setDownloadingId(cv.id);
    try {
      await downloadCv(cv.id); // keep the server-side download counter in sync
    } catch {
      // non-fatal: still generate the file client-side below
    }
    setDownloadingCv(cv);
  };

  // Renders the CV off-screen (see hidden Box near the bottom of this page)
  // then captures it to a PDF once it has had a moment to paint.
  useEffect(() => {
    if (!downloadingCv) return;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        await exportElementToPdf(downloadRef.current, `${downloadingCv.title || 'CV'}.pdf`);
        createDownloadHistory({
          type: 'cv',
          downloadableId: Number(downloadingCv.id),
          format: 'PDF',
        }).catch(() => {});
      } catch (err) {
        if (!cancelled) showSnackbar(err.message || 'Failed to generate PDF', 'error');
      } finally {
        if (!cancelled) {
          setDownloadingCv(null);
          setDownloadingId(null);
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [downloadingCv]);

  const filteredCvs = useMemo(() => cvs, [cvs]);

  const handleMenuOpen = (event, cv) => {
    setAnchorEl(event.currentTarget);
    setSelectedCv(cv);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    if (!selectedCv) return;
    setPreviewCv(selectedCv);
    handleMenuClose();
  };

  const handleEdit = () => {
    handleMenuClose();
    if (!selectedCv) return;
    router.push(`/CV_Builder?id=${selectedCv.id}`);
  };

  const handleDuplicate = async () => {
    if (!selectedCv) return;
    try {
      const res = await duplicateCv(selectedCv.id);
      showSnackbar(res.message || 'CV duplicated successfully');
    } catch (err) {
      showSnackbar(err.message || 'Failed to duplicate CV', 'error');
    } finally {
      handleMenuClose();
    }
  };

  const handleRenameOpen = () => {
    setNewName(selectedCv?.title || '');
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleRenameConfirm = async () => {
    if (!selectedCv) return;
    try {
      const res = await renameCv(selectedCv.id, newName);
      showSnackbar(res.message || 'CV renamed successfully');
      setRenameDialogOpen(false);
    } catch (err) {
      showSnackbar(err.message || 'Failed to rename CV', 'error');
    }
  };

  const handleShareOpen = async () => {
    if (!selectedCv) return;

    try {
      const res = await shareCv(selectedCv.id);
      if (res.cv) setSelectedCv(res.cv);
      showSnackbar(res.message || 'Share link generated');
      setShareDialogOpen(true);
    } catch (err) {
      showSnackbar(err.message || 'Failed to generate share link', 'error');
    } finally {
      handleMenuClose();
    }
  };

  const handleDownload = async () => {
    if (!selectedCv) return;
    handleMenuClose();
    await handleDownloadPdf(selectedCv);
  };

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCv) return;
    try {
      const res = await deleteCv(selectedCv.id);
      showSnackbar(res.message || 'CV deleted successfully', 'warning');
      setDeleteDialogOpen(false);
      setSelectedCv(null);
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete CV', 'error');
    }
  };

  const handleCreateCv = () => {
    router.push('/templates');
  };

  const handleCopyLink = async () => {
    const link = selectedCv?.shareUrl || `${window.location.origin}/shared/cv/${selectedCv?.id}`;
    await navigator.clipboard.writeText(link);
    showSnackbar('Link copied to clipboard');
    setShareDialogOpen(false);
  };

  const handleVersionHistory = () => {
    handleMenuClose();
    setVersionHistoryOpen(true);
  };

  const CV_LIMIT = isPremium ? Infinity : 3;
  const isLimitReached = !isPremium && filteredCvs.length >= CV_LIMIT;

  const menuItems = [
    { label: 'View', icon: <Eye size={16} />, action: handleView, color: '#000000' },
    { label: 'Edit', icon: <Pencil size={16} />, action: handleEdit, color: '#000000' },
    { label: 'Rename', icon: <PenLine size={16} />, action: handleRenameOpen, color: '#64748b' },
    { label: 'Duplicate', icon: <Copy size={16} />, action: handleDuplicate, color: '#64748b' },
    { label: 'Share', icon: <Share2 size={16} />, action: handleShareOpen, color: '#64748b' },
    { label: 'Download', icon: <Download size={16} />, action: handleDownload, color: '#10b981' },
    ...(isPremium
      ? [
          { divider: true },
          {
            label: 'Version History',
            icon: <History size={16} />,
            action: handleVersionHistory,
            color: '#000000',
          },
        ]
      : []),
    { divider: true },
    { label: 'Delete', icon: <Trash2 size={16} />, action: handleDeleteOpen, color: '#ef4444' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          severity={snackbar.severity}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
              {meta.total} {meta.total === 1 ? 'CV' : 'CVs'} created
            </Typography>
            {!isPremium ? (
              <Chip
                label={`${meta.total}/3 used`}
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: meta.total >= 3 ? '#ef444420' : '#00000015',
                  color: meta.total >= 3 ? '#ef4444' : '#000000',
                  border: `1px solid ${meta.total >= 3 ? '#ef444440' : '#00000030'}`,
                }}
              />
            ) : (
              <Chip
                label="Unlimited"
                size="small"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: '#00000015',
                  color: '#000000',
                  border: '1px solid #00000030',
                }}
              />
            )}
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleCreateCv}
          disabled={isLimitReached}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1.2,
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
          }}
        >
          {isLimitReached ? 'Limit Reached' : 'Create New CV'}
        </Button>
      </Box>

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
          placeholder="Search CVs..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#ffffff',
              '&.Mui-focused fieldset': { borderColor: '#000000' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#94a3b8" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          size="small"
          startIcon={<ArrowUpDown size={16} />}
          onClick={(e) => setSortAnchorEl(e.currentTarget)}
          sx={{
            textTransform: 'none',
            color: '#64748b',
            bgcolor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            px: 2,
          }}
        >
          Sort
        </Button>

        <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)}>
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

        <Box sx={{ display: 'flex', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <IconButton
            size="small"
            onClick={() => setViewMode('grid')}
            sx={{
              borderRadius: '8px 0 0 8px',
              bgcolor: viewMode === 'grid' ? '#00000015' : 'transparent',
              color: viewMode === 'grid' ? '#000000' : '#94a3b8',
            }}
          >
            <LayoutGrid size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setViewMode('list')}
            sx={{
              borderRadius: '0 8px 8px 0',
              bgcolor: viewMode === 'list' ? '#00000015' : 'transparent',
              color: viewMode === 'list' ? '#000000' : '#94a3b8',
            }}
          >
            <ListIcon size={18} />
          </IconButton>
        </Box>
      </Box>

      {isPremium && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="700" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FolderPlus size={18} /> Folders
            </Typography>
            <Button
              size="small"
              startIcon={<FolderPlus size={16} />}
              sx={{
                textTransform: 'none',
                color: '#000000',
                fontWeight: 600,
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
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2.5,
                py: 1.5,
                borderRadius: 2,
                bgcolor: '#00000010',
                border: '1px solid #00000040',
                whiteSpace: 'nowrap',
              }}
            >
              <FileText size={18} color="#000000" />
              <Box>
                <Typography variant="body2" fontWeight="600" color="#000000">
                  All CVs
                </Typography>
                <Typography variant="caption" color="#94a3b8">
                  {meta.total} {meta.total === 1 ? 'CV' : 'CVs'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

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
          <Typography variant="body2" color="#92400e" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle size={16} /> You&apos;ve reached the free plan limit of 3 CVs. Upgrade to create unlimited CVs.
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
            }}
          >
            Upgrade
          </Button>
        </Box>
      )}

      {loading ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                animation: `fadeIn 0.4s ease ${i * 0.07}s both`,
                '@keyframes fadeIn': {
                  from: { opacity: 0, transform: 'translateY(12px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Skeleton variant="rectangular" height={200} />
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" width="70%" height={24} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="50%" height={18} sx={{ mb: 1.5 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="rounded" width={60} height={24} />
                  <Skeleton variant="rounded" width={80} height={24} />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ) : filteredCvs.length === 0 ? (
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
              bgcolor: '#00000015',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <FileText size={40} color="#000000" />
          </Box>
          <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>
            {searchQuery ? 'No CVs found' : 'No CVs yet'}
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
            {searchQuery ? 'Try a different search term' : 'Create your first CV and start building your career'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={handleCreateCv}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
              }}
            >
              Create Your First CV
            </Button>
          )}
        </Box>
      ) : viewMode === 'grid' ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {filteredCvs.map((cv, idx) => (
            <Box
              key={cv.id}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                animation: `fadeInUp 0.4s ease ${idx * 0.06}s both`,
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(16px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  '& .cv-actions': { opacity: 1 },
                },
              }}
            >
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
                  setPreviewCv(cv);
                }}
              >
                {templateComponents[cv.template_id] ? (
                  <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    <Box sx={{ width: '900px', transform: 'scale(0.28)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                      {(() => {
                        const ThumbTemplate = templateComponents[cv.template_id];
                        return <ThumbTemplate cvData={cv} />;
                      })()}
                    </Box>
                  </Box>
                ) : (
                  <FileText size={60} color="#cbd5e1" />
                )}

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
                      sx={{ bgcolor: '#ffffff' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCv(cv);
                        setPreviewCv(cv);
                      }}
                    >
                      <Eye size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      sx={{ bgcolor: '#ffffff' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/CV_Builder?id=${cv.id}`);
                      }}
                    >
                      <Pencil size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      sx={{ bgcolor: '#ffffff' }}
                      disabled={downloadingId === cv.id}
                      onClick={async (e) => {
                        e.stopPropagation();
                        setSelectedCv(cv);
                        await handleDownloadPdf(cv);
                      }}
                    >
                      {downloadingId === cv.id ? <CircularProgress size={16} /> : <Download size={16} />}
                    </IconButton>
                  </Tooltip>
                </Box>

                {!isPremium ? (
                  <Chip
                    label={`${meta.total}/${CV_LIMIT} used`}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      bgcolor: isLimitReached ? '#ef444420' : '#00000015',
                      color: isLimitReached ? '#ef4444' : '#000000',
                      border: `1px solid ${isLimitReached ? '#ef444440' : '#00000030'}`,
                    }}
                  />
                ) : (
                  <Chip
                    label="Unlimited"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      bgcolor: '#00000015',
                      color: '#000000',
                      border: '1px solid #00000030',
                    }}
                  />
                )}
              </Box>

              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight="600" color="#1e293b" noWrap>
                      {cv.title}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      {cv.template} template
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, cv)}
                    disabled={actionLoading}
                  >
                    <MoreVertical size={16} />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="#94a3b8">
                    Edited {cv.lastEdited}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Download size={14} color="#94a3b8" />
                    <Typography variant="caption" color="#94a3b8">
                      {cv.downloads}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}

          <Box
            onClick={isLimitReached ? undefined : handleCreateCv}
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              border: '2px dashed #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
              cursor: isLimitReached ? 'not-allowed' : 'pointer',
              opacity: isLimitReached ? 0.5 : 1,
              transition: 'all 0.3s ease',
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#00000015',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Plus size={30} color="#000000" />
            </Box>
            <Typography variant="body1" fontWeight="600" color="#000000">
              Create New CV
            </Typography>
            <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5 }}>
              Choose a template to get started
            </Typography>
          </Box>
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
            <Typography variant="caption" fontWeight="700" color="#64748b">NAME</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">TEMPLATE</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">STATUS</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">LAST EDITED</Typography>
            <Typography variant="caption" fontWeight="700" color="#64748b">ACTIONS</Typography>
          </Box>

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
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 44,
                    borderRadius: 1,
                    bgcolor: '#00000015',
                    border: '1px solid #00000030',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={18} color="#000000" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
                    {cv.title}
                  </Typography>
                  <Typography variant="caption" color="#94a3b8" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Download size={12} /> {cv.downloads} downloads
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="#64748b">
                {cv.template}
              </Typography>

              {!isPremium ? (
                <Chip
                  label={`${meta.total}/${CV_LIMIT} used`}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    bgcolor: isLimitReached ? '#ef444420' : '#00000015',
                    color: isLimitReached ? '#ef4444' : '#000000',
                    border: `1px solid ${isLimitReached ? '#ef444440' : '#00000030'}`,
                  }}
                />
              ) : (
                <Chip
                  label="Unlimited"
                  size="small"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    bgcolor: '#00000015',
                    color: '#000000',
                    border: '1px solid #00000030',
                  }}
                />
              )}

              <Typography variant="body2" color="#94a3b8">
                {cv.lastEdited}
              </Typography>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="View">
                  <IconButton
                    size="small"
                    onClick={() => setPreviewCv(cv)}
                  >
                    <Eye size={16} color="#94a3b8" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/CV_Builder?id=${cv.id}`)}
                  >
                    <Pencil size={16} color="#94a3b8" />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, cv)}>
                  <MoreVertical size={16} color="#94a3b8" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

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
          disabled={isLimitReached}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            minWidth: 0,
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          }}
        >
          <Plus size={24} />
        </Button>
      </Box>

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

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete CV</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Are you sure you want to delete <strong>{selectedCv?.title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ textTransform: 'none', borderRadius: 2 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
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
                '&.Mui-focused fieldset': { borderColor: '#000000' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#000000' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRenameDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}>
            Cancel
          </Button>
          <Button
            onClick={handleRenameConfirm}
            variant="contained"
            disabled={!newName.trim()}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: '#000000',
              '&:hover': { bgcolor: '#5a6fd6' },
            }}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Share CV</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            Share <strong>{selectedCv?.title}</strong> with others
          </Typography>
          <TextField
            fullWidth
            value={selectedCv?.shareUrl || ''}
            InputProps={{
              readOnly: true,
              sx: { borderRadius: 2, bgcolor: '#f8fafc' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShareDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}>
            Close
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="contained"
            startIcon={<Copy size={16} />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: '#000000',
              '&:hover': { bgcolor: '#5a6fd6' },
            }}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>

      {isPremium && (
        <Dialog
          open={versionHistoryOpen}
          onClose={() => setVersionHistoryOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><History size={18} /> Version History</Box>
            <Typography variant="body2" color="#64748b">
              {selectedCv?.title}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="#94a3b8">
              Version history backend is not added yet.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setVersionHistoryOpen(false)} sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={Boolean(previewCv)}
        onClose={() => setPreviewCv(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>{previewCv?.title}</DialogTitle>
        <DialogContent sx={{ bgcolor: '#f1f5f9', display: 'flex', justifyContent: 'center', py: 4 }}>
          {previewCv && templateComponents[previewCv.template_id] ? (
            (() => {
              const PreviewTemplate = templateComponents[previewCv.template_id];
              return <PreviewTemplate cvData={previewCv} />;
            })()
          ) : (
            <Typography variant="body2" color="#94a3b8">
              No preview available for this template.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPreviewCv(null)} sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {downloadingCv && templateComponents[downloadingCv.template_id] && (
        <Box sx={{ position: 'fixed', top: 0, left: -99999, zIndex: -1 }}>
          <Box ref={downloadRef} sx={{ width: '900px', bgcolor: '#ffffff' }}>
            {(() => {
              const DownloadTemplate = templateComponents[downloadingCv.template_id];
              return <DownloadTemplate cvData={downloadingCv} />;
            })()}
          </Box>
        </Box>
      )}
    </Box>
  );
}