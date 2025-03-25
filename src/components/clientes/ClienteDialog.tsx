
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClienteForm, { ClienteFormValues } from "./ClienteForm";

interface ClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  defaultValues: ClienteFormValues;
  onSubmit: (values: ClienteFormValues) => Promise<void>;
}

const ClienteDialog: React.FC<ClienteDialogProps> = ({
  open,
  onOpenChange,
  isEditing,
  defaultValues,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClienteDialog;
