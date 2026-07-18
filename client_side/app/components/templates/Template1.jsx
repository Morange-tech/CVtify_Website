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

import SportsIcon from '@mui/icons-material/Sports';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AddBoxIcon from '@mui/icons-material/AddBox';
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

import { makeSectionLayout } from '../../lib/sectionLayout';

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

const SkillBar = ({ skill, value, dark }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
    <Typography
      variant="body2"
      sx={{ width: '120px', fontWeight: 'bold', mr: 2, color: dark ? 'white' : 'text.primary' }}
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
        bgcolor: dark ? 'rgba(255,255,255,0.3)' : '#e0e0e0',
        '& .MuiLinearProgress-bar': {
          bgcolor: dark ? 'white' : 'primary.main',
          borderRadius: 5,
        },
      }}
    />
  </Box>
);

// Default column ("left" = dark sidebar, "right" = white content column) per section,
// overridable per-CV via the "Colonne de gauche/droite" section menu (sectionColumn prop).
const DEFAULT_COLUMN = {
  3: 'left',   // Education
  2: 'right',  // Profile / About me
  4: 'right',  // Experience
  5: 'left',   // Skills
  6: 'left',   // Languages
  7: 'left',   // Interests
  references: 'left',
  courses: 'right',
  internships: 'right',
  extracurricular: 'right',
  qualities: 'right',
  certificates: 'right',
  achievements: 'right',
  custom: 'right',
  signature: 'right',
  footer: 'right',
};

// =============================================
// MAIN TEMPLATE - NOW ACCEPTS cvData
// =============================================
const ResumeTemplate1 = ({ cvData, sectionTitleOverrides = {}, sectionColumn = {}, sectionPageBreak = {} }) => {
  // Safe defaults
  const personalInfo = cvData?.personalInfo || {};
  const profile = cvData?.profile || '';
  const education = cvData?.education || [];
  const experience = cvData?.experience || [];
  const skills = cvData?.skills || [];
  const languages = cvData?.languages || [];
  const interests = cvData?.interests || [];
  const references = cvData?.references || [];

  const { getTitle, getColumn, pageBreakStyle } = makeSectionLayout(
    { sectionTitleOverrides, sectionColumn, sectionPageBreak },
    DEFAULT_COLUMN
  );

  // Text colors that stay legible on both the dark sidebar and the white column
  const textColor = (dark) => ({
    primary: dark ? 'white' : 'text.primary',
    secondary: dark ? 'rgba(255,255,255,0.75)' : 'text.secondary',
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

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentYear = now.getFullYear();

  // =============================================
  // SECTION RENDERERS — each returns a node (or null) for either column.
  // `dark` is true when the section is placed in the black sidebar.
  // =============================================
  const renderEducation = (dark) => {
    if (!education.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="education" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle(3) }}>
        <Header icon={<SchoolIcon />} title={getTitle(3, "Education")} />
        {education.map((edu, index) => (
          <Box key={edu.id || index} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: c.primary }}>
              {edu.school || 'School Name'}
            </Typography>
            <Typography variant="body2" sx={{ color: c.secondary }}>
              {edu.education || 'Degree'}
            </Typography>
            <Typography variant="body2" sx={{ color: c.secondary }}>
              {[
                [edu.startMonth, edu.startYear].filter(Boolean).join('-'),
                edu.isPresent
                  ? `${currentMonth}-${currentYear}`
                  : [edu.endMonth, edu.endYear].filter(Boolean).join('-'),
              ]
                .filter(Boolean)
                .join(' / ')}
            </Typography>
            {edu.city && (
              <Typography variant="body2" sx={{ color: c.secondary }}>
                {edu.city}
              </Typography>
            )}
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
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="references" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle("references") }}>
        <Header icon={<GroupIcon />} title={getTitle("references", "References")} />
        {references.map((ref, index) => (
          <Box key={ref.id || index} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: c.primary }}>
              {ref.name || 'Reference Name'}
            </Typography>
            {ref.company && (
              <Typography variant="body2" sx={{ color: c.secondary }}>
                {ref.company}
              </Typography>
            )}
            {ref.city && (
              <Typography variant="body2" sx={{ color: c.secondary }}>
                {ref.city}
              </Typography>
            )}
            {ref.phone && (
              <Typography variant="body2" sx={{ color: c.secondary }}>
                Tel: {ref.phone}
              </Typography>
            )}
            {ref.email && (
              <Typography variant="body2" sx={{ color: c.secondary }}>
                Email: {ref.email}
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
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="profile" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle(2) }}>
        <Header icon={<PersonIcon />} title={getTitle(2, "ABOUT ME")} />
        <Typography variant="body1" sx={{ color: c.secondary, textAlign: 'justify' }}>
          {profileText}
        </Typography>
      </Box>
    );
  };

  const renderExperience = (dark) => {
    if (!experience.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="experience" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle(4) }}>
        <Header icon={<WorkIcon />} title={getTitle(4, "JOB EXPERIENCE")} />
        {experience.map((exp, index) => (
          <Box key={exp.id || index} sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 0.5,
                mb: 0.5,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: c.primary }}>
                {exp.position || 'Position'}
              </Typography>
              <Typography variant="body2" fontWeight="bold" sx={{ color: c.primary }}>
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
            <Typography variant="body2" sx={{ color: c.secondary, fontStyle: 'italic', mb: 1 }}>
              {[exp.employer, exp.city].filter(Boolean).join(' / ')}
            </Typography>
            {exp.description && (
              <Typography
                variant="body2"
                sx={{ color: c.secondary }}
                dangerouslySetInnerHTML={{ __html: exp.description }}
              />
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderSkills = (dark) => {
    if (!skills.length) return null;
    const Header = dark ? DarkSectionHeader : SectionHeader;
    const bars = (items) =>
      items.map((skill, index) => (
        <SkillBar
          key={skill.id || index}
          skill={skill.skill || 'Skill'}
          value={getLevelPercentage(skill.level)}
          dark={dark}
        />
      ));
    return (
      <Box key="skills" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle(5) }}>
        <Header icon={<SpeedIcon />} title={getTitle(5, "SKILLS")} />
        {dark ? (
          bars(skills)
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              {bars(skills.filter((_, i) => i % 2 === 0))}
            </Grid>
            <Grid item xs={12} sm={6}>
              {bars(skills.filter((_, i) => i % 2 !== 0))}
            </Grid>
          </Grid>
        )}
      </Box>
    );
  };

  const renderLanguages = (dark) => {
    if (!languages.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="languages" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle(6) }}>
        <Header icon={<PublicIcon />} title={getTitle(6, "LANGUAGES")} />
        <List dense disablePadding>
          {languages.map((lang, index) => (
            <ListItem key={lang.id || index} sx={{ p: 0, pb: 1.5 }}>
              <ListItemText
                primary={`• ${(lang.language || 'Language').toUpperCase()}`}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 'bold',
                  sx: { color: c.primary },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const renderInterests = (dark) => {
    if (!interests.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="interests" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle(7) }}>
        <Header icon={<FlagIcon />} title={getTitle(7, "HOBBIES")} />
        <List dense disablePadding>
          {interests.map((item, index) => (
            <ListItem key={item.id || index} sx={{ p: 0, pb: 1.5 }}>
              <ListItemText
                primary={`• ${(item.interest || 'Interest').toUpperCase()}`}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 'bold',
                  sx: { color: c.primary },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const renderCourses = (dark) => {
    if (!cvData.courses?.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="courses" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle("courses") }}>
        <Header icon={<SchoolIcon />} title={getTitle("courses", "Courses")} />
        {cvData.courses.map((course, index) => (
          <Box key={course.id || index} sx={{ mb: 2 }}>
            <Typography fontWeight="bold" sx={{ color: c.primary }}>
              {course.course}
            </Typography>
            <Typography variant="body2" sx={{ color: c.secondary }}>
              {course.isPresent
                ? `${currentMonth}/${currentYear}`
                : [course.month, course.year].filter(Boolean).join("/")}
            </Typography>
            {course.description && (
              <Typography
                variant="body2"
                sx={{ color: c.secondary }}
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderInternships = (dark) => {
    if (!cvData.internships?.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="internships" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle("internships") }}>
        <Header icon={<WorkIcon />} title={getTitle("internships", "Internships")} />
        {cvData.internships.map((item, index) => (
          <Box key={item.id || index} sx={{ mb: 2 }}>
            <Typography fontWeight="bold" sx={{ color: c.primary }}>
              {item.position}
            </Typography>
            <Typography variant="body2" sx={{ color: c.secondary }}>
              {[item.employer, item.city].filter(Boolean).join(" - ")}
            </Typography>
            <Typography variant="body2" sx={{ color: c.secondary }}>
              {[item.startMonth, item.startYear].filter(Boolean).join("/")} -{" "}
              {item.isPresent
                ? `${currentMonth}/${currentYear}`
                : [item.endMonth, item.endYear].filter(Boolean).join("/")}
            </Typography>
            {item.description && (
              <Typography
                variant="body2"
                sx={{ color: c.secondary }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderExtracurricular = (dark) => {
    if (!cvData.extracurricular?.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="extracurricular" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle("extracurricular") }}>
        <Header
          icon={<SportsIcon />}
          title={getTitle("extracurricular", "Extracurricular Activities")}
        />
        {cvData.extracurricular.map((item, index) => (
          <Box key={item.id || index} sx={{ mb: 2 }}>
            <Typography fontWeight="bold" sx={{ color: c.primary }}>
              {item.position}
            </Typography>
            <Typography variant="body2" sx={{ color: c.secondary }}>
              {[item.employer, item.city].filter(Boolean).join(" - ")}
            </Typography>
            <Typography variant="body2" sx={{ color: c.secondary }}>
              {[item.startMonth, item.startYear].filter(Boolean).join("/")} -{" "}
              {item.isPresent
                ? `${currentMonth}/${currentYear}`
                : [item.endMonth, item.endYear].filter(Boolean).join("/")}
            </Typography>
            {item.description && (
              <Typography
                variant="body2"
                sx={{ color: c.secondary }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderQualities = (dark) => {
    if (!cvData.qualities?.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="qualities" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle("qualities") }}>
        <Header icon={<StarIcon />} title={getTitle("qualities", "Qualities")} />
        {cvData.qualities.map((item, index) => (
          <Typography key={index} variant="body2" sx={{ color: c.secondary }}>
            • {item.quality}
          </Typography>
        ))}
      </Box>
    );
  };

  const renderCertificates = (dark) => {
    if (!cvData.certificates?.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="certificates" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle("certificates") }}>
        <Header icon={<EmojiEventsIcon />} title={getTitle("certificates", "Certificates")} />
        {cvData.certificates.map((item, index) => (
          <Box key={item.id || index} sx={{ mb: 2 }}>
            <Typography fontWeight="bold" sx={{ color: c.primary }}>
              {item.certificate}
            </Typography>
            <Typography variant="body2" sx={{ color: c.secondary }}>
              {item.isPresent
                ? `${currentMonth}/${currentYear}`
                : [item.month, item.year].filter(Boolean).join("/")}
            </Typography>
            {item.description && item.description !== "<p><br></p>" && (
              <Typography
                variant="body2"
                sx={{ color: c.secondary, mt: 1 }}
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderAchievements = (dark) => {
    if (!cvData.achievements?.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="achievements" sx={{ mb: dark ? 0 : 5, ...pageBreakStyle("achievements") }}>
        <Header icon={<RocketLaunchIcon />} title={getTitle("achievements", "Achievements")} />
        {cvData.achievements.map((item, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: c.secondary }}
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        ))}
      </Box>
    );
  };

  const renderCustomSections = (dark) => {
    if (!cvData.customSections?.length) return null;
    const c = textColor(dark);
    const Header = dark ? DarkSectionHeader : SectionHeader;
    return (
      <Box key="custom" sx={pageBreakStyle("custom")}>
        {cvData.customSections.map((section, index) => (
          <Box key={index} sx={{ mb: dark ? 0 : 5 }}>
            <Header icon={<AddBoxIcon />} title={section.title || "Custom Section"} />

            {section.type === "description" && section.description && (
              <Typography
                variant="body2"
                sx={{ color: c.secondary }}
                dangerouslySetInnerHTML={{ __html: section.description }}
              />
            )}

            {section.type === "entries" &&
              section.entries?.map((entry, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography fontWeight="bold" sx={{ color: c.primary }}>
                    {entry.title} - {entry.summary}
                  </Typography>
                  <Typography variant="body2" sx={{ color: c.secondary }}>
                    {entry.startDate} - {entry.endDate || "Present"}
                  </Typography>
                  {entry.description && (
                    <Typography
                      variant="body2"
                      sx={{ color: c.secondary }}
                      dangerouslySetInnerHTML={{ __html: entry.description }}
                    />
                  )}
                </Box>
              ))}

            {section.type === "skills" &&
              section.skills?.map((skill, i) => (
                <Typography key={i} variant="body2" sx={{ color: c.secondary }}>
                  • {skill.name} ({skill.level})
                </Typography>
              ))}

            {section.type === "list" &&
              section.list?.map((item, i) => (
                <Typography key={i} variant="body2" sx={{ color: c.secondary }}>
                  • {item.text}
                </Typography>
              ))}
          </Box>
        ))}
      </Box>
    );
  };

  const renderSignature = (dark) => {
    if (!cvData.signature?.length) return null;
    const c = textColor(dark);
    return (
      <Box
        key="signature"
        sx={{ mt: dark ? 3 : 6, textAlign: dark ? 'left' : 'right', ...pageBreakStyle("signature") }}
      >
        {cvData.signature.map((sig, index) => (
          <Box key={index}>
            <Typography sx={{ color: c.secondary }}>{sig.city}</Typography>
            <Typography sx={{ color: c.secondary }}>{sig.date}</Typography>
            {sig.signatureType === "type" ? (
              <Typography sx={{ fontFamily: "cursive", fontSize: 20, color: c.primary }}>
                {sig.signature}
              </Typography>
            ) : (
              <Box component="img" src={sig.signature} sx={{ height: 60 }} />
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const renderFooter = (dark) => {
    if (!cvData.footer?.length) return null;
    const c = textColor(dark);
    return (
      <Box key="footer" sx={{ mt: dark ? 3 : 6, ...pageBreakStyle("footer") }}>
        {cvData.footer.map((item, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: c.secondary }}
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        ))}
      </Box>
    );
  };

  // Core sections first, additional sections after — keeps additional sections
  // anchored near the bottom of whichever column they end up in.
  const SECTION_ORDER = [
    { id: 3, render: renderEducation },
    { id: 2, render: renderProfile },
    { id: 4, render: renderExperience },
    { id: 5, render: renderSkills },
    { id: 6, render: renderLanguages },
    { id: 7, render: renderInterests },
    { id: 'references', render: renderReferences },
    { id: 'courses', render: renderCourses },
    { id: 'internships', render: renderInternships },
    { id: 'extracurricular', render: renderExtracurricular },
    { id: 'qualities', render: renderQualities },
    { id: 'certificates', render: renderCertificates },
    { id: 'achievements', render: renderAchievements },
    { id: 'custom', render: renderCustomSections },
    { id: 'signature', render: renderSignature },
    { id: 'footer', render: renderFooter },
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
              src={personalInfo.profileImage || undefined}
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
            {/* Birth Date */}
            {personalInfo.birthDate && (
              <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">
                  {personalInfo.birthDate}
                </Typography>
              </ListItem>
            )}

            {/* Place of Birth */}
            {personalInfo.placeOfBirth && (
              <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <LocationOnIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">
                  {personalInfo.placeOfBirth}
                </Typography>
              </ListItem>
            )}

            {/* Driving License */}
            {personalInfo.drivingLicense && (
              <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <FlagIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">
                  {personalInfo.drivingLicense}
                </Typography>
              </ListItem>
            )}

            {/* Nationality */}
            {personalInfo.nationality && (
              <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <FlagIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">
                  {personalInfo.nationality}
                </Typography>
              </ListItem>
            )}

            {/*sex */}
            {personalInfo.sex && (
              <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">
                  {personalInfo.sex}
                </Typography>
              </ListItem>
            )}

            {/* LinkedIn */}
            {cvData.personalInfo.linkedIn && (
              <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <LanguageIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">
                  {personalInfo.linkedIn}
                </Typography>
              </ListItem>
            )}
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
            {leftSections}
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
          {rightSections}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ResumeTemplate1;
