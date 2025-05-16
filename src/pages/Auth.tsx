
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthLayout from '@/components/auth/AuthLayout';

interface AuthProps {
  defaultTab?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ defaultTab = 'login' }) => {
  const { user, signIn, signUp, adminExists } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleTabChange = (value: 'login' | 'register') => {
    setActiveTab(value);
  };

  return (
    <AuthLayout 
      defaultTab={defaultTab}
      loginContent={<LoginForm onLogin={signIn} />}
      registerContent={<RegisterForm onRegister={signUp} adminExists={adminExists || false} />}
      onTabChange={handleTabChange}
    >
      <p className="text-muted-foreground text-sm text-center">
        {activeTab === 'login' ? 'Entre com sua conta' : 'Crie uma nova conta'}
      </p>
    </AuthLayout>
  );
};

export default Auth;
