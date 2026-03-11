'use client';

import { createContext, useContext, useState } from 'react';

const AdminSidebarContext = createContext();

export function AdminSidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <AdminSidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar must be used within AdminSidebarProvider');
  }
  return context;
}