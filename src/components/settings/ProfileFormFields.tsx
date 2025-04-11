
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CardContent, CardFooter } from "@/components/ui/card";
import { ProfileFormData } from "@/hooks/useProfileData";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";

interface ProfileFormFieldsProps {
  defaultValues: {
    full_name: string;
    phone: string;
    email: string;
  };
  onSubmit: (data: ProfileFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({ 
  defaultValues,
  onSubmit,
  isSubmitting
}) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input 
              id="full_name" 
              {...register("full_name", { required: "Nome é obrigatório" })}
              className="w-full"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              placeholder="(00) 00000-0000" 
              {...register("phone")}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email"
              {...register("email", { 
                required: "E-mail é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "E-mail inválido"
                }
              })}
              className="w-full"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate('/configuracoes?tab=security')}
        >
          <KeyRound className="h-4 w-4" />
          Alterar Senha
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default ProfileFormFields;
