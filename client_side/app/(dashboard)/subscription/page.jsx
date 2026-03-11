'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  Alert,
  Snackbar,
  Tooltip,
  Switch,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DownloadIcon from '@mui/icons-material/Download';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import HighQualityIcon from '@mui/icons-material/HighQuality';
import BlockIcon from '@mui/icons-material/Block';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BrushIcon from '@mui/icons-material/Brush';
import FolderIcon from '@mui/icons-material/Folder';
import HistoryIcon from '@mui/icons-material/History';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InsightsIcon from '@mui/icons-material/Insights';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PaymentIcon from '@mui/icons-material/Payment';
import EditIcon from '@mui/icons-material/Edit';
import ShieldIcon from '@mui/icons-material/Shield';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth'; // adjust path

// ─── Section Card (defined outside to prevent re-render focus issues) ───
function SectionCard({ children, title, icon, action, borderColor }) {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        mb: 3,
        border: borderColor ? `1px solid ${borderColor}` : 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: '#667eea12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#667eea',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" fontWeight="700" color="#1e293b">
            {title}
          </Typography>
        </Box>
        {action}
      </Box>
      <Divider />
      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isPremium = user?.plan === 'premium';

  // ─── State ───
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [updatePaymentDialogOpen, setUpdatePaymentDialogOpen] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ─── Mock Subscription Data (replace with API) ───
  const subscription = {
    plan: 'Premium',
    status: 'active', // 'active', 'cancelled', 'expired'
    price: '$9.99',
    cycle: 'monthly',
    startDate: 'January 18, 2025',
    currentPeriodStart: 'June 18, 2025',
    currentPeriodEnd: 'July 18, 2025',
    nextBillingDate: 'July 18, 2025',
    paymentMethod: {
      type: 'Visa',
      last4: '4242',
      expiry: '12/2026',
    },
    daysRemaining: 22,
    totalDays: 30,
  };

  const billingHistory = [
    { id: 1, date: 'June 18, 2025', amount: '$9.99', status: 'paid', invoice: 'INV-2025-006' },
    { id: 2, date: 'May 18, 2025', amount: '$9.99', status: 'paid', invoice: 'INV-2025-005' },
    { id: 3, date: 'April 18, 2025', amount: '$9.99', status: 'paid', invoice: 'INV-2025-004' },
    { id: 4, date: 'March 18, 2025', amount: '$9.99', status: 'paid', invoice: 'INV-2025-003' },
    { id: 5, date: 'February 18, 2025', amount: '$9.99', status: 'paid', invoice: 'INV-2025-002' },
    { id: 6, date: 'January 18, 2025', amount: '$9.99', status: 'paid', invoice: 'INV-2025-001' },
  ];

  const usageStats = {
    cvsCreated: 8,
    lettersCreated: 5,
    totalDownloads: 47,
    templatesUsed: 6,
  };

  // ─── Computed ───
  const progressPercent = ((subscription.totalDays - subscription.daysRemaining) / subscription.totalDays) * 100;
  const isCancelled = subscription.status === 'cancelled';
  const totalSpent = billingHistory.reduce((acc) => acc + 9.99, 0).toFixed(2);

  // ─── Handlers ───
  const handleCancelSubscription = () => {
    // TODO: API call
    setCancelDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Subscription cancelled. Access continues until ' + subscription.currentPeriodEnd,
      severity: 'info',
    });
  };

  const handleRenewSubscription = () => {
    // TODO: API call
    setRenewDialogOpen(false);
    setSnackbar({
      open: true,
      message: 'Subscription renewed successfully! 🎉',
      severity: 'success',
    });
  };

  const handleDownloadInvoice = (invoice) => {
    // TODO: API call to download invoice PDF
    setSnackbar({
      open: true,
      message: `Downloading ${invoice}...`,
      severity: 'info',
    });
  };

  // ─── Redirect non-premium users ───
  if (!isPremium) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ textTransform: 'none', color: '#64748b', mb: 3 }}
        >
          Back
        </Button>

        <Box
          sx={{
            textAlign: 'center',
            py: 10,
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
              bgcolor: '#667eea15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <StarIcon sx={{ fontSize: 40, color: '#667eea' }} />
          </Box>
          <Typography variant="h5" fontWeight="700" color="#1e293b" gutterBottom>
            No Active Subscription
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Upgrade to Premium to access this page and unlock all features.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/upgrade')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            }}
          >
            🚀 Upgrade to Premium
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Typography variant="h4" fontWeight="700" color="#1e293b">
            💎 Subscription
          </Typography>
          <Chip
            label={isCancelled ? 'Cancelled' : 'Active'}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              bgcolor: isCancelled ? '#ef444415' : '#10b98115',
              color: isCancelled ? '#ef4444' : '#10b981',
            }}
          />
        </Box>
        <Typography variant="body2" color="#64748b">
          Manage your Premium subscription, billing, and payment methods
        </Typography>
      </Box>

      {/* ═══════════════════════════════════════════ */}
      {/* 1. ACTIVE PLAN OVERVIEW */}
      {/* ═══════════════════════════════════════════ */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          color: '#ffffff',
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.08)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <StarIcon sx={{ fontSize: 24 }} />
                <Typography variant="h5" fontWeight="800">
                  Premium Plan
                </Typography>
              </Box>
              <Typography sx={{ opacity: 0.9 }}>
                {subscription.price}/{subscription.cycle} • Started {subscription.startDate}
              </Typography>
            </Box>

            {isCancelled ? (
              <Button
                variant="contained"
                startIcon={<AutorenewIcon />}
                onClick={() => setRenewDialogOpen(true)}
                sx={{
                  bgcolor: '#ffffff',
                  color: '#667eea',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': { bgcolor: '#f0f0ff' },
                }}
              >
                Renew Subscription
              </Button>
            ) : (
              <Chip
                icon={<CheckCircleIcon sx={{ color: '#ffffff !important', fontSize: 16 }} />}
                label="Active"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              />
            )}
          </Box>

          {/* Billing Period Progress */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Current billing period
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {subscription.daysRemaining} days remaining
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: '#ffffff',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {subscription.currentPeriodStart}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {subscription.currentPeriodEnd}
              </Typography>
            </Box>
          </Box>

          {/* Quick Stats */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
              gap: 2,
              mt: 3,
            }}
          >
            {[
              { label: 'CVs Created', value: usageStats.cvsCreated, icon: <DescriptionIcon sx={{ fontSize: 18 }} /> },
              { label: 'Letters', value: usageStats.lettersCreated, icon: <MailOutlineIcon sx={{ fontSize: 18 }} /> },
              { label: 'Downloads', value: usageStats.totalDownloads, icon: <DownloadIcon sx={{ fontSize: 18 }} /> },
              { label: 'Templates', value: usageStats.templatesUsed, icon: <BrushIcon sx={{ fontSize: 18 }} /> },
            ].map((stat, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                }}
              >
                <Box sx={{ mb: 0.5, opacity: 0.8 }}>{stat.icon}</Box>
                <Typography variant="h6" fontWeight="800">
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Cancelled Warning */}
      {isCancelled && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              size="small"
              onClick={() => setRenewDialogOpen(true)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Renew Now
            </Button>
          }
        >
          Your subscription has been cancelled. You&apos;ll have access until{' '}
          <strong>{subscription.currentPeriodEnd}</strong>.
        </Alert>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* 2. PLAN FEATURES */}
      {/* ═══════════════════════════════════════════ */}
      <SectionCard
        title="Plan Features"
        icon={<StarIcon fontSize="small" />}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.5,
          }}
        >
          {[
            { text: 'Unlimited CVs & Letters', icon: <AllInclusiveIcon sx={{ fontSize: 18 }} /> },
            { text: 'No Watermark', icon: <BlockIcon sx={{ fontSize: 18 }} /> },
            { text: 'High-Quality Exports (300 DPI)', icon: <HighQualityIcon sx={{ fontSize: 18 }} /> },
            { text: 'PDF, DOCX, PNG, JPG', icon: <PictureAsPdfIcon sx={{ fontSize: 18 }} /> },
            { text: 'All Premium Templates', icon: <BrushIcon sx={{ fontSize: 18 }} /> },
            { text: 'Folders & Organization', icon: <FolderIcon sx={{ fontSize: 18 }} /> },
            { text: 'Version History', icon: <HistoryIcon sx={{ fontSize: 18 }} /> },
            { text: 'AI-Powered Suggestions', icon: <AutoAwesomeIcon sx={{ fontSize: 18 }} /> },
            { text: 'Advanced Analytics', icon: <InsightsIcon sx={{ fontSize: 18 }} /> },
            { text: 'Priority Support', icon: <SupportAgentIcon sx={{ fontSize: 18 }} /> },
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1,
                px: 1.5,
                borderRadius: 2,
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              <Box sx={{ color: '#667eea' }}>{feature.icon}</Box>
              <Typography variant="body2" color="#1e293b" fontWeight="500">
                {feature.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </SectionCard>

      {/* ═══════════════════════════════════════════ */}
      {/* 3. PAYMENT METHOD */}
      {/* ═══════════════════════════════════════════ */}
      <SectionCard
        title="Payment Method"
        icon={<CreditCardIcon fontSize="small" />}
        action={
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => setUpdatePaymentDialogOpen(true)}
            sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}
          >
            Update
          </Button>
        }
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2.5,
            borderRadius: 2,
            bgcolor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            {/* Card Icon */}
            <Box
              sx={{
                width: 52,
                height: 36,
                borderRadius: 1.5,
                bgcolor: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PaymentIcon sx={{ color: '#ffffff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight="600" color="#1e293b">
                {subscription.paymentMethod.type} •••• {subscription.paymentMethod.last4}
              </Typography>
              <Typography variant="caption" color="#94a3b8">
                Expires {subscription.paymentMethod.expiry}
              </Typography>
            </Box>
          </Box>
          <Chip
            label="Default"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.65rem',
              bgcolor: '#667eea15',
              color: '#667eea',
            }}
          />
        </Box>

        {/* Auto-Renew Toggle */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2.5,
            p: 2,
            borderRadius: 2,
            bgcolor: '#f8fafc',
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight="600" color="#1e293b">
              Auto-Renew
            </Typography>
            <Typography variant="caption" color="#94a3b8">
              Automatically renew subscription at end of billing period
            </Typography>
          </Box>
          <Switch
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#667eea' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#667eea',
              },
            }}
          />
        </Box>

        {/* Next Billing */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mt: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: '#667eea08',
            border: '1px solid #667eea20',
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 18, color: '#667eea' }} />
          <Typography variant="body2" color="#64748b">
            {isCancelled ? (
              <>Access expires on <strong>{subscription.currentPeriodEnd}</strong></>
            ) : (
              <>Next billing: <strong>{subscription.nextBillingDate}</strong> — {subscription.price}</>
            )}
          </Typography>
        </Box>
      </SectionCard>

      {/* ═══════════════════════════════════════════ */}
      {/* 4. BILLING HISTORY */}
      {/* ═══════════════════════════════════════════ */}
      <SectionCard
        title="Billing History"
        icon={<ReceiptIcon fontSize="small" />}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="#64748b">
              Total spent:
            </Typography>
            <Chip
              label={`$${totalSpent}`}
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: '#667eea15',
                color: '#667eea',
              }}
            />
          </Box>
        }
      >
        {/* Table Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '2fr 1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' },
            gap: 2,
            p: 1.5,
            bgcolor: '#f8fafc',
            borderRadius: 2,
            mb: 1,
          }}
        >
          <Typography variant="caption" fontWeight="700" color="#64748b">DATE</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b">AMOUNT</Typography>
          <Typography variant="caption" fontWeight="700" color="#64748b">STATUS</Typography>
          <Typography
            variant="caption"
            fontWeight="700"
            color="#64748b"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            INVOICE
          </Typography>
          <Typography
            variant="caption"
            fontWeight="700"
            color="#64748b"
            sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}
          >
            ACTION
          </Typography>
        </Box>

        {/* Rows */}
        {billingHistory.map((entry, index) => (
          <Box
            key={entry.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '2fr 1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' },
              gap: 2,
              p: 1.5,
              alignItems: 'center',
              borderBottom: index < billingHistory.length - 1 ? '1px solid #f1f5f9' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: '#f8fafc' },
              borderRadius: 1,
            }}
          >
            {/* Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
              <Typography variant="body2" color="#1e293b" fontWeight="500">
                {entry.date}
              </Typography>
            </Box>

            {/* Amount */}
            <Typography variant="body2" fontWeight="600" color="#1e293b">
              {entry.amount}
            </Typography>

            {/* Status */}
            <Chip
              label={entry.status === 'paid' ? 'Paid' : entry.status}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.65rem',
                height: 22,
                width: 'fit-content',
                bgcolor: entry.status === 'paid' ? '#10b98115' : '#f59e0b15',
                color: entry.status === 'paid' ? '#10b981' : '#f59e0b',
              }}
            />

            {/* Invoice Number */}
            <Typography
              variant="body2"
              color="#94a3b8"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              {entry.invoice}
            </Typography>

            {/* Download */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              <Tooltip title="Download Invoice">
                <IconButton
                  size="small"
                  onClick={() => handleDownloadInvoice(entry.invoice)}
                  sx={{
                    color: '#667eea',
                    '&:hover': { bgcolor: '#667eea10' },
                  }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}

        {/* Download All */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            sx={{
              textTransform: 'none',
              color: '#667eea',
              fontWeight: 600,
              '&:hover': { bgcolor: '#667eea10' },
            }}
          >
            Download All Invoices
          </Button>
        </Box>
      </SectionCard>

      {/* ═══════════════════════════════════════════ */}
      {/* 5. CANCEL / RENEW */}
      {/* ═══════════════════════════════════════════ */}
      <SectionCard
        title={isCancelled ? 'Renew Subscription' : 'Cancel Subscription'}
        icon={isCancelled ? <AutorenewIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
        borderColor={isCancelled ? '#667eea40' : '#ef444430'}
      >
        {isCancelled ? (
          /* ─── Renew State ─── */
          <Box>
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              Your subscription was cancelled. Premium features will be removed after{' '}
              <strong>{subscription.currentPeriodEnd}</strong>.
            </Alert>

            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
              Renew now to keep all your premium benefits:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
              {[
                'Unlimited CVs & Letters',
                'No Watermark on downloads',
                'All premium templates',
                'DOCX, PNG, JPG formats',
                'Priority support',
              ].map((feature, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#667eea' }} />
                  <Typography variant="body2" color="#1e293b">{feature}</Typography>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AutorenewIcon />}
              onClick={() => setRenewDialogOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                },
              }}
            >
              Renew Premium — {subscription.price}/{subscription.cycle}
            </Button>
          </Box>
        ) : (
          /* ─── Cancel State ─── */
          <Box>
            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
              We&apos;re sorry to see you go. If you cancel, you&apos;ll lose access to premium features
              at the end of your current billing period.
            </Typography>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#fef3c7',
                border: '1px solid #fcd34d',
                mb: 3,
              }}
            >
              <Typography variant="body2" fontWeight="600" color="#92400e" sx={{ mb: 1 }}>
                You&apos;ll lose access to:
              </Typography>
              {[
                'Watermark-free downloads',
                'DOCX, PNG, JPG formats',
                'Premium templates',
                'Unlimited CVs (limit to 3)',
                'Version history & analytics',
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.3 }}>
                  <CancelIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                  <Typography variant="body2" color="#92400e">{item}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setCancelDialogOpen(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Cancel Subscription
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  // TODO: Open support chat
                  setSnackbar({
                    open: true,
                    message: 'Opening support chat...',
                    severity: 'info',
                  });
                }}
                sx={{
                  textTransform: 'none',
                  color: '#667eea',
                  fontWeight: 600,
                }}
              >
                Talk to Support Instead
              </Button>
            </Box>
          </Box>
        )}
      </SectionCard>

      {/* ═══════════════════════════════════════════ */}
      {/* DIALOGS */}
      {/* ═══════════════════════════════════════════ */}

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#ef4444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon />
            Cancel Premium Subscription?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            Your premium access will continue until <strong>{subscription.currentPeriodEnd}</strong>.
            After that:
          </Typography>

          <Box sx={{ mb: 2 }}>
            {[
              'Downloads will include a watermark',
              'Only PDF format available',
              'Limited to 3 CVs and 3 letters',
              'No access to premium templates',
              'Standard quality exports only',
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                <CancelIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                <Typography variant="body2" color="#64748b">{item}</Typography>
              </Box>
            ))}
          </Box>

          <Alert severity="info" sx={{ borderRadius: 2 }}>
            You can renew anytime to restore premium access.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => setCancelDialogOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: '#667eea',
              '&:hover': { bgcolor: '#5a6fd6' },
            }}
          >
            Keep Premium
          </Button>
          <Button
            onClick={handleCancelSubscription}
            color="error"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog
        open={renewDialogOpen}
        onClose={() => setRenewDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutorenewIcon sx={{ color: '#667eea' }} />
            Renew Premium
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            Welcome back! Renewing will restore all premium features immediately.
          </Typography>

          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: '#667eea08',
              border: '1px solid #667eea20',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" fontWeight="700" color="#1e293b">
                  Premium Plan
                </Typography>
                <Typography variant="caption" color="#94a3b8">
                  Billed {subscription.cycle}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="800" color="#667eea">
                {subscription.price}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCardIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
            <Typography variant="caption" color="#94a3b8">
              Charged to {subscription.paymentMethod.type} ••••{subscription.paymentMethod.last4}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRenewDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#64748b', borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleRenewSubscription}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            🚀 Renew Now — {subscription.price}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Payment Dialog */}
      <Dialog
        open={updatePaymentDialogOpen}
        onClose={() => setUpdatePaymentDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Update Payment Method</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
            You&apos;ll be redirected to our secure payment provider to update your card details.
          </Typography>

          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <ShieldIcon sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
            <Typography variant="body2" fontWeight="600" color="#1e293b">
              Secure Payment
            </Typography>
            <Typography variant="caption" color="#94a3b8">
              Powered by Stripe. We never store your card details.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setUpdatePaymentDialogOpen(false)}
            sx={{ textTransform: 'none', color: '#64748b', borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setUpdatePaymentDialogOpen(false);
              // TODO: Redirect to Stripe customer portal
              setSnackbar({ open: true, message: 'Redirecting to payment portal...', severity: 'info' });
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: '#667eea',
              '&:hover': { bgcolor: '#5a6fd6' },
            }}
          >
            Update Card
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}