'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Avatar,
  LinearProgress,
  Tooltip,
  Menu,
  MenuItem,
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BrushIcon from '@mui/icons-material/Brush';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [timeAnchorEl, setTimeAnchorEl] = useState(null);

  // ─── Mock Data (replace with API) ───
  const stats = [
    {
      label: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'up',
      icon: <PeopleIcon />,
      color: '#667eea',
      sparkline: [30, 40, 35, 50, 49, 60, 70, 65, 75, 80, 85, 90],
      detail: '142 this month',
    },
    {
      label: 'Premium Users',
      value: '486',
      change: '+15.2%',
      changeType: 'up',
      icon: <WorkspacePremiumIcon />,
      color: '#8b5cf6',
      sparkline: [10, 15, 12, 18, 22, 25, 28, 30, 35, 38, 40, 45],
      detail: '38 this month',
    },
    {
      label: 'Total CVs and motivation letters Created',
      value: '8,432',
      change: '+8.1%',
      changeType: 'up',
      icon: <DescriptionIcon />,
      color: '#10b981',
      sparkline: [100, 120, 115, 140, 130, 160, 155, 170, 180, 190, 200, 210],
      detail: '624 this month',
    },
    {
      label: 'Total Downloads',
      value: '15,281',
      change: '+22.4%',
      changeType: 'up',
      icon: <DownloadIcon />,
      color: '#06b6d4',
      sparkline: [200, 220, 250, 230, 280, 300, 320, 310, 350, 380, 400, 420],
      detail: '1,847 this month',
    },
    {
      label: 'Revenue',
      value: '$12,490',
      change: '+23.8%',
      changeType: 'up',
      icon: <AttachMoneyIcon />,
      color: '#f59e0b',
      sparkline: [800, 900, 850, 1000, 1100, 1200, 1150, 1300, 1400, 1500, 1600, 1700],
      detail: '$4,856 this month',
    },
    {
      label: 'Pending Requests',
      value: '23',
      change: '+5',
      changeType: 'up',
      icon: <PendingActionsIcon />,
      color: '#ef4444',
      sparkline: [5, 8, 12, 10, 15, 18, 14, 20, 22, 19, 25, 23],
      detail: 'Needs attention',
      urgent: true,
    },
    {
      label: 'New Users Today',
      value: '47',
      change: '+18.3%',
      changeType: 'up',
      icon: <PersonAddIcon />,
      color: '#ec4899',
      sparkline: [20, 25, 30, 28, 35, 40, 38, 42, 45, 43, 48, 47],
      detail: 'vs 39 yesterday',
    },
    {
      label: 'Active Users',
      value: '1,234',
      change: '-2.1%',
      changeType: 'down',
      icon: <GroupIcon />,
      color: '#14b8a6',
      sparkline: [1300, 1280, 1260, 1290, 1270, 1250, 1240, 1260, 1250, 1245, 1238, 1234],
      detail: 'Currently online',
    },
  ];

  const recentActivity = [
    {
      text: 'John Doe created a new CV',
      time: '2 min ago',
      color: '#667eea',
      icon: <DescriptionIcon sx={{ fontSize: 16 }} />,
      type: 'cv',
    },
    {
      text: 'Morange created a new motivation letter',
      time: '5 min ago',
      color: '#667eea',
      icon: <DescriptionIcon sx={{ fontSize: 16 }} />,
      type: 'motivation letter',
    },
    {
      text: 'Jane Smith upgraded to Premium',
      time: '15 min ago',
      color: '#10b981',
      icon: <WorkspacePremiumIcon sx={{ fontSize: 16 }} />,
      type: 'premium',
    },
    {
      text: 'New user registered: alex@mail.com',
      time: '1 hour ago',
      color: '#8b5cf6',
      icon: <PersonAddIcon sx={{ fontSize: 16 }} />,
      type: 'user',
    },
    {
      text: 'Payment received: $9.99 from Sarah K.',
      time: '2 hours ago',
      color: '#f59e0b',
      icon: <PaymentIcon sx={{ fontSize: 16 }} />,
      type: 'payment',
    },
    {
      text: 'Template "Executive" was updated',
      time: '3 hours ago',
      color: '#64748b',
      icon: <BrushIcon sx={{ fontSize: 16 }} />,
      type: 'template',
    },
    {
      text: 'Mike Chen downloaded 3 CVs',
      time: '4 hours ago',
      color: '#06b6d4',
      icon: <DownloadIcon sx={{ fontSize: 16 }} />,
      type: 'download',
    },
    {
      text: 'Premium request from emma@mail.com',
      time: '5 hours ago',
      color: '#ef4444',
      icon: <PendingActionsIcon sx={{ fontSize: 16 }} />,
      type: 'request',
    },
  ];

  const pendingRequests = [
    {
      id: 1,
      name: 'Emma Wilson',
      email: 'emma@mail.com',
      plan: 'Monthly',
      amount: '$9.99',
      requestedAt: '2 hours ago',
      avatar: null,
    },
    {
      id: 2,
      name: 'Robert Chen',
      email: 'robert@mail.com',
      plan: 'Yearly',
      amount: '$79.99',
      requestedAt: '5 hours ago',
      avatar: null,
    },
    {
      id: 3,
      name: 'Lisa Park',
      email: 'lisa@mail.com',
      plan: 'Monthly',
      amount: '$9.99',
      requestedAt: '1 day ago',
      avatar: null,
    },
  ];

  const topTemplates = [
    { name: 'Professional', uses: 3245, percentage: 38 },
    { name: 'Modern Creative', uses: 2180, percentage: 26 },
    { name: 'Minimal Clean', uses: 1650, percentage: 20 },
    { name: 'Executive', uses: 890, percentage: 11 },
    { name: 'Fresh Graduate', uses: 467, percentage: 5 },
  ];

  const revenueBreakdown = [
    { label: 'Monthly Subs', value: '$7,240', percentage: 58, color: '#667eea' },
    { label: 'Yearly Subs', value: '$4,150', percentage: 33, color: '#10b981' },
    { label: 'One-time', value: '$1,100', percentage: 9, color: '#f59e0b' },
  ];

  // ─── Mini Sparkline Component ───
  const Sparkline = ({ data, color, height = 40 }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const step = width / (data.length - 1);

    const points = data
      .map((val, i) => {
        const x = i * step;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={`url(#grad-${color.replace('#', '')})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* ─── Header ─── */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="700" color="#1e293b">
            Dashboard
          </Typography>
          <Typography variant="body2" color="#64748b">
            Welcome back, Admin. Here&apos;s what&apos;s happening today.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Time Range Filter */}
          <Button
            size="small"
            startIcon={<CalendarTodayIcon />}
            onClick={(e) => setTimeAnchorEl(e.currentTarget)}
            sx={{
              textTransform: 'none',
              color: '#64748b',
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              px: 2,
              fontWeight: 600,
              '&:hover': { bgcolor: '#f8fafc' },
            }}
          >
            {timeRange === '24h' && 'Last 24 Hours'}
            {timeRange === '7d' && 'Last 7 Days'}
            {timeRange === '30d' && 'Last 30 Days'}
            {timeRange === '90d' && 'Last 90 Days'}
          </Button>

          <Menu
            anchorEl={timeAnchorEl}
            open={Boolean(timeAnchorEl)}
            onClose={() => setTimeAnchorEl(null)}
          >
            {[
              { label: 'Last 24 Hours', value: '24h' },
              { label: 'Last 7 Days', value: '7d' },
              { label: 'Last 30 Days', value: '30d' },
              { label: 'Last 90 Days', value: '90d' },
            ].map((opt) => (
              <MenuItem
                key={opt.value}
                selected={timeRange === opt.value}
                onClick={() => {
                  setTimeRange(opt.value);
                  setTimeAnchorEl(null);
                }}
              >
                {opt.label}
              </MenuItem>
            ))}
          </Menu>

          {/* Refresh */}
          <Tooltip title="Refresh Data">
            <IconButton
              sx={{
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                '&:hover': { bgcolor: '#f8fafc' },
              }}
            >
              <RefreshIcon sx={{ fontSize: 20, color: '#64748b' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ─── Stats Grid ─── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr 1fr',
          },
          gap: 3,
          mb: 4,
        }}
      >
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: stat.urgent ? '1px solid #ef444430' : '1px solid transparent',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
              },
            }}
          >
            {/* Card Content */}
            <Box sx={{ p: 3, pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    bgcolor: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>

                {/* Change Badge */}
                <Chip
                  icon={
                    stat.changeType === 'up' ? (
                      <ArrowUpwardIcon sx={{ fontSize: '14px !important' }} />
                    ) : (
                      <ArrowDownwardIcon sx={{ fontSize: '14px !important' }} />
                    )
                  }
                  label={stat.change}
                  size="small"
                  sx={{
                    height: 24,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    bgcolor: stat.changeType === 'up' ? '#10b98115' : '#ef444415',
                    color: stat.changeType === 'up' ? '#10b981' : '#ef4444',
                    '& .MuiChip-icon': {
                      color: stat.changeType === 'up' ? '#10b981' : '#ef4444',
                    },
                  }}
                />
              </Box>

              <Typography variant="h4" fontWeight="800" color="#1e293b" sx={{ mb: 0.3 }}>
                {stat.value}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="#64748b" fontWeight="500">
                  {stat.label}
                </Typography>
                {stat.urgent && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#ef4444',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
                        '70%': { boxShadow: '0 0 0 6px rgba(239, 68, 68, 0)' },
                        '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
                      },
                    }}
                  />
                )}
              </Box>

              <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5, display: 'block' }}>
                {stat.detail}
              </Typography>
            </Box>

            {/* Sparkline Chart */}
            <Box sx={{ px: 1, pb: 0 }}>
              <Sparkline data={stat.sparkline} color={stat.color} height={45} />
            </Box>
          </Box>
        ))}
      </Box>

      {/* ─── Main Content Grid ─── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
          mb: 3,
        }}
      >
        {/* ─── Left Column ─── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Revenue Overview */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="700" color="#1e293b">
                  Revenue Overview
                </Typography>
                <Typography variant="caption" color="#94a3b8">
                  Breakdown by subscription type
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="800" color="#1e293b">
                $12,490
              </Typography>
            </Box>

            {/* Revenue Bar */}
            <Box sx={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', mb: 3 }}>
              {revenueBreakdown.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    width: `${item.percentage}%`,
                    bgcolor: item.color,
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>

            {/* Revenue Legend */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {revenueBreakdown.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 1,
                      bgcolor: item.color,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight="600" color="#1e293b">
                      {item.value}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      {item.label} ({item.percentage}%)
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Recent Activity */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="700" color="#1e293b">
                Recent Activity
              </Typography>
              <Button
                size="small"
                sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}
              >
                View All →
              </Button>
            </Box>

            {recentActivity.map((activity, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.5,
                  borderBottom: index < recentActivity.length - 1 ? '1px solid #f1f5f9' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: '#f8fafc', mx: -1, px: 1, borderRadius: 1 },
                }}
              >
                {/* Activity Icon */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: `${activity.color}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activity.color,
                    flexShrink: 0,
                  }}
                >
                  {activity.icon}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" color="#1e293b" noWrap>
                    {activity.text}
                  </Typography>
                </Box>

                <Typography variant="caption" color="#94a3b8" sx={{ whiteSpace: 'nowrap' }}>
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ─── Right Column ─── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Pending Premium Requests */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              p: 3,
              border: '1px solid #ef444420',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h6" fontWeight="700" color="#1e293b">
                  Pending Requests
                </Typography>
                <Chip
                  label={pendingRequests.length}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    height: 22,
                    bgcolor: '#ef444415',
                    color: '#ef4444',
                  }}
                />
              </Box>
              <Button
                size="small"
                sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}
              >
                View All →
              </Button>
            </Box>

            {pendingRequests.map((request, index) => (
              <Box
                key={request.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 2,
                  borderBottom: index < pendingRequests.length - 1 ? '1px solid #f1f5f9' : 'none',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: '#667eea',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    {request.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="600" color="#1e293b">
                      {request.name}
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      {request.plan} • {request.amount}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Approve">
                    <IconButton
                      size="small"
                      sx={{
                        color: '#10b981',
                        '&:hover': { bgcolor: '#10b98115' },
                      }}
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <IconButton
                      size="small"
                      sx={{
                        color: '#ef4444',
                        '&:hover': { bgcolor: '#ef444415' },
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Top Templates */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              p: 3,
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1e293b" gutterBottom>
              Top Templates
            </Typography>

            {topTemplates.map((template, index) => (
              <Box key={index} sx={{ mb: 2.5, '&:last-child': { mb: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="caption"
                      fontWeight="700"
                      color="#94a3b8"
                      sx={{ minWidth: 16 }}
                    >
                      #{index + 1}
                    </Typography>
                    <Typography variant="body2" fontWeight="600" color="#1e293b">
                      {template.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="#94a3b8">
                    {template.uses.toLocaleString()} uses
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={template.percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: `linear-gradient(90deg, #667eea ${100 - template.percentage}%, #764ba2 100%)`,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* User Growth Summary */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              p: 3,
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ mb: 2 }}>
              User Breakdown
            </Typography>

            {[
              {
                label: 'Free Users',
                value: '2,361',
                percentage: 83,
                color: '#64748b',
              },
              {
                label: 'Premium Monthly',
                value: '324',
                percentage: 11,
                color: '#667eea',
              },
              {
                label: 'Premium Yearly',
                value: '162',
                percentage: 6,
                color: '#10b981',
              },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: index < 2 ? '1px solid #f1f5f9' : 'none',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 1,
                      bgcolor: item.color,
                    }}
                  />
                  <Typography variant="body2" color="#64748b">
                    {item.label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="body2" fontWeight="700" color="#1e293b">
                    {item.value}
                  </Typography>
                  <Chip
                    label={`${item.percentage}%`}
                    size="small"
                    sx={{
                      height: 20,
                      fontWeight: 600,
                      fontSize: '0.65rem',
                      bgcolor: `${item.color}15`,
                      color: item.color,
                    }}
                  />
                </Box>
              </Box>
            ))}

            {/* Conversion Rate */}
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: '#667eea08',
                border: '1px solid #667eea20',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="#64748b">
                Free → Premium Conversion
              </Typography>
              <Typography variant="h5" fontWeight="800" color="#667eea">
                17.1%
              </Typography>
              <Chip
                label="+2.3% vs last month"
                size="small"
                icon={<ArrowUpwardIcon sx={{ fontSize: '12px !important' }} />}
                sx={{
                  mt: 0.5,
                  height: 20,
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  bgcolor: '#10b98115',
                  color: '#10b981',
                  '& .MuiChip-icon': { color: '#10b981' },
                }}
              />
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box
            sx={{
              bgcolor: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              p: 3,
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1e293b" gutterBottom>
              Quick Actions
            </Typography>
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
                  onClick={() => {
                    // router.push(action.path)
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: `${action.color}08`,
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      bgcolor: `${action.color}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: action.color,
                      '& .MuiSvgIcon-root': { fontSize: 16 },
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="body2" fontWeight="500" color="#1e293b">
                    {action.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}