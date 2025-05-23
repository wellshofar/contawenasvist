
import React, { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SystemSettings } from "@/types/settings";
import { toast } from "@/hooks/use-toast";

const SystemSettingsForm: React.FC = () => {
  const { systemSettings, updateSystemSettings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SystemSettings>({
    defaultValues: systemSettings
  });

  React.useEffect(() => {
    // Update form when systemSettings change
    if (systemSettings) {
      reset(systemSettings);
    }
  }, [systemSettings, reset]);

  const onSubmit = async (data: SystemSettings) => {
    try {
      setIsSubmitting(true);
      await updateSystemSettings(data);
      toast({
        title: "Configurações salvas",
        description: "As configurações da empresa foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações da empresa.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Empresa</CardTitle>
        <CardDescription>
          Configure as informações da sua empresa para os relatórios e documentos
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input 
              id="companyName" 
              placeholder="HOKEN Purificadores" 
              {...register("companyName", { required: "Nome da empresa é obrigatório" })}
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input 
              id="address" 
              placeholder="Av. Principal, 123, São Paulo - SP" 
              {...register("address")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              placeholder="(11) 99999-9999" 
              {...register("phone")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="contato@hoken.com.br" 
              {...register("email", { 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "E-mail inválido"
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SystemSettingsForm;
