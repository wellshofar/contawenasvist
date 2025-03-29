
import React from 'react';
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthLayoutProps {
  children: React.ReactNode;
  loginContent: React.ReactNode;
  registerContent: React.ReactNode;
  defaultTab?: 'login' | 'register';
  onTabChange?: (value: 'login' | 'register') => void;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  loginContent, 
  registerContent,
  defaultTab = 'login',
  onTabChange 
}) => {
  const handleValueChange = (value: string) => {
    if (onTabChange && (value === 'login' || value === 'register')) {
      onTabChange(value);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="max-w-md w-full p-4">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-2xl font-bold text-hoken-600">HOKEN Service Manager</h1>
            </div>
            <Tabs defaultValue={defaultTab} onValueChange={handleValueChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Acessar</TabsTrigger>
                <TabsTrigger value="register">Novo Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                {loginContent}
              </TabsContent>
              
              <TabsContent value="register">
                {registerContent}
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardFooter className="text-center text-xs text-muted-foreground">
            HOKEN Service Manager &copy; {new Date().getFullYear()}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
