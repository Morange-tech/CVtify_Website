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

const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Poppins", sans-serif',
    h3: { fontWeight: 700, color: '#333', letterSpacing: '-1px' },
    h5: { fontWeight: 300, fontStyle: 'italic', color: '#666' },
    h6: { fontWeight: 700, textTransform: 'none', letterSpacing: '0.5px' },
    body1: { fontSize: '0.9rem', color: '#eee' },
    body2: { fontSize: '0.85rem', color: '#555' },
  },
});

// 1. Sidebar Ribbon Header
const SidebarRibbon = ({ title }) => (
  <Box sx={{ position: 'relative', width: '101%', my: 3 }}>
    <Box sx={{
      bgcolor: '#1a1a1a',
      color: 'white',
      py: 1,
      pl: 4,
      width: '108%',
      zIndex: 2,
      position: 'relative',
      boxShadow: '2px 4px 10px rgba(0,0,0,0.3)',
    }}>
      <Typography variant="h6" sx={{ fontSize: '1.4rem' }}>{title}</Typography>
    </Box>
    <Box sx={{
      position: 'absolute',
      right: '-8%',
      bottom: '-10px',
      width: 26,
      height: -80,
      borderTop: '10px solid #000',
      borderRight: '25px solid transparent',
      zIndex: 1
    }} />
  </Box>
);

// 2. Right Side Section Header
const RightHeader = ({ title }) => (
  <Box sx={{ bgcolor: '#1a1a1a', color: 'white', py: 1, px: 2, mb: 3 }}>
    <Typography variant="h5" sx={{
      textAlign: 'center',
      fontWeight: 'bold',
      fontStyle: 'normal',
      color: 'white',
      fontSize: '1.7rem'
    }}>
      {title}
    </Typography>
  </Box>
);

// 3. Timeline Item
const TimelineItem = ({ date, title, subtitle, details, isLast }) => (
  <Box sx={{ display: 'flex', mb: isLast ? 0 : 4, position: 'relative' }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
      <Box sx={{ width: 12, height: 12, bgcolor: '#555', borderRadius: '50%', zIndex: 2 }} />
      {!isLast && <Box sx={{ width: '1px', flexGrow: 1, bgcolor: '#999', my: 0.5 }} />}
    </Box>
    <Box sx={{ mt: -0.5 }}>
      {date && (
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: '#888' }}>
          {date}
        </Typography>
      )}
      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#444', mb: 0.2 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>
          {subtitle}
        </Typography>
      )}
      {Array.isArray(details) ? (
        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#666', fontSize: '0.85rem' }}>
          {details.map((item, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
          ))}
        </ul>
      ) : (
        details && (
          <Typography variant="body2" sx={{ color: '#666' }}>
            {details}
          </Typography>
        )
      )}
    </Box>
  </Box>
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
  const firstName = personalInfo.firstName || 'First';
  const lastName = personalInfo.lastName || 'Name';
  const jobTitle = personalInfo.title || 'Your Job Title';

  // Address
  const address = [personalInfo.address, personalInfo.city]
    .filter(Boolean)
    .join(', ') || '';

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
      <Paper
        elevation={24}
        sx={{ width: '850px', display: 'flex', overflow: 'hidden', borderRadius: 0 }}
      >

        {/* ================= LEFT SIDEBAR ================= */}
        <Box sx={{
          width: '33%',
          bgcolor: '#333',
          color: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}>

          {/* PHOTO / ARCH SECTION */}
          <Box sx={{
            position: 'relative',
            height: '320px',
            bgcolor: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}>
            <Box sx={{
              width: '300px',
              height: '265px',
              bgcolor: '#333',
              borderRadius: '140px 140px 0 0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              overflow: 'hidden',
              mb: 2,
              zIndex: 1
            }}>
              {personalInfo.profileImage ? (
                <Avatar
                  src={personalInfo.profileImage}
                  sx={{ width: 240, height: 250, borderRadius: 60 }}
                />
              ) : (
                // Fallback initials
                <Avatar
                  sx={{
                    width: 240,
                    height: 250,
                    borderRadius: 60,
                    bgcolor: '#555',
                    fontSize: '4rem',
                    fontWeight: 800,
                  }}
                >
                  {`${(personalInfo.firstName || '')[0] || ''}${(personalInfo.lastName || '')[0] || ''}`}
                </Avatar>
              )}
            </Box>
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '80px',
              bgcolor: '#333',
              zIndex: 0
            }} />
          </Box>

          <Box sx={{ pt: 4, pb: 6 }}>

            {/* ABOUT ME / PROFILE */}
            {profileText && (
              <>
                <SidebarRibbon title="About Me" />
                <Box sx={{ px: 4, mb: 4 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, opacity: 0.9 }}>
                    {profileText}
                  </Typography>
                </Box>
              </>
            )}

            {/* SKILLS */}
            {skills.length > 0 && (
              <>
                <SidebarRibbon title="Expertise Skill" />
                <Box sx={{ px: 4, mb: 4 }}>
                  <ul style={{
                    paddingLeft: '1.2rem',
                    margin: 0,
                    lineHeight: 2,
                    fontSize: '1rem',
                    color: '#eee'
                  }}>
                    {skills.map((skill, index) => (
                      <li key={skill.id || index}>
                        {skill.skill || 'Skill'}
                      </li>
                    ))}
                  </ul>
                </Box>
              </>
            )}

            {/* LANGUAGES */}
            {languages.length > 0 && (
              <>
                <SidebarRibbon title="Languages" />
                <Box sx={{ px: 4, mb: 4 }}>
                  <ul style={{
                    paddingLeft: '1.2rem',
                    margin: 0,
                    lineHeight: 2,
                    fontSize: '1rem',
                    color: '#eee'
                  }}>
                    {languages.map((lang, index) => (
                      <li key={lang.id || index}>
                        {lang.language || 'Language'}
                      </li>
                    ))}
                  </ul>
                </Box>
              </>
            )}

            {/* INTERESTS */}
            {interests.length > 0 && (
              <>
                <SidebarRibbon title="Interests" />
                <Box sx={{ px: 4, mb: 4 }}>
                  <ul style={{
                    paddingLeft: '1.2rem',
                    margin: 0,
                    lineHeight: 2,
                    fontSize: '1rem',
                    color: '#eee'
                  }}>
                    {interests.map((item, index) => (
                      <li key={item.id || index}>
                        {item.interest || 'Interest'}
                      </li>
                    ))}
                  </ul>
                </Box>
              </>
            )}

            {/* CONTACT */}
            <SidebarRibbon title="Contact Me" />
            <Box sx={{ px: 3 }}>
              <List dense>
                {[
                  personalInfo.phoneNumber && {
                    icon: <PhoneIcon />,
                    text: personalInfo.phoneNumber
                  },
                  personalInfo.email && {
                    icon: <EmailIcon />,
                    text: personalInfo.email
                  },
                  personalInfo.website && {
                    icon: <LanguageIcon />,
                    text: personalInfo.website
                  },
                  address && {
                    icon: <HomeIcon />,
                    text: address
                  },
                ]
                  .filter(Boolean)
                  .map((item, idx) => (
                    <ListItem key={idx} sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box sx={{
                          bgcolor: 'white',
                          borderRadius: '50%',
                          p: 0.5,
                          display: 'flex',
                          border: '1px solid rgba(255,255,255,0.5)'
                        }}>
                          {React.cloneElement(item.icon, {
                            sx: { color: 'black', fontSize: 18 }
                          })}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          variant: 'body1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </ListItem>
                  ))}
              </List>
            </Box>

          </Box>
        </Box>

        {/* ================= RIGHT COLUMN ================= */}
        <Box sx={{
          width: '62%',
          bgcolor: '#fff',
          py: 6,
          display: 'flex',
          flexDirection: 'column'
        }}>

          {/* NAME & TITLE HEADER */}
          <Box sx={{ px: 5, mb: 6 }}>
            <Typography variant="h3" sx={{
              fontSize: '4rem',
              lineHeight: 0.9,
              color: '#333'
            }}>
              {firstName}<br />{lastName}
            </Typography>
            <Typography variant="h5" sx={{ mt: 1, letterSpacing: 2 }}>
              {jobTitle}
            </Typography>
          </Box>

          {/* EDUCATION */}
          {education.length > 0 && (
            <>
              <RightHeader title="Education" />
              <Box sx={{ px: 5, mb: 2 }}>
                {education.map((edu, index) => (
                  <TimelineItem
                    key={edu.id || index}
                    date={formatDate(edu)}
                    title={edu.school || 'School Name'}
                    subtitle={edu.education || ''}
                    details={edu.city || ''}
                    isLast={index === education.length - 1}
                  />
                ))}
              </Box>
            </>
          )}

          {/* WORK EXPERIENCE */}
          {experience.length > 0 && (
            <>
              <RightHeader title="Work Experience" />
              <Box sx={{ px: 5 }}>
                {experience.map((exp, index) => {
                  // Extract bullet points from HTML description
                  const getDetails = (html) => {
                    if (!html) return [];
                    if (typeof window === 'undefined') return [];
                    const tmp = document.createElement('div');
                    tmp.innerHTML = html;
                    const items = tmp.querySelectorAll('li');
                    if (items.length > 0) {
                      return Array.from(items).map((li) => li.textContent);
                    }
                    return tmp.textContent ? [tmp.textContent] : [];
                  };

                  const details = getDetails(exp.description);

                  return (
                    <TimelineItem
                      key={exp.id || index}
                      title={exp.position || 'Position'}
                      subtitle={[
                        exp.employer,
                        formatDate(exp),
                      ]
                        .filter(Boolean)
                        .join(' | ')}
                      details={details.length > 0 ? details : exp.city || ''}
                      isLast={index === experience.length - 1}
                    />
                  );
                })}
              </Box>
            </>
          )}

        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ResumeDesign;