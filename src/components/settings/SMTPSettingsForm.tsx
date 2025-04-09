
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, Save } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { testSMTPConnection } from "@/utils/emailUtils";
import { smtpFormSchema, type SMTPFormValues } from "./smtp/SMTPSchema";
import SMTPServerFields from "./smtp/SMTPServerFields";
import SMTPAuthFields from "./smtp/SMTPAuthFields";
import SMTPSecureToggle from "./smtp/SMTPSecureToggle";
import SMTPSenderFields from "./smtp/SMTPSenderFields";

const SMTPSettingsForm: React.FC = () => {
  const { systemSettings, updateSystemSettings, isLoading } = useSettings();
  
  const defaultValues: Partial<SMTPFormValues> = {
    smtpHost: systemSettings.smtpHost || "",
    smtpPort: systemSettings.smtpPort || 587,
    smtpUser: systemSettings.smtpUser || "",
    smtpPassword: systemSettings.smtpPassword || "",
    smtpSecure: systemSettings.smtpSecure !== false,
    smtpFromEmail: systemSettings.smtpFromEmail || "",
    smtpFromName: systemSettings.smtpFromName || "",
  };

  const form = useForm<SMTPFormValues>({
    resolver: zodResolver(smtpFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (systemSettings) {
      form.reset({
        smtpHost: systemSettings.smtpHost || "",
        smtpPort: systemSettings.smtpPort || 587,
        smtpUser: systemSettings.smtpUser || "",
        smtpPassword: systemSettings.smtpPassword || "",
        smtpSecure: systemSettings.smtpSecure !== false,
        smtpFromEmail: systemSettings.smtpFromEmail || "",
        smtpFromName: systemSettings.smtpFromName || "",
      });
    }
  }, [systemSettings, form]);

  console.log("Current system settings:", systemSettings);

  const onSubmit = async (data: SMTPFormValues) => {
    try {
      console.log("Submitting SMTP settings:", data);
      await updateSystemSettings(data);
      toast({
        title: "Configurações SMTP salvas",
        description: "As configurações do servidor de email foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações SMTP:", error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível atualizar as configurações do servidor de email.",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    const values = form.getValues();
    
    const validationResult = await form.trigger();
    if (!validationResult) {
      toast({
        title: "Formulário inválido",
        description: "Preencha todos os campos obrigatórios antes de testar a conexão.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Testando conexão SMTP...",
      description: "Enviando email de teste.",
    });
    
    try {
      await updateSystemSettings(values);
      
      const result = await testSMTPConnection();
      
      if (result.success) {
        toast({
          title: "Conexão SMTP estabelecida",
          description: "O email de teste foi enviado com sucesso.",
        });
      } else {
        throw new Error(result.error || "Falha ao testar conexão SMTP");
      }
    } catch (error) {
      console.error("Erro ao testar conexão SMTP:", error);
      toast({
        title: "Erro na conexão SMTP",
        description: "Não foi possível conectar ao servidor SMTP. Verifique as configurações.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Configurações de SMTP
        </CardTitle>
        <CardDescription>
          Configure seu servidor SMTP para envio de emails pelo sistema
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <SMTPServerFields form={form} />
            <SMTPAuthFields form={form} />
            <SMTPSecureToggle form={form} />
            <SMTPSenderFields form={form} />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isLoading}
            >
              Testar Conexão
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default SMTPSettingsForm;
