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

import { makeSectionLayout } from '../../lib/sectionLayout';

const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 },
    h6: { fontWeight: 700, letterSpacing: '0.5px' },
    subtitle1: { fontWeight: 700, fontSize: '1rem' },
    subtitle2: { fontWeight: 700, fontSize: '0.9rem' },
    body1: { fontSize: '0.9rem', lineHeight: 1.6 },
    body2: { fontSize: '0.85rem' },
  },
  palette: {
    primary: { main: '#0B3064' },
    text: { primary: '#333333', secondary: '#666666' },
  },
});

// --- HELPER COMPONENTS ---

const SectionHeader = ({ title }) => (
  <Box sx={{
    bgcolor: 'primary.main',
    color: 'white',
    py: 1,
    px: 4,
    mb: 2,
    width: '100%',
  }}>
    <Typography variant="h6" sx={{ textTransform: 'uppercase', fontSize: '1.1rem' }}>
      {title}
    </Typography>
  </Box>
);

const BulletItem = ({ title, subtitle, description, dark }) => (
  <ListItem alignItems="flex-start" sx={{ p: 0, mb: 2 }}>
    <ListItemIcon sx={{ minWidth: '24px', mt: 0.8 }}>
      <SquareIcon sx={{ fontSize: 10, color: dark ? 'white' : 'primary.main' }} />
    </ListItemIcon>
    <Box sx={{ m: 0 }}>
      <Typography variant="subtitle1" sx={{ color: dark ? 'white' : 'text.primary' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ mt: 0.5, color: dark ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}
      {description && (
        <Box
          sx={{
            mt: 0.5,
            fontSize: '0.85rem',
            color: dark ? 'rgba(255,255,255,0.8)' : 'text.secondary',
            '& p': { margin: 0 },
            '& ul, & ol': { margin: 0, paddingLeft: '1.2rem' },
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </Box>
  </ListItem>
);

// Header used for a section when it's in the blue left column — mirrors the
// underline style the fixed "Contact" block already uses there.
const UnderlineHeader = ({ title }) => (
  <Typography variant="h6" sx={{
    mb: 2,
    borderBottom: '2px solid rgba(255,255,255,0.2)',
    paddingBottom: 1,
    display: 'inline-block',
  }}>
    {title}
  </Typography>
);

// Default column ("left" = blue sidebar, "right" = white content column) per
// section, overridable per-CV via the "Colonne de gauche/droite" section menu.
const DEFAULT_COLUMN = {
  2: 'left',   // Profile / About me
  6: 'left',   // Languages
  7: 'left',   // Interests
  5: 'right',  // Skills
  4: 'right',  // Experience
  3: 'right',  // Education
};

// =============================================
// MAIN TEMPLATE - NOW ACCEPTS cvData
// =============================================
const ResumeDesign = ({ cvData, sectionTitleOverrides = {}, sectionColumn = {}, sectionPageBreak = {} }) => {

  // Safe defaults
  const personalInfo = cvData?.personalInfo || {};
  const profile = cvData?.profile || '';
  const education = cvData?.education || [];
  const experience = cvData?.experience || [];
  const skills = cvData?.skills || [];
  const languages = cvData?.languages || [];
  const interests = cvData?.interests || [];

  // Full name
  const fullName =
    `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() ||
    'Your Name';

  // Strip HTML from profile
  const stripHtml = (html) => {
    if (!html) return '';
    if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '');
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const profileText = stripHtml(profile);

  // Format date helper
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
  // `dark` is true when the section is placed in the blue left column.
  // =============================================
  const renderProfile = (dark) => {
    if (!profileText) return null;
    const Header = dark ? UnderlineHeader : SectionHeader;
    return (
      <Box key="profile" sx={{ mb: 5, ...pageBreakStyle(2) }}>
        <Header title={getTitle(2, "About Me")} />
        <Typography variant="body2" sx={{ opacity: dark ? 0.9 : 1, lineHeight: 1.7 }}>
          {profileText}
        </Typography>
      </Box>
    );
  };

  const renderLanguages = (dark) => {
    if (!languages.length) return null;
    const Header = dark ? UnderlineHeader : SectionHeader;
    return (
      <Box key="languages" sx={{ mb: 5, ...pageBreakStyle(6) }}>
        <Header title={getTitle(6, "Languages")} />
        <Box>
          {languages.map((lang, index) => (
            <Typography key={lang.id || index} variant="body2" sx={{ opacity: dark ? 0.9 : 1, mb: 1 }}>
              • {lang.language || 'Language'}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };

  const renderInterests = (dark) => {
    if (!interests.length) return null;
    const Header = dark ? UnderlineHeader : SectionHeader;
    return (
      <Box key="interests" sx={{ mb: 5, ...pageBreakStyle(7) }}>
        <Header title={getTitle(7, "Interests")} />
        <Box>
          {interests.map((item, index) => (
            <Typography key={item.id || index} variant="body2" sx={{ opacity: dark ? 0.9 : 1, mb: 1 }}>
              • {item.interest || 'Interest'}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };

  const renderSkills = (dark) => {
    if (!skills.length) return null;
    const Header = dark ? UnderlineHeader : SectionHeader;
    return (
      <Box key="skills" sx={{ mb: 5, ...pageBreakStyle(5) }}>
        <Header title={getTitle(5, "Skills")} />
        <List sx={{ pl: dark ? 0 : 1 }}>
          {skills.map((skill, index) => (
            <ListItem key={skill.id || index} sx={{ p: 0, mb: 1.5, alignItems: 'center' }}>
              <ListItemIcon sx={{ minWidth: '24px' }}>
                <SquareIcon sx={{ fontSize: 10, color: dark ? 'white' : 'primary.main' }} />
              </ListItemIcon>
              <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', color: dark ? 'white' : 'text.primary' }}>
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
    const Header = dark ? UnderlineHeader : SectionHeader;
    return (
      <Box key="experience" sx={{ mb: 5, ...pageBreakStyle(4) }}>
        <Header title={getTitle(4, "Experience")} />
        <List sx={{ pl: dark ? 0 : 1 }}>
          {experience.map((exp, index) => (
            <BulletItem
              key={exp.id || index}
              title={exp.position || 'Position'}
              subtitle={[formatDate(exp), exp.employer, exp.city].filter(Boolean).join(' | ')}
              description={exp.description}
              dark={dark}
            />
          ))}
        </List>
      </Box>
    );
  };

  const renderEducation = (dark) => {
    if (!education.length) return null;
    const Header = dark ? UnderlineHeader : SectionHeader;
    return (
      <Box key="education" sx={{ mb: 5, ...pageBreakStyle(3) }}>
        <Header title={getTitle(3, "Education")} />
        <List sx={{ pl: dark ? 0 : 1 }}>
          {education.map((edu, index) => (
            <BulletItem
              key={edu.id || index}
              title={edu.school || 'School Name'}
              subtitle={[edu.education, formatDate(edu), edu.city].filter(Boolean).join(' | ')}
              description={edu.description}
              dark={dark}
            />
          ))}
        </List>
      </Box>
    );
  };

  const SECTION_ORDER = [
    { id: 2, render: renderProfile },
    { id: 6, render: renderLanguages },
    { id: 7, render: renderInterests },
    { id: 5, render: renderSkills },
    { id: 4, render: renderExperience },
    { id: 3, render: renderEducation },
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
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');`}
      </style>

      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >

        {/* ================= LEFT COLUMN (Blue) ================= */}
        <Box sx={{
          width: { xs: '100%', md: '38%' },
          bgcolor: '#0B3064',
          color: 'white',
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>

          {/* PROFILE IMAGE */}
          {personalInfo.profileImage ? (
            <Avatar
              src={personalInfo.profileImage}
              sx={{
                width: 180,
                height: 180,
                mb: 4,
                border: '4px solid rgba(255,255,255,0.2)',
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 180,
                height: 180,
                mb: 4,
                border: '4px solid rgba(255,255,255,0.2)',
                bgcolor: '#1a4a8a',
                fontSize: '3rem',
                fontWeight: 800,
              }}
            >
              {`${(personalInfo.firstName || '')[0] || ''}${(personalInfo.lastName || '')[0] || ''}`}
            </Avatar>
          )}

          {/* NAME */}
          <Typography variant="h4" fontWeight="700" sx={{ mb: 6, lineHeight: 1.2 }}>
            {fullName}
          </Typography>

          <Box sx={{ width: '100%', textAlign: 'left' }}>

            {/* CONTACT */}
            {(personalInfo.phoneNumber ||
              personalInfo.email ||
              personalInfo.website ||
              personalInfo.linkedIn) && (
              <>
                <Typography variant="h6" sx={{
                  mb: 3,
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                  paddingBottom: 1,
                  display: 'inline-block',
                }}>
                  Contact
                </Typography>

                {personalInfo.phoneNumber && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2">Phone Number</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {personalInfo.phoneNumber}
                    </Typography>
                  </Box>
                )}

                {personalInfo.email && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2">E-mail Address</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {personalInfo.email}
                    </Typography>
                  </Box>
                )}

                {personalInfo.linkedIn && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2">LinkedIn</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {personalInfo.linkedIn}
                    </Typography>
                  </Box>
                )}

                {personalInfo.website && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2">Website</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {personalInfo.website}
                    </Typography>
                  </Box>
                )}

                {personalInfo.address && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2">Address</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {[personalInfo.address, personalInfo.city]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {leftSections}

          </Box>
        </Box>

        {/* ================= RIGHT COLUMN (White) ================= */}
        <Box sx={{
          width: { xs: '100%', md: '62%' },
          bgcolor: 'white',
          p: 6,
        }}>

          {rightSections}

        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ResumeDesign;