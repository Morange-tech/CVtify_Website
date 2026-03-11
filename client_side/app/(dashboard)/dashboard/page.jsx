'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import AppSidebar from '../../components/AppSidebar';
import { useState } from 'react';

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { SidebarProvider } from '../../components/SidebarContext';
import ModalComponent from '../../components/ModalComponent';

// ─────────────────────────────────────────────
// REUSABLE: Stat Card
// ─────────────────────────────────────────────
function StatCard({ label, value, color, icon, sub }) {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            width: 45,
            height: 45,
            borderRadius: 2,
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" fontWeight="700" color="#1e293b">
        {value}
      </Typography>
      <Typography variant="body2" color="#64748b" fontWeight="500">
        {label}
      </Typography>
      <Typography variant="caption" color={color} fontWeight="600" sx={{ mt: 0.5, display: 'block' }}>
        {sub}
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────
// FREE USER: Upgrade Banner
// ─────────────────────────────────────────────
function UpgradeBanner({ onUpgradeClick }) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 4,
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight="700" gutterBottom>
          🚀 Unlock Premium Features
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Get advanced stats, profile strength score, unlimited CVs, premium templates & more.
        </Typography>
      </Box>
      <Button
        onClick={onUpgradeClick}
        variant="contained"
        sx={{
          bgcolor: '#ffffff',
          color: '#667eea',
          fontWeight: 700,
          textTransform: 'none',
          px: 4,
          py: 1.5,
          borderRadius: 2,
          '&:hover': {
            bgcolor: '#f0f0ff',
          },
        }}
      >
        Upgrade Now
      </Button>
    </Box>
  );
}

// ─────────────────────────────────────────────
// FREE USER: Recent Documents
// ─────────────────────────────────────────────
function RecentDocuments() {
  const docs = [
    {
      title: 'Software Developer CV',
      template: 'Professional',
      lastEdited: '2 hours ago',
      downloads: 5,
      status: 'Complete',
      statusColor: '#10b981',
    },
    {
      title: 'UX Designer Resume',
      template: 'Modern',
      lastEdited: '3 days ago',
      downloads: 4,
      status: 'Complete',
      statusColor: '#10b981',
    },
    {
      title: 'Project Manager CV',
      template: 'Classic',
      lastEdited: '1 week ago',
      downloads: 3,
      status: 'Draft',
      statusColor: '#f59e0b',
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="700">
          Recent Documents
        </Typography>
        <Button
          size="small"
          sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}
        >
          View All →
        </Button>
      </Box>

      {docs.map((cv, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            mb: 1.5,
            borderRadius: 2,
            bgcolor: '#f8fafc',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: '#f1f5f9',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 42,
                height: 54,
                borderRadius: 1,
                bgcolor: '#667eea15',
                border: '1px solid #667eea30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
              }}
            >
              📄
            </Box>
            <Box>
              <Typography variant="body1" fontWeight="600" color="#1e293b">
                {cv.title}
              </Typography>
              <Typography variant="caption" color="#94a3b8">
                {cv.template} • Edited {cv.lastEdited}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 5,
                bgcolor: `${cv.statusColor}15`,
                color: cv.statusColor,
                fontSize: '0.7rem',
                fontWeight: 600,
              }}
            >
              {cv.status}
            </Box>
            <Typography variant="caption" color="#94a3b8">
              ⬇️ {cv.downloads}
            </Typography>
          </Box>
        </Box>
      ))}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          mt: 2,
          borderRadius: 2,
          border: '2px dashed #e2e8f0',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#667eea',
            bgcolor: '#667eea08',
          },
        }}
      >
        <Typography variant="body2" color="#94a3b8" fontWeight="600">
          ➕ Create New CV
        </Typography>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────
// PREMIUM USER: Profile Strength Score
// ─────────────────────────────────────────────
function ProfileStrengthScore() {
  const score = 72;

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" fontWeight="700" gutterBottom>
        Profile Strength
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3, position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={140}
          thickness={5}
          sx={{ color: '#e2e8f0', position: 'absolute' }}
        />
        <CircularProgress
          variant="determinate"
          value={score}
          size={140}
          thickness={5}
          sx={{
            color: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
          }}
        />
        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="800" color="#1e293b">
            {score}
          </Typography>
          <Typography variant="caption" color="#94a3b8" fontWeight="600">
            out of 100
          </Typography>
        </Box>
      </Box>

      {[
        { label: 'Personal Info', progress: 100, color: '#10b981' },
        { label: 'Work Experience', progress: 80, color: '#667eea' },
        { label: 'Education', progress: 90, color: '#667eea' },
        { label: 'Skills', progress: 60, color: '#f59e0b' },
        { label: 'Summary', progress: 30, color: '#ef4444' },
      ].map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="#64748b" fontWeight="500">
              {item.label}
            </Typography>
            <Typography variant="body2" color={item.color} fontWeight="600">
              {item.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={item.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#e2e8f0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: item.color,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

// ─────────────────────────────────────────────
// PREMIUM USER: Tips to Improve CV
// ─────────────────────────────────────────────
function TipsToImprove() {
  const tips = [
    { tip: 'Add a professional summary', impact: 'High Impact', color: '#ef4444' },
    { tip: 'Include measurable achievements', impact: 'High Impact', color: '#ef4444' },
    { tip: 'Add relevant skills section', impact: 'Medium Impact', color: '#f59e0b' },
    { tip: 'Upload a professional photo', impact: 'Low Impact', color: '#10b981' },
  ];

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" fontWeight="700" gutterBottom>
        Tips to Improve
      </Typography>
      {tips.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
            borderBottom: index < tips.length - 1 ? '1px solid #f1f5f9' : 'none',
          }}
        >
          <Typography variant="body2" color="#1e293b">
            💡 {item.tip}
          </Typography>
          <Typography
            variant="caption"
            fontWeight="600"
            sx={{
              color: item.color,
              bgcolor: `${item.color}15`,
              px: 1,
              py: 0.3,
              borderRadius: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {item.impact}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// ─────────────────────────────────────────────
// PREMIUM USER: Advanced Stats
// ─────────────────────────────────────────────
function AdvancedStats() {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" fontWeight="700" gutterBottom>
        📊 Advanced Analytics
      </Typography>

      {[
        { label: 'CV Views (30d)', value: '142', change: '+23%', changeColor: '#10b981' },
        { label: 'Download Rate', value: '68%', change: '+5%', changeColor: '#10b981' },
        { label: 'Avg. Time Spent', value: '2m 34s', change: '-12%', changeColor: '#ef4444' },
        { label: 'ATS Score', value: '85/100', change: '+8', changeColor: '#10b981' },
      ].map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
            borderBottom: index < 3 ? '1px solid #f1f5f9' : 'none',
          }}
        >
          <Box>
            <Typography variant="body2" color="#64748b">
              {item.label}
            </Typography>
            <Typography variant="h6" fontWeight="700" color="#1e293b">
              {item.value}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 5,
              bgcolor: `${item.changeColor}15`,
              color: item.changeColor,
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {item.change}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// ─────────────────────────────────────────────
// SHARED: Quick Actions
// ─────────────────────────────────────────────
function QuickActions() {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" fontWeight="700" gutterBottom>
        Quick Actions
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {[
          { label: 'Create New CV', icon: '➕', color: '#667eea', bg: '#667eea' },
          { label: 'Browse Templates', icon: '🎨', color: '#764ba2', bg: null },
          { label: 'Import from LinkedIn', icon: '🔗', color: '#0077b5', bg: null },
          { label: 'Export All as PDF', icon: '📥', color: '#10b981', bg: null },
        ].map((action, index) => (
          <Button
            key={index}
            fullWidth
            variant={index === 0 ? 'contained' : 'text'}
            sx={{
              justifyContent: 'flex-start',
              gap: 1.5,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              ...(index === 0
                ? {
                    background: `linear-gradient(135deg, ${action.bg} 0%, #764ba2 100%)`,
                    color: '#ffffff',
                    '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' },
                  }
                : {
                    color: '#1e293b',
                    bgcolor: '#f8fafc',
                    '&:hover': { bgcolor: `${action.color}10`, color: action.color },
                  }),
            }}
          >
            <span>{action.icon}</span>
            {action.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────
// SHARED: Storage Usage
// ─────────────────────────────────────────────
function StorageUsage({ isPremium }) {
  const used = 3;
  const max = isPremium ? 100 : 10;
  const percent = Math.round((used / max) * 100);

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" fontWeight="700" gutterBottom>
        Storage
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="#64748b">
            {used} of {max} CVs used
          </Typography>
          <Typography variant="body2" color="#667eea" fontWeight="600">
            {percent}%
          </Typography>
        </Box>
        <Box sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0', overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              width: `${percent}%`,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          />
        </Box>
      </Box>
      <Typography variant="caption" color="#94a3b8">
        {isPremium ? 'Premium plan: 100 CVs max' : 'Free plan: 10 CVs max'}
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────
// FREE DASHBOARD VIEW
// ─────────────────────────────────────────────
function FreeDashboard({ user, onUpgradeClick }) {
  const freeStats = [
    { label: 'CVs Created', value: '3', color: '#667eea', icon: '📄', sub: '+1 this week' },
    { label: 'Downloads', value: '12', color: '#10b981', icon: '⬇️', sub: '+4 this month' },
    { label: 'Templates Used', value: '2', color: '#764ba2', icon: '🎨', sub: 'Professional, Modern' },
    { label: 'Last Edited', value: '2h ago', color: '#f59e0b', icon: '✏️', sub: 'Software Dev CV' },
  ];

  return (
    <>
      <UpgradeBanner onUpgradeClick={onUpgradeClick} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        {freeStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <RecentDocuments />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <QuickActions />
          <StorageUsage isPremium={false} />
        </Box>
      </Box>
    </>
  );
}

// ─────────────────────────────────────────────
// PREMIUM DASHBOARD VIEW
// ─────────────────────────────────────────────
function PremiumDashboard({ user }) {
  const premiumStats = [
    { label: 'CVs Created', value: '8', color: '#667eea', icon: '📄', sub: '+3 this week' },
    { label: 'Downloads', value: '47', color: '#10b981', icon: '⬇️', sub: '+12 this month' },
    { label: 'ATS Score', value: '85', color: '#764ba2', icon: '🎯', sub: 'Above average' },
    { label: 'Profile Views', value: '142', color: '#f59e0b', icon: '👁️', sub: '+23% this month' },
  ];

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        {premiumStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <AdvancedStats />
          <RecentDocuments />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ProfileStrengthScore />
          <TipsToImprove />
          <QuickActions />
          <StorageUsage isPremium={true} />
        </Box>
      </Box>
    </>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD CONTENT
// ─────────────────────────────────────────────
function DashboardContent() {
  const { user, logoutMutation } = useAuth();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isPremium = user?.plan === 'premium';

  return (
    <Box sx={{ display: 'flex' }}>
      {/* SIDEBAR */}
      <AppSidebar />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f8fafc',
          minHeight: '100vh',
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="700">
            CVtify
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isPremium && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                ⭐ PREMIUM
              </Box>
            )}
            <Avatar src={user?.avatar} sx={{ bgcolor: '#667eea' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography>Welcome, {user?.name}</Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? <CircularProgress size={20} /> : 'Logout'}
            </Button>
          </Box>
        </Box>

        {/* PAGE CONTENT */}
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </Typography>
            <Typography variant="body1" color="#64748b">
              {isPremium
                ? "Here's your advanced dashboard overview"
                : "Here's what's happening with your CVs"}
            </Typography>
          </Box>

          {/* ✅ CONDITIONAL RENDERING */}
          {isPremium ? (
            <PremiumDashboard user={user} />
          ) : (
            <FreeDashboard
              user={user}
              onUpgradeClick={() => setUpgradeModalOpen(true)}
            />
          )}
        </Box>

        {/* ✅ MODAL - rendered once here */}
        <ModalComponent
          open={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
        />
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────
// PAGE EXPORT
// ─────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardContent />
      </SidebarProvider>
    </ProtectedRoute>
  );
}