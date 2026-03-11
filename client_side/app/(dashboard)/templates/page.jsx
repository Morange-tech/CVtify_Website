'use client';

// components/filteredTemplatesSection.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Chip,
  Modal,
  IconButton,
  Slider,
  useTheme,
  useMediaQuery,
  Fade,
  Backdrop,
  CircularProgress
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
import Image from 'next/image';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth'; // adjust path
import LockIcon from '@mui/icons-material/Lock';



// Styled components
const StyledSection = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  padding: theme.spacing(10, 2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 2),
  },
}));

const FilteredTemplatesGrid = styled(Box)(({ theme }) => ({
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
    '& .overlay': {
      opacity: 1,
    },
    '& .template-image': {
      transform: 'scale(1.05)',
    },
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
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
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

// Modal Styles
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
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#e2e8f0',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#94a3b8',
    borderRadius: '4px',
  },
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
  '&:hover': {
    backgroundColor: '#ffffff',
    transform: 'scale(1.1)',
  },
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

const FilteredTemplatesSection = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeFilter, setActiveFilter] = useState('all');


  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const { user } = useAuth();
  const isPremium = user?.plan === 'premium';

  // Loading state for navigation
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTemplateName, setNavigatingTemplateName] = useState('');

  const [wishlist, setWishlist] = useState([]);

  const handleToggleWishlist = (templateId, e) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  const isInWishlist = (templateId) => wishlist.includes(templateId);



  // filteredTemplates with real images - Now with proper template IDs that match CV Builder
  const templates = [
    {
      id: 1,
      name: 'Modern Creative',
      category: 'creative',
      image: '/templates/template4.png',
      badges: ['popular'],
      rating: 4.9,
      uses: '12.5k',
      isFree: true,
      templateId: 4, // Maps to Template4 in CV Builder
    },
    {
      id: 2,
      name: 'Professional',
      category: 'professional',
      image: '/templates/template1.png',
      badges: ['premium'],
      rating: 4.8,
      uses: '8.2k',
      isFree: false,
      templateId: 1, // Maps to Template1 in CV Builder
    },
    {
      id: 3,
      name: 'Minimal Clean',
      category: 'ats-optimized',  // ✅ updated
      image: '/templates/template5.png',
      badges: ['free'],
      rating: 4.7,
      uses: '15.3k',
      isFree: true,
      templateId: 5, // Maps to Template5 in CV Builder
    },
    {
      id: 4,
      name: 'Executive',
      category: 'executive',  // ✅ updated
      image: '/templates/template2.png',
      badges: ['popular', 'premium'],
      rating: 4.9,
      uses: '9.8k',
      isFree: false,
      templateId: 2, // Maps to Template2 in CV Builder
    },
    {
      id: 5,
      name: 'Fresh Graduate',
      category: 'ats-optimized',  // ✅ updated
      image: '/templates/template6.png',
      badges: ['free', 'new'],
      rating: 4.6,
      uses: '6.1k',
      isFree: true,
      templateId: 6, // Maps to Template6 in CV Builder
    },
    {
      id: 6,
      name: 'Tech Pro',
      category: 'professional',
      image: '/templates/template3.png',
      badges: ['premium'],
      rating: 4.8,
      uses: '7.4k',
      isFree: false,
      templateId: 3, // Maps to Template3 in CV Builder
    },
  ];



  // ✅ Filter filteredTemplates for premium users
  // Filtered result:
  const displayedTemplates = isPremium
    ? activeFilter === 'all'
      ? templates
      : templates.filter((t) => t.category === activeFilter)
    : templates;


  // const handleTabChange = (event, newValue) => {
  //   setActiveTab(newValue);
  // };

  const getBadgeLabel = (badge) => {
    const labels = {
      popular: { label: 'Most Popular', icon: <StarIcon sx={{ fontSize: 14 }} /> },
      free: { label: 'Free', icon: null },
      premium: { label: 'Premium', icon: <WorkspacePremiumIcon sx={{ fontSize: 14 }} /> },
      new: { label: 'New', icon: null },
    };
    return labels[badge] || { label: badge, icon: null };
  };

  // Modal handlers
  const handleOpenPreview = (template, e) => {
    e.stopPropagation();

    // ✅ Block free users
    if (!isPremium && !template.isFree) {
      router.push('/upgrade');
      return;
    }

    setSelectedTemplate(template);
    setZoomLevel(100);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTemplate(null);
    setZoomLevel(100);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const handleZoomSliderChange = (event, newValue) => {
    setZoomLevel(newValue);
  };

  /**
   * Navigate to CV Builder with selected template
   * This passes the template ID as a URL parameter
   */
  const handleUseTemplate = (template, e) => {
    e?.stopPropagation();

    // ✅ Block free users from premium templates
    if (!isPremium && !template.isFree) {
      router.push('/upgrade');
      return;
    }

    // Show loading state
    setIsNavigating(true);
    setNavigatingTemplateName(template.name);

    // Close modal if open
    if (modalOpen) {
      handleCloseModal();
    }

    // Store template selection in localStorage for persistence
    const filteredTemplateselection = {
      templateId: template.templateId,
      templateName: template.name,
      selectedAt: new Date().toISOString(),
    };
    localStorage.setItem('selectedTemplate', JSON.stringify(filteredTemplateselection));

    // Navigate to CV Builder with template parameter
    // The template parameter will be read by CV Builder to set the initial template
    setTimeout(() => {
      router.push(`/CV_Builder?template=${template.templateId}`);
    }, 500); // Small delay for visual feedback
  };

  /**
   * Handle clicking on a template card (not the buttons)
   * This opens the preview modal
   */
  const handleCardClick = (template) => {

    // ✅ If free user clicks locked template → upgrade
    if (!isPremium && !template.isFree) {
      router.push('/upgrade');
      return;
    }

    setSelectedTemplate(template);
    setZoomLevel(100);
    setModalOpen(true);
  };

  return (
    <>
      {/* Loading Overlay during navigation */}
      {isNavigating && (
        <LoadingOverlay>
          <CircularProgress
            size={60}
            sx={{
              color: '#667eea',
            }}
          />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            Loading {navigatingTemplateName}...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preparing your CV Builder
          </Typography>
        </LoadingOverlay>
      )}

      <StyledSection>
        <Container maxWidth="lg">
          {/* Header */}
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
              Professionally designed Templates that help you stand out
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
                and get hired faster.
              </Box>
            </Typography>
          </Box>

          {/* ✅ Premium: Category Filters */}
          {isPremium && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 1.5,
                mb: 4,
              }}
            >
              {[
                { label: 'All Templates', value: 'all', icon: '📋' },
                { label: 'Professional', value: 'professional', icon: '💼' },
                { label: 'Creative', value: 'creative', icon: '🎨' },
                { label: 'Executive', value: 'executive', icon: '👔' },
                { label: 'ATS-Optimized', value: 'ats-optimized', icon: '🎯' },
              ].map((filter) => (
                <Chip
                  key={filter.value}
                  label={`${filter.icon} ${filter.label}`}
                  onClick={() => setActiveFilter(filter.value)}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    px: 1,
                    py: 2.5,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ...(activeFilter === filter.value
                      ? {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#ffffff',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                      }
                      : {
                        bgcolor: '#f8fafc',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                        '&:hover': {
                          bgcolor: '#667eea10',
                          borderColor: '#667eea',
                          color: '#667eea',
                        },
                      }),
                  }}
                />
              ))}
            </Box>
          )}

          {/* ✅ Free user: Info text */}
          {!isPremium && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
                mb: 4,
                p: 2,
                borderRadius: 2,
                bgcolor: '#667eea08',
                border: '1px solid #667eea20',
              }}
            >
              <LockIcon sx={{ fontSize: 18, color: '#667eea' }} />
              <Typography variant="body2" color="#64748b">
                Premium Templates are locked.{' '}
                <Box
                  component="span"
                  onClick={() => router.push('/upgrade')}
                  sx={{
                    color: '#667eea',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Upgrade to unlock all Templates →
                </Box>
              </Typography>
            </Box>
          )}

          {/* filteredTemplates Grid */}
          <FilteredTemplatesGrid>
            {displayedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                onClick={() => handleCardClick(template)}
              >
                {/* Badges */}
                <BadgeWrapper>
                  {template.badges.map((badge, idx) => {
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

                {/* ✅ Lock overlay for free users on premium templates */}
                {!isPremium && !template.isFree && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 4,
                      bgcolor: 'rgba(0, 0, 0, 0.45)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/upgrade');
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <LockIcon sx={{ fontSize: 30, color: '#ffffff' }} />
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight="700"
                      color="#ffffff"
                      sx={{ textAlign: 'center' }}
                    >
                      Premium Template
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: '#ffffff',
                        color: '#667eea',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        '&:hover': {
                          bgcolor: '#f0f0ff',
                        },
                      }}
                    >
                      Upgrade to Unlock
                    </Button>
                  </Box>
                )}

                {/* Image Area */}
                <ImageWrapper>
                  {/* Wishlist Button */}
                  <WishlistButton
                    onClick={(e) => handleToggleWishlist(template.id, e)}
                    size="small"
                  >
                    {isInWishlist(template.id) ? (
                      <FavoriteIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    )}
                  </WishlistButton>
                  <TemplateImageBox className="template-image">
                    <Image
                      src={template.image}
                      alt={`${template.name} CV Template`}
                      fill
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'top'
                      }}
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

                {/* Card Footer */}
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
          </FilteredTemplatesGrid>


          {/* View All Button */}
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

        {/* Preview Modal */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 300,
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            },
          }}
        >
          <Fade in={modalOpen}>
            <ModalContent>
              {selectedTemplate && (
                <>
                  {/* Modal Header */}
                  <ModalHeader>
                    <Box>
                      <Typography variant="h6" fontWeight="700" color="text.primary">
                        {selectedTemplate.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="body2" color="text.secondary">
                          {selectedTemplate.rating} • {selectedTemplate.uses} uses
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
                        onClick={(e) => handleUseTemplate(selectedTemplate, e)}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#ffffff',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 2,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
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

                  {/* Modal Image Container */}
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
                          style={{
                            objectFit: 'contain',
                          }}
                          quality={100}
                          priority
                        />
                      </Box>
                    </Box>
                  </ModalImageContainer>

                  {/* Zoom Controls */}
                  <ZoomControls>
                    <IconButton
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 50}
                      size="small"
                      sx={{
                        color: zoomLevel <= 50 ? '#cbd5e1' : '#64748b',
                        '&:hover': {
                          backgroundColor: '#e2e8f0',
                        },
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
                            boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)',
                          },
                        },
                        '& .MuiSlider-track': {
                          height: 4,
                        },
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
                        '&:hover': {
                          backgroundColor: '#e2e8f0',
                        },
                      }}
                    >
                      <ZoomInIcon />
                    </IconButton>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minWidth: 50,
                        textAlign: 'center',
                        fontWeight: 600,
                      }}
                    >
                      {zoomLevel}%
                    </Typography>

                    <IconButton
                      onClick={handleZoomReset}
                      size="small"
                      sx={{
                        color: '#64748b',
                        '&:hover': {
                          backgroundColor: '#e2e8f0',
                        },
                      }}
                    >
                      <RestartAltIcon />
                    </IconButton>

                    {/* Mobile Use Template Button */}
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => handleUseTemplate(selectedTemplate, e)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#ffffff',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2,
                        ml: 'auto',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
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

export default FilteredTemplatesSection;