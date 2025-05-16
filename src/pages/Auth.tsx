
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthLoader from '@/components/auth/AuthLoader';

interface AuthProps {
  defaultTab?: 'login' | 'register';
}

interface LocationState {
  defaultTab?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ defaultTab = 'login' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signIn, signUp, adminExists, loading } = useAuth();
  const locationState = location.state as LocationState;
  const initialTab = locationState?.defaultTab || defaultTab;
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Show loader while checking auth state
  if (loading) {
    return <AuthLoader />;
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleTabChange = (value: 'login' | 'register') => {
    setActiveTab(value);
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleRegisterSuccess = () => {
    // Redirect to login tab after successful registration
    setActiveTab('login');
  };

  return (
    <AuthLayout 
      defaultTab={initialTab}
      loginContent={<LoginForm onLogin={signIn} onSuccess={handleLoginSuccess} />}
      registerContent={<RegisterForm onRegister={signUp} adminExists={adminExists || false} onSuccess={handleRegisterSuccess} />}
      onTabChange={handleTabChange}
    >
      <p className="text-muted-foreground text-sm text-center">
        {activeTab === 'login' ? 'Entre com sua conta' : 'Crie uma nova conta'}
      </p>
    </AuthLayout>
  );
};

export default Auth;
