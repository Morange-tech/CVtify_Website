// app/dashboard/page.jsx
'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import useDashboard from '../../hooks/useDashboard';
import AppSidebar from '../../components/AppSidebar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  LinearProgress,
  Skeleton,
  Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { SidebarProvider } from '../../components/SidebarContext';
import ModalComponent from '../../components/ModalComponent';

// ─── StatCard ───────────────────────────────────────────────────
function StatCard({ label, value, color, icon, sub, loading }) {
  if (loading) {
    return (
      <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Skeleton variant="rounded" width={45} height={45} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={60} height={40} />
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={80} height={16} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#ffffff', p: 3, borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box
          sx={{
            width: 45, height: 45, borderRadius: 2,
            bgcolor: `${color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" fontWeight="700" color="#1e293b">{value}</Typography>
      <Typography variant="body2" color="#64748b" fontWeight="500">{label}</Typography>
      <Typography variant="caption" color={color} fontWeight="600" sx={{ mt: 0.5, display: 'block' }}>
        {sub}
      </Typography>
    </Box>
  );
}

// ─── UpgradeBanner ──────────────────────────────────────────────
function UpgradeBanner({ onUpgradeClick }) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3, p: 4, color: '#ffffff',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 2, mb: 4,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight="700" gutterBottom>🚀 Unlock Premium Features</Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Get advanced stats, profile strength score, unlimited CVs, premium templates & more.
        </Typography>
      </Box>
      <Button
        onClick={onUpgradeClick}
        variant="contained"
        sx={{
          bgcolor: '#ffffff', color: '#667eea', fontWeight: 700,
          textTransform: 'none', px: 4, py: 1.5, borderRadius: 2,
          '&:hover': { bgcolor: '#f0f0ff' },
        }}
      >
        Upgrade Now
      </Button>
    </Box>
  );
}

// ─── RecentDocuments (real data) ────────────────────────────────
function RecentDocuments({ documents, loading, onCreateNew }) {
  const router = useRouter();

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rounded" height={70} sx={{ mb: 1.5 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="700">Recent Documents</Typography>
        <Button size="small" sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}>
          View All →
        </Button>
      </Box>

      {documents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="#94a3b8" sx={{ mb: 2 }}>
            No documents yet. Create your first CV!
          </Typography>
        </Box>
      ) : (
        documents.map((doc) => (
          <Box
            key={doc.id}
            onClick={() => router.push(`/CV_Builder?document=${doc.id}&template=${doc.templateId}`)}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              p: 2, mb: 1.5, borderRadius: 2, bgcolor: '#f8fafc',
              transition: 'all 0.2s ease', cursor: 'pointer',
              '&:hover': { bgcolor: '#f1f5f9', transform: 'translateX(4px)' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 42, height: 54, borderRadius: 1,
                  bgcolor: doc.type === 'cv' ? '#667eea15' : '#f2727315',
                  border: `1px solid ${doc.type === 'cv' ? '#667eea30' : '#f2727330'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                }}
              >
                {doc.type === 'cv' ? '📄' : '✉️'}
              </Box>
              <Box>
                <Typography variant="body1" fontWeight="600" color="#1e293b">{doc.title}</Typography>
                <Typography variant="caption" color="#94a3b8">
                  {doc.template} • Edited {doc.lastEdited}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  px: 1.5, py: 0.5, borderRadius: 5,
                  bgcolor: `${doc.statusColor}15`, color: doc.statusColor,
                  fontSize: '0.7rem', fontWeight: 600,
                }}
              >
                {doc.status}
              </Box>
              <Typography variant="caption" color="#94a3b8">⬇️ {doc.downloads}</Typography>
            </Box>
          </Box>
        ))
      )}

      <Box
        onClick={onCreateNew}
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          p: 2, mt: 2, borderRadius: 2, border: '2px dashed #e2e8f0',
          cursor: 'pointer', transition: 'all 0.2s ease',
          '&:hover': { borderColor: '#667eea', bgcolor: '#667eea08' },
        }}
      >
        <Typography variant="body2" color="#94a3b8" fontWeight="600">➕ Create New CV</Typography>
      </Box>
    </Box>
  );
}

// ─── ProfileStrengthScore (real data) ───────────────────────────
function ProfileStrengthScore({ profileStrength, loading }) {
  if (loading || !profileStrength) {
    return (
      <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Skeleton variant="text" width={150} height={30} />
        <Skeleton variant="circular" width={140} height={140} sx={{ mx: 'auto', my: 3 }} />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="rounded" height={20} sx={{ mb: 1.5 }} />
        ))}
      </Box>
    );
  }

  const { score, sections } = profileStrength;

  return (
    <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Typography variant="h6" fontWeight="700" gutterBottom>Profile Strength</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3, position: 'relative' }}>
        <CircularProgress variant="determinate" value={100} size={140} thickness={5} sx={{ color: '#e2e8f0', position: 'absolute' }} />
        <CircularProgress
          variant="determinate" value={score} size={140} thickness={5}
          sx={{ color: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }}
        />
        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="800" color="#1e293b">{score}</Typography>
          <Typography variant="caption" color="#94a3b8" fontWeight="600">out of 100</Typography>
        </Box>
      </Box>
      {sections.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="#64748b" fontWeight="500">{item.label}</Typography>
            <Typography variant="body2" color={item.color} fontWeight="600">{item.progress}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate" value={item.progress}
            sx={{
              height: 6, borderRadius: 3, bgcolor: '#e2e8f0',
              '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: item.color },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

// ─── TipsToImprove (real data) ──────────────────────────────────
function TipsToImprove({ tips, loading }) {
  if (loading) {
    return (
      <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Skeleton variant="text" width={140} height={30} />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="text" height={40} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Typography variant="h6" fontWeight="700" gutterBottom>Tips to Improve</Typography>
      {tips.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            py: 1.5, borderBottom: index < tips.length - 1 ? '1px solid #f1f5f9' : 'none',
          }}
        >
          <Typography variant="body2" color="#1e293b">💡 {item.tip}</Typography>
          <Typography
            variant="caption" fontWeight="600"
            sx={{ color: item.color, bgcolor: `${item.color}15`, px: 1, py: 0.3, borderRadius: 1, whiteSpace: 'nowrap' }}
          >
            {item.impact}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// ─── AdvancedStats (real data) ──────────────────────────────────
function AdvancedStats({ advancedStats, loading }) {
  if (loading) {
    return (
      <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Skeleton variant="text" width={180} height={30} />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Typography variant="h6" fontWeight="700" gutterBottom>📊 Advanced Analytics</Typography>
      {advancedStats.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            py: 2, borderBottom: index < advancedStats.length - 1 ? '1px solid #f1f5f9' : 'none',
          }}
        >
          <Box>
            <Typography variant="body2" color="#64748b">{item.label}</Typography>
            <Typography variant="h6" fontWeight="700" color="#1e293b">{item.value}</Typography>
          </Box>
          <Box
            sx={{
              px: 1.5, py: 0.5, borderRadius: 5,
              bgcolor: `${item.changeColor}15`, color: item.changeColor,
              fontSize: '0.75rem', fontWeight: 700,
            }}
          >
            {item.change}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// ─── QuickActions ───────────────────────────────────────────────
function QuickActions() {
  const router = useRouter();

  const actions = [
    { label: 'Create New CV', icon: '➕', color: '#667eea', bg: '#667eea', href: '/CV_Builder' },
    { label: 'Browse Templates', icon: '🎨', color: '#764ba2', bg: null, href: '/cvs' },
    { label: 'Motivation Letters', icon: '✉️', color: '#f27273', bg: null, href: '/motivation-letters' },
    { label: 'Export All as PDF', icon: '📥', color: '#10b981', bg: null, href: null },
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Typography variant="h6" fontWeight="700" gutterBottom>Quick Actions</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {actions.map((action, index) => (
          <Button
            key={index}
            fullWidth
            variant={index === 0 ? 'contained' : 'text'}
            onClick={() => action.href && router.push(action.href)}
            sx={{
              justifyContent: 'flex-start', gap: 1.5, py: 1.5, px: 2,
              borderRadius: 2, textTransform: 'none', fontWeight: 600,
              ...(index === 0
                ? {
                    background: `linear-gradient(135deg, ${action.bg} 0%, #764ba2 100%)`,
                    color: '#ffffff',
                    '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' },
                  }
                : {
                    color: '#1e293b', bgcolor: '#f8fafc',
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

// ─── StorageUsage (real data) ───────────────────────────────────
function StorageUsage({ storage, loading }) {
  if (loading || !storage) {
    return (
      <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Skeleton variant="text" width={80} height={30} />
        <Skeleton variant="rounded" height={8} sx={{ my: 2 }} />
        <Skeleton variant="text" width={150} height={16} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Typography variant="h6" fontWeight="700" gutterBottom>Storage</Typography>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="#64748b">{storage.used} of {storage.max} CVs used</Typography>
          <Typography variant="body2" color="#667eea" fontWeight="600">{storage.percent}%</Typography>
        </Box>
        <Box sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0', overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%', width: `${storage.percent}%`, borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          />
        </Box>
      </Box>
      <Typography variant="caption" color="#94a3b8">{storage.label}</Typography>
    </Box>
  );
}

// ─── FreeDashboard ──────────────────────────────────────────────
function FreeDashboard({ stats, recentDocuments, storage, loading, onUpgradeClick, onCreateNew }) {
  return (
    <>
      <UpgradeBanner onUpgradeClick={onUpgradeClick} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {loading
          ? [...Array(4)].map((_, i) => <StatCard key={i} loading />)
          : stats.map((stat, i) => <StatCard key={i} {...stat} />)
        }
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <RecentDocuments documents={recentDocuments} loading={loading} onCreateNew={onCreateNew} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <QuickActions />
          <StorageUsage storage={storage} loading={loading} />
        </Box>
      </Box>
    </>
  );
}

// ─── PremiumDashboard ───────────────────────────────────────────
function PremiumDashboard({ stats, recentDocuments, storage, profileStrength, advancedStats, tips, loading, onCreateNew }) {
  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {loading
          ? [...Array(4)].map((_, i) => <StatCard key={i} loading />)
          : stats.map((stat, i) => <StatCard key={i} {...stat} />)
        }
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <AdvancedStats advancedStats={advancedStats} loading={loading} />
          <RecentDocuments documents={recentDocuments} loading={loading} onCreateNew={onCreateNew} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ProfileStrengthScore profileStrength={profileStrength} loading={loading} />
          <TipsToImprove tips={tips} loading={loading} />
          <QuickActions />
          <StorageUsage storage={storage} loading={loading} />
        </Box>
      </Box>
    </>
  );
}

// ─── DashboardContent ───────────────────────────────────────────
function DashboardContent() {
  const { user: authUser, logoutMutation } = useAuth();
  const {
    loading, error, refresh,
    user, stats, recentDocuments, storage,
    isPremium, profileStrength, advancedStats, tips,
  } = useDashboard();

  const router = useRouter();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const handleLogout = () => logoutMutation.mutate();
  const handleCreateNew = () => router.push('/CV_Builder');

  const displayUser = user || authUser;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppSidebar />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="700">CVtify</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isPremium && (
              <Box
                sx={{
                  px: 1.5, py: 0.5, borderRadius: 5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff', fontSize: '0.7rem', fontWeight: 700,
                }}
              >
                ⭐ PREMIUM
              </Box>
            )}
            <Avatar src={displayUser?.avatar} sx={{ bgcolor: '#667eea' }}>
              {displayUser?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography>Welcome, {displayUser?.name}</Typography>
            <Button variant="outlined" color="error" onClick={handleLogout} disabled={logoutMutation.isPending}>
              {logoutMutation.isPending ? <CircularProgress size={20} /> : 'Logout'}
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
          {/* Error */}
          {error && (
            <Alert
              severity="error" sx={{ mb: 3 }}
              action={
                <Button color="inherit" size="small" onClick={refresh} startIcon={<RefreshIcon />}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              Welcome back, {displayUser?.name?.split(' ')[0]} 👋
            </Typography>
            <Typography variant="body1" color="#64748b">
              {isPremium ? "Here's your advanced dashboard overview" : "Here's what's happening with your CVs"}
            </Typography>
          </Box>

          {isPremium ? (
            <PremiumDashboard
              stats={stats}
              recentDocuments={recentDocuments}
              storage={storage}
              profileStrength={profileStrength}
              advancedStats={advancedStats}
              tips={tips}
              loading={loading}
              onCreateNew={handleCreateNew}
            />
          ) : (
            <FreeDashboard
              stats={stats}
              recentDocuments={recentDocuments}
              storage={storage}
              loading={loading}
              onUpgradeClick={() => setUpgradeModalOpen(true)}
              onCreateNew={handleCreateNew}
            />
          )}
        </Box>

        <ModalComponent open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
      </Box>
    </Box>
  );
}

// ─── Page Export ─────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardContent />
      </SidebarProvider>
    </ProtectedRoute>
  );
}