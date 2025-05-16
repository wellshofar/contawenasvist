
import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClienteForm, { ClienteFormValues } from "./ClienteForm";

interface ClienteDialogProps {
  isEditing: boolean;
  defaultValues: ClienteFormValues;
  onSubmit: (values: ClienteFormValues) => Promise<void>;
}

const ClienteDialog: React.FC<ClienteDialogProps> = ({
  isEditing,
  defaultValues,
  onSubmit,
}) => {
  const handleCancel = () => {
    const closeButton = document.querySelector('[data-radix-dialog-close]');
    if (closeButton && 'click' in closeButton) {
      (closeButton as HTMLElement).click();
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar Cliente" : "Adicionar Novo Cliente"}
        </DialogTitle>
        <DialogDescription>
          Preencha os dados do cliente para {isEditing ? "atualizá-lo" : "cadastrá-lo"} no sistema.
        </DialogDescription>
      </DialogHeader>
      <ClienteForm 
        defaultValues={defaultValues} 
        onSubmit={onSubmit} 
        isEditing={isEditing} 
        onCancel={handleCancel} 
      />
    </DialogContent>
  );
};

export default ClienteDialog;
