
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Auth: React.FC = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setInfoMessage(null);

    try {
      let emailToUse = email.trim();
      
      // Special case for administrator accounts
      if (email.trim().toLowerCase() === 'administradorgeral' || email.trim().toLowerCase() === 'admin') {
        emailToUse = 'admin@hokenservice.com.br';
      } 
      // Additional check for the explicit admin email
      else if (email.trim().toLowerCase() === 'wellingtonshofar@gmail.com') {
        emailToUse = 'wellingtonshofar@gmail.com';
      }

      const { error } = await signIn(emailToUse, password);
      
      if (error) {
        console.error("Login error:", error);
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Credenciais inválidas",
            description: "Verifique seu usuário e senha e tente novamente.",
            variant: "destructive",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email não confirmado",
            description: "Por favor, confirme seu email antes de fazer login.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro ao fazer login",
            description: error.message || "Ocorreu um erro ao tentar fazer login.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      console.error("Login exception:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Algo deu errado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      toast({
        title: "Nome Completo é obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setInfoMessage(null);

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message || "Verifique suas informações e tente novamente.",
          variant: "destructive",
        });
      } else {
        // Reset fields after successful signup
        setEmail("");
        setPassword("");
        setFullName("");
        // Switch to login tab
        setIsLoggingIn(true);
        // Show info message
        setInfoMessage("Conta criada com sucesso! Um administrador precisa aprovar seu acesso antes que você possa fazer login. Por favor, entre em contato com o administrador do sistema.");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Algo deu errado. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is already logged in, redirect to dashboard
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Hoken Service</CardTitle>
            <CardDescription className="text-center">
              Gerenciamento de ordens de serviço
            </CardDescription>
          </CardHeader>
          
          {infoMessage && (
            <div className="px-6 mb-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {infoMessage}
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <Tabs defaultValue={isLoggingIn ? "login" : "register"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="login" 
                onClick={() => setIsLoggingIn(true)}
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                onClick={() => setIsLoggingIn(false)}
              >
                Cadastre-se
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Usuário ou Email</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Seu usuário ou email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Nome Completo"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Senha</Label>
                    <Input
                      id="password-register"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="px-6 py-4 text-xs text-center text-muted-foreground">
            <p>Para acessar com a conta de administrador, use:</p>
            <p>Usuário: administradorgeral ou wellingtonshofar@gmail.com</p>
            <p>Senha: Filtros@25</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
