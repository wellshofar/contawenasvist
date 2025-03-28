
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const OrdensDashboard: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
        <p className="text-muted-foreground mt-1">Gerencie as ordens de serviço no sistema.</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="min-h-[40vh] flex flex-col items-center justify-center">
            <h2 className="text-xl font-medium mb-2">Funcionalidade em desenvolvimento</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Esta página está sendo implementada. Em breve você poderá gerenciar ordens de serviço aqui.
            </p>
            {profile?.role === 'admin' && (
              <p className="text-sm text-blue-500 mt-4">
                Como administrador, você terá acesso completo às funcionalidades de ordens.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdensDashboard;
