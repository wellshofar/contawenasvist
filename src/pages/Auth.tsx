import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MailIcon, LockIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Auth: React.FC = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o e-mail e a senha.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        
        // Check if the error is that the user is not confirmed
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "E-mail não confirmado",
            description: "Tentando confirmar seu e-mail automaticamente...",
          });
          
          try {
            // Try to get the user if they do exist
            const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
            
            if (getUserError) throw getUserError;
            
            // Find the user with matching email
            const user = users?.find(u => u.email === email);
            
            if (user) {
              // Try to confirm the user's email
              const { error: updateUserError } = await supabase.auth.admin.updateUserById(
                user.id,
                { email_confirm: true }
              );
              
              if (updateUserError) throw updateUserError;
              
              toast({
                title: "E-mail confirmado",
                description: "Tentando fazer login novamente...",
              });
              
              // Try to login again
              const { error: retryError } = await signIn(email, password);
              
              if (retryError) {
                throw retryError;
              } else {
                // If login successful, redirect to dashboard
                navigate('/', { replace: true });
              }
            }
          } catch (confirmError) {
            console.error("Error confirming email:", confirmError);
            toast({
              title: "Erro ao confirmar e-mail",
              description: "Por favor, verifique seu e-mail e clique no link de confirmação.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Erro ao fazer login",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // If login successful, redirect to dashboard
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      console.error("Login exception:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        console.error("SignUp error:", error);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // No need to manually redirect since toast is shown from signUp function
      }
    } catch (error: any) {
      console.error("SignUp exception:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao tentar criar sua conta.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If loading, show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="max-w-md w-full p-4">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-2xl font-bold text-hoken-600">HOKEN Service Manager</h1>
            </div>
            <Tabs defaultValue="login" onValueChange={(value) => setIsLoggingIn(value === "login")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Acessar</TabsTrigger>
                <TabsTrigger value="register">Novo Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <CardDescription className="text-center pb-4">
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
                
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MailIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="seu@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <LockIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Aguarde..." : "Entrar"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <CardDescription className="text-center pb-4">
                  Crie uma nova conta para acessar o sistema
                </CardDescription>
                
                <form onSubmit={handleSignup}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome completo</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Seu nome completo" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emailRegister">E-mail</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MailIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="emailRegister" 
                          type="email" 
                          placeholder="seu@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passwordRegister">Senha</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <LockIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          id="passwordRegister" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Cadastrando..." : "Criar conta"}
                    </Button>

                    {!adminExists && (
                      <p className="text-sm text-green-600 text-center mt-2">
                        Primeiro cadastro será promovido a administrador automaticamente.
                      </p>
                    )}
                  </div>
                </form>
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

export default Auth;
