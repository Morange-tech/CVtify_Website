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

import { makeSectionLayout } from '../../lib/sectionLayout';

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

// 1b. Left (mauve) Sidebar Header — plain white h6, matching what the
// fixed Profile/Contact headers already look like there.
const SidebarHeader = ({ title }) => (
  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
    {title}
  </Typography>
);

// 2. Education/Experience Item
const InfoBlock = ({ title, subtitle, date, description, dark }) => (
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
      <Typography
        variant="body2"
        sx={{ color: dark ? 'rgba(255,255,255,0.75)' : 'text.secondary' }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
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

// Default column ("left" = mauve sidebar, "right" = white content column) per
// section, overridable per-CV via the "Colonne de gauche/droite" section menu.
const DEFAULT_COLUMN = {
  2: 'left',   // Profile / About me
  3: 'right',  // Education
  6: 'right',  // Languages
  5: 'right',  // Skills
  4: 'right',  // Experience
};

const ResumeDesign4 = ({ cvData, sectionTitleOverrides = {}, sectionColumn = {}, sectionPageBreak = {} }) => {
  // Safe defaults
  const personalInfo = cvData?.personalInfo || {};
  const profile = cvData?.profile || '';
  const education = cvData?.education || [];
  const experience = cvData?.experience || [];
  const skills = cvData?.skills || [];
  const languages = cvData?.languages || [];

  const firstName = personalInfo.firstName || 'First';
  const lastName = personalInfo.lastName || 'Name';
  const jobTitle = personalInfo.title || 'Your Job Title';

  const address = [personalInfo.address, personalInfo.city].filter(Boolean).join(', ') || '';

  const stripHtml = (html) => {
    if (!html) return '';
    if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '');
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const profileText = stripHtml(profile);

  const formatDate = (item) => {
    const start = [item.startMonth, item.startYear].filter(Boolean).join('-');
    const end = item.isPresent
      ? 'Present'
      : [item.endMonth, item.endYear].filter(Boolean).join('-');
    return [start, end].filter(Boolean).join(' / ');
  };

  const { getTitle, getColumn, pageBreakStyle } = makeSectionLayout(
    { sectionTitleOverrides, sectionColumn, sectionPageBreak },
    DEFAULT_COLUMN
  );

  // =============================================
  // SECTION RENDERERS — each returns a node (or null) for either column.
  // `dark` is true when the section is placed in the mauve left sidebar.
  // =============================================
  const renderProfile = (dark) => {
    if (!profileText) return null;
    const Header = dark ? SidebarHeader : SectionHeader;
    return (
      <Box key="profile" sx={{ width: '100%', mb: dark ? 6 : 4, ...pageBreakStyle(2) }}>
        <Header title={getTitle(2, "Profile")} />
        <Typography variant="body2" sx={{ color: dark ? 'rgba(255,255,255,0.9)' : 'text.secondary' }}>
          {profileText}
        </Typography>
      </Box>
    );
  };

  const renderEducation = (dark) => {
    if (!education.length) return null;
    const Header = dark ? SidebarHeader : SectionHeader;
    return (
      <Box key="education" sx={{ width: '100%', mb: dark ? 6 : 4, ...pageBreakStyle(3) }}>
        <Header title={getTitle(3, "Education")} />
        {education.map((edu, index) => (
          <InfoBlock
            key={edu.id || index}
            title={edu.school || 'School Name'}
            subtitle={edu.education || ''}
            date={formatDate(edu)}
            description={edu.description}
            dark={dark}
          />
        ))}
      </Box>
    );
  };

  const renderLanguages = (dark) => {
    if (!languages.length) return null;
    const Header = dark ? SidebarHeader : SectionHeader;
    return (
      <Box key="languages" sx={{ width: '100%', mb: dark ? 6 : 4, ...pageBreakStyle(6) }}>
        <Header title={getTitle(6, "Languages")} />
        {languages.map((lang, index) => (
          <Typography
            key={lang.id || index}
            variant="body2"
            sx={{ mb: 1, color: dark ? 'rgba(255,255,255,0.9)' : 'text.secondary' }}
          >
            {lang.language || 'Language'}
          </Typography>
        ))}
      </Box>
    );
  };

  const renderSkills = (dark) => {
    if (!skills.length) return null;
    const Header = dark ? SidebarHeader : SectionHeader;
    return (
      <Box key="skills" sx={{ width: '100%', mb: dark ? 6 : 4, ...pageBreakStyle(5) }}>
        <Header title={getTitle(5, "Skills")} />
        <List dense disablePadding>
          {skills.map((skill, index) => (
            <ListItem key={skill.id || index} sx={{ p: 0, pb: 0.5 }}>
              <Typography variant="body2" sx={{ color: dark ? 'rgba(255,255,255,0.9)' : 'text.secondary' }}>
                {skill.skill || 'Skill'}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const renderExperience = (dark) => {
    if (!experience.length) return null;
    const Header = dark ? SidebarHeader : SectionHeader;
    return (
      <Box key="experience" sx={{ width: '100%', mb: dark ? 6 : 4, ...pageBreakStyle(4) }}>
        <Header title={getTitle(4, "Experience")} />
        {experience.map((exp, index) => (
          <InfoBlock
            key={exp.id || index}
            title={exp.position || 'Position'}
            subtitle={[exp.employer, exp.city].filter(Boolean).join(' / ')}
            date={formatDate(exp)}
            description={exp.description}
            dark={dark}
          />
        ))}
      </Box>
    );
  };

  const SECTION_ORDER = [
    { id: 2, render: renderProfile },
    { id: 3, render: renderEducation },
    { id: 6, render: renderLanguages },
    { id: 5, render: renderSkills },
    { id: 4, render: renderExperience },
  ];

  const leftSections = [];
  const rightSections = [];
  SECTION_ORDER.forEach(({ id, render }) => {
    const dark = getColumn(id) === 'left';
    const node = render(dark);
    if (!node) return;
    (dark ? leftSections : rightSections).push(node);
  });

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
              {personalInfo.profileImage ? (
                <Avatar
                  src={personalInfo.profileImage}
                  sx={{
                    width: 200,
                    height: 200,
                    border: '5px solid white'
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    border: '5px solid white',
                    bgcolor: '#8a767a',
                    fontSize: '3.5rem',
                    fontWeight: 800,
                  }}
                >
                  {`${(personalInfo.firstName || '')[0] || ''}${(personalInfo.lastName || '')[0] || ''}`}
                </Avatar>
              )}
            </Box>

            {leftSections}

            {/* Contact Section */}
            {(personalInfo.phoneNumber || personalInfo.email || address) && (
              <Box sx={{ width: '100%' }}>
                <SidebarHeader title="Contact Me" />
                <List>
                  {personalInfo.phoneNumber && (
                    <ContactItem icon={<PhoneIcon />} text={personalInfo.phoneNumber} />
                  )}
                  {personalInfo.email && (
                    <ContactItem icon={<EmailIcon />} text={personalInfo.email} />
                  )}
                  {address && (
                    <ContactItem icon={<LocationOnIcon />} text={address} />
                  )}
                </List>
              </Box>
            )}

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
                {firstName.toUpperCase()} <br/> {lastName.toUpperCase()}
              </Typography>
              <Typography variant="h2" sx={{ mt: 1 }}>
                {jobTitle}
              </Typography>
            </Box>

            {/* --- BOTTOM CONTENT (White) --- */}
            <Box sx={{ p: 6, pt: 5, flexGrow: 1, bgcolor: 'white' }}>

              {rightSections}

            </Box>

          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ResumeDesign4;