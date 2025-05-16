
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MailIcon, LockIcon } from "lucide-react";

interface RegisterFormProps {
  onRegister: (email: string, password: string, fullName: string) => Promise<{error: any}>;
  adminExists: boolean;
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, adminExists, onSuccess }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const { error } = await onRegister(email, password, fullName);
      
      if (error) {
        console.error("SignUp error:", error);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conta criada com sucesso",
          description: "Um administrador precisa aprovar sua conta antes que você possa fazer login.",
        });
        
        if (onSuccess) {
          onSuccess();
        }
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

  return (
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
  );
};

export default RegisterForm;
