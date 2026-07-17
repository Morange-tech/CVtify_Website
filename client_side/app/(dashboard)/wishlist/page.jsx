'use client';

// app/(dashboard)/wishlist/page.jsx
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Skeleton,
  Alert,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Heart, Star, ArrowRight, FileText, Mail, RefreshCw } from 'lucide-react';
import { templateApi, motivationTemplateApi } from '../../services/api';

const Grid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(3),
  [theme.breakpoints.down('lg')]: { gridTemplateColumns: 'repeat(2, 1fr)' },
  [theme.breakpoints.down('sm')]: { gridTemplateColumns: '1fr' },
}));

const ItemCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  border: '1px solid #e2e8f0',
  boxShadow: 'none',
  transition: 'all 0.25s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
    borderColor: '#000000',
  },
}));

const ImageWrapper = styled(Box)({
  position: 'relative',
  aspectRatio: '3/4',
  backgroundColor: '#f1f5f9',
});

const HeartButton = styled(IconButton)({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 2,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  '&:hover': { backgroundColor: '#ffffff', transform: 'scale(1.1)' },
});

const CardFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid #e2e8f0',
}));

const CardSkeleton = () => (
  <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
    <Skeleton variant="rectangular" sx={{ aspectRatio: '3/4', width: '100%' }} />
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="70%" height={24} />
      <Skeleton variant="text" width="50%" height={18} />
    </Box>
  </Card>
);

const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 10,
      bgcolor: '#ffffff',
      borderRadius: 3,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}
  >
    <Box
      sx={{
        width: 72, height: 72, borderRadius: '50%', bgcolor: '#00000015',
        display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3,
      }}
    >
      <Icon size={32} color="#000000" />
    </Box>
    <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom>{title}</Typography>
    <Typography variant="body2" color="#64748b">{subtitle}</Typography>
  </Box>
);

export default function WishlistPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('cvs');

  const [cvTemplates, setCvTemplates] = useState([]);
  const [cvLoading, setCvLoading] = useState(true);
  const [cvError, setCvError] = useState(null);

  const [letterTemplates, setLetterTemplates] = useState([]);
  const [letterLoading, setLetterLoading] = useState(true);
  const [letterError, setLetterError] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const fetchCvWishlist = useCallback(async () => {
    try {
      setCvLoading(true);
      setCvError(null);
      const response = await templateApi.getUserWishlist();
      setCvTemplates(response.data || []);
    } catch (err) {
      setCvError(err.message || 'Failed to load your CV wishlist.');
      setCvTemplates([]);
    } finally {
      setCvLoading(false);
    }
  }, []);

  const fetchLetterWishlist = useCallback(async () => {
    try {
      setLetterLoading(true);
      setLetterError(null);
      const response = await motivationTemplateApi.getUserWishlist();
      setLetterTemplates(response.data || []);
    } catch (err) {
      setLetterError(err.message || 'Failed to load your motivation letter wishlist.');
      setLetterTemplates([]);
    } finally {
      setLetterLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCvWishlist();
    fetchLetterWishlist();
  }, [fetchCvWishlist, fetchLetterWishlist]);

  const handleRemoveCv = async (templateId, e) => {
    e.stopPropagation();
    try {
      await templateApi.toggleWishlist(templateId);
      setCvTemplates((prev) => prev.filter((t) => t.id !== templateId));
      showSnackbar('Removed from wishlist');
    } catch {
      showSnackbar('Failed to update wishlist', 'error');
    }
  };

  const handleRemoveLetter = async (templateId, e) => {
    e.stopPropagation();
    try {
      await motivationTemplateApi.toggleWishlist(templateId);
      setLetterTemplates((prev) => prev.filter((t) => t.id !== templateId));
      showSnackbar('Removed from wishlist');
    } catch {
      showSnackbar('Failed to update wishlist', 'error');
    }
  };

  const openCvTemplate = (template) => {
    localStorage.setItem(
      'selectedTemplate',
      JSON.stringify({ templateId: template.templateId, templateName: template.name, selectedAt: new Date().toISOString() })
    );
    router.push(`/CV_Builder?template=${template.templateId}`);
  };

  const openLetterTemplate = (template) => {
    localStorage.setItem(
      'selectedMotivationTemplate',
      JSON.stringify({ templateId: template.templateId, templateName: template.name, selectedAt: new Date().toISOString() })
    );
    router.push(`/motivation-letter-builder?template=${template.templateId}`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="700" color="#1e293b" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Heart size={28} color="#ef4444" fill="#ef4444" /> My Wishlist
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
          Templates you&apos;ve favorited, all in one place.
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{
          mb: 3,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', minHeight: 40 },
          '& .Mui-selected': { color: '#000000' },
          '& .MuiTabs-indicator': { backgroundColor: '#000000' },
        }}
      >
        <Tab icon={<FileText size={16} />} iconPosition="start" label={`CVs (${cvTemplates.length})`} value="cvs" />
        <Tab icon={<Mail size={16} />} iconPosition="start" label={`Lettres de motivation (${letterTemplates.length})`} value="letters" />
      </Tabs>

      {/* CVs tab */}
      {activeTab === 'cvs' && (
        <>
          {cvError && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={fetchCvWishlist} startIcon={<RefreshCw size={16} />}>
                  Retry
                </Button>
              }
            >
              {cvError}
            </Alert>
          )}

          {cvLoading ? (
            <Grid>{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</Grid>
          ) : cvTemplates.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No CV templates in your wishlist yet"
              subtitle="Browse templates and tap the heart icon to save your favorites here."
            />
          ) : (
            <Grid>
              {cvTemplates.map((template) => (
                <ItemCard key={template.id} onClick={() => openCvTemplate(template)} sx={{ cursor: 'pointer' }}>
                  <ImageWrapper>
                    <HeartButton size="small" onClick={(e) => handleRemoveCv(template.id, e)}>
                      <Heart size={18} color="#ef4444" fill="#ef4444" />
                    </HeartButton>
                    {template.image ? (
                      <Box
                        component="img"
                        src={template.image}
                        alt={`${template.name} CV Template`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        No Image
                      </Box>
                    )}
                  </ImageWrapper>
                  <CardFooter>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="700" color="text.primary">{template.name}</Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Star size={14} color="#f59e0b" />
                        <Typography variant="caption" color="text.secondary">{template.rating} • {template.uses} uses</Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowRight size={14} />}
                      onClick={(e) => { e.stopPropagation(); openCvTemplate(template); }}
                      sx={{ textTransform: 'none', fontWeight: 600, color: '#000000' }}
                    >
                      Use
                    </Button>
                  </CardFooter>
                </ItemCard>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Letters tab */}
      {activeTab === 'letters' && (
        <>
          {letterError && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={fetchLetterWishlist} startIcon={<RefreshCw size={16} />}>
                  Retry
                </Button>
              }
            >
              {letterError}
            </Alert>
          )}

          {letterLoading ? (
            <Grid>{[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}</Grid>
          ) : letterTemplates.length === 0 ? (
            <EmptyState
              icon={Mail}
              title="No motivation letter templates in your wishlist yet"
              subtitle="Browse motivation letter templates and tap the heart icon to save your favorites here."
            />
          ) : (
            <Grid>
              {letterTemplates.map((template) => (
                <ItemCard key={template.id} onClick={() => openLetterTemplate(template)} sx={{ cursor: 'pointer' }}>
                  <ImageWrapper>
                    <HeartButton size="small" onClick={(e) => handleRemoveLetter(template.id, e)}>
                      <Heart size={18} color="#ef4444" fill="#ef4444" />
                    </HeartButton>
                    {template.image ? (
                      <Box
                        component="img"
                        src={template.image}
                        alt={`${template.name} Motivation Letter Template`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        No Image
                      </Box>
                    )}
                  </ImageWrapper>
                  <CardFooter>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="700" color="text.primary">{template.name}</Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Star size={14} color="#f59e0b" />
                        <Typography variant="caption" color="text.secondary">{template.rating} • {template.uses} uses</Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      endIcon={<ArrowRight size={14} />}
                      onClick={(e) => { e.stopPropagation(); openLetterTemplate(template); }}
                      sx={{ textTransform: 'none', fontWeight: 600, color: '#000000' }}
                    >
                      Use
                    </Button>
                  </CardFooter>
                </ItemCard>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
