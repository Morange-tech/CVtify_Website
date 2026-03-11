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
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import HomeIcon from '@mui/icons-material/Home';
import CircleIcon from '@mui/icons-material/Circle';

// --- THEME SETUP ---
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700, color: '#333333' }, // Name
    h5: { fontWeight: 300, fontStyle: 'italic', color: '#666666' }, // Job Title
    h6: { fontWeight: 700, letterSpacing: '0.5px' }, // Headers
    body1: { fontSize: '0.9rem', lineHeight: 1.6 },
    body2: { fontSize: '0.85rem', lineHeight: 1.6 },
  },
  palette: {
    primary: { main: '#1a1a1a' }, // Dark Black/Grey for Sidebar
    secondary: { main: '#f2f2f2' }, // Light Grey Background
    text: { primary: '#333333', secondary: '#555555' }
  }
});

// --- HELPER COMPONENTS ---

// 1. The Ribbon Header (Left Sidebar)
// This creates the box that "sticks out" to the right with a shadow fold
const RibbonHeader = ({ title }) => (
  <Box sx={{ position: 'relative', mb: 3, mt: 1 }}>
    {/* Main Bar */}
    <Box sx={{ 
      bgcolor: '#1a1a1a', 
      color: 'white', 
      py: 1.5, 
      pl: 4,
      width: '115%', // Extends beyond the container width
      position: 'relative',
      zIndex: 2,
      boxShadow: '3px 3px 5px rgba(0,0,0,0.3)'
    }}>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
    </Box>
    
    {/* The Triangle Fold Effect (Shadow) */}
    <Box sx={{
      position: 'absolute',
      right: '-15%', // Matches the width extension
      bottom: '-10px', // Height of the fold
      width: 0, 
      height: 0, 
      borderTop: '10px solid black', // Dark shadow color
      borderRight: '15px solid transparent',
      zIndex: 1
    }} />
  </Box>
);

// 2. Right Side Section Header (Dark Bar)
const RightHeader = ({ title }) => (
  <Box sx={{ 
    bgcolor: '#1a1a1a', 
    color: 'white', 
    py: 1, 
    px: 4, 
    mb: 3,
    width: '100%' 
  }}>
    <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
      {title}
    </Typography>
  </Box>
);

// 3. Timeline Item (Education/Work)
const TimelineItem = ({ title, subtitle, date, details, isLast }) => (
  <Box sx={{ 
    display: 'flex', 
    position: 'relative',
    pb: isLast ? 0 : 3 
  }}>
    {/* The Vertical Line */}
    <Box sx={{ 
      position: 'absolute', 
      left: '6px', 
      top: '10px', 
      bottom: 0, 
      width: '2px', 
      bgcolor: '#999',
      display: isLast ? 'none' : 'block'
    }} />

    {/* The Dot */}
    <CircleIcon sx={{ 
      color: '#555', 
      fontSize: 14, 
      position: 'absolute', 
      left: 0, 
      top: '6px',
      zIndex: 2,
      bgcolor: '#f2f2f2', // Mask line behind dot
      borderRadius: '50%'
    }} />

    {/* Content */}
    <Box sx={{ pl: 4 }}>
      {date && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {date}
        </Typography>
      )}
      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ lineHeight: 1.2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
        {subtitle}
      </Typography>
      
      {/* If details is a string, show text. If array, show list */}
      {Array.isArray(details) ? (
        <ul style={{ margin: 0, paddingLeft: '18px', color: '#555', fontSize: '0.85rem' }}>
          {details.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {details}
        </Typography>
      )}
    </Box>
  </Box>
);

const ResumeDesign5 = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');`}
      </style>

      <Box sx={{ bgcolor: '#ccc', minHeight: '100vh', py: 5, display: 'flex', justifyContent: 'center' }}>
        
        {/* Main Paper Container */}
        <Paper elevation={10} sx={{ 
          width: '100%', 
          maxWidth: '900px', 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden'
        }}>

          {/* ================= LEFT SIDEBAR (Dark) ================= */}
          <Box sx={{ 
            width: { xs: '100%', md: '37%' }, 
            bgcolor: '#4d4d4d', // Base Grey
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}>
            
            {/* Top Grey Arch Background for Photo */}
            <Box sx={{ 
              bgcolor: '#999', // Lighter grey top section
              pt: 5,
              pb: 4,
              display: 'flex',
              justifyContent: 'center',
              borderBottomLeftRadius: '0',
              borderBottomRightRadius: '0',
              position: 'relative'
            }}>
               {/* Decorative Circular Arch effect created by the Avatar border/shape */}
               <Box sx={{
                 width: '240px',
                 height: '240px',
                 borderRadius: '50% 50% 0 0', // Arch shape
                 bgcolor: 'white', // The white halo
                 display: 'flex',
                 alignItems: 'flex-end',
                 justifyContent: 'center',
                 overflow: 'hidden',
                 mb: -4 // Push down into the dark section slightly
               }}>
                 <Avatar 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    sx={{ width: 220, height: 220, mb: 0 }}
                 />
               </Box>
            </Box>

            {/* Left Content Area */}
            <Box sx={{ bgcolor: '#444', flexGrow: 1, pb: 5, pt: 5 }}>
              
              {/* ABOUT ME */}
              <RibbonHeader title="About Me" />
              <Box sx={{ px: 4, mb: 4 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  I possess a strong understanding of design principles and user needs, allowing me to craft templates that are both visually appealing and functionally effective.
                </Typography>
              </Box>

              {/* EXPERTISE SKILL */}
              <RibbonHeader title="Expertise Skill" />
              <Box sx={{ px: 4, mb: 4 }}>
                 <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li>Graphic design</li>
                    <li>Computer Programing</li>
                    <li>Content Marketing</li>
                    <li>Digital Marketing</li>
                    <li>Video editing</li>
                 </ul>
              </Box>

              {/* CONTACT ME */}
              <RibbonHeader title="Contact Me" />
              <Box sx={{ px: 4 }}>
                <List dense>
                  <ListItem disablePadding sx={{ mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 35 }}>
                       <PhoneIcon sx={{ color: 'white', fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText primary="+123-456-7890" primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 35 }}>
                       <EmailIcon sx={{ color: 'white', fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText primary="hello@forreal.com" primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 35 }}>
                       <LanguageIcon sx={{ color: 'white', fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText primary="www.forreal.com" primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 35, mt: 0.5 }}>
                       <HomeIcon sx={{ color: 'white', fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText primary="123 Anywhere st., Any City, ST 12345" primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                </List>
              </Box>

            </Box>
          </Box>

          {/* ================= RIGHT COLUMN (Light) ================= */}
          <Box sx={{ 
            width: { xs: '100%', md: '63%' }, 
            bgcolor: '#f2f2f2', 
            pt: 6,
            pb: 6,
            px: 0 
          }}>
            
            {/* NAME HEADER */}
            <Box sx={{ px: 5, mb: 6 }}>
              <Typography variant="h3" sx={{ color: '#444', lineHeight: 1 }}>
                Lily <br/> Chu
              </Typography>
              <Typography variant="h5" sx={{ mt: 1 }}>
                Graphic Designer
              </Typography>
            </Box>

            {/* EDUCATION */}
            <RightHeader title="Education" />
            <Box sx={{ px: 5, mb: 4 }}>
              <TimelineItem 
                date="2015-2017"
                title="School Of Design University"
                details="123 Anywhere st., Any City, ST 12345"
              />
              <TimelineItem 
                date="2017-2019"
                title="School Of Marketing University"
                details="123 Anywhere st., Any City, ST 12345"
                isLast={true}
              />
            </Box>

            {/* WORK EXPERIENCE */}
            <RightHeader title="Work Experience" />
            <Box sx={{ px: 5 }}>
              <TimelineItem 
                title="Senior Graphic Designer"
                subtitle="Larana, Inc | 2019-2020"
                details={[
                  "create more than 100 graphic designs for big companies",
                  "complete a lot of complicated work"
                ]}
              />
              <TimelineItem 
                title="Senior Graphic Designer"
                subtitle="Iliceria & co. | 2020-preset"
                details={[
                  "create more than 100 graphic designs for big companies",
                  "complete a lot of complicated work",
                  "Ensured customer satisfaction by handling day-to-day affairs",
                  "Managing oversees Company digital marketing strategies"
                ]}
                isLast={true}
              />
            </Box>

          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ResumeDesign5;