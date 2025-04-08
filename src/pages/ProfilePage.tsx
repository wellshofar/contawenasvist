
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from "@/components/ui/separator";

const ProfilePage: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Perfil do Usuário</h1>
      </div>

      <Card>
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
            <h3 className="font-medium">Cargo</h3>
            <p className="text-muted-foreground">{profile?.role || 'Usuário'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
