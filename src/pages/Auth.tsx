
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { supabase } from '@/integrations/supabase/client';

interface AuthProps {
  defaultTab?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ defaultTab = 'login' }) => {
  const { user, signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [adminExists, setAdminExists] = useState<boolean>(true);

  // Check if an admin user already exists in the system
  useEffect(() => {
    const checkIfAdminExists = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);
          
        if (error) {
          console.error('Error checking for admin:', error);
          return;
        }
        
        setAdminExists(data && data.length > 0);
      } catch (error) {
        console.error('Exception checking for admin:', error);
      }
    };
    
    checkIfAdminExists();
  }, []);

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">HOKEN SERVICE</CardTitle>
            <p className="text-muted-foreground text-sm">
              {activeTab === 'login' ? 'Entre com sua conta' : 'Crie sua conta'}
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Registro</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm onLogin={signIn} />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm onRegister={signUp} adminExists={adminExists} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
