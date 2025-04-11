
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit, User } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Perfil do Usuário</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate('/configuracoes')}
        >
          <Edit className="w-4 h-4" />
          Editar Perfil
        </Button>
      </div>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="bg-primary/10 rounded-full p-3">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{profile?.full_name || 'Usuário'}</CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium">Nome Completo</h3>
            <p className="text-muted-foreground">{profile?.full_name || 'Não informado'}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium">Telefone</h3>
            <p className="text-muted-foreground">{profile?.phone || 'Não informado'}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium">Cargo</h3>
            <p className="text-muted-foreground">{
              profile?.role === 'admin' ? 'Administrador' : 
              profile?.role === 'tecnico' ? 'Técnico' : 
              profile?.role === 'atendente' ? 'Atendente' : 'Usuário'
            }</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
