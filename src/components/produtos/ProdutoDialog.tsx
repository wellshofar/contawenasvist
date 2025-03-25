
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProdutoForm, { ProdutoFormValues } from "./ProdutoForm";

interface ProdutoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  defaultValues: ProdutoFormValues;
  onSubmit: (values: ProdutoFormValues) => Promise<void>;
}

const ProdutoDialog: React.FC<ProdutoDialogProps> = ({
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
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProdutoDialog;
