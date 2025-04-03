
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { useSettings } from "@/contexts/SettingsContext";

interface EvolutionApiFormValues {
  instanceName: string;
  apiToken: string;
  apiBaseUrl: string;
  testNumber: string;
}

const EvolutionApiForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { systemSettings, updateSystemSettings } = useSettings();
  
  const form = useForm<EvolutionApiFormValues>({
    defaultValues: {
      instanceName: systemSettings.evolutionInstance || "juniorhoken",
      apiToken: systemSettings.evolutionToken || "",
      apiBaseUrl: systemSettings.evolutionUrl || "https://api.chatzapbot.com.br",
      testNumber: ""
    }
  });

  const onSaveSettings = async (data: EvolutionApiFormValues) => {
    // Salvar as configurações do Evolution API
    await updateSystemSettings({
      evolutionInstance: data.instanceName,
      evolutionToken: data.apiToken,
      evolutionUrl: data.apiBaseUrl
    });
    
    toast({
      title: "Configurações salvas",
      description: "As configurações do Evolution API foram salvas com sucesso."
    });
  };

  const handleTestMessage = async () => {
    const { instanceName, apiToken, apiBaseUrl, testNumber } = form.getValues();
    
    if (!testNumber) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de teste válido.",
        variant: "destructive",
      });
      return;
    }

    if (!instanceName || !apiToken) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da instância e o token API.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Format phone number (remove non-numeric characters and ensure it has country code)
      let phoneNumber = testNumber.replace(/\D/g, '');
      if (!phoneNumber.startsWith('55')) {
        phoneNumber = `55${phoneNumber}`;
      }
      
      console.log(`Sending WhatsApp to formatted number: ${phoneNumber}`);
      console.log(`Using Evolution API: ${apiBaseUrl}/${instanceName}`);
      
      // Try direct API call first
      try {
        const response = await fetch(`${apiBaseUrl}/message/text/${instanceName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": apiToken
          },
          body: JSON.stringify({
            number: phoneNumber,
            text: "Teste de integração da Evolution API com o sistema HOKEN. Se você recebeu esta mensagem, a integração está funcionando corretamente!"
          })
        });
        
        const result = await response.json();
        console.log("WhatsApp direct API response:", result);
        
        if (!response.ok) {
          throw new Error(`WhatsApp API error: ${result.error || JSON.stringify(result)}`);
        }
        
        toast({
          title: "Mensagem enviada",
          description: `Uma mensagem de teste foi enviada para o número ${testNumber}.`,
        });
        
        return;
      } catch (directError) {
        console.error("Erro ao enviar mensagem diretamente:", directError);
      }
      
      // Fallback to using the Supabase function
      const response = await fetch(`${window.location.origin}/api/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "whatsapp",
          to: phoneNumber,
          message: "Teste de integração da Evolution API com o sistema HOKEN. Se você recebeu esta mensagem, a integração está funcionando corretamente!",
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Send notification response:", result);
      
      toast({
        title: "Mensagem enviada",
        description: `Uma mensagem de teste foi enviada para o número ${testNumber}.`,
      });
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar a mensagem de teste. Verifique os logs no console para mais detalhes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Integração com Evolution API
        </CardTitle>
        <CardDescription>
          Configure a integração com a Evolution API para envio de mensagens pelo WhatsApp.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSaveSettings)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="apiBaseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da API</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.chatzapbot.com.br" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="instanceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Instância</FormLabel>
                  <FormControl>
                    <Input placeholder="juniorhoken" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token da API</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu token da Evolution API" type="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Teste da Integração</h3>
              <FormField
                control={form.control}
                name="testNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número para Teste</FormLabel>
                    <FormControl>
                      <Input placeholder="5511999998888" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Formato: código do país + DDD + número (ex: 5511999998888)
                    </p>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestMessage}
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Mensagem de Teste"}
            </Button>
            <Button type="submit">Salvar Configurações</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default EvolutionApiForm;
