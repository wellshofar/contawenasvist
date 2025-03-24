
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Redirect to Dashboard
  return <Navigate to="/" replace />;
};

export default Index;
