
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from '@/components/auth/LoginForm';
import AuthLayout from '@/components/auth/AuthLayout';

interface AuthProps {
  defaultTab?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ defaultTab = 'login' }) => {
  const { user, signIn } = useAuth();
  const [activeTab] = useState<string>('login');

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout 
      defaultTab="login"
      loginContent={<LoginForm onLogin={signIn} />}
      registerContent={null}
    >
      <p className="text-muted-foreground text-sm text-center">
        {activeTab === 'login' ? 'Entre com sua conta' : ''}
      </p>
    </AuthLayout>
  );
};

export default Auth;
