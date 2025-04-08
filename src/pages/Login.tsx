
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Auth from './Auth';

const Login: React.FC = () => {
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Auth />
  );
};

export default Login;
