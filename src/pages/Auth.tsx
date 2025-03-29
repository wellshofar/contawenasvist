
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthLoader from '@/components/auth/AuthLoader';

const Auth: React.FC = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);
          
        if (error) throw error;
        
        setAdminExists(data && data.length > 0);
      } catch (e) {
        console.error('Error checking for admin:', e);
      }
    };
    
    checkAdmin();
  }, []);

  // If loading, show spinner
  if (loading) {
    return <AuthLoader />;
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const loginContent = (
    <>
      <CardDescription className="text-center pb-4">
        Entre com suas credenciais para acessar o sistema
      </CardDescription>
      <LoginForm onLogin={signIn} />
    </>
  );

  const registerContent = (
    <>
      <CardDescription className="text-center pb-4">
        Crie uma nova conta para acessar o sistema
      </CardDescription>
      <RegisterForm onRegister={signUp} adminExists={adminExists} />
    </>
  );

  return (
    <AuthLayout 
      loginContent={loginContent}
      registerContent={registerContent}
      defaultTab={isLoggingIn ? 'login' : 'register'}
      onTabChange={(value) => setIsLoggingIn(value === 'login')}
    >
      {/* Este children está vazio mas é necessário para satisfazer o TypeScript */}
    </AuthLayout>
  );
};

export default Auth;
