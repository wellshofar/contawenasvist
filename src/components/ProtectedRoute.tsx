
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from './layout/AppLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render children wrapped in AppLayout if authenticated
  return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;
