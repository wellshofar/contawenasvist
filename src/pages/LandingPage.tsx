
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      <header className="container mx-auto py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="font-semibold text-xl">HOKEN</span>
        </div>
        <div>
          <Button variant="outline" className="mr-2" onClick={() => navigate('/login')}>
            Entrar
          </Button>
          <Button onClick={() => navigate('/auth', { state: { defaultTab: 'register' } })}>
            Cadastrar
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 py-12">
        <div className="space-y-6 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            HOKEN Service Manager
          </h1>
          <p className="text-xl text-muted-foreground">
            Sistema completo para gestão de serviços, agendamentos e manutenções para sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Começar agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Acessar sistema
            </Button>
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-8 shadow-lg border border-border">
          <div className="aspect-video w-full max-w-lg bg-card rounded-md flex items-center justify-center">
            <div className="text-center p-8">
              <h3 className="text-2xl font-semibold mb-4">HOKEN Service Manager</h3>
              <p className="text-muted-foreground">
                Controle de manutenções e filtros
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          HOKEN Service Manager &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
