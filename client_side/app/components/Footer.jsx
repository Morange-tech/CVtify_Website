// components/Footer.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import { useLanguage } from '../hooks/useLanguage';

// Styled Components
const FooterWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
  color: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
}));

const FooterTop = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0, 6),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 0, 4),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5, 0, 3),
  },
}));

const FooterBottom = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
}));

const BackgroundDecoration = styled(Box)({
  position: 'absolute',
  width: '500px',
  height: '500px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 0%, transparent 70%)',
  top: '-200px',
  right: '-100px',
  zIndex: 0,
});

const BackgroundDecoration2 = styled(Box)({
  position: 'absolute',
  width: '400px',
  height: '400px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(26, 26, 26, 0.08) 0%, transparent 70%)',
  bottom: '-150px',
  left: '-100px',
  zIndex: 0,
});

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 45,
  height: 45,
  borderRadius: theme.spacing(1.5),
  background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    color: '#ffffff',
  },
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1rem',
  marginBottom: theme.spacing(3),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 40,
    height: 3,
    background: 'linear-gradient(135deg, #EAB308)',
    borderRadius: 2,
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.3s ease',
  padding: theme.spacing(0.5, 0),
  '&:hover': {
    color: '#ffffff',
    paddingLeft: theme.spacing(1),
    '& .arrow-icon': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
}));

const ArrowIcon = styled(ArrowForwardIcon)({
  fontSize: '0.9rem',
  opacity: 0,
  transform: 'translateX(-10px)',
  transition: 'all 0.3s ease',
});

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  color: '#94a3b8',
  fontSize: '0.9rem',
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: '#000000',
    marginTop: 2,
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: '#94a3b8',
  width: 40,
  height: 40,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#000000',
    color: '#ffffff',
    transform: 'translateY(-3px)',
  },
}));

const NewsletterWrapper = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.05)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.spacing(1.5),
    color: '#ffffff',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000000',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#000000',
  },
  '& input::placeholder': {
    color: '#64748b',
    opacity: 1,
  },
}));

const SubscribeButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
  color: '#ffffff',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  marginTop: theme.spacing(2),
  '&:hover': {
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
  },
}));

const BadgeChip = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.spacing(2),
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  color: '#10b981',
  fontSize: '0.75rem',
  fontWeight: 600,
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useLanguage();

  const quickLinks = [
    { label: t('footer.links.home'), href: '/' },
    { label: t('footer.links.templates'), href: '/templates' },
    { label: t('footer.links.pricing'), href: '/pricing' },
    { label: t('footer.links.examples'), href: '/examples' },
    { label: t('footer.links.blog'), href: '/blog' },
  ];

  const resourceLinks = [
    { label: t('footer.links.cvWritingGuide'), href: '/guides/cv-writing' },
    { label: t('footer.links.coverLetterTips'), href: '/guides/cover-letter' },
    { label: t('footer.links.interviewPrep'), href: '/guides/interview' },
    { label: t('footer.links.careerAdvice'), href: '/blog/career' },
    { label: t('footer.links.faq'), href: '/faq' },
  ];

  const legalLinks = [
    { label: t('footer.links.privacyPolicy'), href: '/privacy' },
    { label: t('footer.links.termsOfService'), href: '/terms' },
    { label: t('footer.links.cookiePolicy'), href: '/cookies' },
    { label: t('footer.links.gdpr'), href: '/gdpr' },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <TwitterIcon />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <LinkedInIcon />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <InstagramIcon />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <YouTubeIcon />, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <FooterWrapper>
      <BackgroundDecoration />
      <BackgroundDecoration2 />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <FooterTop>
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} sm={6} md={4}>
              <LogoWrapper>
                <LogoIcon>
                  <DescriptionIcon />
                </LogoIcon>
                <Typography variant="h5" fontWeight="700" color="#ffffff">
                  CVtify
                </Typography>
              </LogoWrapper>

              <Typography
                variant="body2"
                sx={{ color: '#94a3b8', lineHeight: 1.7, mb: 3, maxWidth: 280 }}
              >
                {t('footer.tagline')}
              </Typography>

              <BadgeChip>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                  }}
                />
                {t('footer.trustedBadge')}
              </BadgeChip>

              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                {socialLinks.map((social, index) => (
                  <SocialButton
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </SocialButton>
                ))}
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} sm={3} md={2}>
              <FooterTitle>{t('footer.quickLinksTitle')}</FooterTitle>
              <Stack spacing={1} sx={{ mt: 4 }}>
                {quickLinks.map((link, index) => (
                  <FooterLink key={index} href={link.href}>
                    <ArrowIcon className="arrow-icon" />
                    {link.label}
                  </FooterLink>
                ))}
              </Stack>
            </Grid>

            {/* Resources */}
            <Grid item xs={6} sm={3} md={2}>
              <FooterTitle>{t('footer.resourcesTitle')}</FooterTitle>
              <Stack spacing={1} sx={{ mt: 4 }}>
                {resourceLinks.map((link, index) => (
                  <FooterLink key={index} href={link.href}>
                    <ArrowIcon className="arrow-icon" />
                    {link.label}
                  </FooterLink>
                ))}
              </Stack>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={4}>
              <FooterTitle>{t('footer.newsletterTitle')}</FooterTitle>
              <NewsletterWrapper sx={{ mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{ color: '#94a3b8', mb: 2, lineHeight: 1.6 }}
                >
                  {t('footer.newsletterText')}
                </Typography>

                <StyledTextField
                  fullWidth
                  placeholder={t('footer.emailPlaceholder')}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ color: '#64748b', mr: 1, fontSize: '1.2rem' }} />
                    ),
                  }}
                />

                <SubscribeButton fullWidth endIcon={<SendIcon />}>
                  {t('footer.subscribe')}
                </SubscribeButton>

                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', display: 'block', mt: 1.5, fontSize: '0.7rem' }}
                >
                  {t('footer.newsletterDisclaimer')}
                </Typography>
              </NewsletterWrapper>
            </Grid>
          </Grid>

          {/* Contact Info Row */}
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <ContactItem>
                  <EmailIcon />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600, mb: 0.5 }}>
                      {t('footer.emailUs')}
                    </Typography>
                    <Link
                      href="mailto:support@cvbuilder.com"
                      sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#000000' } }}
                    >
                      baesara803@gmail.com
                    </Link>
                  </Box>
                </ContactItem>
              </Grid>

              <Grid item xs={12} sm={4}>
                <ContactItem>
                  <PhoneIcon />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600, mb: 0.5 }}>
                      {t('footer.callUs')}
                    </Typography>
                    <Link
                      href="tel:+1234567890"
                      sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#000000' } }}
                    >
                      +237 680 526 194
                    </Link>
                  </Box>
                </ContactItem>
              </Grid>

              <Grid item xs={12} sm={4}>
                <ContactItem>
                  <LocationOnIcon />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600, mb: 0.5 }}>
                      {t('footer.location')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {t('footer.locationValue')}
                    </Typography>
                  </Box>
                </ContactItem>
              </Grid>
            </Grid>
          </Box>
        </FooterTop>

        {/* Footer Bottom */}
        <FooterBottom>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: '0.85rem',
                }}
              >
                © {new Date().getFullYear()} CVtify. {t('footer.rightsReserved')}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                spacing={3}
                justifyContent={{ xs: 'center', md: 'flex-end' }}
                flexWrap="wrap"
                sx={{ gap: { xs: 2, sm: 3 } }}
              >
                {legalLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: '#64748b',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: '#000000',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </FooterBottom>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;