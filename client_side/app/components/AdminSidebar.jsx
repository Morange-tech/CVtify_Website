'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import BrushIcon from '@mui/icons-material/Brush';
import DownloadIcon from '@mui/icons-material/Download';
import InsightsIcon from '@mui/icons-material/Insights';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAdminSidebar } from './AdminSidebarContext';
import { useAuth } from '../hooks/useAuth'; // adjust path

const SIDEBAR_WIDTH_OPEN = 260;
const SIDEBAR_WIDTH_CLOSED = 72;

const menuItems = [
  { section: 'Main' },
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { label: 'Premium Requests', icon: <WorkspacePremiumIcon />, path: '/admin/premium-requests', badge: 3 },
  { label: 'Payments', icon: <PaymentIcon />, path: '/admin/payments' },

  { section: 'Content' },
  { label: 'CVs', icon: <DescriptionIcon />, path: '/admin/cvs' },
  { label: 'Motivational Letters', icon: <DescriptionIcon />, path: '/admin/motivational-letters' },
  { label: 'Templates', icon: <BrushIcon />, path: '/admin/templates' },
  { label: 'Downloads', icon: <DownloadIcon />, path: '/admin/downloads' },

  { section: 'Insights' },
  { label: 'Analytics', icon: <InsightsIcon />, path: '/admin/analytics' },
  { label: 'Messages', icon: <ChatIcon />, path: '/admin/messages', badge: 5 },
  { label: 'Notifications', icon: <NotificationsIcon />, path: '/admin/notifications' },

  { section: 'System' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  { label: 'Logs', icon: <HistoryIcon />, path: '/admin/logs' },
  { label: 'Admins', icon: <AdminPanelSettingsIcon />, path: '/admin/admins' },
];

export default function AdminSidebar() {
  const { isOpen, toggleSidebar } = useAdminSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutMutation } = useAuth();

  const isActive = (path) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        width: isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED,
        minWidth: isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED,
        height: '100vh',
        bgcolor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        borderRight: '1px solid #1e293b',
      }}
    >
      {/* ─── Header ─── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'space-between' : 'center',
          p: 2,
          minHeight: 64,
        }}
      >
        {isOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AdminPanelSettingsIcon sx={{ color: '#ffffff', fontSize: 18 }} />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="800" color="#ffffff" sx={{ lineHeight: 1.2 }}>
                CVtify
              </Typography>
              <Typography variant="caption" sx={{ color: '#667eea', fontSize: '0.65rem', fontWeight: 600 }}>
                Admin Panel
              </Typography>
            </Box>
          </Box>
        )}

        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: '#94a3b8',
            '&:hover': { bgcolor: '#1e293b', color: '#ffffff' },
          }}
        >
          {isOpen ? <MenuOpenIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: '#1e293b' }} />

      {/* ─── Menu Items ─── */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#334155',
            borderRadius: 2,
          },
        }}
      >
        {menuItems.map((item, index) => {
          // Section Header
          if (item.section) {
            return isOpen ? (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  px: 2.5,
                  pt: index === 0 ? 1 : 2.5,
                  pb: 1,
                  display: 'block',
                }}
              >
                {item.section}
              </Typography>
            ) : (
              <Divider
                key={index}
                sx={{
                  borderColor: '#1e293b',
                  my: 1,
                  mx: 1.5,
                }}
              />
            );
          }

          // Menu Item
          const active = isActive(item.path);

          const menuButton = (
            <Box
              key={index}
              onClick={() => router.push(item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mx: 1,
                my: 0.3,
                px: isOpen ? 2 : 0,
                py: 1.2,
                borderRadius: 2,
                cursor: 'pointer',
                justifyContent: isOpen ? 'flex-start' : 'center',
                position: 'relative',
                transition: 'all 0.2s ease',
                ...(active
                  ? {
                      bgcolor: '#667eea15',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: 3,
                        borderRadius: '0 4px 4px 0',
                        bgcolor: '#667eea',
                      },
                    }
                  : {
                      '&:hover': {
                        bgcolor: '#1e293b',
                      },
                    }),
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: active ? '#667eea' : '#94a3b8',
                  transition: 'color 0.2s ease',
                  fontSize: 20,
                  minWidth: 24,
                  '& .MuiSvgIcon-root': { fontSize: 20 },
                }}
              >
                {item.icon}
              </Box>

              {/* Label */}
              {isOpen && (
                <Typography
                  variant="body2"
                  fontWeight={active ? 600 : 400}
                  sx={{
                    color: active ? '#ffffff' : '#94a3b8',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    fontSize: '0.85rem',
                  }}
                >
                  {item.label}
                </Typography>
              )}

              {/* Badge */}
              {item.badge && isOpen && (
                <Box
                  sx={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                    bgcolor: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: '#ffffff', fontSize: '0.65rem', fontWeight: 700 }}
                  >
                    {item.badge}
                  </Typography>
                </Box>
              )}

              {/* Badge dot when closed */}
              {item.badge && !isOpen && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: isOpen ? 12 : 14,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#ef4444',
                    border: '2px solid #0f172a',
                  }}
                />
              )}
            </Box>
          );

          // Wrap with tooltip when sidebar is closed
          return !isOpen ? (
            <Tooltip
              key={index}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.label}
                  {item.badge && (
                    <Box
                      sx={{
                        minWidth: 16,
                        height: 16,
                        borderRadius: 8,
                        bgcolor: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.6rem', color: '#fff', fontWeight: 700 }}>
                        {item.badge}
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
              placement="right"
              arrow
            >
              {menuButton}
            </Tooltip>
          ) : (
            menuButton
          );
        })}
      </Box>

      {/* ─── Footer: User Info + Logout ─── */}
      <Divider sx={{ borderColor: '#1e293b' }} />
      <Box sx={{ p: isOpen ? 2 : 1, py: 2 }}>
        {/* User Info */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1.5,
            justifyContent: isOpen ? 'flex-start' : 'center',
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#667eea',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>

          {isOpen && (
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight="600"
                color="#ffffff"
                noWrap
                sx={{ fontSize: '0.8rem' }}
              >
                {user?.name || 'Admin'}
              </Typography>
              <Typography
                variant="caption"
                color="#64748b"
                noWrap
                sx={{ fontSize: '0.7rem' }}
              >
                {user?.email || 'admin@cvtify.com'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Logout Button */}
        {isOpen ? (
          <Box
            onClick={() => logoutMutation.mutate()}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1,
              borderRadius: 2,
              cursor: 'pointer',
              color: '#94a3b8',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#ef444415',
                color: '#ef4444',
              },
            }}
          >
            <LogoutIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" fontWeight="500" sx={{ fontSize: '0.85rem' }}>
              Logout
            </Typography>
          </Box>
        ) : (
          <Tooltip title="Logout" placement="right" arrow>
            <IconButton
              onClick={() => logoutMutation.mutate()}
              sx={{
                color: '#94a3b8',
                mx: 'auto',
                display: 'flex',
                '&:hover': {
                  bgcolor: '#ef444415',
                  color: '#ef4444',
                },
              }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}