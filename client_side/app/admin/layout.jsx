'use client';

import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { AdminSidebarProvider } from '../components/AdminSidebarContext';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout({ children }) {
  const { user, token, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !token) {
      router.replace('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [loading, isAuthenticated, token, user, router]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f1f5f9',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !token || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminSidebarProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
        <AdminSidebar />
        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </Box>
      </Box>
    </AdminSidebarProvider>
  );
}