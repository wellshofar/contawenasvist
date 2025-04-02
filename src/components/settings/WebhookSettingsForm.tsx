
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { sendToMakeWebhook } from "@/utils/notifications";
import { AlertTriangle, CheckCircle, Webhook } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WebhookFormValues {
  webhookUrl: string;
}

const WebhookSettingsForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const form = useForm<WebhookFormValues>({
    defaultValues: {
      webhookUrl: localStorage.getItem('webhookUrl') || ''
    }
  });

  const onSaveWebhook = (data: WebhookFormValues) => {
    localStorage.setItem('webhookUrl', data.webhookUrl);
    toast({
      title: "Webhook salvo",
      description: "A URL do webhook foi salva com sucesso."
    });
  };

  const handleTestWebhook = async () => {
    const webhookUrl = form.getValues('webhookUrl');
    
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL de webhook válida.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Enviar um teste para o webhook configurado
      await sendToMakeWebhook({
        event: "test",
        source: "webhook_test",
        timestamp: new Date().toISOString(),
        data: {
          message: "Este é um teste de integração do sistema HOKEN",
        }
      });
      
      toast({
        title: "Teste enviado",
        description: "O teste foi enviado com sucesso para o webhook.",
      });
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível enviar o teste para o webhook.",
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
          <Webhook className="h-5 w-5" />
          Configuração de Webhooks
        </CardTitle>
        <CardDescription>
          Configure webhooks para integrar com ferramentas externas como Make (Integromat), n8n, Zapier e outras.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSaveWebhook)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Webhook</FormLabel>
                  <FormControl>
                    <Input placeholder="https://hook.eu2.make.com/yourwebhook" {...field} />
                  </FormControl>
                  <FormDescription>
                    Insira a URL do seu webhook da ferramenta de automação externa.
                  </FormDescription>
                </FormItem>
              )}
            />

            <Dialog open={showHelp} onOpenChange={setShowHelp}>
              <DialogTrigger asChild>
                <Button variant="outline" type="button">Ver Exemplos de Uso</Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Como usar webhooks</DialogTitle>
                  <DialogDescription>
                    Orientações para configurar webhooks em diferentes plataformas
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Make (Integromat)</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Crie um novo cenário no Make</li>
                      <li>Adicione o módulo "Webhooks" como trigger</li>
                      <li>Selecione "Webhook personalizado"</li>
                      <li>Copie a URL gerada e cole no campo acima</li>
                    </ol>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">n8n</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Crie um novo workflow no n8n</li>
                      <li>Adicione o nó "Webhook"</li>
                      <li>Configure como "Webhook Listener"</li>
                      <li>Copie a URL gerada e cole no campo acima</li>
                    </ol>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Zapier</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Crie um novo Zap no Zapier</li>
                      <li>Selecione "Webhook" como trigger</li>
                      <li>Escolha "Catch Hook"</li>
                      <li>Copie a URL gerada e cole no campo acima</li>
                    </ol>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestWebhook}
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Testar Webhook"}
            </Button>
            <Button type="submit">Salvar Webhook</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default WebhookSettingsForm;
