
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WebhookHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WebhookHelpDialog: React.FC<WebhookHelpDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default WebhookHelpDialog;
