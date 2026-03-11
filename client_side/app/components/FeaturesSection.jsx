// components/FeaturesSection.jsx
import React from 'react';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
// import VerifiedIcon from '@mui/icons-material/Verified';
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionIcon from '@mui/icons-material/Description';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import DownloadIcon from '@mui/icons-material/Download';
import ColorLensIcon from '@mui/icons-material/ColorLens';

// Styled components
const StyledSection = styled(Box)(({ theme }) => ({
  background: '#f8fafc',
  padding: theme.spacing(10, 2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 2),
  },
}));

const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2.5),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  textAlign: 'center',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid #e2e8f0',
  boxShadow: 'none',
  backgroundColor: '#ffffff',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
    borderColor: '#EAB308',
  },
}));

const IconWrapper = styled(Box)(({ theme, bgcolor }) => ({
  width: 70,
  height: 70,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2.5),
  background: bgcolor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
    color: '#ffffff',
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

const FeaturesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    // {
    //   icon: <VerifiedIcon />,
    //   bgcolor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    //   title: 'Beat the Bots',
    //   subtitle: 'ATS-Optimized CVs',
    //   description: 'Get past applicant tracking systems and land more interviews with perfectly formatted, ATS-friendly resumes.',
    // },
    // {
    //   icon: <AutoAwesomeIcon />,
    //   bgcolor: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    //   title: 'AI-Powered Writing',
    //   subtitle: 'Smart Suggestions',
    //   description: 'Let AI help you write compelling bullet points and summaries that highlight your achievements.',
    //   popular: true,
    // },
    {
      icon: <DescriptionIcon />,
      bgcolor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      title: 'Complete Package',
      subtitle: 'CV + Cover Letters',
      description: 'Create matching CVs and motivation letters that work together to tell your professional story.',
    },
    {
      icon: <PhoneIphoneIcon />,
      bgcolor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      title: 'Edit Anywhere',
      subtitle: 'Mobile-Friendly',
      description: 'Update your CV on the go. Our editor works beautifully on any device, anytime.',
    },
    {
      icon: <DownloadIcon />,
      bgcolor: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      title: 'Instant Download',
      subtitle: 'PDF & Word Formats',
      description: 'Download your polished CV instantly in multiple formats, ready to send to employers.',
    },
    {
      icon: <ColorLensIcon />,
      bgcolor: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      title: 'Stand Out',
      subtitle: 'Beautiful Templates',
      description: 'Choose from professionally designed templates that make a lasting first impression.',
    },
  ];

  return (
    <StyledSection>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={6} textAlign="center">
          <HighlightChip>Why Choose Us</HighlightChip>
          
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h2"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Everything You Need to
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
              Land Your Dream Job
            </Box>
          </Typography>
          
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            color="text.secondary"
            sx={{ 
              maxWidth: 600, 
              margin: '0 auto',
              fontWeight: 400,
            }}
          >
            Simple tools that help you create professional documents in minutes, not hours.
          </Typography>
        </Box>

        {/* Features Grid */}
        <FeaturesGrid>
          {features.map((feature, index) => (
            <StyledCard key={index}>
              {feature.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Popular
                </Box>
              )}
              
              <CardContent sx={{ padding: theme.spacing(1) }}>
                <IconWrapper bgcolor={feature.bgcolor}>
                  {feature.icon}
                </IconWrapper>

                <Typography
                  variant="overline"
                  sx={{ 
                    color: '#667eea',
                    fontWeight: 600,
                    letterSpacing: '1px',
                  }}
                >
                  {feature.subtitle}
                </Typography>

                <Typography
                  variant="h6"
                  component="h3"
                  fontWeight="700"
                  color="text.primary"
                  gutterBottom
                  sx={{ mt: 0.5, mb: 1.5 }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.6,
                    fontSize: '0.9rem',
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </StyledCard>
          ))}
        </FeaturesGrid>
      </Container>
    </StyledSection>
  );
};

export default FeaturesSection;