import React from 'react';
import { 
  Box, 
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

// Icons
import PhoneIcon from '@mui/icons-material/Phone'; // Using simple icons to match
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // For section arrows

// --- THEME & FONTS ---
const theme = createTheme({
  typography: {
    fontFamily: '"Lora", "Times New Roman", serif', // Main Serif font
    h1: { 
      fontFamily: '"Montserrat", sans-serif', 
      fontWeight: 700, 
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontSize: '3rem',
      color: '#1a1a1a'
    },
    h2: {
      fontFamily: '"Lora", serif',
      fontStyle: 'italic',
      fontSize: '1.8rem',
      color: '#1a1a1a',
      fontWeight: 400
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontSize: '0.9rem',
    },
    body1: {
      fontFamily: '"Lora", serif',
      fontSize: '0.95rem',
      lineHeight: 1.6
    },
    body2: {
      fontFamily: '"Lora", serif',
      fontSize: '0.9rem',
      lineHeight: 1.6
    }
  },
  palette: {
    primary: {
      main: '#A59094', // Darker Mauve (Left Sidebar)
    },
    secondary: {
      main: '#E6D8DB', // Lighter Mauve (Top Right Header)
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
      light: '#ffffff'
    }
  }
});

// --- HELPER COMPONENTS ---

// 1. Right Side Section Header (Chevron + Title)
const SectionHeader = ({ title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
    <ChevronRightIcon sx={{ color: '#d3c4c7', fontSize: 30, mr: 1, fontWeight: 'bold' }} />
    <Typography variant="h6" sx={{ color: '#1a1a1a' }}>
      {title}
    </Typography>
  </Box>
);

// 2. Education/Experience Item
const InfoBlock = ({ title, subtitle, date, description }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="body1" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 0.5 }}>
        {subtitle}
      </Typography>
    )}
    {date && (
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {date}
      </Typography>
    )}
    {description && (
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    )}
  </Box>
);

// 3. Contact Item
const ContactItem = ({ icon, text }) => (
  <ListItem sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
    <ListItemIcon sx={{ minWidth: 35, mt: 0.5 }}>
      {React.cloneElement(icon, { sx: { color: 'white', fontSize: 20 } })}
    </ListItemIcon>
    <ListItemText 
      primary={
        <Typography variant="body2" sx={{ color: 'white', lineHeight: 1.4 }}>
          {text}
        </Typography>
      } 
    />
  </ListItem>
);

const ResumeDesign4 = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@500;700&display=swap');`}
      </style>

      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 5, display: 'flex', justifyContent: 'center' }}>
        
        {/* A4 Paper Container */}
        <Paper elevation={4} sx={{ 
          width: '100%', 
          maxWidth: '900px', 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: '1100px'
        }}>

          {/* ================= LEFT SIDEBAR (Dark Mauve) ================= */}
          <Box sx={{ 
            width: { xs: '100%', md: '38%' }, 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4
          }}>
            
            {/* Avatar */}
            <Box sx={{ mt: 4, mb: 6 }}>
              <Avatar
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
                sx={{ 
                  width: 200, 
                  height: 200, 
                  border: '5px solid white' 
                }}
              />
            </Box>

            {/* Profile Section */}
            <Box sx={{ width: '100%', mb: 6 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Profile
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                Business Administration student.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                I consider my self a responsible and orderly person.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                I am looking foward for my first work experience.
              </Typography>
            </Box>

            {/* Contact Section */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Contact Me
              </Typography>
              <List>
                <ContactItem icon={<PhoneIcon />} text="123-456-7890" />
                <ContactItem icon={<EmailIcon />} text="hello@reallygreatsite.com" />
                <ContactItem icon={<LocationOnIcon />} text="123 Anywhere St., Any City, ST 12345" />
              </List>
            </Box>

          </Box>

          {/* ================= RIGHT COLUMN ================= */}
          <Box sx={{ width: { xs: '100%', md: '62%' }, display: 'flex', flexDirection: 'column' }}>
            
            {/* --- TOP HEADER (Light Mauve) --- */}
            <Box sx={{ 
              height: '280px', // Roughly matches the visual height of avatar area
              bgcolor: 'secondary.main', 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pl: 6,
              pr: 2
            }}>
              <Typography variant="h1" sx={{ lineHeight: 1 }}>
                DONNA <br/> STROUPE
              </Typography>
              <Typography variant="h2" sx={{ mt: 1 }}>
                Student
              </Typography>
            </Box>

            {/* --- BOTTOM CONTENT (White) --- */}
            <Box sx={{ p: 6, pt: 5, flexGrow: 1, bgcolor: 'white' }}>
              
              {/* EDUCATION */}
              <Box sx={{ mb: 4 }}>
                <SectionHeader title="Education" />
                
                <InfoBlock 
                  title="Borcelle University"
                  description="Business Administration career, in progress."
                />
                
                <InfoBlock 
                  title="Fauget College"
                  date="2018-2022"
                />
              </Box>

              {/* LANGUAGE */}
              <Box sx={{ mb: 4 }}>
                <SectionHeader title="Language" />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Native English.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Advanced spanish.
                </Typography>
              </Box>

              {/* COMPUTER SKILLS */}
              <Box sx={{ mb: 4 }}>
                <SectionHeader title="Computer Skills" />
                <List dense disablePadding>
                  {['Text processor.', 'Spreadsheet.', 'Slide presentation.'].map((skill) => (
                     <ListItem key={skill} sx={{ p: 0, pb: 0.5 }}>
                       <Typography variant="body2" color="text.secondary">{skill}</Typography>
                     </ListItem>
                  ))}
                </List>
              </Box>

              {/* VOLUNTEER EXPERIENCE */}
              <Box>
                <SectionHeader title="Volunteer Experience" />
                <InfoBlock 
                  title="Ingoude Company"
                  description="Participation in collections to distribute in low-income schools."
                />
              </Box>

            </Box>

          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ResumeDesign4;