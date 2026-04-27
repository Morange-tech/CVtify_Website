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
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';

const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' },
    h6: { fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '1rem' },
    subtitle1: { fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' },
    subtitle2: { fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' },
    body1: { fontSize: '0.85rem', lineHeight: 1.6 },
    body2: { fontSize: '0.75rem', lineHeight: 1.6 },
  },
  palette: {
    background: { default: '#e0e0e0' },
    primary: { main: '#282828' },
    secondary: { main: '#f2f2f2' },
    text: { primary: '#333333', secondary: '#777777' },
  },
});

// --- HELPER COMPONENTS ---
const SectionHeader = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        borderRadius: '50%',
        p: 0.5,
        mr: 2,
        display: 'flex',
      }}
    >
      {React.cloneElement(icon, { fontSize: 'small' })}
    </Box>
    <Typography variant="h6" color="text.primary">
      {title}
    </Typography>
  </Box>
);

const DarkSectionHeader = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
    <Box
      sx={{
        bgcolor: 'white',
        color: 'primary.main',
        borderRadius: '50%',
        p: 0.5,
        mr: 2,
        display: 'flex',
      }}
    >
      {React.cloneElement(icon, { fontSize: 'small' })}
    </Box>
    <Typography variant="h6" color="white">
      {title}
    </Typography>
  </Box>
);

// Converts level code to percentage
const getLevelPercentage = (levelCode) => {
  const levelMap = {
    '01': 20,
    '02': 40,
    '03': 60,
    '04': 80,
    '05': 100,
  };
  return levelMap[levelCode] || 0;
};

const SkillBar = ({ skill, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
    <Typography
      variant="body2"
      sx={{ width: '120px', fontWeight: 'bold', mr: 2 }}
    >
      {skill}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        flexGrow: 1,
        height: 8,
        borderRadius: 5,
        bgcolor: '#e0e0e0',
        '& .MuiLinearProgress-bar': {
          bgcolor: 'primary.main',
          borderRadius: 5,
        },
      }}
    />
  </Box>
);

// =============================================
// MAIN TEMPLATE - NOW ACCEPTS cvData
// =============================================
const ResumeTemplate2 = ({ cvData, sectionTitleOverrides = {}, sectionColumn = {}, sectionPageBreak = {} }) => {
  // Safe defaults
  const personalInfo = cvData?.personalInfo || {};
  const profile = cvData?.profile || '';
  const education = cvData?.education || [];
  const experience = cvData?.experience || [];
  const skills = cvData?.skills || [];
  const languages = cvData?.languages || [];
  const interests = cvData?.interests || [];
  const references = cvData?.references || [];


  // Return renamed title or default
  const getTitle = (id, defaultTitle) =>
    sectionTitleOverrides?.[id] || defaultTitle;

  // Check if section should go left
  const isLeft = (id) => sectionColumn?.[id] === "left";

  // Check if section should go right
  const isRight = (id) => sectionColumn?.[id] === "right";

  // Page break style
  const pageBreakStyle = (id) => ({
    pageBreakBefore: sectionPageBreak?.[id] ? "always" : "auto",
    breakBefore: sectionPageBreak?.[id] ? "page" : "auto",
  });

  // Build full name
  const fullName =
    `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim() ||
    'Your Name';

  // Build title
  const jobTitle = personalInfo.title || 'Your Job Title';

  // Build address
  const address =
    [personalInfo.address, personalInfo.city].filter(Boolean).join(', ') ||
    '';

  // Strip HTML from profile for plain text display
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const profileText = stripHtml(profile);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&display=swap');`}
      </style>

      <Paper
        elevation={5}
        sx={{
          width: '100%',
          maxWidth: '900px',
          minHeight: '1100px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
        }}
      >
        {/* ================= LEFT SIDEBAR ================= */}
        <Box
          sx={{
            width: { xs: '100%', md: '36%' },
            bgcolor: 'secondary.main',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* --- TOP DARK SECTION --- */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              pt: 6,
              pb: 25,
              px: 3,
              mx: 2,
              textAlign: 'center',
              borderBottomLeftRadius: '70% 70%',
              borderBottomRightRadius: '70% 70%',
            }}
          >
            <Typography variant="h3" sx={{ fontSize: '1.5rem', mb: 0.5 }}>
              {fullName}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ opacity: 0.8, letterSpacing: '1px' }}
            >
              {jobTitle}
            </Typography>
          </Box>

          {/* --- AVATAR --- */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: -23,
              mb: 4,
              zIndex: 2,
            }}
          >
            <Avatar
              src={personalInfo.profileImage || ''}
              sx={{
                width: 170,
                height: 170,
                border: '8px solid #f2f2f2',
                bgcolor: '#ccc',
              }}
            >
              {/* Fallback: show initials */}
              {!personalInfo.profileImage &&
                `${(personalInfo.firstName || '')[0] || ''}${(personalInfo.lastName || '')[0] || ''}`}
            </Avatar>
          </Box>

          {/* --- CONTACT SECTION --- */}
          <Box
            sx={{
              px: 4,
              pb: 4,
              textAlign: 'left',
              maxWidth: '220px',
              mx: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                justifyContent: 'center',
              }}
            >
              <AccountCircleIcon sx={{ mr: 1 }} />
              <Typography variant="h6" color="text.primary">
                CONTACT ME
              </Typography>
            </Box>

            <List>
              {/* Phone */}
              {personalInfo.phoneNumber && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 35 }}>
                    <PhoneIcon fontSize="small" />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body2">
                      {personalInfo.phoneNumber}
                    </Typography>
                  </Box>
                </ListItem>
              )}

              {/* Email */}
              {personalInfo.email && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 35 }}>
                    <EmailIcon fontSize="small" />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body2">
                      {personalInfo.email}
                    </Typography>
                  </Box>
                </ListItem>
              )}

              {/* Website */}
              {personalInfo.website && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 35 }}>
                    <LanguageIcon fontSize="small" />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body2">
                      {personalInfo.website}
                    </Typography>
                  </Box>
                </ListItem>
              )}

              {/* Address */}
              {address && (
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 35 }}>
                    <LocationOnIcon fontSize="small" />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body2">{address}</Typography>
                  </Box>
                </ListItem>
              )}
            </List>
          </Box>

          {/* --- BOTTOM DARK SECTION --- */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              flexGrow: 1,
              pt: 6,
              px: 4,
              pb: 6,
              borderTopLeftRadius: '60px',
              borderTopRightRadius: '60px',
              mt: 2,
              mx: 2,
            }}
          >
            {/* EDUCATION */}
            {education.length > 0 && isLeft(3) && (
              <Box sx={pageBreakStyle(3)}>
                <DarkSectionHeader
                  icon={<SchoolIcon />}
                  title={getTitle(3, "Education")}
                />
                {education.map((edu, index) => (
                  <Box key={edu.id || index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white' }}>
                      {edu.school || 'School Name'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {edu.education || 'Degree'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {[
                        [edu.startMonth, edu.startYear].filter(Boolean).join('-'),
                        edu.isPresent
                          ? 'Present'
                          : [edu.endMonth, edu.endYear].filter(Boolean).join('-'),
                      ]
                        .filter(Boolean)
                        .join(' / ')}
                    </Typography>
                    {edu.city && (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {edu.city}
                      </Typography>
                    )}
                    {edu.description && (
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.7, mt: 0.5 }}
                        dangerouslySetInnerHTML={{ __html: edu.description }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* REFERENCES */}
            {references.length > 0 && (
              <>
                <DarkSectionHeader icon={<GroupIcon />} title="References" />
                {references.map((ref, index) => (
                  <Box key={ref.id || index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white' }}>
                      {ref.name || 'Reference Name'}
                    </Typography>
                    {ref.company && (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {ref.company}
                      </Typography>
                    )}
                    {ref.city && (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {ref.city}
                      </Typography>
                    )}
                    {ref.phone && (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Tel: {ref.phone}
                      </Typography>
                    )}
                    {ref.email && (
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Email: {ref.email}
                      </Typography>
                    )}
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>

        {/* ================= RIGHT CONTENT ================= */}
        <Box
          sx={{
            width: { xs: '100%', md: '64%' },
            bgcolor: 'white',
            p: 6,
          }}
        >
          {/* ABOUT ME / PROFILE */}
          {profileText && (
            <Box sx={{ mb: 5, ...pageBreakStyle(2) }}>
              <SectionHeader
                icon={<PersonIcon />}
                title={getTitle(2, "ABOUT ME")}
              />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: 'justify' }}
              >
                {profileText}
              </Typography>
            </Box>
          )}

          {/* EDUCATION (Right if not Left) */}
          {education.length > 0 && !isLeft(3) && (
            <Box sx={{ mb: 5, ...pageBreakStyle(3) }}>
              <SectionHeader
                icon={<SchoolIcon />}
                title={getTitle(3, "Education")}
              />
              {education.map((edu, index) => (
                <Box key={edu.id || index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">
                    {edu.school || 'School Name'}
                  </Typography>
                  <Typography variant="body2">
                    {edu.education || 'Degree'}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* JOB EXPERIENCE */}
          {experience.length > 0 && (
            <Box sx={{ mb: 5, ...pageBreakStyle(4) }}>
              <SectionHeader icon={<WorkIcon />} title={getTitle(4, "JOB EXPERIENCE")} />
              {experience.map((exp, index) => (
                <Box key={exp.id || index} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="subtitle1">
                      {exp.position || 'Position'}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {[
                        [exp.startMonth, exp.startYear].filter(Boolean).join('-'),
                        exp.isPresent
                          ? 'Present'
                          : [exp.endMonth, exp.endYear].filter(Boolean).join('-'),
                      ]
                        .filter(Boolean)
                        .join(' / ')}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: 'italic', mb: 1 }}
                  >
                    {[exp.employer, exp.city].filter(Boolean).join(' / ')}
                  </Typography>
                  {exp.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <Box sx={{ mb: 5, ...pageBreakStyle(5) }}>
              <SectionHeader icon={<SpeedIcon />} title={getTitle(5, "SKILLS")} />
              <Grid container spacing={4}>
                {/* Split skills into two columns */}
                <Grid item xs={12} sm={6}>
                  {skills
                    .filter((_, i) => i % 2 === 0)
                    .map((skill, index) => (
                      <SkillBar
                        key={skill.id || index}
                        skill={skill.skill || 'Skill'}
                        value={getLevelPercentage(skill.level)}
                      />
                    ))}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {skills
                    .filter((_, i) => i % 2 !== 0)
                    .map((skill, index) => (
                      <SkillBar
                        key={skill.id || index}
                        skill={skill.skill || 'Skill'}
                        value={getLevelPercentage(skill.level)}
                      />
                    ))}
                </Grid>
              </Grid>
            </Box>
          )}

          {/* LANGUAGE & HOBBIES GRID */}
          <Grid container spacing={6}>
            {/* LANGUAGES */}
            {languages.length > 0 && (
              <Grid item xs={6} sx={pageBreakStyle(6)}>
                <SectionHeader icon={<PublicIcon />} title={getTitle(6, "LANGUAGES")} />
                <Grid container columnGap={3}>
                  <Grid item xs={5}>
                    <List dense disablePadding>
                      {languages
                        .filter((_, i) => i % 2 === 0)
                        .map((lang, index) => (
                          <ListItem key={lang.id || index} sx={{ p: 0, pb: 1.5 }}>
                            <ListItemText
                              primary={`• ${(lang.language || 'Language').toUpperCase()}`}
                              primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: 'bold',
                              }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                  <Grid item xs={5}>
                    <List dense disablePadding>
                      {languages
                        .filter((_, i) => i % 2 !== 0)
                        .map((lang, index) => (
                          <ListItem key={lang.id || index} sx={{ p: 0, pb: 1.5 }}>
                            <ListItemText
                              primary={`• ${(lang.language || 'Language').toUpperCase()}`}
                              primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: 'bold',
                              }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {/* INTERESTS / HOBBIES */}
            {interests.length > 0 && (
              <Grid item xs={6} sx={pageBreakStyle(7)}>
                <SectionHeader icon={<FlagIcon />} title={getTitle(7, "HOBBIES")} />
                <Grid container columnGap={3}>
                  <Grid item xs={5}>
                    <List dense disablePadding>
                      {interests
                        .filter((_, i) => i % 2 === 0)
                        .map((item, index) => (
                          <ListItem key={item.id || index} sx={{ p: 0, pb: 1.5 }}>
                            <ListItemText
                              primary={`• ${(item.interest || 'Interest').toUpperCase()}`}
                              primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: 'bold',
                              }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                  <Grid item xs={5}>
                    <List dense disablePadding>
                      {interests
                        .filter((_, i) => i % 2 !== 0)
                        .map((item, index) => (
                          <ListItem key={item.id || index} sx={{ p: 0, pb: 1.5 }}>
                            <ListItemText
                              primary={`• ${(item.interest || 'Interest').toUpperCase()}`}
                              primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: 'bold',
                              }}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ResumeTemplate2;