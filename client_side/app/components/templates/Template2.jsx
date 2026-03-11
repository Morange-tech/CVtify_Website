import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  LinearProgress, 
  List, 
  ListItem, 
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';

// --- THEME CONFIGURATION ---
const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Arial", sans-serif',
    h1: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 },
    h2: { fontWeight: 300, textTransform: 'uppercase', letterSpacing: 5 }, // Thin last name
    h6: { fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem' },
    subtitle1: { fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' },
    subtitle2: { fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' },
    body1: { fontSize: '0.85rem', lineHeight: 1.8 },
    body2: { fontSize: '0.75rem', lineHeight: 1.6 },
  },
  palette: {
    background: { default: '#f0f0f0' },
    primary: { main: '#fdc601' }, // The specific Yellow from the image
    secondary: { main: '#1c1c1c' }, // The specific Black/Dark Grey
    text: { primary: '#1c1c1c', secondary: '#555555' }
  }
});

// --- HELPER COMPONENTS ---

// 1. Yellow Pill Header (Used for section titles like ABOUT ME, EDUCATION)
const SectionPill = ({ title, dark = false }) => (
  <Box sx={{ 
    bgcolor: 'primary.main', 
    py: 0.5, 
    px: 3, 
    borderRadius: '20px', 
    display: 'inline-block',
    mb: 2
  }}>
    <Typography variant="subtitle2" sx={{ color: '#1c1c1c', fontWeight: 800 }}>
      {title}
    </Typography>
  </Box>
);

// 2. Skill Bar
const SkillBar = ({ skill, value }) => (
  <Box sx={{ mb: 1, pr: 4 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="body2" fontWeight="bold">{skill}</Typography>
    </Box>
    <LinearProgress 
      variant="determinate" 
      value={value} 
      sx={{ 
        height: 5, 
        bgcolor: '#e0e0e0', // Light grey track
        '& .MuiLinearProgress-bar': {
          bgcolor: '#1c1c1c' // Dark bar matches text
        }
      }} 
    />
  </Box>
);

// 3. Contact Item (Yellow Tab Style)
const ContactItem = ({ label, value }) => (
  <Box sx={{ mb: 3 }}>
    {/* Yellow Tab */}
    <Box sx={{ 
      bgcolor: 'primary.main', 
      py: 0.5, 
      px: 2, 
      borderRadius: '0 15px 15px 0', 
      display: 'inline-block',
      mb: 0.5,
      minWidth: '100px'
    }}>
      <Typography variant="body2" sx={{ fontWeight: 800, color: '#1c1c1c' }}>
        {label}
      </Typography>
    </Box>
    {/* Value */}
    <Typography variant="body2" sx={{ color: 'white', pl: 2, opacity: 0.9 }}>
      {value}
    </Typography>
  </Box>
);

const ResumeDesign3 = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;800&display=swap');`}
      </style>

      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        
        {/* A4 PAPER */}
        <Paper elevation={10} sx={{ 
          width: '100%', 
          maxWidth: '900px', 
          minHeight: '1200px', 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden'
        }}>

          {/* ================= LEFT COLUMN (Dark) ================= */}
          <Grid container direction="column" sx={{ width: { xs: '100%', md: '35%' }, bgcolor: 'secondary.main', position: 'relative' }}>
            
            {/* 1. PHOTO SECTION */}
            <Box sx={{ height: '320px', position: 'relative', bgcolor: 'white' }}>
               {/* Actual Image */}
               <Box 
                 component="img"
                 src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
                 sx={{ 
                   width: '100%', 
                   height: '100%', 
                   objectFit: 'cover',
                   // This is technically a rectangle in the image, the curve comes from the section below
                 }}
               />
            </Box>

            {/* 2. CURVE CONNECTOR (The Magic Part) */}
            {/* We create a white box to push content down, but the black sidebar curves UP into it */}
            <Box sx={{ position: 'relative', flexGrow: 1, bgcolor: 'secondary.main' }}>
              
              {/* This Box creates the White Negative Space Curve */}
              <Box sx={{ 
                height: '80px', 
                bgcolor: 'white', 
                borderBottomLeftRadius: '0px', 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1
              }} />

              {/* This Box creates the rounded top of the dark sidebar */}
              <Box sx={{ 
                height: '80px', 
                bgcolor: 'secondary.main', 
                borderTopRightRadius: '80px', // The Curve
                position: 'absolute',
                top: 0, // Moves it up to overlap the white
                left: 0,
                right: 0,
                zIndex: 2
              }} />

              {/* LEFT COLUMN CONTENT */}
              <Box sx={{ position: 'relative', zIndex: 3, pt: 10, px: 0 }}>
                
                {/* EDUCATION */}
                <Box sx={{ px: 4, mb: 5 }}>
                  <SectionPill title="EDUCATION" />
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight="bold" color="white">ENTER YOUR MAJOR</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Name of Your University</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">2013-2017</Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight="bold" color="white">ENTER YOUR MAJOR</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Name of Your University</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">2017-2019</Typography>
                  </Box>
                </Box>

                {/* REFERENCE */}
                <Box sx={{ px: 4, mb: 5 }}>
                  <SectionPill title="REFERENCE" />
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" fontWeight="bold" color="white">Lorem Ipsum</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Director | Company Name</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">T: +1 234 56789</Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight="bold" color="white">Lorem Ipsum</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">Sr. Graphic Designer | Co.</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">T: +1 234 56789</Typography>
                  </Box>
                </Box>

                {/* CONTACT (Yellow Tabs) */}
                <Box sx={{ mb: 4 }}>
                   <ContactItem label="Phone" value="+000 123 456 789" />
                   <ContactItem label="Email" value="yourname@gmail.com" />
                   <ContactItem label="Website" value="yourwebsite.com" />
                   <ContactItem label="Address" value="Your street address, Your City, Zip Code" />
                </Box>

              </Box>
            </Box>
          </Grid>


          {/* ================= RIGHT COLUMN (White) ================= */}
          <Box sx={{ width: { xs: '100%', md: '65%' }, bgcolor: 'white', position: 'relative' }}>
            
            {/* YELLOW DECORATION BLOCK (Top) */}
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 40, 
              width: '100px', 
              height: '180px', 
              bgcolor: 'primary.main',
              zIndex: 0
            }} />

            <Box sx={{ p: 5, position: 'relative', zIndex: 1 }}>
              
              {/* HEADER */}
              <Box sx={{ mt: 8, mb: 6 }}>
                <Typography variant="h1" sx={{ fontSize: '3.5rem', lineHeight: 0.9 }}>
                  MATHEW
                </Typography>
                <Typography variant="h2" sx={{ fontSize: '2.5rem', fontWeight: 300 }}>
                  PARKER
                </Typography>
                <Typography variant="subtitle2" sx={{ letterSpacing: 3, mt: 1, color: 'text.secondary' }}>
                  GRAPHIC DESIGNER
                </Typography>
              </Box>

              {/* ABOUT ME */}
              <Box sx={{ mb: 5 }}>
                <SectionPill title="ABOUT ME" />
                <Typography variant="body1" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
                </Typography>
              </Box>

              {/* WORK EXPERIENCE */}
              <Box sx={{ mb: 5 }}>
                <SectionPill title="WORK EXPERIENCE" />
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={3}>
                    <Typography variant="body2" fontWeight="bold">2019 - 2022</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>JOB POSITION HERE</Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>Company Name / California USA</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lorem ipsum is simply dummy text of the printing and typesetting industry.
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={3}>
                    <Typography variant="body2" fontWeight="bold">2022 - 2024</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>JOB POSITION HERE</Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>Company Name / California USA</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lorem ipsum is simply dummy text of the printing and typesetting industry.
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="body2" fontWeight="bold">2024 - Present</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>JOB POSITION HERE</Typography>
                    <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>Company Name / California USA</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lorem ipsum is simply dummy text of the printing and typesetting industry.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* SOFTWARE SKILL */}
              <Box>
                <SectionPill title="SOFTWARE SKILL" />
                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <SkillBar skill="Adobe Photoshop" value={90} />
                    <SkillBar skill="Adobe Illustrator" value={80} />
                    <SkillBar skill="Adobe Indesign" value={70} />
                  </Grid>
                  <Grid item xs={6}>
                    <SkillBar skill="Adobe After Effects" value={75} />
                    <SkillBar skill="Adobe Premiere Pro" value={85} />
                  </Grid>
                </Grid>
              </Box>

            </Box>
          </Box>

        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ResumeDesign3;