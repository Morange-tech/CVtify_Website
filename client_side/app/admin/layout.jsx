'use client';

import { Box } from '@mui/material';
import AdminSidebar from '../components/AdminSidebar';
import { AdminSidebarProvider } from '../components/AdminSidebarContext';

export default function AdminLayout({ children }) {
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