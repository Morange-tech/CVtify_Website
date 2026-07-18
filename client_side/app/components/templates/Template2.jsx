import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  LinearProgress,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import { makeSectionLayout } from '../../lib/sectionLayout';

// --- THEME CONFIGURATION ---
const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Arial", sans-serif',
    h1: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 },
    h2: { fontWeight: 300, textTransform: 'uppercase', letterSpacing: 5 },
    h6: { fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem' },
    subtitle1: { fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' },
    subtitle2: { fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' },
    body1: { fontSize: '0.85rem', lineHeight: 1.8 },
    body2: { fontSize: '0.75rem', lineHeight: 1.6 },
  },
  palette: {
    background: { default: '#f0f0f0' },
    primary: { main: '#fdc601' },
    secondary: { main: '#1c1c1c' },
    text: { primary: '#1c1c1c', secondary: '#555555' }
  }
});

// --- HELPER COMPONENTS ---

const SectionPill = ({ title }) => (
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

const SkillBar = ({ skill, value, dark }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'uppercase', mb: 0.5, color: dark ? 'white' : 'inherit' }}>
      {skill}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 4,
        bgcolor: dark ? 'rgba(255,255,255,0.25)' : '#1c1c1c',
        '& .MuiLinearProgress-bar': { bgcolor: '#f0aa14' }
      }}
    />
  </Box>
);

const ContactItem = ({ label, value }) => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    mb: 1.5,
    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
    py: 0.8,
    pr: 2
  }}>
    <Box sx={{
      width: '45px',
      height: '22px',
      bgcolor: 'primary.main',
      borderRadius: '0 12px 12px 0',
      mr: 2,
      flexShrink: 0
    }} />
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography sx={{
        color: 'white',
        fontWeight: 800,
        fontSize: '0.85rem',
        lineHeight: 1.1,
        textTransform: 'capitalize'
      }}>
        {label}
      </Typography>
      <Typography sx={{
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.75rem',
        fontWeight: 400,
        mt: 0.2,
        whiteSpace: 'pre-line'
      }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

// =============================================
// MAIN TEMPLATE - NOW ACCEPTS cvData
// =============================================
// Default column ("left" = photo/dark-lower-sidebar, "right" = white main area) per
// section, overridable per-CV via the "Colonne de gauche/droite" section menu.
const DEFAULT_COLUMN = {
  3: 'left',          // Education
  references: 'left',
  2: 'right',         // Profile / About me
  4: 'right',         // Experience
  5: 'right',         // Skills
  6: 'right',         // Languages
  7: 'right',         // Interests
};

const ResumeDesign3 = ({ cvData, sectionTitleOverrides = {}, sectionColumn = {}, sectionPageBreak = {} }) => {

  // Safe defaults
  const personalInfo = cvData?.personalInfo || {};
  const profile = cvData?.profile || '';
  const education = cvData?.education || [];
  const experience = cvData?.experience || [];
  const skills = cvData?.skills || [];
  const languages = cvData?.languages || [];
  const interests = cvData?.interests || [];
  const references = cvData?.references || [];

  // Full name
  const firstName = personalInfo.firstName || 'First Name';
  const lastName = personalInfo.lastName || 'Last Name';
  const jobTitle = personalInfo.title || 'Your Job Title';

  // Address
  const address = [personalInfo.address, personalInfo.city]
    .filter(Boolean)
    .join(',\n') || '';

  // Strip HTML from profile
  const stripHtml = (html) => {
    if (!html) return '';
    if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '');
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const profileText = stripHtml(profile);

  const { getTitle, getColumn, pageBreakStyle } = makeSectionLayout(
    { sectionTitleOverrides, sectionColumn, sectionPageBreak },
    DEFAULT_COLUMN
  );

  // Text colors that stay legible on both the dark lower-sidebar and the white main column
  const textColor = (dark) => ({
    primary: dark ? 'white' : 'text.primary',
    secondary: dark ? 'rgba(255,255,255,0.6)' : 'text.secondary',
    meta: dark ? 'primary.main' : 'text.primary',
  });

  // =============================================
  // SECTION RENDERERS — each returns a node (or null) for either column.
  // `dark` is true when the section is placed in the sidebar's dark lower box.
  // =============================================
  const renderEducation = (dark) => {
    if (!education.length) return null;
    const c = textColor(dark);
    return (
      <Box key="education" sx={{ ...(dark ? { px: 4 } : {}), mb: dark ? 4 : 6, ...pageBreakStyle(3) }}>
        <SectionPill title={getTitle(3, "EDUCATION")} />
        {education.map((edu, index) => (
          <Box key={edu.id || index} sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: c.primary }}>
              {edu.education || 'Degree'}
            </Typography>
            <Typography variant="body2" sx={{ color: c.secondary }}>
              {edu.school || 'University Name'}
            </Typography>
            {edu.city && (
              <Typography variant="body2" sx={{ color: c.secondary }}>
                {edu.city}
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: c.meta }}>
              {[
                [edu.startMonth, edu.startYear].filter(Boolean).join('-'),
                edu.isPresent
                  ? 'Present'
                  : [edu.endMonth, edu.endYear].filter(Boolean).join('-'),
              ]
                .filter(Boolean)
                .join(' / ')}
            </Typography>
            {edu.description && (
              <Typography
                variant="body2"
                sx={{ color: c.secondary, mt: 0.5 }}
                dangerouslySetInnerHTML={{ __html: edu.description }}
              />
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderReferences = (dark) => {
    if (!references.length) return null;
    const c = textColor(dark);
    return (
      <Box key="references" sx={{ ...(dark ? { px: 4 } : {}), mb: dark ? 4 : 6, ...pageBreakStyle("references") }}>
        <SectionPill title={getTitle("references", "REFERENCE")} />
        {references.map((ref, index) => (
          <Box key={ref.id || index} sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: c.primary }}>
              {ref.name || 'Reference Name'}
            </Typography>
            {ref.company && (
              <Typography variant="caption" display="block" sx={{ color: c.secondary }}>
                {ref.company}
              </Typography>
            )}
            {ref.city && (
              <Typography variant="caption" display="block" sx={{ color: c.secondary }}>
                {ref.city}
              </Typography>
            )}
            {ref.phone && (
              <Typography variant="caption" sx={{ color: c.secondary }}>
                T: {ref.phone}
              </Typography>
            )}
            {ref.email && (
              <Typography variant="caption" display="block" sx={{ color: c.secondary }}>
                {ref.email}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderProfile = (dark) => {
    if (!profileText) return null;
    const c = textColor(dark);
    return (
      <Box key="profile" sx={{ ...(dark ? { px: 4 } : {}), mb: dark ? 4 : 6, ...pageBreakStyle(2) }}>
        <SectionPill title={getTitle(2, "ABOUT ME")} />
        <Typography variant="body1" sx={{ color: c.secondary, textAlign: 'justify' }}>
          {profileText}
        </Typography>
      </Box>
    );
  };

  const renderExperience = (dark) => {
    if (!experience.length) return null;
    const c = textColor(dark);
    return (
      <Box key="experience" sx={{ ...(dark ? { px: 4 } : {}), mb: dark ? 4 : 6, ...pageBreakStyle(4) }}>
        <SectionPill title={getTitle(4, "WORK EXPERIENCE")} />
        {experience.map((exp, index) => (
          <Grid container spacing={2} sx={{ mb: 3 }} key={exp.id || index}>
            <Grid item xs={3}>
              <Typography variant="body2" fontWeight="bold" sx={{ color: c.meta }}>
                {[
                  [exp.startMonth, exp.startYear].filter(Boolean).join('-'),
                  exp.isPresent
                    ? 'Present'
                    : [exp.endMonth, exp.endYear].filter(Boolean).join('-'),
                ]
                  .filter(Boolean)
                  .join(' / ')}
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="subtitle1" sx={{ color: dark ? 'primary.main' : 'secondary.main' }}>
                {exp.position || 'Position'}
              </Typography>
              <Typography variant="body2" sx={{
                mb: 0.5,
                fontStyle: 'italic',
                fontSize: '0.7rem',
                color: c.secondary,
              }}>
                {[exp.employer, exp.city].filter(Boolean).join(' / ')}
              </Typography>
              {exp.description && (
                <Typography
                  variant="body2"
                  sx={{ color: c.secondary }}
                  dangerouslySetInnerHTML={{ __html: exp.description }}
                />
              )}
            </Grid>
          </Grid>
        ))}
      </Box>
    );
  };

  const renderSkills = (dark) => {
    if (!skills.length) return null;
    return (
      <Box key="skills" sx={{ ...(dark ? { px: 4 } : {}), mb: dark ? 4 : 6, ...pageBreakStyle(5) }}>
        <SectionPill title={getTitle(5, "SKILLS")} />
        <Grid container spacing={dark ? 2 : 5}>
          <Grid item xs={dark ? 12 : 6}>
            {skills
              .filter((_, i) => i % 2 === 0)
              .map((skill, index) => (
                <SkillBar
                  key={skill.id || index}
                  skill={skill.skill || 'Skill'}
                  value={getLevelPercentage(skill.level)}
                  dark={dark}
                />
              ))}
          </Grid>
          <Grid item xs={dark ? 12 : 6}>
            {skills
              .filter((_, i) => i % 2 !== 0)
              .map((skill, index) => (
                <SkillBar
                  key={skill.id || index}
                  skill={skill.skill || 'Skill'}
                  value={getLevelPercentage(skill.level)}
                  dark={dark}
                />
              ))}
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderLanguages = (dark) => {
    if (!languages.length) return null;
    const c = textColor(dark);
    const cols = dark
      ? [languages]
      : [languages.filter((_, i) => i % 2 === 0), languages.filter((_, i) => i % 2 !== 0)];
    return (
      <Box key="languages" sx={{ ...(dark ? { px: 4 } : {}), mb: dark ? 4 : 6, ...pageBreakStyle(6) }}>
        <SectionPill title={getTitle(6, "LANGUAGES")} />
        <Grid container columnGap={3}>
          {cols.map((col, ci) => (
            <Grid item xs={dark ? 12 : 5} key={ci}>
              {col.map((lang, index) => (
                <Typography
                  key={lang.id || index}
                  variant="body2"
                  fontWeight="bold"
                  sx={{ textTransform: 'uppercase', mb: 1, color: c.primary }}
                >
                  • {lang.language || 'Language'}
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderInterests = (dark) => {
    if (!interests.length) return null;
    const c = textColor(dark);
    const cols = dark
      ? [interests]
      : [interests.filter((_, i) => i % 2 === 0), interests.filter((_, i) => i % 2 !== 0)];
    return (
      <Box key="interests" sx={{ ...(dark ? { px: 4 } : {}), mb: dark ? 4 : 0, ...pageBreakStyle(7) }}>
        <SectionPill title={getTitle(7, "HOBBIES")} />
        <Grid container columnGap={3}>
          {cols.map((col, ci) => (
            <Grid item xs={dark ? 12 : 5} key={ci}>
              {col.map((item, index) => (
                <Typography
                  key={item.id || index}
                  variant="body2"
                  fontWeight="bold"
                  sx={{ textTransform: 'uppercase', mb: 1, color: c.primary }}
                >
                  • {item.interest || 'Interest'}
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Core sections first, keeps relative ordering stable within whichever column
  // each section ends up in.
  const SECTION_ORDER = [
    { id: 3, render: renderEducation },
    { id: 'references', render: renderReferences },
    { id: 2, render: renderProfile },
    { id: 4, render: renderExperience },
    { id: 5, render: renderSkills },
    { id: 6, render: renderLanguages },
    { id: 7, render: renderInterests },
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
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;800&display=swap');`}
      </style>

      <Paper elevation={20} sx={{
        width: '100%',
        maxWidth: '850px',
        minHeight: '1100px',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        borderRadius: 0
      }}>

        {/* ================= LEFT COLUMN ================= */}
        <Box sx={{
          width: { xs: '100%', md: '35%' },
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}>

          {/* PHOTO SECTION */}
          <Box sx={{
            height: '350px',
            bgcolor: 'secondary.main',
            borderBottomRightRadius: '100px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box sx={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {personalInfo.profileImage ? (
                <Box
                  component="img"
                  src={personalInfo.profileImage}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                // Fallback: show initials when no image
                <Typography sx={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#1c1c1c'
                }}>
                  {`${(personalInfo.firstName || '')[0] || ''}${(personalInfo.lastName || '')[0] || ''}`}
                </Typography>
              )}
            </Box>
          </Box>

          {/* WHITE SPACER */}
          <Box sx={{ height: '20px', bgcolor: 'white' }} />

          {/* LOWER SIDEBAR */}
          <Box sx={{
            flexGrow: 1,
            bgcolor: 'secondary.main',
            borderTopRightRadius: '100px',
            pt: 6,
            pb: 4
          }}>

            {leftSections}

            {/* CONTACT */}
            <Box sx={{ mt: 4 }}>
              {personalInfo.phoneNumber && (
                <ContactItem label="Phone" value={personalInfo.phoneNumber} />
              )}
              {personalInfo.email && (
                <ContactItem label="Email" value={personalInfo.email} />
              )}
              {personalInfo.website && (
                <ContactItem label="Website" value={personalInfo.website} />
              )}
              {address && (
                <ContactItem label="Address" value={address} />
              )}
            </Box>
          </Box>
        </Box>

        {/* ================= RIGHT COLUMN ================= */}
        <Box sx={{
          width: { xs: '100%', md: '65%' },
          bgcolor: 'white',
          position: 'relative'
        }}>

          {/* YELLOW DECORATION BLOCK */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 40,
            width: '110px',
            height: '160px',
            bgcolor: 'primary.main',
            borderBottomLeftRadius: '60px',
            borderBottomRightRadius: '60px',
            zIndex: 0
          }} />

          <Box sx={{ p: 6, position: 'relative', zIndex: 1 }}>

            {/* HEADER - NAME & TITLE */}
            <Box sx={{ mt: 6, mb: 8 }}>
              <Typography variant="h1" sx={{
                fontSize: '3.8rem',
                lineHeight: 1,
                color: 'secondary.main'
              }}>
                {firstName.toUpperCase()}
              </Typography>
              <Typography variant="h2" sx={{
                fontSize: '2.8rem',
                color: 'secondary.main'
              }}>
                {lastName.toUpperCase()}
              </Typography>
              <Typography variant="subtitle2" sx={{
                letterSpacing: 6,
                mt: 1,
                color: 'text.secondary'
              }}>
                {jobTitle.toUpperCase()}
              </Typography>
            </Box>

            {rightSections}

          </Box>
        </Box>
      </Paper>

    </ThemeProvider>
  );
};

export default ResumeDesign3;