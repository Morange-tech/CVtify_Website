'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Switch,
  Divider,
  IconButton,
} from '@mui/material';
import {
  CheckCircle2,
  XCircle,
  Star,
  ArrowLeft,
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
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth'; // adjust path
import useUpgradeContent from '../../hooks/useUpgradeContent';
import {
  calculateSavings,
  getPerMonth,
  getCurrentPrice,
} from '../../helpers/upgradeHelpers';

export default function UpgradePage() {
  const router = useRouter();
  const { user } = useAuth();
  const isPremium = user?.plan === 'premium';
  const { plans, faqs, loading, error } = useUpgradeContent();

  const freePlan = plans?.free;
  const premiumPlan = plans?.premium;
  const monthlyPrice = Number(premiumPlan?.monthlyPrice || 0);
  const yearlyPrice = Number(premiumPlan?.yearlyPrice || 0);
  const yearlyMonthly = getPerMonth(monthlyPrice, yearlyPrice, 'yearly');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const currentPrice = getCurrentPrice(monthlyPrice, yearlyPrice, billingCycle);
  const savings = calculateSavings(monthlyPrice, yearlyPrice);
  const perMonth = getPerMonth(monthlyPrice, yearlyPrice, billingCycle);





  // If already premium, show a different state
  if (isPremium) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => router.back()}
          sx={{ textTransform: 'none', color: '#64748b', mb: 3 }}
        >
          Back
        </Button>

        <Box
          sx={{
            textAlign: 'center',
            py: 8,
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
            You&apos;re Already Premium! 🎉
          </Typography>
          <Typography variant="body1" color="#64748b" sx={{ mb: 3 }}>
            You have full access to all features, formats, and templates.
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
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading upgrade content...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowLeft size={18} />}
        onClick={() => router.back()}
        sx={{ textTransform: 'none', color: '#64748b', mb: 3 }}
      >
        Back
      </Button>

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            mb: 4,
            flexWrap: 'wrap',
          }}
        >
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
              {/* Fake CV lines */}
              <Box sx={{ width: '60%', height: 8, bgcolor: '#e2e8f0', borderRadius: 1 }} />
              <Box sx={{ width: '80%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '70%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '90%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '50%', height: 8, bgcolor: '#e2e8f0', borderRadius: 1, mt: 1 }} />
              <Box sx={{ width: '85%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '75%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '65%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />

              {/* Watermark Overlay */}
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
              <XCircle size={14} /> With Watermark
            </Typography>
          </Box>

          {/* Arrow */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#94a3b8',
            }}
          >
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
              {/* Fake CV lines - cleaner */}
              <Box sx={{ width: '60%', height: 8, bgcolor: '#00000030', borderRadius: 1 }} />
              <Box sx={{ width: '80%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '70%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '90%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '50%', height: 8, bgcolor: '#00000030', borderRadius: 1, mt: 1 }} />
              <Box sx={{ width: '85%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '75%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              <Box sx={{ width: '65%', height: 5, bgcolor: '#f1f5f9', borderRadius: 1 }} />

              {/* Premium badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
              >
                <Star size={16} color="#EAB308" />
              </Box>
            </Box>
            <Typography variant="caption" color="#10b981" fontWeight="600" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
              <CheckCircle2 size={14} /> Clean & Professional
            </Typography>
          </Box>
        </Box>

        <Typography variant="h3" fontWeight="800" color="#1e293b" gutterBottom sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
          Remove Watermark &
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
            Unlock Everything
          </Box>
        </Typography>
        <Typography variant="body1" color="#64748b" sx={{ maxWidth: 600, mx: 'auto' }}>
          Get professional, watermark-free downloads in multiple formats with premium templates and advanced features.
        </Typography>
      </Box>

      {/* ─── BILLING TOGGLE ─── */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          mb: 5,
        }}
      >
        <Typography
          variant="body1"
          fontWeight={billingCycle === 'monthly' ? 700 : 400}
          color={billingCycle === 'monthly' ? '#1e293b' : '#94a3b8'}
        >
          Monthly
        </Typography>
        <Switch
          checked={billingCycle === 'yearly'}
          onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#000000',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#000000',
            },
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body1"
            fontWeight={billingCycle === 'yearly' ? 700 : 400}
            color={billingCycle === 'yearly' ? '#1e293b' : '#94a3b8'}
          >
            Yearly
          </Typography>
          <Chip
            label={`Save ${savings}%`}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              bgcolor: '#10b98115',
              color: '#10b981',
            }}
          />
        </Box>
      </Box>

      {/* ─── PLAN COMPARISON ─── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 6,
        }}
      >
        {/* FREE PLAN */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderRadius: 4,
            border: '2px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 4 }}>
            <Typography variant="overline" color="#94a3b8" fontWeight="700">
              Free Plan
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1, mb: 1 }}>
              <Typography variant="h3" fontWeight="800" color="#1e293b">
                $0
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                /forever
              </Typography>
            </Box>
            <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
              Basic features to get started
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              disabled
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                py: 1.5,
                borderColor: '#e2e8f0',
                color: '#94a3b8',
              }}
            >
              Current Plan
            </Button>
          </Box>

          <Divider />

          <Box sx={{ p: 4 }}>
            <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
              What&apos;s included:
            </Typography>
            {[
              { text: '3 CVs', included: true },
              { text: '3 Motivation Letters', included: true },
              { text: 'PDF Download', included: true },
              { text: 'Basic Templates', included: true },
              { text: 'Watermark on exports', included: true, negative: true },
              { text: 'Standard Quality', included: true, negative: true },
              { text: 'DOCX, PNG, JPG formats', included: false },
              { text: 'Premium Templates', included: false },
              { text: 'Folders & Organization', included: false },
              { text: 'Version History', included: false },
              { text: 'Advanced Analytics', included: false },
              { text: 'Priority Support', included: false },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 0.8,
                }}
              >
                {feature.included ? (
                  feature.negative ? (
                    <XCircle size={18} color="#f59e0b" />
                  ) : (
                    <CheckCircle2 size={18} color="#10b981" />
                  )
                ) : (
                  <XCircle size={18} color="#e2e8f0" />
                )}
                <Typography
                  variant="body2"
                  color={feature.included ? '#1e293b' : '#94a3b8'}
                  sx={{
                    textDecoration: !feature.included ? 'line-through' : 'none',
                    fontWeight: feature.negative ? 500 : 400,
                  }}
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
          {/* Recommended Badge */}
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
            <Sparkles size={14} /> Recommended
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="overline" color="#000000" fontWeight="700">
              Premium Plan
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1, mb: 1 }}>
              <Typography variant="h3" fontWeight="800" color="#1e293b">
                ${perMonth}
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                /month
              </Typography>
            </Box>
            {billingCycle === 'yearly' && (
              <Typography variant="caption" color="#10b981" fontWeight="600">
                ${yearlyPrice} billed annually (save {savings}%)
              </Typography>
            )}
            <Typography variant="body2" color="#64748b" sx={{ mb: 3, mt: 0.5 }}>
              Everything you need to land your dream job
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                // TODO: Integrate payment (Stripe, etc.)
                console.log('Upgrade clicked', { billingCycle, price: currentPrice });
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                py: 1.5,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Rocket size={18} style={{ marginRight: 8 }} /> Get Premium Now
            </Button>
          </Box>

          <Divider />

          <Box sx={{ p: 4 }}>
            <Typography variant="body2" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
              Everything in Free, plus:
            </Typography>
            {[
              { text: 'Unlimited CVs & Letters', icon: <InfinityIcon size={18} /> },
              { text: 'No Watermark', icon: <Ban size={18} /> },
              { text: 'High-Quality Exports', icon: <BadgeCheck size={18} /> },
              { text: 'PDF, DOCX, PNG, JPG formats', icon: <FileType size={18} /> },
              { text: 'All Premium Templates', icon: <Paintbrush size={18} /> },
              { text: 'Folders & Organization', icon: <Folder size={18} /> },
              { text: 'Version History', icon: <History size={18} /> },
              { text: 'Advanced Analytics', icon: <LineChart size={18} /> },
              { text: 'Priority Support', icon: <Headset size={18} /> },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 0.8,
                }}
              >
                <Box sx={{ color: '#000000' }}>{feature.icon}</Box>
                <Typography variant="body2" color="#1e293b" fontWeight="500">
                  {feature.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ─── FORMAT COMPARISON ─── */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderRadius: 4,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          mb: 6,
        }}
      >
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="800" color="#1e293b" gutterBottom>
            Download Formats Comparison
          </Typography>
          <Typography variant="body2" color="#64748b">
            See what you get with each plan
          </Typography>
        </Box>

        {/* Table */}
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 500 }}>
            {/* Header */}
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
                FEATURE
              </Typography>
              <Typography variant="body2" fontWeight="700" color="#64748b" textAlign="center">
                FREE
              </Typography>
              <Typography variant="body2" fontWeight="700" color="#000000" textAlign="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                PREMIUM <Star size={14} />
              </Typography>
            </Box>

            {/* Rows */}
            {[
              { feature: 'PDF Export', free: true, premium: true },
              { feature: 'DOCX Export', free: false, premium: true },
              { feature: 'PNG Export', free: false, premium: true },
              { feature: 'JPG Export', free: false, premium: true },
              { feature: 'High Quality (300 DPI)', free: false, premium: true },
              { feature: 'No Watermark', free: false, premium: true },
              { feature: 'Custom File Name', free: false, premium: true },
              { feature: 'Batch Download', free: false, premium: true },
            ].map((row, index) => (
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
                  {row.free ? (
                    <CheckCircle2 size={20} color="#10b981" />
                  ) : (
                    <XCircle size={20} color="#e2e8f0" />
                  )}
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
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderRadius: 4,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          p: 4,
          mb: 6,
        }}
      >
        <Typography variant="h5" fontWeight="800" color="#1e293b" textAlign="center" gutterBottom>
          Frequently Asked Questions
        </Typography>

        {faqs.map((faq, index) => (
          <Box
            key={faq.id}
            sx={{
              py: 2.5,
              borderBottom: index < faqs.length - 1 ? '1px solid #f1f5f9' : 'none',
            }}
          >
            <Typography variant="body1" fontWeight="700" color="#1e293b" gutterBottom>
              {faq.question}
            </Typography>
            <Typography variant="body2" color="#64748b">
              {faq.answer}
            </Typography>
          </Box>
        ))}
      </Box>

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
          Ready to go watermark-free?
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, maxWidth: 500, mx: 'auto' }}>
          Join thousands of professionals who trust CVtify for their career documents.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => {
            // TODO: Integrate payment
            console.log('Final CTA clicked');
          }}
          sx={{
            bgcolor: '#ffffff',
            color: '#000000',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 3,
            px: 5,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              bgcolor: '#f0f0ff',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            },
          }}
        >
          <Rocket size={18} style={{ marginRight: 8 }} /> Get Premium — ${perMonth}/mo
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, flexWrap: 'wrap' }}>
          {['Cancel anytime', '7-day guarantee', 'Secure payment'].map((text) => (
            <Box
              key={text}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <ShieldCheck size={14} style={{ opacity: 0.8 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}