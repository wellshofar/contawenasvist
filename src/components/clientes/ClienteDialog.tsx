
import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
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
    // Usar DialogClose para fechar o diálogo sem confiar em querySelectors
    // que podem causar problemas de interação
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
