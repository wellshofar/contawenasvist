
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Save, Trash } from "lucide-react";

interface OrderDescriptionProps {
  orderId: string;
  initialDescription: string | null;
  cleanDescription: string;
  onDelete?: () => void;
}

const OrderDescription: React.FC<OrderDescriptionProps> = ({
  orderId,
  initialDescription,
  cleanDescription,
  onDelete,
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(cleanDescription);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveDescription = async () => {
    setIsSaving(true);
    try {
      // When saving, make sure to preserve the original JSON data in the description
      let updatedDescription = editedDescription;

      // Check if there was service items JSON in the original description
      if (initialDescription) {
        const regex = /(\{.*"items":\s*\[.*\].*"__metadata":\s*\{\s*"type":\s*"serviceItems"\s*\}\})/s;
        const match = initialDescription.match(regex);
        
        if (match) {
          // Append the JSON to the new description
          updatedDescription = `${editedDescription}\n\n${match[1]}`;
        }
      }

      const { error } = await supabase
        .from("service_orders")
        .update({ description: updatedDescription })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ordem de serviço atualizada com sucesso.",
      });

      // Return the updated values to parent component
      setIsEditing(false);
      
      return {
        updatedDescription,
        cleanDescription: editedDescription
      };
    } catch (error) {
      console.error("Error updating service order:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a ordem de serviço.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-6 border-b pb-4 print:mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-lg">Detalhes do Atendimento</h2>
        <div className="flex gap-2 print:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={isEditing ? handleSaveDescription : handleToggleEdit}
            className="flex items-center gap-1"
            disabled={isSaving}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar"}
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Editar
              </>
            )}
          </Button>
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
              Excluir
            </Button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <Textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="min-h-[200px] font-mono print:hidden"
        />
      ) : (
        <div className="whitespace-pre-wrap">
          {cleanDescription || "Nenhum detalhe informado."}
        </div>
      )}
    </div>
  );
};

export default OrderDescription;
