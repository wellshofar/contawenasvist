
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MailIcon, LockIcon } from "lucide-react";
import { handleLoginError } from "@/utils/authHelpers";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{error: any}>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const { error } = await onLogin(email, password);
      
      if (error) {
        // Handle login error using the extracted helper function
        await handleLoginError(
          error, 
          email, 
          password,
          // Function to retry login
          async () => await onLogin(email, password)
        );
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

  return (
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
  );
};

export default LoginForm;
