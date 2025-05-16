
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Redirecionar para a página inicial
  return <Navigate to="/" replace />;
};

export default Index;
