import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Divider,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';

// Import Icons
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed'; // For Skills
import PublicIcon from '@mui/icons-material/Public'; // For Languages
import FlagIcon from '@mui/icons-material/Flag'; // For Hobbies
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// --- THEME SETUP ---
// Using Montserrat font to match the clean, sans-serif look of the image
const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }, // Name
    h6: { fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '1rem' }, // Section Headers
    subtitle1: { fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }, // Job Titles
    subtitle2: { fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }, // Sub-headers
    body1: { fontSize: '0.85rem', lineHeight: 1.6 },
    body2: { fontSize: '0.75rem', lineHeight: 1.6 },
  },
  palette: {
    background: {
      default: '#e0e0e0', // Outer background
    },
    primary: {
      main: '#282828', // Dark Grey/Black used in left sidebar
    },
    secondary: {
      main: '#f2f2f2', // Light Grey used in middle of left sidebar
    },
    text: {
      primary: '#333333',
      secondary: '#777777',
    }
  }
});

// --- HELPER COMPONENTS ---

// 1. Right Side Section Header (Icon + Title)
const SectionHeader = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box 
      sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        borderRadius: '50%', 
        p: 0.5, 
        mr: 2, 
        display: 'flex' 
      }}
    >
      {React.cloneElement(icon, { fontSize: 'small' })}
    </Box>
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
  </Box>
);

// 2. Left Side Section Header (Icon + Title - White Text)
const DarkSectionHeader = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
    <Box 
      sx={{ 
        bgcolor: 'white', 
        color: 'primary.main', 
        borderRadius: '50%', 
        p: 0.5, 
        mr: 2, 
        display: 'flex' 
      }}
    >
      {React.cloneElement(icon, { fontSize: 'small' })}
    </Box>
    <Typography variant="h6" color="white">
      {title}
    </Typography>
  </Box>
);

// 3. Skill Bar Component
const SkillBar = ({ skill, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
    <Typography variant="body2" sx={{ width: '120px', fontWeight: 'bold' }}>
      {skill}
    </Typography>
    <LinearProgress 
      variant="determinate" 
      value={value} 
      sx={{ 
        flexGrow: 1, 
        height: 6, 
        bgcolor: '#e0e0e0',
        '& .MuiLinearProgress-bar': {
          bgcolor: 'primary.main' 
        }
      }} 
    />
  </Box>
);

const ResumeTemplate2 = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Import Font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&display=swap');`}
      </style>

      <Box sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
        
        {/* Main Paper A4 Container */}
        <Paper 
          elevation={5} 
          sx={{ 
            width: '100%', 
            maxWidth: '900px', 
            minHeight: '1100px',
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            overflow: 'hidden' 
          }}
        >
          
          {/* ================= LEFT SIDEBAR ================= */}
          <Box sx={{ 
            width: { xs: '100%', md: '36%' }, 
            bgcolor: 'secondary.main', // Light Grey Background for the middle part
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>

            {/* --- TOP DARK SECTION (Rounded Bottom) --- */}
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              pt: 6, 
              pb: 25, // Extra padding at bottom to allow avatar overlap
              px: 3,
              textAlign: 'center',
              borderBottomLeftRadius: '70% 70%', // Creates the curve
              borderBottomRightRadius: '70% 70%',
            }}>
              <Typography variant="h3" sx={{ fontSize: '1.5rem', mb: 0.5 }}>NOEL TAYLOR</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, letterSpacing: '1px' }}>
                GRAPHIC & WEB DESIGNER
              </Typography>
            </Box>

            {/* --- AVATAR (Overlapping) --- */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: -23, mb: 4, zIndex: 2 }}>
              <Avatar 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                sx={{ 
                  width: 170, 
                  height: 170, 
                  border: '8px solid #f2f2f2' // Matches the background color
                }} 
              />
            </Box>

            {/* --- CONTACT ME SECTION (Light Background) --- */}
            <Box sx={{ px: 4, pb: 4, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                 <AccountCircleIcon sx={{ mr: 1 }} />
                 <Typography variant="h6" color="text.primary">CONTACT ME</Typography>
              </Box>

              <List>
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 35 }}>
                    <PhoneIcon fontSize="small" />
                  </ListItemIcon>
                  <Box>
                     <Typography variant="body2">+1-718-310-5588</Typography>
                  </Box>
                </ListItem>
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 35 }}>
                    <LanguageIcon fontSize="small" />
                  </ListItemIcon>
                  <Box>
                     <Typography variant="body2">www.yourwebsite.com</Typography>
                  </Box>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 35 }}>
                    <LocationOnIcon fontSize="small" />
                  </ListItemIcon>
                  <Box>
                     <Typography variant="body2">769 Prudence Lincoln Park, MI</Typography>
                  </Box>
                </ListItem>
              </List>
            </Box>

            {/* --- BOTTOM DARK SECTION (Rounded Top) --- */}
            <Box sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              flexGrow: 1, 
              pt: 6, 
              px: 4, 
              pb: 6,
              borderTopLeftRadius: '60px', 
              borderTopRightRadius: '60px',
              mt: 2
            }}>
              
              {/* EDUCATION */}
              <DarkSectionHeader icon={<SchoolIcon />} title="Education" />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'white' }}>STANFORD UNIVERSITY</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>MASTER DEGREE GRADUATE</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>2011 - 2013</Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ color: 'white' }}>UNIVERSITY OF CHICAGO</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>BACHELOR DEGREE GRADUATE</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>2007 - 2010</Typography>
              </Box>

              {/* REFERENCES */}
              <DarkSectionHeader icon={<GroupIcon />} title="References" />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'white' }}>DARWIN B. MAGANA</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>2813 Shobe Lane Mancos. CO.</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>Tel: +1-970-533-3393</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>Email: www.yourwebsite.com</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white' }}>ROBERT J. BELVIN</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>2119 Fairfax Drive Newark, NJ.</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>Tel: +1-908-987-5103</Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>Email: www.yourwebsite.com</Typography>
              </Box>

            </Box>

          </Box>

          {/* ================= RIGHT CONTENT ================= */}
          <Box sx={{ 
            width: { xs: '100%', md: '64%' }, 
            bgcolor: 'white', 
            p: 6 
          }}>

            {/* ABOUT ME */}
            <Box sx={{ mb: 5 }}>
              <SectionHeader icon={<PersonIcon />} title="ABOUT ME" />
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'justify' }}>
                Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </Typography>
            </Box>

            {/* JOB EXPERIENCE */}
            <Box sx={{ mb: 5 }}>
              <SectionHeader icon={<WorkIcon />} title="JOB EXPERIENCE" />

              {/* Job 1 */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1">SENIOR WEB DESIGNER</Typography>
                  <Typography variant="body2" fontWeight="bold">2020 - Present</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>Creative Agency / Chicago</Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem Ipsum has been the industry's standard dummy text ever since 1500s, when an unknown printer took a galley of type.
                </Typography>
              </Box>

              {/* Job 2 */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1">GRAPHIC DESIGNER</Typography>
                  <Typography variant="body2" fontWeight="bold">2015 - 2020</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>Creative Market / Chicago</Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem Ipsum has been the industry's standard dummy text ever since 1500s, when an unknown printer took a galley of type.
                </Typography>
              </Box>

              {/* Job 3 */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1">MARKETING MANAGER</Typography>
                  <Typography variant="body2" fontWeight="bold">2013 - 2015</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>Manufacturing Agency / NJ</Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem Ipsum has been the industry's standard dummy text ever since 1500s, when an unknown printer took a galley of type.
                </Typography>
              </Box>
            </Box>

            {/* SKILLS */}
            <Box sx={{ mb: 5 }}>
              <SectionHeader icon={<SpeedIcon />} title="SKILLS" />
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <SkillBar skill="Adobe Photoshop" value={90} />
                  <SkillBar skill="Microsoft Word" value={85} />
                  <SkillBar skill="HTML-5/CSS-3" value={95} />
                </Grid>
                <Grid item xs={6}>
                  <SkillBar skill="Adobe Illustrator" value={80} />
                  <SkillBar skill="Microsoft Powerpoint" value={75} />
                </Grid>
              </Grid>
            </Box>

            {/* LANGUAGE & HOBBIES GRID */}
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <SectionHeader icon={<PublicIcon />} title="LANGUAGE" />
                <Grid container>
                  <Grid item xs={6}>
                    <List dense disablePadding>
                      <ListItem sx={{ p:0, pb:1 }}><ListItemText primary="• ENGLISH" primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold'}} /></ListItem>
                      <ListItem sx={{ p:0, pb:1 }}><ListItemText primary="• FRENCH" primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold'}} /></ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={6} ml={3}>
                    <List dense disablePadding>
                      <ListItem sx={{ p:0, pb:1 }}><ListItemText primary="• SPANISH" primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold'}} /></ListItem>
                      <ListItem sx={{ p:0, pb:1 }}><ListItemText primary="• GERMAN" primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold'}} /></ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6} ml={3}>
                <SectionHeader icon={<FlagIcon />} title="HOBBIES" />
                <List dense disablePadding>
                  <ListItem sx={{ p:0, pb:1 }}><ListItemText primary="• READING BOOKS" primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold'}} /></ListItem>
                  <ListItem sx={{ p:0, pb:1 }}><ListItemText primary="• TRAVELING" primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold'}} /></ListItem>
                  <ListItem sx={{ p:0, pb:1 }}><ListItemText primary="• PLAYING CHESS" primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold'}} /></ListItem>
                </List>
              </Grid>
            </Grid>

          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ResumeTemplate2;