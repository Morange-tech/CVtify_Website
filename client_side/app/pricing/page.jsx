'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Chip, Switch, Divider, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CheckCircle2,
  XCircle,
  Star,
  ArrowRight,
  FileType,
  BadgeCheck,
  Ban,
  Folder,
  History,
  Headset,
  Infinity as InfinityIcon,
  Paintbrush,
  LineChart,
  ShieldCheck,
  Sparkles,
  Rocket,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import useUpgradeContent from '../hooks/useUpgradeContent';
import { calculateSavings, getPerMonth } from '../helpers/upgradeHelpers';

const FREE_FEATURE_FLAGS = [
  { included: true },
  { included: true },
  { included: true },
  { included: true },
  { included: true, negative: true },
  { included: true, negative: true },
  { included: false },
  { included: false },
  { included: false },
  { included: false },
  { included: false },
  { included: false },
];

const PREMIUM_FEATURE_ICONS = [InfinityIcon, Ban, BadgeCheck, FileType, Paintbrush, Folder, History, LineChart, Headset];

const FORMAT_ROW_FREE_FLAGS = [true, false, false, false, false, false, false, false];

const PageWrapper = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const isPremium = user?.plan === 'premium';
  const { plans, faqs, loading } = useUpgradeContent();
  const { t } = useLanguage();

  const premiumPlan = plans?.premium;
  const monthlyPrice = Number(premiumPlan?.monthlyPrice || 0);
  const yearlyPrice = Number(premiumPlan?.yearlyPrice || 0);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const savings = calculateSavings(monthlyPrice, yearlyPrice);
  const perMonth = getPerMonth(monthlyPrice, yearlyPrice, billingCycle);

  const freeFeatures = t('pricing.freeFeatures').map((text, i) => ({ text, ...FREE_FEATURE_FLAGS[i] }));
  const premiumFeatures = t('pricing.premiumFeatures').map((text, i) => ({ text, Icon: PREMIUM_FEATURE_ICONS[i] }));
  const formatRows = t('pricing.formatRows').map((feature, i) => ({ feature, free: FORMAT_ROW_FREE_FLAGS[i] }));
  const trustBadges = [t('pricing.cancelAnytime'), t('pricing.sevenDayGuarantee'), t('pricing.securePayment')];

  // "Get Started for Free" — not logged in goes to login, logged in goes to pick a CV template
  const handleGetStartedFree = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/templates');
    }
  };

  // Already premium: point the visitor back to their dashboard instead of repeating the plans
  if (isPremium) {
    return (
      <PageWrapper>
        <Navbar />
        <Box sx={{ flex: 1, bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', pt: { xs: 12, md: 14 }, pb: 6 }}>
          <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, md: 4 }, width: '100%' }}>
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 4,
                bgcolor: '#ffffff',
                borderRadius: 4,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Star size={40} color="#ffffff" />
              </Box>
              <Typography variant="h4" fontWeight="800" color="#1e293b" gutterBottom>
                {t('pricing.alreadyPremiumTitle')}
              </Typography>
              <Typography variant="body1" color="#64748b" sx={{ mb: 3 }}>
                {t('pricing.alreadyPremiumText')}
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/dashboard')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                }}
              >
                {t('pricing.goToDashboard')}
              </Button>
            </Box>
          </Box>
        </Box>
        <Footer />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />

      <Box sx={{ flex: 1, bgcolor: '#f8fafc', pt: { xs: 12, md: 14 }, pb: 6 }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 4 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#000000' }} />
            </Box>
          ) : (
            <>
              {/* ─── HERO SECTION ─── */}
              <Box
                sx={{
                  textAlign: 'center',
                  mb: 6,
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #00000008 0%, #1a1a1a08 100%)',
                  border: '1px solid #00000020',
                }}
              >
                {/* Watermark Preview */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
                  {/* Free Version Preview */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: { xs: 140, md: 180 },
                        height: { xs: 198, md: 254 },
                        bgcolor: '#ffffff',
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        gap: 1,
                      }}
                    >
                      <Box sx={{ width: '60%', height: 8, bgcolor: '#e2e8f0', borderRadius: 1 }} />
                      <Box sx={{ width: '80%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '70%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '90%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '50%', height: 8, bgcolor: '#e2e8f0', borderRadius: 1, mt: 1 }} />
                      <Box sx={{ width: '85%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '75%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '65%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: 'rotate(-30deg)',
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#ef444425',
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
                            fontWeight: 900,
                            letterSpacing: 2,
                            userSelect: 'none',
                          }}
                        >
                          CVtify
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="#ef4444" fontWeight="600" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <XCircle size={14} /> {t('pricing.withWatermark')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
                    <ArrowRight size={32} />
                  </Box>

                  {/* Premium Version Preview */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: { xs: 140, md: 180 },
                        height: { xs: 198, md: 254 },
                        bgcolor: '#ffffff',
                        borderRadius: 2,
                        border: '2px solid #00000040',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        gap: 1,
                      }}
                    >
                      <Box sx={{ width: '60%', height: 8, bgcolor: '#00000030', borderRadius: 1 }} />
                      <Box sx={{ width: '80%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '70%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '90%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '50%', height: 8, bgcolor: '#00000030', borderRadius: 1, mt: 1 }} />
                      <Box sx={{ width: '85%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '75%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ width: '65%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
                      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <Star size={16} color="#EAB308" />
                      </Box>
                    </Box>
                    <Typography variant="caption" color="#10b981" fontWeight="600" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <CheckCircle2 size={14} /> {t('pricing.cleanAndProfessional')}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h3" fontWeight="800" color="#1e293b" gutterBottom sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                  {t('pricing.headingLine1')}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'block',
                    }}
                  >
                    {t('pricing.headingLine2')}
                  </Box>
                </Typography>
                <Typography variant="body1" color="#64748b" sx={{ maxWidth: 600, mx: 'auto' }}>
                  {t('pricing.subheading')}
                </Typography>
              </Box>

              {/* ─── BILLING TOGGLE ─── */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 5 }}>
                <Typography variant="body1" fontWeight={billingCycle === 'monthly' ? 700 : 400} color={billingCycle === 'monthly' ? '#1e293b' : '#94a3b8'}>
                  {t('pricing.monthly')}
                </Typography>
                <Switch
                  checked={billingCycle === 'yearly'}
                  onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#000000' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#000000' },
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" fontWeight={billingCycle === 'yearly' ? 700 : 400} color={billingCycle === 'yearly' ? '#1e293b' : '#94a3b8'}>
                    {t('pricing.yearly')}
                  </Typography>
                  <Chip
                    label={t('pricing.save', { percent: savings })}
                    size="small"
                    sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: '#10b98115', color: '#10b981' }}
                  />
                </Box>
              </Box>

              {/* ─── PLAN COMPARISON ─── */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 6 }}>
                {/* FREE PLAN */}
                <Box sx={{ bgcolor: '#ffffff', borderRadius: 4, border: '2px solid #e2e8f0', overflow: 'hidden' }}>
                  <Box sx={{ p: 4 }}>
                    <Typography variant="overline" color="#94a3b8" fontWeight="700">
                      {t('pricing.freePlanName')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1, mb: 1 }}>
                      <Typography variant="h3" fontWeight="800" color="#1e293b">
                        $0
                      </Typography>
                      <Typography variant="body2" color="#94a3b8">
                        {t('pricing.forever')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                      {t('pricing.freePlanDescription')}
                    </Typography>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleGetStartedFree}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        py: 1.5,
                        borderColor: '#000000',
                        color: '#000000',
                        '&:hover': { borderColor: '#000000', bgcolor: '#00000008' },
                      }}
                    >
                      {t('pricing.getStartedForFree')}
                    </Button>
                  </Box>

                  <Divider />

                  <Box sx={{ p: 4 }}>
                    <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
                      {t('pricing.whatsIncluded')}
                    </Typography>
                    {freeFeatures.map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.8 }}>
                        {feature.included ? (
                          feature.negative ? <XCircle size={18} color="#f59e0b" /> : <CheckCircle2 size={18} color="#10b981" />
                        ) : (
                          <XCircle size={18} color="#e2e8f0" />
                        )}
                        <Typography
                          variant="body2"
                          color={feature.included ? '#1e293b' : '#94a3b8'}
                          sx={{ textDecoration: !feature.included ? 'line-through' : 'none', fontWeight: feature.negative ? 500 : 400 }}
                        >
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* PREMIUM PLAN */}
                <Box
                  sx={{
                    bgcolor: '#ffffff',
                    borderRadius: 4,
                    border: '2px solid #000000',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                      color: '#ffffff',
                      textAlign: 'center',
                      py: 1,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Sparkles size={14} /> {t('pricing.recommended')}
                  </Box>

                  <Box sx={{ p: 4 }}>
                    <Typography variant="overline" color="#000000" fontWeight="700">
                      {t('pricing.premiumPlanName')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1, mb: 1 }}>
                      <Typography variant="h3" fontWeight="800" color="#1e293b">
                        ${perMonth}
                      </Typography>
                      <Typography variant="body2" color="#94a3b8">
                        {t('pricing.perMonth')}
                      </Typography>
                    </Box>
                    {billingCycle === 'yearly' && (
                      <Typography variant="caption" color="#10b981" fontWeight="600">
                        {t('pricing.billedAnnually', { price: `$${yearlyPrice}`, percent: savings })}
                      </Typography>
                    )}
                    <Typography variant="body2" color="#64748b" sx={{ mb: 3, mt: 0.5 }}>
                      {t('pricing.premiumPlanDescription')}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => router.push(isAuthenticated ? '/upgrade' : '/signup')}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                        '&:hover': { boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)', transform: 'translateY(-1px)' },
                      }}
                    >
                      <Rocket size={18} style={{ marginRight: 8 }} /> {t('pricing.getPremiumNow')}
                    </Button>
                  </Box>

                  <Divider />

                  <Box sx={{ p: 4 }}>
                    <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
                      {t('pricing.everythingInFreePlus')}
                    </Typography>
                    {premiumFeatures.map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.8 }}>
                        <Box sx={{ color: '#000000' }}><feature.Icon size={18} /></Box>
                        <Typography variant="body2" color="#1e293b" fontWeight="500">
                          {feature.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* ─── FORMAT COMPARISON ─── */}
              <Box sx={{ bgcolor: '#ffffff', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', mb: 6 }}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="800" color="#1e293b" gutterBottom>
                    {t('pricing.formatComparisonTitle')}
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    {t('pricing.formatComparisonSubtitle')}
                  </Typography>
                </Box>

                <Box sx={{ overflowX: 'auto' }}>
                  <Box sx={{ minWidth: 500 }}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr',
                        p: 2,
                        bgcolor: '#f8fafc',
                        borderTop: '1px solid #e2e8f0',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <Typography variant="body2" fontWeight="700" color="#64748b">
                        {t('pricing.feature')}
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color="#64748b" textAlign="center">
                        {t('pricing.free')}
                      </Typography>
                      <Typography variant="body2" fontWeight="700" color="#000000" textAlign="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        {t('pricing.premium')} <Star size={14} />
                      </Typography>
                    </Box>

                    {formatRows.map((row, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr',
                          p: 2,
                          borderBottom: '1px solid #f1f5f9',
                          '&:hover': { bgcolor: '#f8fafc' },
                        }}
                      >
                        <Typography variant="body2" color="#1e293b">
                          {row.feature}
                        </Typography>
                        <Box sx={{ textAlign: 'center' }}>
                          {row.free ? <CheckCircle2 size={20} color="#10b981" /> : <XCircle size={20} color="#e2e8f0" />}
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <CheckCircle2 size={20} color="#000000" />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* ─── FAQ ─── */}
              {faqs.length > 0 && (
                <Box sx={{ bgcolor: '#ffffff', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', p: 4, mb: 6 }}>
                  <Typography variant="h5" fontWeight="800" color="#1e293b" textAlign="center" gutterBottom>
                    {t('pricing.faqTitle')}
                  </Typography>

                  {faqs.map((faq, index) => (
                    <Box key={faq.id} sx={{ py: 2.5, borderBottom: index < faqs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <Typography variant="body1" fontWeight="700" color="#1e293b" gutterBottom>
                        {faq.question}
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        {faq.answer}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* ─── FINAL CTA ─── */}
              <Box
                sx={{
                  textAlign: 'center',
                  p: { xs: 4, md: 6 },
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                  color: '#ffffff',
                  mb: 4,
                }}
              >
                <Typography variant="h4" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {t('pricing.finalCtaTitle')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, maxWidth: 500, mx: 'auto' }}>
                  {t('pricing.finalCtaText')}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGetStartedFree}
                    sx={{
                      bgcolor: '#ffffff',
                      color: '#000000',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 3,
                      px: 5,
                      py: 1.5,
                      fontSize: '1.1rem',
                      '&:hover': { bgcolor: '#f0f0ff', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' },
                    }}
                  >
                    {t('pricing.getStartedForFree')}
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, flexWrap: 'wrap' }}>
                  {trustBadges.map((text) => (
                    <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ShieldCheck size={14} style={{ opacity: 0.8 }} />
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Footer />
    </PageWrapper>
  );
}
