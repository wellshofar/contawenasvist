
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Form } from "@/components/ui/form";
import ApiConfigFields from "./evolution/ApiConfigFields";
import TestMessageSection from "./evolution/TestMessageSection";
import { useEvolutionApi } from "@/hooks/useEvolutionApi";
import { EvolutionApiFormValues } from "./evolution/EvolutionApiSchema";

const EvolutionApiForm: React.FC = () => {
  const { isLoading, saveSettings, sendTestMessage, defaultValues } = useEvolutionApi();
  
  const form = useForm<EvolutionApiFormValues>({
    defaultValues
  });

  const onSaveSettings = async (data: EvolutionApiFormValues) => {
    await saveSettings(data);
  };

  const handleTestMessage = async () => {
    await sendTestMessage(form.getValues());
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
            <ApiConfigFields form={form} />
            <TestMessageSection 
              form={form} 
              isLoading={isLoading} 
              onTestMessage={handleTestMessage} 
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Salvar Configurações</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default EvolutionApiForm;
