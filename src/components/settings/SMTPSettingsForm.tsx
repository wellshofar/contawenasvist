
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Save } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const smtpFormSchema = z.object({
  smtpHost: z.string().min(1, { message: "O servidor SMTP é obrigatório" }),
  smtpPort: z.coerce.number().int().min(1).max(65535),
  smtpUser: z.string().min(1, { message: "O usuário é obrigatório" }),
  smtpPassword: z.string().min(1, { message: "A senha é obrigatória" }),
  smtpSecure: z.boolean().default(true),
  smtpFromEmail: z.string().email({ message: "Email inválido" }),
  smtpFromName: z.string().min(1, { message: "O nome de remetente é obrigatório" }),
});

type SMTPFormValues = z.infer<typeof smtpFormSchema>;

const SMTPSettingsForm: React.FC = () => {
  const { systemSettings, updateSystemSettings, isLoading } = useSettings();
  
  const defaultValues: Partial<SMTPFormValues> = {
    smtpHost: systemSettings.smtpHost || "",
    smtpPort: systemSettings.smtpPort || 587,
    smtpUser: systemSettings.smtpUser || "",
    smtpPassword: systemSettings.smtpPassword || "",
    smtpSecure: systemSettings.smtpSecure || true,
    smtpFromEmail: systemSettings.smtpFromEmail || "",
    smtpFromName: systemSettings.smtpFromName || "",
  };

  const form = useForm<SMTPFormValues>({
    resolver: zodResolver(smtpFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: SMTPFormValues) => {
    try {
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

  const testConnection = async () => {
    const values = form.getValues();
    
    // Validate form before testing
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
      // Save settings first
      await updateSystemSettings(values);
      
      // Make a request to test the SMTP connection
      const response = await fetch("/api/test-smtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error("Falha ao testar conexão SMTP");
      }
      
      toast({
        title: "Conexão SMTP estabelecida",
        description: "O email de teste foi enviado com sucesso.",
      });
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="smtpHost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servidor SMTP</FormLabel>
                    <FormControl>
                      <Input placeholder="smtp.gmail.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Endereço do servidor SMTP
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtpPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porta</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="587" {...field} />
                    </FormControl>
                    <FormDescription>
                      Porta do servidor SMTP (geralmente 587 ou 465)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="smtpUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="seu-email@gmail.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Usuário para autenticação SMTP
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtpPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Senha para autenticação SMTP
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="smtpSecure"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Conexão Segura (TLS/SSL)</FormLabel>
                    <FormDescription>
                      Usar conexão segura para envio de emails
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="smtpFromEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Remetente</FormLabel>
                    <FormControl>
                      <Input placeholder="noreply@suaempresa.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Email que aparecerá como remetente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtpFromName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Remetente</FormLabel>
                    <FormControl>
                      <Input placeholder="Hoken Service" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nome que aparecerá como remetente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={testConnection}
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
