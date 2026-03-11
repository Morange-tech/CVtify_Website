// components/TemplatesSection.jsx
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Chip,
  Tabs,
  Tab,
  Modal,
  IconButton,
  Slider,
  useTheme,
  useMediaQuery,
  Fade,
  Backdrop,
  CircularProgress,
  Alert,
  Skeleton,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import Image from 'next/image';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from 'next/link';
import useTemplates from '../hooks/useTemplate';

// ─── Styled Components ──────────────────────────────────────────
const StyledSection = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  padding: theme.spacing(10, 2),
  [theme.breakpoints.down('md')]: { padding: theme.spacing(8, 2) },
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(6, 2) },
}));

const TemplatesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(4),
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(3),
  },
}));

const TemplateCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid #e2e8f0',
  boxShadow: 'none',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 25px 50px rgba(102, 126, 234, 0.2)',
    borderColor: '#667eea',
    '& .overlay': { opacity: 1 },
    '& .template-image': { transform: 'scale(1.05)' },
  },
}));

const ImageWrapper = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  aspectRatio: '3/4',
  backgroundColor: '#f1f5f9',
});

const TemplateImageBox = styled(Box)({
  width: '100%',
  height: '100%',
  transition: 'transform 0.4s ease-in-out',
  position: 'relative',
});

const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    'linear-gradient(135deg, rgba(102,126,234,0.9) 0%, rgba(118,75,162,0.9) 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
}));

const BadgeWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  zIndex: 2,
}));

const StyledChip = styled(Chip)(({ badgetype }) => {
  const styles = {
    popular: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#ffffff',
    },
    free: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
    },
    premium: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      color: '#ffffff',
    },
    new: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: '#ffffff',
    },
  };
  return {
    ...styles[badgetype],
    fontWeight: 700,
    fontSize: '0.7rem',
    letterSpacing: '0.5px',
    height: '24px',
  };
});

const CardFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #e2e8f0',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(135deg, #EAB308)',
    height: 3,
    borderRadius: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: '#64748b',
    '&.Mui-selected': { color: '#EAB308' },
  },
}));

const HighlightChip = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(3),
  background: 'linear-gradient(135deg, #EAB308)',
  color: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  textTransform: 'uppercase',
  letterSpacing: '1px',
}));

const NoResults = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  color: '#64748b',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '900px',
  height: '90vh',
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: '95vw',
    height: '95vh',
    borderRadius: theme.spacing(1),
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
}));

const ModalImageContainer = styled(Box)({
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  backgroundColor: '#f1f5f9',
  '&::-webkit-scrollbar': { width: '8px', height: '8px' },
  '&::-webkit-scrollbar-track': { background: '#e2e8f0' },
  '&::-webkit-scrollbar-thumb': { background: '#94a3b8', borderRadius: '4px' },
});

const ZoomControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3),
  borderTop: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 2),
    gap: theme.spacing(1),
  },
}));

const WishlistButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  '&:hover': { backgroundColor: '#ffffff', transform: 'scale(1.1)' },
  transition: 'all 0.2s ease',
}));

const LoadingOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  gap: 16,
});

// ─── Skeleton Loader ────────────────────────────────────────────
const TemplateCardSkeleton = () => (
  <Card
    sx={{
      borderRadius: 2,
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      boxShadow: 'none',
    }}
  >
    <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', width: '100%' }} />
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Box>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="text" width={80} height={18} />
      </Box>
      <Skeleton variant="rounded" width={50} height={24} />
    </Box>
  </Card>
);

// ─── Main Component ─────────────────────────────────────────────
const TemplatesSection = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Backend data via custom hook
  const {
    templates,
    tabFilters,
    activeFilter,
    loading,
    error,
    changeFilter,
    toggleWishlist,
    refresh,
  } = useTemplates();

  // Compute active tab index from activeFilter
  const activeTab = tabFilters.findIndex((f) => f.value === activeFilter);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Navigation loading state
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTemplateName, setNavigatingTemplateName] = useState('');

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // ─── Wishlist Handler ─────────────────────────────────────
  const handleToggleWishlist = useCallback(
    async (templateId, e) => {
      e.stopPropagation();
      try {
        const result = await toggleWishlist(templateId);
        if (result?.error === 'auth_required') {
          showSnackbar('Please log in to save templates to your wishlist', 'warning');
          return;
        }
        showSnackbar(
          result.is_wishlisted
            ? 'Added to wishlist!'
            : 'Removed from wishlist',
          'success'
        );
      } catch {
        showSnackbar('Failed to update wishlist', 'error');
      }
    },
    [toggleWishlist]
  );

  // ─── Tab Change ───────────────────────────────────────────
  const handleTabChange = (event, newValue) => {
    const filterValue = tabFilters[newValue]?.value || 'all';
    changeFilter(filterValue);
  };

  // ─── Badge Helper ─────────────────────────────────────────
  const getBadgeLabel = (badge) => {
    const labels = {
      popular: { label: 'Most Popular', icon: <StarIcon sx={{ fontSize: 14 }} /> },
      free: { label: 'Free', icon: null },
      premium: {
        label: 'Premium',
        icon: <WorkspacePremiumIcon sx={{ fontSize: 14 }} />,
      },
      new: { label: 'New', icon: null },
    };
    return labels[badge] || { label: badge, icon: null };
  };

  // ─── Modal Handlers ──────────────────────────────────────
  const handleOpenPreview = (template, e) => {
    e.stopPropagation();
    setSelectedTemplate(template);
    setZoomLevel(100);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTemplate(null);
    setZoomLevel(100);
  };

  const handleZoomIn = () => setZoomLevel((p) => Math.min(p + 25, 200));
  const handleZoomOut = () => setZoomLevel((p) => Math.max(p - 25, 50));
  const handleZoomReset = () => setZoomLevel(100);
  const handleZoomSliderChange = (_, val) => setZoomLevel(val);

  // ─── Use Template ─────────────────────────────────────────
  const handleUseTemplate = (template, e) => {
    e?.stopPropagation();
    setIsNavigating(true);
    setNavigatingTemplateName(template.name);

    if (modalOpen) handleCloseModal();

    localStorage.setItem(
      'selectedTemplate',
      JSON.stringify({
        templateId: template.templateId,
        templateName: template.name,
        selectedAt: new Date().toISOString(),
      })
    );

    setTimeout(() => {
      router.push(`/CV_Builder?template=${template.templateId}`);
    }, 500);
  };

  // ─── Card Click ───────────────────────────────────────────
  const handleCardClick = (template) => {
    setSelectedTemplate(template);
    setZoomLevel(100);
    setModalOpen(true);
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <>
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <LoadingOverlay>
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            Loading {navigatingTemplateName}...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preparing your CV Builder
          </Typography>
        </LoadingOverlay>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <StyledSection>
        <Container maxWidth="lg">
          {/* ── Header ───────────────────────────────────── */}
          <Box mb={4} textAlign="center">
            <HighlightChip>Templates</HighlightChip>

            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component="h2"
              fontWeight="bold"
              color="text.primary"
              gutterBottom
              sx={{ mb: 2 }}
            >
              Choose Your Perfect
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #EAB308)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block',
                }}
              >
                CV Template
              </Box>
            </Typography>

            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              color="text.secondary"
              sx={{ maxWidth: 600, margin: '0 auto', fontWeight: 400, mb: 4 }}
            >
              Professionally designed templates that help you stand out and get
              hired faster.
            </Typography>
          </Box>

          {/* ── Filter Tabs ──────────────────────────────── */}
          <Box display="flex" justifyContent="center" mb={2}>
            <StyledTabs
              value={activeTab >= 0 ? activeTab : 0}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
              centered={!isMobile}
            >
              {tabFilters.map((tab, index) => (
                <Tab key={index} label={tab.label} disabled={loading} />
              ))}
            </StyledTabs>
          </Box>

          {/* ── Error State ──────────────────────────────── */}
          {error && (
            <Box display="flex" justifyContent="center" mb={4}>
              <Alert
                severity="error"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={refresh}
                    startIcon={<RefreshIcon />}
                  >
                    Retry
                  </Button>
                }
                sx={{ maxWidth: 600, width: '100%' }}
              >
                {error}
              </Alert>
            </Box>
          )}

          {/* ── Loading Skeletons ────────────────────────── */}
          {loading && (
            <TemplatesGrid>
              {[...Array(6)].map((_, i) => (
                <TemplateCardSkeleton key={i} />
              ))}
            </TemplatesGrid>
          )}

          {/* ── Templates Grid ───────────────────────────── */}
          {!loading && !error && templates.length > 0 && (
            <TemplatesGrid>
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  onClick={() => handleCardClick(template)}
                >
                  {/* Badges */}
                  <BadgeWrapper>
                    {(template.badges || []).map((badge, idx) => {
                      const { label, icon } = getBadgeLabel(badge);
                      return (
                        <StyledChip
                          key={idx}
                          label={label}
                          icon={icon}
                          badgetype={badge}
                          size="small"
                        />
                      );
                    })}
                  </BadgeWrapper>

                  {/* Image */}
                  <ImageWrapper>
                    <WishlistButton
                      onClick={(e) => handleToggleWishlist(template.id, e)}
                      size="small"
                    >
                      {template.isWishlisted ? (
                        <FavoriteIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                      ) : (
                        <FavoriteBorderIcon
                          sx={{ color: '#64748b', fontSize: 20 }}
                        />
                      )}
                    </WishlistButton>

                    <TemplateImageBox className="template-image">
                      <Image
                        src={template.image}
                        alt={`${template.name} CV Template`}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={template.id <= 3}
                      />
                    </TemplateImageBox>

                    {/* Hover Overlay */}
                    <Overlay className="overlay">
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        onClick={(e) => handleUseTemplate(template, e)}
                        sx={{
                          background: '#ffffff',
                          color: '#667eea',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          '&:hover': {
                            background: '#f8fafc',
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        Start with this template
                      </Button>
                      <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<VisibilityIcon />}
                        onClick={(e) => handleOpenPreview(template, e)}
                        sx={{
                          borderColor: '#ffffff',
                          color: '#ffffff',
                          fontWeight: 500,
                          textTransform: 'none',
                          borderRadius: 3,
                          px: 3,
                          py: 1,
                          '&:hover': {
                            borderColor: '#ffffff',
                            background: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        Preview
                      </Button>
                    </Overlay>
                  </ImageWrapper>

                  {/* Footer */}
                  <CardFooter>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight="700"
                        color="text.primary"
                      >
                        {template.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="body2" color="text.secondary">
                          {template.rating} • {template.uses} uses
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={template.isFree ? 'Free' : 'Pro'}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        background: template.isFree
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: '#ffffff',
                      }}
                    />
                  </CardFooter>
                </TemplateCard>
              ))}
            </TemplatesGrid>
          )}

          {/* ── Empty State ──────────────────────────────── */}
          {!loading && !error && templates.length === 0 && (
            <NoResults>
              <Typography variant="h6" gutterBottom>
                No templates found
              </Typography>
              <Typography variant="body2">
                Try selecting a different filter.
              </Typography>
            </NoResults>
          )}

          {/* ── View All Button ──────────────────────────── */}
          <Box display="flex" justifyContent="center" mt={6}>
            <Link href="/cvs" passHref>
              <Button
                variant="outlined"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderColor: '#EAB308',
                  color: '#667eea',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 3,
                  px: 5,
                  py: 1.5,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: '#EAB308',
                    background: 'linear-gradient(135deg, #EAB308)',
                    color: '#ffffff',
                  },
                }}
              >
                View All Templates
              </Button>
            </Link>
          </Box>
        </Container>

        {/* ── Preview Modal ────────────────────────────── */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 300,
              sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
            },
          }}
        >
          <Fade in={modalOpen}>
            <ModalContent>
              {selectedTemplate && (
                <>
                  <ModalHeader>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        color="text.primary"
                      >
                        {selectedTemplate.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="body2" color="text.secondary">
                          {selectedTemplate.rating} •{' '}
                          {selectedTemplate.uses} uses
                        </Typography>
                        <Chip
                          label={selectedTemplate.isFree ? 'Free' : 'Pro'}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            height: '20px',
                            background: selectedTemplate.isFree
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            color: '#ffffff',
                          }}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={(e) =>
                          handleUseTemplate(selectedTemplate, e)
                        }
                        sx={{
                          background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#ffffff',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 2,
                          '&:hover': {
                            background:
                              'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          },
                          display: { xs: 'none', sm: 'flex' },
                        }}
                      >
                        Use Template
                      </Button>
                      <IconButton
                        onClick={handleCloseModal}
                        sx={{
                          color: '#64748b',
                          '&:hover': {
                            backgroundColor: '#e2e8f0',
                            color: '#1e293b',
                          },
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </ModalHeader>

                  <ModalImageContainer>
                    <Box
                      sx={{
                        transform: `scale(${zoomLevel / 100})`,
                        transition: 'transform 0.2s ease-out',
                        transformOrigin: 'center center',
                        position: 'relative',
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: '300px', sm: '400px', md: '500px' },
                          height: { xs: '424px', sm: '566px', md: '707px' },
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                          borderRadius: 1,
                          overflow: 'hidden',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <Image
                          src={selectedTemplate.image}
                          alt={`${selectedTemplate.name} CV Template Preview`}
                          fill
                          style={{ objectFit: 'contain' }}
                          quality={100}
                          priority
                        />
                      </Box>
                    </Box>
                  </ModalImageContainer>

                  <ZoomControls>
                    <IconButton
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 50}
                      size="small"
                      sx={{
                        color: zoomLevel <= 50 ? '#cbd5e1' : '#64748b',
                        '&:hover': { backgroundColor: '#e2e8f0' },
                      }}
                    >
                      <ZoomOutIcon />
                    </IconButton>

                    <Slider
                      value={zoomLevel}
                      onChange={handleZoomSliderChange}
                      min={50}
                      max={200}
                      step={5}
                      sx={{
                        width: { xs: 100, sm: 200 },
                        color: '#667eea',
                        '& .MuiSlider-thumb': {
                          width: 16,
                          height: 16,
                          '&:hover': {
                            boxShadow:
                              '0 0 0 8px rgba(102, 126, 234, 0.16)',
                          },
                        },
                        '& .MuiSlider-track': { height: 4 },
                        '& .MuiSlider-rail': {
                          height: 4,
                          backgroundColor: '#e2e8f0',
                        },
                      }}
                    />

                    <IconButton
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 200}
                      size="small"
                      sx={{
                        color: zoomLevel >= 200 ? '#cbd5e1' : '#64748b',
                        '&:hover': { backgroundColor: '#e2e8f0' },
                      }}
                    >
                      <ZoomInIcon />
                    </IconButton>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: 50, textAlign: 'center', fontWeight: 600 }}
                    >
                      {zoomLevel}%
                    </Typography>

                    <IconButton
                      onClick={handleZoomReset}
                      size="small"
                      sx={{
                        color: '#64748b',
                        '&:hover': { backgroundColor: '#e2e8f0' },
                      }}
                    >
                      <RestartAltIcon />
                    </IconButton>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) =>
                        handleUseTemplate(selectedTemplate, e)
                      }
                      sx={{
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#ffffff',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2,
                        ml: 'auto',
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        },
                        display: { xs: 'flex', sm: 'none' },
                      }}
                    >
                      Use
                    </Button>
                  </ZoomControls>
                </>
              )}
            </ModalContent>
          </Fade>
        </Modal>
      </StyledSection>
    </>
  );
};

export default TemplatesSection;