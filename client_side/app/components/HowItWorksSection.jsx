// components/HowItWorksSection.jsx
import React from 'react';
import { 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Typography,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DownloadIcon from '@mui/icons-material/Download';

// Styled components
const StyledSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffe6)',
  minHeight: '5vh',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(10, 2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 2),
  },
}));

const CardsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'stretch',
  gap: theme.spacing(4),
  flexWrap: 'nowrap',
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '480px',
  minWidth: '250px',
  maxWidth: '300px',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  textAlign: 'center',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  overflow: 'visible',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #ffe200 )',
    borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  },
  [theme.breakpoints.down('md')]: {
    width: '240px',
    minWidth: '200px',
    padding: theme.spacing(1.5),
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: '320px',
    minWidth: 'unset',
  },
}));

const StepAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  background: 'linear-gradient(135deg, #fa9a9a)',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  fontSize: '1.25rem',
  fontWeight: 'bold',
  boxShadow: '0 5px 15px rgba(102, 126, 234, 0.4)',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  color: '#f27273',
  marginBottom: theme.spacing(1.5),
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
  },
}));

const HowItWorksSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = [
    {
      number: '1',
      icon: <DescriptionIcon />,
      title: 'Choose a Template',
      description: 'Select from our collection of professionally designed CV templates.',
    },
    {
      number: '2',
      icon: <EditNoteIcon />,
      title: 'Fill in Your Details',
      description: 'Enter your personal information, work experience, and skills.',
    },
    {
      number: '3',
      icon: <DownloadIcon />,
      title: 'Download & Apply',
      description: 'Download your professional CV in PDF format and start applying.',
    },
  ];

  return (
    <StyledSection>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={35} textAlign="center">
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h1"
            fontWeight="bold"
            color="black"
            gutterBottom
          >
            How It Works
          </Typography>
          <Typography
            variant={isMobile ? 'body1' : 'h6'}
            color="black"
            sx={{ opacity: 0.9 }}
          >
            Create your professional CV in just 3 simple steps
          </Typography>
        </Box>

        {/* Cards Container */}
        <CardsWrapper mt={-20}>
          {steps.map((step, index) => (
            <StyledCard key={index}>
              <CardContent sx={{ padding: theme.spacing(1.5) }}>
                <StepAvatar>{step.number}</StepAvatar>
                
                <IconWrapper>
                  {step.icon}
                </IconWrapper>

                <Typography
                  variant="h6"
                  component="h2"
                  fontWeight="600"
                  color="text.primary"
                  gutterBottom
                >
                  {step.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ 
                    lineHeight: 1.5,
                    fontSize: '0.85rem'
                  }}
                >
                  {step.description}
                </Typography>
              </CardContent>
            </StyledCard>
          ))}
        </CardsWrapper>
      </Container>
    </StyledSection>
  );
};

export default HowItWorksSection;