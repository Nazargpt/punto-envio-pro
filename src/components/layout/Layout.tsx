import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AppHeader from '@/components/layout/AppHeader';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/50">
        <AppHeader />
        <main className="container mx-auto p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;