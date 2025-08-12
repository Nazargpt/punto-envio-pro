import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AppHeader from '@/components/layout/AppHeader';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/50 flex flex-col">
        <AppHeader />
        <main className="container mx-auto p-6 flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Layout;