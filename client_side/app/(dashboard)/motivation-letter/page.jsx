// app/(dashboard)/motivation-letter/page.jsx
'use client';

import { useState, useEffect } from 'react';
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
  Tooltip,
  Divider,
  Tabs,
  Tab,
  Skeleton,
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
  Mail,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  Building2,
  Briefcase,
  Link2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth'; // adjust path


export default function MotivationLettersPage() {
  const router = useRouter();
  const [letters, setLetters] = useState([]);
  const { user, token } = useAuth();
  const isPremium = user?.plan === 'premium';

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [sortBy, setSortBy] = useState('lastEdited');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(false);

  // New letter form
  const [newLetter, setNewLetter] = useState({
    title: '',
    company: '',
    position: '',
    linkedCv: '',
  });


  const LETTER_LIMIT = isPremium ? Infinity : 3;
  const isLimitReached = !isPremium && letters.length >= LETTER_LIMIT;

  // Filter letters
  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.position.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'complete') return matchesSearch && letter.status === 'complete';
    if (activeTab === 'draft') return matchesSearch && letter.status === 'draft';
    return matchesSearch;
  });

  // Menu handlers
  const handleMenuOpen = (event, letter) => {
    setAnchorEl(event.currentTarget);
    setSelectedLetter(letter);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Actions
  const handleView = () => {
    handleMenuClose();
  };

  const handleEdit = () => {
    handleMenuClose();
  };

  const handleDuplicate = async () => {
    try {
      const res = await fetch(`${API_URL}/motivation-letters/${selectedLetter.id}/duplicate`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to duplicate');
        return;
      }

      setLetters((prev) => [data.data, ...prev]);
      handleMenuClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRenameOpen = () => {
    setNewName(selectedLetter.title);
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleRenameConfirm = async () => {
    try {
      const res = await fetch(`${API_URL}/motivation-letters/${selectedLetter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newName }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to rename');
        return;
      }

      setLetters((prev) =>
        prev.map((letter) =>
          letter.id === selectedLetter.id ? data.data : letter
        )
      );

      setRenameDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, [searchQuery, activeTab, sortBy]);

  const fetchLetters = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (searchQuery) params.append('search', searchQuery);
      if (activeTab !== 'all') params.append('status', activeTab);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await fetch(`${API_URL}/motivation-letters?${params.toString()}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setLetters(data.data || []);
    } catch (error) {
      console.error('Failed to fetch letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareOpen = async () => {
    try {
      const res = await fetch(`${API_URL}/motivation-letters/${selectedLetter.id}/share`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to generate share link');
        return;
      }

      await navigator.clipboard.writeText(data.data.url);
      setShareDialogOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    handleMenuClose();
  };

  const handleDeleteOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${API_URL}/motivation-letters/${selectedLetter.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Failed to delete');
        return;
      }

      setLetters((prev) => prev.filter((letter) => letter.id !== selectedLetter.id));
      setDeleteDialogOpen(false);
      setSelectedLetter(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateOpen = () => {
    setNewLetter({ title: '', company: '', position: '', linkedCv: '' });
    setCreateDialogOpen(true);
  };

  const handleCreateConfirm = async () => {
    try {
      const res = await fetch(`${API_URL}/motivation-letters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLetter),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to create letter');
        return;
      }

      setLetters((prev) => [data.data, ...prev]);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://cvtify.com/letter/${selectedLetter?.id}/view`
    );
    setShareDialogOpen(false);
  };

  // Company color generator
  const getCompanyColor = (company) => {
    const colors = ['#000000', '#10b981', '#f59e0b', '#ef4444', '#eab308', '#ec4899', '#06b6d4'];
    let hash = 0;
    for (let i = 0; i < company.length; i++) {
      hash = company.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Menu items
  const menuItems = [
    { label: 'View', icon: <Eye size={16} />, action: handleView, color: '#000000' },
    { label: 'Edit', icon: <Pencil size={16} />, action: handleEdit, color: '#000000' },
    { label: 'Rename', icon: <PenLine size={16} />, action: handleRenameOpen, color: '#64748b' },
    { label: 'Duplicate', icon: <Copy size={16} />, action: handleDuplicate, color: '#64748b' },
    { label: 'Share', icon: <Share2 size={16} />, action: handleShareOpen, color: '#64748b' },
    { label: 'Download', icon: <Download size={16} />, action: handleDownload, color: '#10b981' },
    { divider: true },
    { label: 'Delete', icon: <Trash2 size={16} />, action: handleDeleteOpen, color: '#ef4444' },
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
            My Motivation Letters
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
            <Typography variant="body2" color="#64748b">
              {letters.length} {letters.length === 1 ? 'letter' : 'letters'} created
            </Typography>
            {!isPremium ? (
              <Chip
                label={`${letters.length}/${LETTER_LIMIT} used`}
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
                icon={<Sparkles size={12} />}
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
          onClick={handleCreateOpen}
          disabled={isLimitReached}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1.2,
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          New Letter
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            minHeight: 40,
          },
          '& .Mui-selected': { color: '#000000' },
          '& .MuiTabs-indicator': { backgroundColor: '#000000' },
        }}
      >
        <Tab
          label={`All (${letters.length})`}
          value="all"
        />
        <Tab
          label={`Complete (${letters.filter((l) => l.status === 'complete').length})`}
          value="complete"
        />
        <Tab
          label={`Drafts (${letters.filter((l) => l.status === 'draft').length})`}
          value="draft"
        />
      </Tabs>

      {/* Search & Filters */}
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
          placeholder="Search by title, company, or position..."
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
            { label: 'Last Edited', value: 'lastEdited' },
            { label: 'Name (A-Z)', value: 'name' },
            { label: 'Company', value: 'company' },
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

      {/* In motivation-letters: same thing but change "3 CVs" to "3 letters" */}
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
            <AlertTriangle size={16} /> You&apos;ve reached the free plan limit of 3 letters. Upgrade to create unlimited letters.
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


      {/* Content */}
      {loading ? (
        /* Loading Skeleton */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Box key={i} sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <Skeleton variant="rectangular" height={120} />
              <Box sx={{ p: 2.5 }}>
                <Skeleton variant="text" width="70%" height={28} />
                <Skeleton variant="text" width="50%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
          ))}
        </Box>
      ) : filteredLetters.length === 0 ? (
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
              bgcolor: '#00000015',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <Mail size={40} color="#000000" />
          </Box>
          <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>
            {searchQuery ? 'No letters found' : 'No motivation letters yet'}
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
            {searchQuery
              ? 'Try a different search term'
              : 'Create your first motivation letter to stand out from the crowd'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={handleCreateOpen}
              disabled={isLimitReached}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
              }}
            >
              {isLimitReached ? 'Limit Reached' : 'New Letter'}
            </Button>
          )}
        </Box>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {filteredLetters.map((letter) => (
            <Box
              key={letter.id}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  '& .letter-actions': { opacity: 1 },
                },
              }}
            >
              {/* Top Section with Company Color */}
              <Box
                sx={{
                  height: 120,
                  background: `linear-gradient(135deg, ${getCompanyColor(letter.company)}20 0%, ${getCompanyColor(letter.company)}10 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedLetter(letter);
                  handleView();
                }}
              >
                {/* Company Initial */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: getCompanyColor(letter.company),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5" fontWeight="700" color="#ffffff">
                    {letter.company.charAt(0)}
                  </Typography>
                </Box>

                {/* Hover Actions */}
                <Box
                  className="letter-actions"
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
                        setSelectedLetter(letter);
                        handleView();
                      }}
                    >
                      <Eye size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f1f5f9' } }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLetter(letter);
                        handleEdit();
                      }}
                    >
                      <Pencil size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#f1f5f9' } }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLetter(letter);
                        handleDownload();
                      }}
                    >
                      <Download size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Status */}
                {!isPremium ? (
                  <Chip
                    label={letter.status === 'complete' ? 'Complete' : 'Draft'}
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
                    icon={<Sparkles size={12} />}
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

              {/* Info */}
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight="600" color="#1e293b" noWrap>
                      {letter.title}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, letter)}>
                    <MoreVertical size={16} />
                  </IconButton>
                </Box>

                {/* Details */}
                <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Building2 size={14} color="#94a3b8" />
                    <Typography variant="caption" color="#64748b">
                      {letter.company}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Briefcase size={14} color="#94a3b8" />
                    <Typography variant="caption" color="#64748b">
                      {letter.position}
                    </Typography>
                  </Box>
                  {letter.linkedCv && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Link2 size={14} color="#000000" />
                      <Typography variant="caption" color="#000000" fontWeight="500">
                        {letter.linkedCv}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="#94a3b8">
                    Edited {letter.lastEdited}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Download size={14} color="#94a3b8" />
                    <Typography variant="caption" color="#94a3b8">
                      {letter.downloads}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}

          {/* Create New Letter Card */}
          <Box
            onClick={isLimitReached ? null : handleCreateOpen}
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              border: '2px dashed #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 280,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#000000',
                bgcolor: '#00000008',
                transform: 'translateY(-4px)',
              },
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
              {isLimitReached ? 'Limit Reached' : 'New Motivation Letter'}
            </Typography>
            <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5 }}>
              {isLimitReached ? 'Upgrade to create more' : 'Write a compelling cover letter'}
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
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
              gap: 2,
              p: 2,
              bgcolor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            {['TITLE', 'COMPANY', 'POSITION', 'STATUS', 'LAST EDITED', 'ACTIONS'].map(
              (header) => (
                <Typography key={header} variant="caption" fontWeight="700" color="#64748b">
                  {header}
                </Typography>
              )
            )}
          </Box>

          {/* List Items */}
          {filteredLetters.map((letter, index) => (
            <Box
              key={letter.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                gap: 2,
                p: 2,
                alignItems: 'center',
                borderBottom:
                  index < filteredLetters.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              {/* Title */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: getCompanyColor(letter.company),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="body2" fontWeight="700" color="#ffffff">
                    {letter.company.charAt(0)}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
                    {letter.title}
                  </Typography>
                  {letter.linkedCv && (
                    <Typography
                      variant="caption"
                      color="#000000"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Link2 size={12} /> {letter.linkedCv}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Company */}
              <Typography variant="body2" color="#64748b">
                {letter.company}
              </Typography>

              {/* Position */}
              <Typography variant="body2" color="#64748b" noWrap>
                {letter.position}
              </Typography>

              {/* Status */}
              {!isPremium ? (
                <Chip
                  label={letter.status === 'complete' ? 'Complete' : 'Draft'}
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
                  icon={<Sparkles size={12} />}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    bgcolor: '#00000015',
                    color: '#000000',
                    border: '1px solid #00000030',
                  }}
                />
              )}

              {/* Last Edited */}
              <Typography variant="body2" color="#94a3b8">
                {letter.lastEdited}
              </Typography>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="View">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedLetter(letter);
                      handleView();
                    }}
                  >
                    <Eye size={16} color="#94a3b8" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedLetter(letter);
                      handleEdit();
                    }}
                  >
                    <Pencil size={16} color="#94a3b8" />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={(e) => handleMenuOpen(e, letter)}>
                  <MoreVertical size={16} color="#94a3b8" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Mobile FAB */}
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
          onClick={isLimitReached ? null : handleCreateOpen}
          disabled={isLimitReached}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            minWidth: 0,
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Plus size={24} />
        </Button>
      </Box>

      {/* ===== CONTEXT MENU ===== */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 180 },
        }}
      >
        {menuItems.map((item, index) =>
          item.divider ? (
            <Divider key={index} sx={{ my: 0.5 }} />
          ) : (
            <MenuItem
              key={index}
              onClick={item.action}
              sx={{ py: 1, '&:hover': { bgcolor: `${item.color}10` } }}
            >
              <ListItemIcon sx={{ color: item.color }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.9rem', color: item.color }}
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
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Letter</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Are you sure you want to delete{' '}
            <strong>{selectedLetter?.title}</strong>? This action cannot be undone.
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
        <DialogTitle sx={{ fontWeight: 700 }}>Rename Letter</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            label="Letter Name"
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
              bgcolor: '#000000',
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
        <DialogTitle sx={{ fontWeight: 700 }}>Share Letter</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            Share <strong>{selectedLetter?.title}</strong> with others
          </Typography>
          <TextField
            fullWidth
            value={`https://cvtify.com/letter/${selectedLetter?.id}/view`}
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
    </Box>
  );
}