import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  requireSuperAdmin = false 
}) => {
  const { user, loading, isAdmin, isSuperAdmin, userRole } = useAuth();

  // Debugging logs
  console.log('🔐 ProtectedRoute Debug:', {
    user: user?.email,
    userRole,
    loading,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),
    requireAdmin,
    requireSuperAdmin
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('❌ No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin()) {
    console.log('❌ Requires SUPERADMIN, user role:', userRole);
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    console.log('❌ Requires ADMIN, user role:', userRole);
    return <Navigate to="/" replace />;
  }

  console.log('✅ Access granted');

  return <>{children}</>;
};

export default ProtectedRoute;