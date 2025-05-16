
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "./LandingPage";

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();

  // Adicionando console log para depuração
  useEffect(() => {
    console.log("HomePage render - Auth state:", { user: !!user, loading });
  }, [user, loading]);

  // Se ainda estiver verificando o status da autenticação, mostre algo simples
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se o usuário estiver autenticado, redirecione para o Dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Caso contrário, mostre a landing page para usuários não autenticados
  return <LandingPage />;
};

export default HomePage;
