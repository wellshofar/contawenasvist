import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "./LandingPage";

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();

  // If still checking authentication status, render nothing to avoid flashing
  if (loading) {
    return null;
  }

  // If user is authenticated, redirect to Dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, show the landing page for non-authenticated users
  return <LandingPage />;
};

export default HomePage;
