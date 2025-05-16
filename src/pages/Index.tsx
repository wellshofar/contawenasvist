
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Redirect to Home page instead of Dashboard
  return <Navigate to="/" replace />;
};

export default Index;
