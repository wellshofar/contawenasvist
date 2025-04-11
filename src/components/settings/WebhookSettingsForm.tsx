
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Webhook } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWebhook } from "@/hooks/useWebhook";
import WebhookHelpDialog from "./webhook/WebhookHelpDialog";
import { webhookFormSchema, WebhookFormValues } from "./webhook/WebhookSchema";

const WebhookSettingsForm: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const { isLoading, handleSaveWebhook, handleTestWebhook, defaultUrl } = useWebhook();
  
  const form = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      webhookUrl: defaultUrl
    }
  });

  const onSubmit = (data: WebhookFormValues) => {
    handleSaveWebhook(data);
  };

  const onTestWebhook = async () => {
    const webhookUrl = form.getValues('webhookUrl');
    await handleTestWebhook(webhookUrl);
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
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

            <WebhookHelpDialog open={showHelp} onOpenChange={setShowHelp} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onTestWebhook}
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
