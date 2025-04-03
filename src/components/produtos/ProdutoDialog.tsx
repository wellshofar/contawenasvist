
import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProdutoForm, { ProdutoFormValues } from "./ProdutoForm";

interface ProdutoDialogProps {
  isEditing: boolean;
  defaultValues: ProdutoFormValues;
  onSubmit: (values: ProdutoFormValues) => Promise<void>;
}

const ProdutoDialog: React.FC<ProdutoDialogProps> = ({
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
          {isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
        </DialogTitle>
        <DialogDescription>
          Preencha os dados do produto HOKEN para {isEditing ? "atualizá-lo" : "cadastrá-lo"} no sistema.
        </DialogDescription>
      </DialogHeader>
      <ProdutoForm 
        defaultValues={defaultValues} 
        onSubmit={onSubmit} 
        isEditing={isEditing} 
        onCancel={handleCancel} 
      />
    </DialogContent>
  );
};

export default ProdutoDialog;
