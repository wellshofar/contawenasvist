
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/30">
      <div className="text-center max-w-md mx-auto space-y-6 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-4xl">H</span>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <Button asChild className="mt-8 gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
