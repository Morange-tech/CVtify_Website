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

const BulletItem = ({ title, subtitle, description }) => (
  <ListItem alignItems="flex-start" sx={{ p: 0, mb: 2 }}>
    <ListItemIcon sx={{ minWidth: '24px', mt: 0.8 }}>
      <SquareIcon sx={{ fontSize: 10, color: 'primary.main' }} />
    </ListItemIcon>
    <Box sx={{ m: 0 }}>
      <Typography variant="subtitle1" color="text.primary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
      {description && (
        <Box
          sx={{
            mt: 0.5,
            fontSize: '0.85rem',
            color: 'text.secondary',
            '& p': { margin: 0 },
            '& ul, & ol': { margin: 0, paddingLeft: '1.2rem' },
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </Box>
  </ListItem>
);

// =============================================
// MAIN TEMPLATE - NOW ACCEPTS cvData
// =============================================
const ResumeDesign = ({ cvData }) => {

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

            {/* ABOUT ME / PROFILE */}
            {profileText && (
              <>
                <Typography variant="h6" sx={{
                  mb: 2,
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                  paddingBottom: 1,
                  display: 'inline-block',
                }}>
                  About Me
                </Typography>
                <Typography variant="body2" sx={{ mb: 5, opacity: 0.9, lineHeight: 1.7 }}>
                  {profileText}
                </Typography>
              </>
            )}

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

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <>
                <Typography variant="h6" sx={{
                  mb: 2,
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                  paddingBottom: 1,
                  display: 'inline-block',
                }}>
                  Languages
                </Typography>
                <Box sx={{ mb: 5 }}>
                  {languages.map((lang, index) => (
                    <Typography
                      key={lang.id || index}
                      variant="body2"
                      sx={{ opacity: 0.9, mb: 1 }}
                    >
                      • {lang.language || 'Language'}
                    </Typography>
                  ))}
                </Box>
              </>
            )}

            {/* INTERESTS */}
            {interests.length > 0 && (
              <>
                <Typography variant="h6" sx={{
                  mb: 2,
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                  paddingBottom: 1,
                  display: 'inline-block',
                }}>
                  Interests
                </Typography>
                <Box sx={{ mb: 5 }}>
                  {interests.map((item, index) => (
                    <Typography
                      key={item.id || index}
                      variant="body2"
                      sx={{ opacity: 0.9, mb: 1 }}
                    >
                      • {item.interest || 'Interest'}
                    </Typography>
                  ))}
                </Box>
              </>
            )}

          </Box>
        </Box>

        {/* ================= RIGHT COLUMN (White) ================= */}
        <Box sx={{
          width: { xs: '100%', md: '62%' },
          bgcolor: 'white',
          p: 6,
        }}>

          {/* SKILLS */}
          {skills.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <SectionHeader title="Skills" />
              <List sx={{ pl: 1 }}>
                {skills.map((skill, index) => (
                  <ListItem
                    key={skill.id || index}
                    sx={{ p: 0, mb: 1.5, alignItems: 'center' }}
                  >
                    <ListItemIcon sx={{ minWidth: '24px' }}>
                      <SquareIcon sx={{ fontSize: 10, color: 'primary.main' }} />
                    </ListItemIcon>
                    <Typography variant="subtitle1" sx={{ fontSize: '0.95rem' }}>
                      {skill.skill || 'Skill'}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <SectionHeader title="Experience" />
              <List sx={{ pl: 1 }}>
                {experience.map((exp, index) => (
                  <BulletItem
                    key={exp.id || index}
                    title={exp.position || 'Position'}
                    subtitle={[
                      formatDate(exp),
                      exp.employer,
                      exp.city,
                    ]
                      .filter(Boolean)
                      .join(' | ')}
                    description={exp.description}
                  />
                ))}
              </List>
            </Box>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <Box>
              <SectionHeader title="Education" />
              <List sx={{ pl: 1 }}>
                {education.map((edu, index) => (
                  <BulletItem
                    key={edu.id || index}
                    title={edu.school || 'School Name'}
                    subtitle={[
                      edu.education,
                      formatDate(edu),
                      edu.city,
                    ]
                      .filter(Boolean)
                      .join(' | ')}
                    description={edu.description}
                  />
                ))}
              </List>
            </Box>
          )}

        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ResumeDesign;