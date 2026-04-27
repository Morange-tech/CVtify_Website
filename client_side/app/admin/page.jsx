// app/admin/dashboard/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Button, Chip, IconButton, Avatar,
  LinearProgress, Tooltip, Menu, MenuItem, Skeleton,
  Snackbar, Alert, CircularProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BrushIcon from '@mui/icons-material/Brush';
import InfoIcon from '@mui/icons-material/Info';
import useAdminDashboard from '../hooks/useAdminDashboard';

// ─── Icon Map (backend sends string, frontend renders component) ───
const ICON_MAP = {
  people: <PeopleIcon />,
  premium: <WorkspacePremiumIcon />,
  description: <DescriptionIcon />,
  download: <DownloadIcon />,
  money: <AttachMoneyIcon />,
  pending: <PendingActionsIcon />,
  personAdd: <PersonAddIcon />,
  group: <GroupIcon />,
  payment: <PaymentIcon />,
  brush: <BrushIcon />,
  info: <InfoIcon />,
};

const SMALL_ICON_MAP = {
  description: <DescriptionIcon sx={{ fontSize: 16 }} />,
  premium: <WorkspacePremiumIcon sx={{ fontSize: 16 }} />,
  personAdd: <PersonAddIcon sx={{ fontSize: 16 }} />,
  payment: <PaymentIcon sx={{ fontSize: 16 }} />,
  brush: <BrushIcon sx={{ fontSize: 16 }} />,
  download: <DownloadIcon sx={{ fontSize: 16 }} />,
  pending: <PendingActionsIcon sx={{ fontSize: 16 }} />,
  info: <InfoIcon sx={{ fontSize: 16 }} />,
};

// ─── Sparkline SVG ──────────────────────────────────────────────
const Sparkline = ({ data, color, height = 40 }) => {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const step = width / (data.length - 1);

  const points = data
    .map((val, i) => `${i * step},${height - ((val - min) / range) * height}`)
    .join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Stat Card Skeleton ─────────────────────────────────────────
const StatCardSkeleton = () => (
  <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
    <Box sx={{ p: 3, pb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Skeleton variant="rounded" width={42} height={42} />
        <Skeleton variant="rounded" width={70} height={24} />
      </Box>
      <Skeleton variant="text" width={80} height={40} />
      <Skeleton variant="text" width={120} height={20} />
      <Skeleton variant="text" width={100} height={16} />
    </Box>
    <Skeleton variant="rectangular" height={45} />
  </Box>
);

// ─── Main Component ─────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const [timeAnchorEl, setTimeAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const {
    loading, error, period, actionLoading,
    changePeriod, approveRequest, rejectRequest, refresh,
    stats, recentActivity, pendingRequests,
    topTemplates, revenueBreakdown, userBreakdown, conversionRate,
  } = useAdminDashboard();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleApprove = async (requestId) => {
    try {
      await approveRequest(requestId);
      showSnackbar('Request approved successfully');
    } catch {
      showSnackbar('Failed to approve request', 'error');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId);
      showSnackbar('Request rejected');
    } catch {
      showSnackbar('Failed to reject request', 'error');
    }
  };

  const timeRangeOptions = [
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar((p) => ({ ...p, open: false }))} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ─── Header ─── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#1e293b">Dashboard</Typography>
          <Typography variant="body2" color="#64748b">Welcome back, Admin. Here&apos;s what&apos;s happening.</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            size="small" startIcon={<CalendarTodayIcon />}
            onClick={(e) => setTimeAnchorEl(e.currentTarget)}
            sx={{ textTransform: 'none', color: '#64748b', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, px: 2, fontWeight: 600, '&:hover': { bgcolor: '#f8fafc' } }}
          >
            {timeRangeOptions.find((o) => o.value === period)?.label}
          </Button>
          <Menu anchorEl={timeAnchorEl} open={Boolean(timeAnchorEl)} onClose={() => setTimeAnchorEl(null)}>
            {timeRangeOptions.map((opt) => (
              <MenuItem key={opt.value} selected={period === opt.value}
                onClick={() => { changePeriod(opt.value); setTimeAnchorEl(null); }}>
                {opt.label}
              </MenuItem>
            ))}
          </Menu>
          <Tooltip title="Refresh Data">
            <IconButton onClick={refresh} disabled={loading}
              sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f8fafc' } }}>
              {loading ? <CircularProgress size={20} /> : <RefreshIcon sx={{ fontSize: 20, color: '#64748b' }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}
          action={<Button color="inherit" size="small" onClick={refresh} startIcon={<RefreshIcon />}>Retry</Button>}>
          {error}
        </Alert>
      )}

      {/* ─── Stats Grid ─── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {loading
          ? [...Array(8)].map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  overflow: 'hidden', transition: 'all 0.3s ease',
                  border: stat.urgent ? '1px solid #ef444430' : '1px solid transparent',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' },
                }}
              >
                <Box sx={{ p: 3, pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                      {ICON_MAP[stat.icon] || <InfoIcon />}
                    </Box>
                    <Chip
                      icon={stat.changeType === 'up' ? <ArrowUpwardIcon sx={{ fontSize: '14px !important' }} /> : stat.changeType === 'down' ? <ArrowDownwardIcon sx={{ fontSize: '14px !important' }} /> : undefined}
                      label={stat.change} size="small"
                      sx={{
                        height: 24, fontWeight: 700, fontSize: '0.7rem',
                        bgcolor: stat.changeType === 'up' ? '#10b98115' : stat.changeType === 'down' ? '#ef444415' : '#64748b15',
                        color: stat.changeType === 'up' ? '#10b981' : stat.changeType === 'down' ? '#ef4444' : '#64748b',
                        '& .MuiChip-icon': { color: stat.changeType === 'up' ? '#10b981' : '#ef4444' },
                      }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight="800" color="#1e293b" sx={{ mb: 0.3 }}>{stat.value}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="#64748b" fontWeight="500">{stat.label}</Typography>
                    {stat.urgent && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444', animation: 'pulse 2s infinite',
                        '@keyframes pulse': { '0%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' }, '70%': { boxShadow: '0 0 0 6px rgba(239,68,68,0)' }, '100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' } } }} />
                    )}
                  </Box>
                  <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5, display: 'block' }}>{stat.detail}</Typography>
                </Box>
                <Box sx={{ px: 1 }}>
                  <Sparkline data={stat.sparkline} color={stat.color} height={45} />
                </Box>
              </Box>
            ))
        }
      </Box>

      {/* ─── Main Content Grid ─── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Left Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Revenue Overview */}
          {!loading && revenueBreakdown && (
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight="700" color="#1e293b">Revenue Overview</Typography>
                  <Typography variant="caption" color="#94a3b8">Breakdown by subscription type</Typography>
                </Box>
                <Typography variant="h5" fontWeight="800" color="#1e293b">{revenueBreakdown.total}</Typography>
              </Box>
              <Box sx={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', mb: 3 }}>
                {revenueBreakdown.breakdown.map((item, i) => (
                  <Box key={i} sx={{ width: `${item.percentage}%`, bgcolor: item.color, transition: 'all 0.3s ease' }} />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {revenueBreakdown.breakdown.map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: item.color }} />
                    <Box>
                      <Typography variant="body2" fontWeight="600" color="#1e293b">{item.value}</Typography>
                      <Typography variant="caption" color="#94a3b8">{item.label} ({item.percentage}%)</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Revenue Skeleton */}
          {loading && (
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', p: 3 }}>
              <Skeleton variant="text" width={180} height={30} />
              <Skeleton variant="rounded" height={12} sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', gap: 3 }}>
                {[1, 2].map((i) => <Skeleton key={i} variant="rounded" width={120} height={40} />)}
              </Box>
            </Box>
          )}

          {/* Recent Activity */}
          <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="700" color="#1e293b">Recent Activity</Typography>
              <Button size="small" sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}>View All →</Button>
            </Box>

            {loading
              ? [...Array(5)].map((_, i) => <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 1 }} />)
              : recentActivity.length === 0
                ? <Typography variant="body2" color="#94a3b8" textAlign="center" py={3}>No recent activity</Typography>
                : recentActivity.map((activity, index) => (
                    <Box key={activity.id || index} sx={{
                      display: 'flex', alignItems: 'center', gap: 2, py: 1.5,
                      borderBottom: index < recentActivity.length - 1 ? '1px solid #f1f5f9' : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: '#f8fafc', mx: -1, px: 1, borderRadius: 1 },
                    }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: `${activity.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activity.color, flexShrink: 0 }}>
                        {SMALL_ICON_MAP[activity.icon] || <InfoIcon sx={{ fontSize: 16 }} />}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" color="#1e293b" noWrap>{activity.text}</Typography>
                      </Box>
                      <Typography variant="caption" color="#94a3b8" sx={{ whiteSpace: 'nowrap' }}>{activity.time}</Typography>
                    </Box>
                  ))
            }
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Pending Requests */}
          <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', p: 3, border: pendingRequests.length > 0 ? '1px solid #ef444420' : 'none' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" fontWeight="700" color="#1e293b">Pending Requests</Typography>
                {pendingRequests.length > 0 && (
                  <Chip label={pendingRequests.length} size="small" sx={{ fontWeight: 700, height: 22, bgcolor: '#ef444415', color: '#ef4444' }} />
                )}
              </Box>
              <Button size="small" sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}>View All →</Button>
            </Box>

            {loading
              ? [...Array(3)].map((_, i) => <Skeleton key={i} variant="rounded" height={56} sx={{ mb: 1 }} />)
              : pendingRequests.length === 0
                ? <Typography variant="body2" color="#94a3b8" textAlign="center" py={3}>No pending requests 🎉</Typography>
                : pendingRequests.map((request, index) => (
                    <Box key={request.id} sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2,
                      borderBottom: index < pendingRequests.length - 1 ? '1px solid #f1f5f9' : 'none',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={request.avatar} sx={{ width: 36, height: 36, bgcolor: '#667eea', fontSize: '0.85rem', fontWeight: 700 }}>
                          {request.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600" color="#1e293b">{request.name}</Typography>
                          <Typography variant="caption" color="#94a3b8">{request.plan} • {request.amount}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {actionLoading === request.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <>
                            <Tooltip title="Approve">
                              <IconButton size="small" onClick={() => handleApprove(request.id)}
                                sx={{ color: '#10b981', '&:hover': { bgcolor: '#10b98115' } }}>
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton size="small" onClick={() => handleReject(request.id)}
                                sx={{ color: '#ef4444', '&:hover': { bgcolor: '#ef444415' } }}>
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </Box>
                  ))
            }
          </Box>

          {/* Top Templates */}
          <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', p: 3 }}>
            <Typography variant="h6" fontWeight="700" color="#1e293b" gutterBottom>Top Templates</Typography>
            {loading
              ? [...Array(5)].map((_, i) => <Skeleton key={i} variant="rounded" height={30} sx={{ mb: 2 }} />)
              : topTemplates.length === 0
                ? <Typography variant="body2" color="#94a3b8" textAlign="center" py={2}>No data yet</Typography>
                : topTemplates.map((template, index) => (
                    <Box key={index} sx={{ mb: 2.5, '&:last-child': { mb: 0 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" fontWeight="700" color="#94a3b8" sx={{ minWidth: 16 }}>#{index + 1}</Typography>
                          <Typography variant="body2" fontWeight="600" color="#1e293b">{template.name}</Typography>
                        </Box>
                        <Typography variant="caption" color="#94a3b8">{template.uses.toLocaleString()} uses</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={template.percentage}
                        sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': { borderRadius: 3, background: `linear-gradient(90deg, #667eea ${100 - template.percentage}%, #764ba2 100%)` } }} />
                    </Box>
                  ))
            }
          </Box>

          {/* User Breakdown */}
          <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', p: 3 }}>
            <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>User Breakdown</Typography>
            {loading
              ? [...Array(3)].map((_, i) => <Skeleton key={i} variant="rounded" height={40} sx={{ mb: 1 }} />)
              : userBreakdown.map((item, index) => (
                  <Box key={index} sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5,
                    borderBottom: index < userBreakdown.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: item.color }} />
                      <Typography variant="body2" color="#64748b">{item.label}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="body2" fontWeight="700" color="#1e293b">{item.value}</Typography>
                      <Chip label={`${item.percentage}%`} size="small"
                        sx={{ height: 20, fontWeight: 600, fontSize: '0.65rem', bgcolor: `${item.color}15`, color: item.color }} />
                    </Box>
                  </Box>
                ))
            }

            {/* Conversion Rate */}
            {!loading && conversionRate && (
              <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: '#667eea08', border: '1px solid #667eea20', textAlign: 'center' }}>
                <Typography variant="caption" color="#64748b">Free → Premium Conversion</Typography>
                <Typography variant="h5" fontWeight="800" color="#667eea">{conversionRate.rate}%</Typography>
                <Chip
                  label={`${conversionRate.change} vs last month`} size="small"
                  icon={conversionRate.changeType === 'up' ? <ArrowUpwardIcon sx={{ fontSize: '12px !important' }} /> : <ArrowDownwardIcon sx={{ fontSize: '12px !important' }} />}
                  sx={{
                    mt: 0.5, height: 20, fontWeight: 600, fontSize: '0.65rem',
                    bgcolor: conversionRate.changeType === 'up' ? '#10b98115' : '#ef444415',
                    color: conversionRate.changeType === 'up' ? '#10b981' : '#ef4444',
                    '& .MuiChip-icon': { color: conversionRate.changeType === 'up' ? '#10b981' : '#ef4444' },
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Quick Actions */}
          <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', p: 3 }}>
            <Typography variant="h6" fontWeight="700" color="#1e293b" gutterBottom>Quick Actions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { label: 'View All Users', icon: <PeopleIcon />, color: '#667eea', path: '/admin/users' },
                { label: 'Manage Templates', icon: <BrushIcon />, color: '#10b981', path: '/admin/templates' },
                { label: 'Review Payments', icon: <PaymentIcon />, color: '#f59e0b', path: '/admin/payments' },
                { label: 'Send Notification', icon: <MailOutlineIcon />, color: '#8b5cf6', path: '/admin/notifications' },
                { label: 'View Analytics', icon: <TrendingUpIcon />, color: '#06b6d4', path: '/admin/analytics' },
              ].map((action, index) => (
                <Box
                  key={index}
                  onClick={() => router.push(action.path)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5,
                    borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: `${action.color}08`, transform: 'translateX(4px)' },
                  }}
                >
                  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${action.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color, '& .MuiSvgIcon-root': { fontSize: 16 } }}>
                    {action.icon}
                  </Box>
                  <Typography variant="body2" fontWeight="500" color="#1e293b">{action.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}