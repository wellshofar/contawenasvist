import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "./LandingPage";

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();

  // Logging for debugging
  useEffect(() => {
    console.log("HomePage render - Auth state:", { user: !!user, loading });
  }, [user, loading]);

  // If still checking auth status, show simple loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise show landing page for non-authenticated users
  return <LandingPage />;
};

export default HomePage;
