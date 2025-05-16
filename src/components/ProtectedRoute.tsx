
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from './layout/AppLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Add debug log
  useEffect(() => {
    console.log("ProtectedRoute render -", 
      { path: location.pathname, isAuthenticated: !!user, loading }
    );
  }, [user, loading, location]);

  // Show loading state while checking authentication
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
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Render children wrapped in AppLayout if authenticated
  return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;
