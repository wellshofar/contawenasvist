
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WebhookSettingsForm from "./WebhookSettingsForm";
import EvolutionApiForm from "./EvolutionApiForm";
import { Webhook, MessageSquare } from "lucide-react";

const IntegrationsSettingsForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrações Externas</CardTitle>
        <CardDescription>
          Configure webhooks e outras integrações com sistemas externos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="webhooks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              <span>Webhooks</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhooks" className="space-y-4 pt-4">
            <WebhookSettingsForm />
          </TabsContent>
          
          <TabsContent value="whatsapp" className="space-y-4 pt-4">
            <EvolutionApiForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegrationsSettingsForm;
