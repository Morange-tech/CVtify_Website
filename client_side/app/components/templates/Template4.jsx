import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Avatar, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import SquareIcon from '@mui/icons-material/Square';

// 1. Setup Theme with Custom Font (Montserrat/Poppins look)
const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 }, // Name
    h6: { fontWeight: 700, letterSpacing: '0.5px' }, // Section Headers
    subtitle1: { fontWeight: 700, fontSize: '1rem' }, // Job Titles
    subtitle2: { fontWeight: 700, fontSize: '0.9rem' }, // Contact Labels
    body1: { fontSize: '0.9rem', lineHeight: 1.6 },
    body2: { fontSize: '0.85rem' },
  },
  palette: {
    primary: {
      main: '#0B3064', // Exact Deep Blue from image
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    }
  }
});

// Helper for Right Side Section Headers (Blue Bar)
const SectionHeader = ({ title }) => (
  <Box sx={{ 
    bgcolor: 'primary.main', 
    color: 'white', 
    py: 1, 
    px: 4, 
    mb: 2,
    width: '100%' 
  }}>
    <Typography variant="h6" sx={{ textTransform: 'uppercase', fontSize: '1.1rem' }}>
      {title}
    </Typography>
  </Box>
);

// Helper for Bullet Points (Blue Square)
const BulletItem = ({ title, subtitle }) => (
  <ListItem alignItems="flex-start" sx={{ p: 0, mb: 2 }}>
    <ListItemIcon sx={{ minWidth: '24px', mt: 0.8 }}>
      <SquareIcon sx={{ fontSize: 10, color: 'primary.main' }} />
    </ListItemIcon>
    <ListItemText
      primary={
        <Typography variant="subtitle1" color="text.primary">
          {title}
        </Typography>
      }
      secondary={
        subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )
      }
      sx={{ m: 0 }}
    />
  </ListItem>
);

const ResumeDesign = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Import Font Manually for this example */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');`}
      </style>

      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', py: 5 }}>
        
        {/* A4 Paper Container */}
        <Paper elevation={3} sx={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          
          {/* ================= LEFT COLUMN (Blue) ================= */}
          <Box sx={{ 
            width: { xs: '100%', md: '38%' }, 
            bgcolor: '#0B3064', 
            color: 'white',
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            
            {/* Profile Image */}
            <Avatar 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" 
              sx={{ width: 180, height: 180, mb: 4, border: '4px solid rgba(255,255,255,0.2)' }}
            />

            {/* Name */}
            <Typography variant="h4" fontWeight="700" sx={{ mb: 6, lineHeight: 1.2 }}>
              Juliana Silva
            </Typography>

            {/* Left Content Container (Left Aligned Text) */}
            <Box sx={{ width: '100%', textAlign: 'left' }}>
              
              {/* About Me */}
              <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: 1, display: 'inline-block' }}>
                About Me
              </Typography>
              <Typography variant="body2" sx={{ mb: 5, opacity: 0.9, lineHeight: 1.7 }}>
                Juliana Silva, the owner of Callia Media, is an experienced, highly qualified marketer, and this fact is clearly stated on her website's page.
              </Typography>

              {/* Contact */}
              <Typography variant="h6" sx={{ mb: 3, borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: 1, display: 'inline-block' }}>
                Contact
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2">Phone Number</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>+123-456-7890</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2">E-mail Address</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>hello@reallygreatsite.com</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2">Social Media</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>@reallygreatsite</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2">Website</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>www.reallygreatsite.com</Typography>
              </Box>
            </Box>

          </Box>

          {/* ================= RIGHT COLUMN (White) ================= */}
          <Box sx={{ 
            width: { xs: '100%', md: '62%' }, 
            bgcolor: 'white', 
            p: 6 
          }}>

            {/* Skills */}
            <Box sx={{ mb: 5 }}>
              <SectionHeader title="Skills" />
              <List sx={{ pl: 1 }}>
                {['Copywriting', 'Digital Marketing', 'Graphic Design', 'Sales Promotion'].map((skill) => (
                  <ListItem key={skill} sx={{ p: 0, mb: 1.5, alignItems: 'center' }}>
                    <ListItemIcon sx={{ minWidth: '24px' }}>
                      <SquareIcon sx={{ fontSize: 10, color: 'primary.main' }} />
                    </ListItemIcon>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.95rem' }}>{skill}</Typography>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Experience */}
            <Box sx={{ mb: 5 }}>
              <SectionHeader title="Experience" />
              <List sx={{ pl: 1 }}>
                <BulletItem 
                  title="Supervisor" 
                  subtitle="2022 - 2024 | Borcelle" 
                />
                <BulletItem 
                  title="Administrator" 
                  subtitle="2024 - 2025 | Larana, Inc." 
                />
                <BulletItem 
                  title="Designer" 
                  subtitle="2025 - 2027 | Liceria & Co." 
                />
              </List>
            </Box>

            {/* Educational */}
            <Box>
              <SectionHeader title="Educational" />
              <List sx={{ pl: 1 }}>
                <BulletItem 
                  title="Fauget University" 
                  subtitle="Fresh Graduate | 2022" 
                />
              </List>
              <Typography variant="body2" color="text.secondary" sx={{ pl: 4, mt: -1, lineHeight: 1.6 }}>
                Thesis involved studying several companies and optimizing their product process.
              </Typography>
            </Box>

          </Box>

        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ResumeDesign;