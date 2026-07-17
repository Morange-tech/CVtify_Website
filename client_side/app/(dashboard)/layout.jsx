// app/(dashboard)/layout.jsx
'use client';

import { SidebarProvider, useSidebar } from '../components/SidebarContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AppSidebar from '../components/AppSidebar';
import { Box, IconButton, Typography } from '@mui/material';
import { Menu } from 'lucide-react';

function MobileTopBar() {
  const { setOpen } = useSidebar();

  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: 'rgba(248, 250, 252, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <IconButton
        onClick={() => setOpen(true)}
        size="small"
        sx={{
          bgcolor: '#fff',
          border: '1px solid #e2e8f0',
          '&:hover': { bgcolor: '#00000010', borderColor: '#00000030' },
        }}
      >
        <Menu size={20} />
      </IconButton>
      <Typography
        variant="h6"
        fontWeight="800"
        sx={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        CVtify
      </Typography>
    </Box>
  );
}

function DashboardContent({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          bgcolor: '#f8fafc',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <MobileTopBar />
        {children}
      </Box>
    </Box>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
