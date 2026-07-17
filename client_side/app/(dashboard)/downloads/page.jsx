// app/(dashboard)/downloads/page.jsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  ListItemIcon,
  Skeleton,
} from '@mui/material';
import {
  Search,
  Download,
  Trash2,
  FileText,
  Mail,
  FileType,
  Image as ImageIcon,
  ArrowUpDown,
  MoreVertical,
  FileX,
  Calendar,
  HardDrive,
  Lock,
  Star,
  Droplet,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth'; // adjust path
import useDownloads from '../../hooks/useDownloads';
import { groupDownloadsByDate } from '../../helpers/downloadHelpers';



export default function DownloadsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedDownload, setSelectedDownload] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);

  const [downloads, setDownloads] = useState([]);
  const [stats, setStats] = useState({
    totalDownloads: 0,
    cvDownloads: 0,
    letterDownloads: 0,
    totalSize: '0 B',
  });
  const cvDownloads = stats.cvDownloads || 0;
  const letterDownloads = stats.letterDownloads || 0;
  const totalSize = stats.totalSize || '0 B';

  const {
    availableFormats: backendFormats,
    loading,
    mutating,
    error,
    removeDownload,
    clearAllDownloads,
    redownload,
  } = useDownloads({
    searchQuery,
    activeTab,
    sortBy,
  });



  // Available formats for free vs premium
  const freeFormats = ['PDF'];
  const premiumFormats = ['PDF', 'DOCX', 'PNG', 'JPG'];
  const { user } = useAuth();
  const isPremium = user?.plan === 'premium';
  const availableFormats =
    backendFormats?.length ? backendFormats : isPremium ? premiumFormats : freeFormats;


  const filteredDownloads = downloads;
  // Filter downloads
  // const filteredDownloads = downloads.filter((dl) => {
  //   const matchesSearch = dl.fileName.toLowerCase().includes(searchQuery.toLowerCase());
  //   if (activeTab === 'all') return matchesSearch;
  //   if (activeTab === 'cvs') return matchesSearch && dl.type === 'cv';
  //   if (activeTab === 'letters') return matchesSearch && dl.type === 'letter';
  //   return matchesSearch;
  // });


  // Format icon helper
  const getFormatIcon = (format) => {
    switch (format) {
      case 'PDF':
        return <FileType size={18} color="#ef4444" />;
      case 'DOCX':
        return <FileText size={18} color="#2563eb" />;
      case 'PNG':
      case 'JPG':
        return <ImageIcon size={18} color="#10b981" />;
      default:
        return <FileText size={18} color="#64748b" />;
    }
  };

  // Type icon helper
  const getTypeIcon = (type) => {
    return type === 'cv' ? (
      <FileText size={20} color="#000000" />
    ) : (
      <Mail size={20} color="#eab308" />
    );
  };

  // Handlers
  const handleMenuOpen = (event, download) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedDownload(download);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleRedownload = async () => {
    if (!selectedDownload) return;

    await redownload(selectedDownload.id, selectedDownload.fileName);
    handleMenuClose();
  };

  const handleDeleteOne = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDownload) return;

    const result = await removeDownload(selectedDownload.id);

    if (result.success) {
      setDeleteDialogOpen(false);
      setSelectedDownload(null);
    }
  };

  const handleClearAll = async () => {
    const result = await clearAllDownloads();

    if (result.success) {
      setClearAllDialogOpen(false);
    }
  };




  // Group downloads by date
  const groupByDate = (items) => {
    const groups = {};
    items.forEach((item) => {
      const date = new Date(item.downloadedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  };

  const totalDownloads = stats.totalDownloads || 0;

  const groupedDownloads = groupDownloadsByDate(filteredDownloads);


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
            Downloads
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
            Your download history and files
          </Typography>
        </Box>

        {downloads.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setClearAllDialogOpen(true)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Clear History
          </Button>
        )}
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 2,
          mb: 4,
        }}
      >
        {[
          {
            label: 'Total Downloads',
            value: totalDownloads,
            icon: <Download size={20} />,
            color: '#000000',
          },
          {
            label: 'CVs Downloaded',
            value: cvDownloads,
            icon: <FileText size={20} />,
            color: '#10b981',
          },
          {
            label: 'Letters Downloaded',
            value: letterDownloads,
            icon: <Mail size={20} />,
            color: '#eab308',
          },
          {
            label: isPremium ? 'Quality' : 'Total Size',
            value: isPremium ? 'High Quality' : totalSize,
            icon: isPremium ? <Star size={20} /> : <HardDrive size={20} />,
            color: isPremium ? '#EAB308' : '#f59e0b',
          },
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
              }}
            >
              {stat.icon}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="700" color="#1e293b">
                {stat.value}
              </Typography>
              <Typography variant="caption" color="#94a3b8">
                {stat.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Format Availability */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          p: 3,
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          mb: 4,
        }}
      >
        <Typography variant="body1" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
          Available Formats
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[
            { format: 'PDF', icon: <FileType size={20} />, color: '#ef4444', free: true },
            { format: 'DOCX', icon: <FileText size={20} />, color: '#2563eb', free: false },
            { format: 'PNG', icon: <ImageIcon size={20} />, color: '#10b981', free: false },
            { format: 'JPG', icon: <ImageIcon size={20} />, color: '#f59e0b', free: false },
          ].map((fmt) => (
            <Box
              key={fmt.format}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2.5,
                py: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: availableFormats.includes(fmt.format) ? `${fmt.color}40` : '#e2e8f0',
                bgcolor: availableFormats.includes(fmt.format) ? `${fmt.color}08` : '#f8fafc',
                opacity: availableFormats.includes(fmt.format) ? 1 : 0.6,
                position: 'relative',
              }}
            >
              <Box sx={{ color: fmt.color }}>{fmt.icon}</Box>
              <Box>
                <Typography variant="body2" fontWeight="600" color="#1e293b">
                  {fmt.format}
                </Typography>
                <Typography variant="caption" color="#94a3b8">
                  {fmt.free ? 'Free' : 'Premium'}
                </Typography>
              </Box>
              {!fmt.free && !isPremium && (
                <Lock size={14} color="#94a3b8" style={{ marginLeft: 8 }} />
              )}
              {!fmt.free && isPremium && (
                <Star size={14} color="#EAB308" style={{ marginLeft: 8 }} />
              )}
            </Box>
          ))}
        </Box>

        {!isPremium && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: '#00000008',
              border: '1px solid #00000020',
            }}
          >
            <Typography variant="body2" color="#64748b" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Lock size={14} /> Unlock DOCX, PNG, and JPG formats with Premium
            </Typography>
            <Button
              size="small"
              onClick={() => router.push('/upgrade')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#000000',
                '&:hover': { bgcolor: '#00000010' },
              }}
            >
              Upgrade →
            </Button>
          </Box>
        )}
      </Box>

      {isPremium && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mt: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: '#10b98108',
            border: '1px solid #10b98120',
          }}
        >
          <Star size={18} color="#EAB308" />
          <Typography variant="body2" color="#064e3b" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Sparkles size={16} /> Premium benefits active:
          </Typography>
          <Chip
            label="High Quality"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              bgcolor: '#10b98115',
              color: '#10b981',
            }}
          />
          <Chip
            label="No Watermark"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              bgcolor: '#10b98115',
              color: '#10b981',
            }}
          />
          <Chip
            label="All Formats"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.7rem',
              bgcolor: '#10b98115',
              color: '#10b981',
            }}
          />
        </Box>
      )}

      {/* ✅ Watermark notice for free users */}
      {!isPremium && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            mb: 4,
            borderRadius: 2,
            bgcolor: '#fef3c7',
            border: '1px solid #fcd34d',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: '#f59e0b15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Droplet size={18} color="#f59e0b" />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#92400e">
                Downloads include watermark
              </Typography>
              <Typography variant="caption" color="#a16207">
                Free plan downloads have a small CVtify watermark. Upgrade for clean exports.
              </Typography>
            </Box>
          </Box>
          <Button
            size="small"
            onClick={() => router.push('/upgrade')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: '#92400e',
              bgcolor: '#fcd34d',
              borderRadius: 2,
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#fbbf24' },
            }}
          >
            Remove Watermark
          </Button>
        </Box>
      )}

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
        <Tab label={`All (${totalDownloads})`} value="all" />
        <Tab label={`CVs (${cvDownloads})`} value="cvs" />
        <Tab label={`Letters (${letterDownloads})`} value="letters" />
      </Tabs>

      {/* Search & Sort */}
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
          placeholder="Search downloads..."
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
                <Search size={18} color="#94a3b8" />
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
            { label: 'Newest First', value: 'newest' },
            { label: 'Oldest First', value: 'oldest' },
            { label: 'Name (A-Z)', value: 'name' },
            { label: 'File Size', value: 'size' },
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
      </Box>

      {/* Download List */}
      {loading ? (
        /* Loading Skeleton */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[0, 1].map((groupIdx) => (
            <Box key={groupIdx}>
              <Skeleton variant="text" width={140} height={24} sx={{ mb: 1.5 }} />
              <Box
                sx={{
                  bgcolor: '#ffffff',
                  borderRadius: 3,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                }}
              >
                {[0, 1, 2].map((rowIdx) => (
                  <Box
                    key={rowIdx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderBottom: rowIdx < 2 ? '1px solid #f1f5f9' : 'none',
                      opacity: 1 - groupIdx * 0.2 - rowIdx * 0.1,
                    }}
                  >
                    <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: 2, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="50%" height={20} />
                      <Skeleton variant="text" width="25%" height={16} />
                    </Box>
                    <Skeleton variant="rounded" width={60} height={28} sx={{ borderRadius: 2, display: { xs: 'none', sm: 'block' } }} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      ) : filteredDownloads.length === 0 ? (
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
            <FileX size={40} color="#000000" />
          </Box>
          <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>
            {searchQuery ? 'No downloads found' : 'No downloads yet'}
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
            {searchQuery
              ? 'Try a different search term'
              : 'Download your CVs and motivation letters to see them here'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              onClick={() => router.push('/my-cvs')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
              }}
            >
              Go to My CVs
            </Button>
          )}
        </Box>
      ) : (
        /* Grouped Download History */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(groupedDownloads).map(([date, items]) => (
            <Box key={date}>
              {/* Date Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Calendar size={14} color="#94a3b8" />
                <Typography variant="body2" fontWeight="600" color="#94a3b8">
                  {date}
                </Typography>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="caption" color="#94a3b8">
                  {items.length} {items.length === 1 ? 'file' : 'files'}
                </Typography>
              </Box>

              {/* Download Items */}
              <Box
                sx={{
                  bgcolor: '#ffffff',
                  borderRadius: 3,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                }}
              >
                {items.map((download, index) => (
                  <Box
                    key={download.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderBottom: index < items.length - 1 ? '1px solid #f1f5f9' : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    {/* Left: File Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                      {/* File Type Icon */}
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: download.type === 'cv' ? '#00000012' : '#eab30812',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {getTypeIcon(download.type)}
                      </Box>

                      {/* File Details */}
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight="600" color="#1e293b" noWrap>
                          {download.fileName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.3 }}>
                          <Chip
                            label={download.type === 'cv' ? 'CV' : 'Letter'}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              bgcolor: download.type === 'cv' ? '#00000015' : '#eab30815',
                              color: download.type === 'cv' ? '#000000' : '#eab308',
                            }}
                          />
                          {download.template && (
                            <Typography variant="caption" color="#94a3b8">
                              {download.template}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    {/* Center: Format & Size */}
                    <Box
                      sx={{
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        gap: 3,
                        mx: 3,
                      }}
                    >
                      {/* Format */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getFormatIcon(download.format)}
                        <Typography variant="caption" fontWeight="600" color="#64748b">
                          {download.format}
                        </Typography>
                      </Box>

                      {/* Size */}
                      <Typography variant="caption" color="#94a3b8" sx={{ minWidth: 60 }}>
                        {download.size}
                      </Typography>

                      {/* ✅ Quality Badge */}
                      <Chip
                        label={isPremium ? 'HD' : 'SD'}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          bgcolor: isPremium ? '#EAB30815' : '#94a3b815',
                          color: isPremium ? '#EAB308' : '#94a3b8',
                          minWidth: 30,
                        }}
                      />

                      {/* Time */}
                      <Typography variant="caption" color="#94a3b8" sx={{ minWidth: 80 }}>
                        {download.timeAgo}
                      </Typography>
                    </Box>

                    {/* Right: Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Tooltip title="Download Again">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedDownload(download);
                            handleRedownload();
                          }}
                          sx={{
                            color: '#000000',
                            '&:hover': { bgcolor: '#00000010' },
                          }}
                        >
                          <Download size={18} />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, download)}
                      >
                        <MoreVertical size={18} color="#94a3b8" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ===== CONTEXT MENU ===== */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', minWidth: 180 },
        }}
      >
        <MenuItem
          onClick={handleRedownload}
          sx={{ py: 1 }}
        >
          <ListItemIcon>
            <Download size={18} color="#000000" />
          </ListItemIcon>
          <Typography variant="body2" color="#000000">
            Download Again
          </Typography>
        </MenuItem>

        {/* Premium format options */}
        {isPremium && (
          <Box>
            <Divider sx={{ my: 0.5 }} />
            <Typography
              variant="caption"
              color="#94a3b8"
              sx={{ px: 2, py: 0.5, display: 'block' }}
            >
              Download as... (High Quality, No Watermark)
            </Typography>
            {premiumFormats
              .filter((f) => f !== selectedDownload?.format)
              .map((format) => (
                <MenuItem key={format} onClick={handleMenuClose} sx={{ py: 0.8, pl: 3 }}>
                  <ListItemIcon>{getFormatIcon(format)}</ListItemIcon>
                  <Typography variant="body2" color="#64748b">
                    {format}
                  </Typography>
                </MenuItem>
              ))}
          </Box>
        )}

        {!isPremium && (
          <Box>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push('/upgrade');
              }}
              sx={{ py: 1 }}
            >
              <ListItemIcon>
                <Lock size={18} color="#EAB308" />
              </ListItemIcon>
              <Typography variant="body2" color="#EAB308" fontWeight="600">
                More Formats (Premium)
              </Typography>
            </MenuItem>
          </Box>
        )}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleDeleteOne}
          sx={{ py: 1, '&:hover': { bgcolor: '#ef444410' } }}
        >
          <ListItemIcon>
            <Trash2 size={18} color="#ef4444" />
          </ListItemIcon>
          <Typography variant="body2" color="#ef4444">
            Remove from History
          </Typography>
        </MenuItem>
      </Menu>

      {/* ===== DELETE ONE DIALOG ===== */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Remove Download</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Remove <strong>{selectedDownload?.fileName}</strong> from your download history?
            This won&apos;t delete the original file.
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
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== CLEAR ALL DIALOG ===== */}
      <Dialog
        open={clearAllDialogOpen}
        onClose={() => setClearAllDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Clear Download History</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b">
            Are you sure you want to clear all download history? This action cannot be undone.
            Your original CVs and letters won&apos;t be affected.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setClearAllDialogOpen(false)}
            sx={{ textTransform: 'none', borderRadius: 2, color: '#64748b' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleClearAll}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}