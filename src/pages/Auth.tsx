
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
  from?: Location;
}

const Auth: React.FC<AuthProps> = ({ defaultTab = 'login' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signIn, signUp, adminExists, loading } = useAuth();
  const locationState = location.state as LocationState;
  const initialTab = locationState?.defaultTab || defaultTab;
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Debug log
  useEffect(() => {
    console.log("Auth render -", { 
      isAuthenticated: !!user, 
      loading, 
      activeTab, 
      from: locationState?.from?.pathname 
    });
  }, [user, loading, activeTab, locationState]);

  // Show loader while checking auth state
  if (loading) {
    return <AuthLoader />;
  }

  // If user is already logged in, redirect to dashboard or requested page
  if (user) {
    const redirectTo = locationState?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const handleTabChange = (value: 'login' | 'register') => {
    setActiveTab(value);
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleRegisterSuccess = () => {
    // Switch to login tab after successful registration
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
