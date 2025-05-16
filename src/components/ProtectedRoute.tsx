
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

  // Adicionando console log para depuração
  useEffect(() => {
    console.log("ProtectedRoute render -", 
      { path: location.pathname, isAuthenticated: !!user, loading }
    );
  }, [user, loading, location]);

  // Mostre estado de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Redirecione para home se não estiver autenticado
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Renderize os filhos envolvidos em AppLayout se autenticado
  return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;
