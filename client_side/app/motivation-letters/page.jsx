'use client';

// app/motivation-letters/page.jsx
import React, { useState, useMemo } from 'react';
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
  Backdrop
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { motion } from 'framer-motion';



// Styled components
const PageWrapper = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f27273)',
  padding: theme.spacing(20, 2, 10),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(16, 2, 8),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(14, 2, 6),
  },
}));

const HeroDecoration = styled(Box)({
  position: 'absolute',
  width: '500px',
  height: '500px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.05)',
  top: '-200px',
  right: '-100px',
});

const HeroDecoration2 = styled(Box)({
  position: 'absolute',
  width: '300px',
  height: '300px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.03)',
  bottom: '-100px',
  left: '-50px',
});

const StyledSection = styled(Box)(({ theme }) => ({
  background: '#ffffff',
  padding: theme.spacing(8, 2),
  flex: 1,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 2),
  },
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

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'badgetype',
})(({ badgetype }) => {
  const styles = {
    popular: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#ffffff',
    },
    free: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
    background: '#EAB308',
    height: 3,
    borderRadius: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: '#64748b',
    '&.Mui-selected': {
      color: '#EAB308',
    },
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
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

const MotivationLettersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Tab filter values - Only Free and Popular
  const tabFilters = [
    { label: 'All Templates', value: 'all' },
    { label: 'Free', value: 'free' },
    { label: 'Popular', value: 'popular' },
  ];

  // Motivation Letter Templates - Only Free and Popular
  const templates = [
    {
      id: 1,
      name: 'Professional Classic',
      category: 'professional',
      image: '/templates/motivation1.png',
      badges: ['popular', 'free'],
      rating: 4.9,
      uses: '18.5k',
      isFree: true,
      description: 'A timeless design perfect for corporate applications',
    },
    {
      id: 2,
      name: 'Modern Minimal',
      category: 'modern',
      image: '/templates/motivation2.png',
      badges: ['popular'],
      rating: 4.8,
      uses: '15.2k',
      isFree: true,
      description: 'Clean and contemporary style for tech industries',
    },
    {
      id: 3,
      name: 'Creative Bold',
      category: 'creative',
      image: '/templates/motivation3.png',
      badges: ['free'],
      rating: 4.7,
      uses: '12.3k',
      isFree: true,
      description: 'Stand out with this eye-catching design',
    },
    {
      id: 4,
      name: 'Executive Elite',
      category: 'executive',
      image: '/templates/motivation4.png',
      badges: ['popular', 'free'],
      rating: 4.9,
      uses: '14.8k',
      isFree: true,
      description: 'Sophisticated template for senior positions',
    },
    {
      id: 5,
      name: 'Fresh Graduate',
      category: 'entry',
      image: '/templates/motivation5.png',
      badges: ['free'],
      rating: 4.6,
      uses: '22.1k',
      isFree: true,
      description: 'Perfect for students and first-time job seekers',
    },
    {
      id: 6,
      name: 'Corporate Pro',
      category: 'corporate',
      image: '/templates/motivation6.png',
      badges: ['popular'],
      rating: 4.8,
      uses: '11.4k',
      isFree: true,
      description: 'Ideal for business and finance sectors',
    },
  ];

  // Features for motivation letters
  const features = [
    'Professionally crafted content suggestions',
    'Industry-specific language and tone',
    'Easy customization for any job application',
    'ATS-friendly formatting',
  ];

  // Filter templates based on active tab
  const filteredTemplates = useMemo(() => {
    const currentFilter = tabFilters[activeTab].value;

    switch (currentFilter) {
      case 'all':
        return templates;
      case 'free':
        return templates.filter((template) => template.isFree === true);
      case 'popular':
        return templates.filter((template) => template.badges.includes('popular'));
      default:
        return templates;
    }
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getBadgeLabel = (badge) => {
    const labels = {
      popular: { label: 'Most Popular', icon: <StarIcon sx={{ fontSize: 14 }} /> },
      free: { label: 'Free', icon: null },
    };
    return labels[badge] || { label: badge, icon: null };
  };

  // Modal handlers
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

  const handleUseTemplate = (template, e) => {
    e?.stopPropagation();
    console.log('Using motivation letter template:', template.name);
    // router.push(`/editor/motivation-letter?template=${template.id}`);
  };

  return (
    <PageWrapper>
      <Navbar />

      {/* Hero Section */}
      <HeroSection>
        <HeroDecoration />
        <HeroDecoration2 />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0 }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box textAlign="center" color="#ffffff">
              {/* Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <MailOutlineIcon sx={{ fontSize: 40, color: '#EAB308' }} />
              </Box>

              <Typography
                variant={isMobile ? 'h4' : 'h2'}
                fontWeight="700"
                gutterBottom
                sx={{ mb: 2 }}
              >
                Motivation Letter
                <Box component="span" sx={{ color: '#EAB308', display: 'block' }}>
                  Templates
                </Box>
              </Typography>

              <Typography
                variant={isMobile ? 'body1' : 'h6'}
                sx={{
                  maxWidth: 700,
                  margin: '0 auto 40px',
                  opacity: 0.9,
                  lineHeight: 1.7,
                }}
              >
                Create compelling motivation letters that capture attention and showcase
                your passion. All templates are free and designed to help you land your dream job.
              </Typography>

              {/* Features */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 2,
                  maxWidth: 800,
                  margin: '0 auto',
                }}
              >
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      padding: '8px 16px',
                      borderRadius: 5,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#EAB308' }} />
                    <Typography variant="body2" fontWeight="500">
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </motion.div>
      </HeroSection>

      {/* Templates Section */}
      <StyledSection>
        <Container maxWidth="lg">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0 }}
          >
            <Box mb={4} textAlign="center">
              <Typography
                variant={isMobile ? 'h5' : 'h4'}
                component="h2"
                fontWeight="bold"
                color="text.primary"
                gutterBottom
                sx={{ mb: 1 }}
              >
                Choose Your Template
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 500, margin: '0 auto' }}
              >
                All our motivation letter templates are completely free.
                Pick one and start writing today.
              </Typography>
            </Box>
          </motion.div>

          {/* Filter Tabs */}
          <Box display="flex" justifyContent="center" mb={2}>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
              centered={!isMobile}
            >
              {tabFilters.map((tab, index) => (
                <Tab key={index} label={tab.label} />
              ))}
            </StyledTabs>
          </Box>

          {/* Templates Grid */}
          <TemplatesGrid>
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id}>
                {/* Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.0 }}
                >
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

                  {/* Image Area */}
                  <ImageWrapper>
                    <TemplateImageBox className="template-image">
                      <Image
                        src={template.image}
                        alt={`${template.name} Motivation Letter Template`}
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
                        Use This Template
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
                      label="Free"
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                      }}
                    />
                  </CardFooter>
                </motion.div>
              </TemplateCard>
            ))}
          </TemplatesGrid>

          {/* CTA Section */}
          <Box
            mt={8}
            p={5}
            textAlign="center"
            sx={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h5" fontWeight="700" color="text.primary" gutterBottom>
              Need Help Writing Your Motivation Letter?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, margin: '0 auto 24px' }}>
              We can help you craft the perfect motivation letter
              tailored to your dream job.
            </Typography>
            <Link href="/signup" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 3,
                  px: 5,
                  py: 1.5,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Get Started for Free
              </Button>
            </Link>
          </Box>
        </Container>
      </StyledSection>

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
                        label="Free"
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.65rem',
                          height: '20px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                      onClick={(e) => {
                        handleUseTemplate(selectedTemplate, e);
                        handleCloseModal();
                      }}
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
                        alt={`${selectedTemplate.name} Motivation Letter Preview`}
                        fill
                        style={{ objectFit: 'contain' }}
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
                          boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)',
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

                  {/* Mobile Use Template Button */}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      handleUseTemplate(selectedTemplate, e);
                      handleCloseModal();
                    }}
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
      <Footer />
      <ScrollToTop />
    </PageWrapper>
  );
};

export default MotivationLettersPage;