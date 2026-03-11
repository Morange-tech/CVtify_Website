// app/(dashboard)/layout.jsx
'use client';

import { SidebarProvider } from '../components/SidebarContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AppSidebar from '../components/AppSidebar';
import { Box } from '@mui/material';
import { useSidebar } from '../components/SidebarContext';

function DashboardContent({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f8fafc',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
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