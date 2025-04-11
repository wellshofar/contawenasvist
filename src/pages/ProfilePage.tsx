
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-3xl">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{profile?.full_name || 'Usuário'}</CardTitle>
            <p className="text-muted-foreground">{profile?.role === 'admin' ? 'Administrador' : 
              profile?.role === 'tecnico' ? 'Técnico' : 
              profile?.role === 'atendente' ? 'Atendente' : 'Usuário'}</p>
          </CardHeader>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
    </div>
  );
};

export default ProfilePage;
