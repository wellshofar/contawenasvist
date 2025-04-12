
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isEditing: boolean;
  submitting: boolean;
  onClose: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isEditing,
  submitting,
  onClose,
}) => {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button type="submit" disabled={submitting}>
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Atualizar" : "Agendar"}
      </Button>
    </div>
  );
};

export default FormActions;
