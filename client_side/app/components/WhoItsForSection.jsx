// components/WhoItsForSection.jsx
import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import PublicIcon from '@mui/icons-material/Public';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useLanguage } from '../hooks/useLanguage';

// Styled Components with shouldForwardProp to prevent DOM warnings
const StyledSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
  padding: theme.spacing(10, 2),
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 2),
  },
}));

const BackgroundDecoration = styled(Box)({
  position: 'absolute',
  width: '600px',
  height: '600px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(26, 26, 26, 0.05) 100%)',
  top: '-200px',
  right: '-200px',
  zIndex: 0,
});

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

const CardsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(3),
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const MobileCarouselWrapper = styled(Box)(({ theme }) => ({
  display: 'none',
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    display: 'block',
  },
}));

// Fix: Use shouldForwardProp to prevent 'activeindex' from being passed to DOM
const CarouselTrack = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'activeindex',
})(({ activeindex }) => ({
  display: 'flex',
  transition: 'transform 0.4s ease-in-out',
  transform: `translateX(-${activeindex * 100}%)`,
}));

const CarouselSlide = styled(Box)({
  minWidth: '100%',
  padding: '0 8px',
  boxSizing: 'border-box',
});

// Fix: Use shouldForwardProp to prevent custom props from being passed to DOM
const PersonaCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'accentcolor',
})(({ theme, selected, accentcolor }) => ({
  height: '100%',
  borderRadius: theme.spacing(2.5),
  padding: theme.spacing(0.5),
  textAlign: 'left',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  border: selected ? `2px solid ${accentcolor}` : '2px solid transparent',
  boxShadow: selected
    ? `0 20px 40px ${accentcolor}25`
    : '0 4px 20px rgba(0, 0, 0, 0.08)',
  cursor: 'pointer',
  overflow: 'visible',
  background: '#ffffff',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 25px 50px ${accentcolor}30`,
    borderColor: accentcolor,
  },
}));

// Fix: Use shouldForwardProp to prevent 'accentcolor' from being passed to DOM
const MobilePersonaCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'accentcolor',
})(({ theme, accentcolor }) => ({
  height: '100%',
  minHeight: '500px',
  borderRadius: theme.spacing(2.5),
  padding: theme.spacing(0.5),
  textAlign: 'left',
  position: 'relative',
  border: `2px solid ${accentcolor}`,
  boxShadow: `0 10px 30px ${accentcolor}20`,
  overflow: 'visible',
  background: '#ffffff',
}));

// Fix: Use shouldForwardProp to prevent 'bgcolor' from being passed to DOM
const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgcolor',
})(({ bgcolor }) => ({
  width: 56,
  height: 56,
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: bgcolor,
  marginBottom: '16px',
  '& .MuiSvgIcon-root': {
    fontSize: '1.75rem',
    color: '#ffffff',
  },
}));

const FeatureList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
}));

// Fix: Use shouldForwardProp to prevent 'accentcolor' from being passed to DOM
const FeatureItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentcolor',
})(({ accentcolor }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    color: accentcolor,
    marginTop: '3px',
    flexShrink: 0,
  },
}));

// Fix: Use shouldForwardProp to prevent 'accentcolor' from being passed to DOM
const SelectBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentcolor',
})(({ theme, accentcolor }) => ({
  position: 'absolute',
  top: -12,
  right: 16,
  background: accentcolor,
  color: '#ffffff',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(2),
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: `0 4px 12px ${accentcolor}50`,
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: '1px solid #f1f5f9',
}));

const StatItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

const NavigationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

// Fix: Use shouldForwardProp to prevent 'accentcolor' from being passed to DOM
const NavButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'accentcolor',
})(({ theme, accentcolor }) => ({
  backgroundColor: '#ffffff',
  border: `2px solid ${accentcolor || '#000000'}`,
  color: accentcolor || '#000000',
  width: 44,
  height: 44,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: accentcolor || '#000000',
    color: '#ffffff',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    color: '#cbd5e1',
  },
}));

// Fix: Use shouldForwardProp to prevent 'active' and 'accentcolor' from being passed to DOM
const DotIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'accentcolor',
})(({ active, accentcolor }) => ({
  width: active ? 24 : 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: active ? accentcolor : '#e2e8f0',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
}));

const WhoItsForSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useLanguage();
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const personas = [
    {
      id: 'students',
      icon: <SchoolIcon />,
      title: t('whoItsFor.personas.students.title'),
      shortTitle: t('whoItsFor.personas.students.shortTitle'),
      description: t('whoItsFor.personas.students.description'),
      accentColor: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      badge: t('whoItsFor.personas.students.badge'),
      features: t('whoItsFor.personas.students.features'),
      stats: {
        users: '50K+',
        success: '89%',
      },
    },
    {
      id: 'professionals',
      icon: <BusinessCenterIcon />,
      title: t('whoItsFor.personas.professionals.title'),
      shortTitle: t('whoItsFor.personas.professionals.shortTitle'),
      description: t('whoItsFor.personas.professionals.description'),
      accentColor: '#000000',
      gradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      badge: null,
      features: t('whoItsFor.personas.professionals.features'),
      stats: {
        users: '120K+',
        success: '94%',
      },
    },
    {
      id: 'switchers',
      icon: <SyncAltIcon />,
      title: t('whoItsFor.personas.switchers.title'),
      shortTitle: t('whoItsFor.personas.switchers.shortTitle'),
      description: t('whoItsFor.personas.switchers.description'),
      accentColor: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      badge: t('whoItsFor.personas.switchers.badge'),
      features: t('whoItsFor.personas.switchers.features'),
      stats: {
        users: '35K+',
        success: '87%',
      },
    },
    {
      id: 'international',
      icon: <PublicIcon />,
      title: t('whoItsFor.personas.international.title'),
      shortTitle: t('whoItsFor.personas.international.shortTitle'),
      description: t('whoItsFor.personas.international.description'),
      accentColor: '#eab308',
      gradient: 'linear-gradient(135deg, #eab308 0%, #000000 100%)',
      badge: null,
      features: t('whoItsFor.personas.international.features'),
      stats: {
        users: '45K+',
        success: '91%',
      },
    },
  ];

  const maxSteps = personas.length;

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleDotClick = (index) => {
    setActiveStep(index);
  };

  const handleCardClick = (personaId) => {
    setSelectedPersona(selectedPersona === personaId ? null : personaId);
  };

  const handleGetStarted = (persona, e) => {
    e.stopPropagation();
    console.log('Getting started with persona:', persona.id);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (diff > swipeThreshold && activeStep < maxSteps - 1) {
      handleNext();
    } else if (diff < -swipeThreshold && activeStep > 0) {
      handleBack();
    }
  };

  const PersonaCardContent = ({ persona, isMobileView = false }) => (
    <CardContent sx={{ p: 3 }}>
      {persona.badge && (
        <SelectBadge accentcolor={persona.accentColor}>
          {persona.badge}
        </SelectBadge>
      )}

      <IconWrapper bgcolor={persona.gradient}>
        {persona.icon}
      </IconWrapper>

      <Typography
        variant="h6"
        fontWeight="700"
        color="text.primary"
        gutterBottom
        sx={{ mb: 1, fontSize: { xs: '1.1rem', md: '1.15rem' } }}
      >
        {isMobileView ? persona.title : (isMobile ? persona.shortTitle : persona.title)}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          lineHeight: 1.6,
          fontSize: '0.875rem',
          mb: 2,
        }}
      >
        {persona.description}
      </Typography>

      <FeatureList>
        {persona.features.map((feature, idx) => (
          <FeatureItem key={idx} accentcolor={persona.accentColor}>
            <CheckCircleIcon />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}
            >
              {feature}
            </Typography>
          </FeatureItem>
        ))}
      </FeatureList>

      <StatsBox>
        <StatItem>
          <AutoAwesomeIcon sx={{ fontSize: 16, color: persona.accentColor }} />
          <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ fontSize: '0.8rem' }}>
            {persona.stats.users} {t('whoItsFor.users')}
          </Typography>
        </StatItem>
        <StatItem>
          <TrendingUpIcon sx={{ fontSize: 16, color: persona.accentColor }} />
          <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ fontSize: '0.8rem' }}>
            {persona.stats.success} {t('whoItsFor.successRate')}
          </Typography>
        </StatItem>
      </StatsBox>

      <Button
        variant="contained"
        fullWidth
        endIcon={<ArrowForwardIcon />}
        onClick={(e) => handleGetStarted(persona, e)}
        sx={{
          mt: 3,
          py: 1.25,
          background: persona.gradient,
          color: '#ffffff',
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 2,
          fontSize: '0.9rem',
          boxShadow: `0 4px 14px ${persona.accentColor}40`,
          '&:hover': {
            boxShadow: `0 6px 20px ${persona.accentColor}50`,
            transform: 'translateY(-2px)',
          },
        }}
      >
        {t('whoItsFor.getStarted')}
      </Button>
    </CardContent>
  );

  return (
    <StyledSection>
      <BackgroundDecoration />

      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={6} textAlign="center" position="relative" zIndex={1}>
          <HighlightChip>{t('whoItsFor.badge')}</HighlightChip>

          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h2"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            {t('whoItsFor.headingLine1')}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #EAB308)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'block', sm: 'inline' },
                ml: { xs: 0, sm: 1 },
              }}
            >
              {t('whoItsFor.headingLine2')}
            </Box>
          </Typography>

          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            color="text.secondary"
            sx={{
              maxWidth: 650,
              margin: '0 auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            {t('whoItsFor.subheading')}
          </Typography>
        </Box>

        {/* Desktop/Tablet Grid */}
        <CardsGrid>
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              selected={selectedPersona === persona.id}
              accentcolor={persona.accentColor}
              onClick={() => handleCardClick(persona.id)}
            >
              <PersonaCardContent persona={persona} />
            </PersonaCard>
          ))}
        </CardsGrid>

        {/* Mobile Carousel */}
        <MobileCarouselWrapper>
          {/* Slide Counter */}
          <Box textAlign="center" mb={2}>
            <Typography
              variant="body2"
              fontWeight="600"
              sx={{ color: personas[activeStep].accentColor }}
            >
              {activeStep + 1} / {maxSteps}
            </Typography>
          </Box>

          {/* Carousel */}
          <Box
            sx={{ overflow: 'hidden' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <CarouselTrack activeindex={activeStep}>
              {personas.map((persona) => (
                <CarouselSlide key={persona.id}>
                  <MobilePersonaCard accentcolor={persona.accentColor}>
                    <PersonaCardContent persona={persona} isMobileView={true} />
                  </MobilePersonaCard>
                </CarouselSlide>
              ))}
            </CarouselTrack>
          </Box>

          {/* Navigation */}
          <NavigationWrapper>
            <NavButton
              onClick={handleBack}
              disabled={activeStep === 0}
              accentcolor={personas[activeStep].accentColor}
            >
              <KeyboardArrowLeftIcon />
            </NavButton>

            {/* Dot Indicators */}
            <Box display="flex" gap={1}>
              {personas.map((persona, index) => (
                <DotIndicator
                  key={persona.id}
                  active={activeStep === index}
                  accentcolor={persona.accentColor}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </Box>

            <NavButton
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
              accentcolor={personas[activeStep].accentColor}
            >
              <KeyboardArrowRightIcon />
            </NavButton>
          </NavigationWrapper>
        </MobileCarouselWrapper>

        {/* Bottom CTA */}
        {/* <Box
          mt={8}
          textAlign="center"
          sx={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(26, 26, 26, 0.05) 100%)',
            borderRadius: 4,
            py: 5,
            px: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            fontWeight="700"
            color="text.primary"
            gutterBottom
          >
            Not sure which one fits you?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 500, margin: '0 auto 24px' }}
          >
            Take our quick 2-minute quiz and get personalized template recommendations.
          </Typography>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderColor: '#EAB308',
              color: '#000000',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 3,
              px: 4,
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
            Take the Quiz
          </Button>
        </Box> */}
      </Container>
    </StyledSection>
  );
};

export default WhoItsForSection;