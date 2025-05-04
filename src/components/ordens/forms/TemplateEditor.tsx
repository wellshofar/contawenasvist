
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormLabel } from "@/components/ui/form";
import { Edit } from "lucide-react";

interface TemplateEditorProps {
  templateText: string;
  editMode: boolean;
  onTemplateChange: (text: string) => void;
  onToggleEditMode: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  templateText,
  editMode,
  onTemplateChange,
  onToggleEditMode
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Template da Ordem de Serviço</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onToggleEditMode} 
          className="flex items-center gap-1"
        >
          {editMode ? "Salvar" : <><Edit className="h-4 w-4" /> Editar</>}
        </Button>
      </div>
      
      {editMode ? (
        <Textarea 
          value={templateText}
          onChange={(e) => onTemplateChange(e.target.value)}
          rows={10}
          className="font-mono"
        />
      ) : (
        <div className="border rounded-md p-3 whitespace-pre-wrap bg-muted/30">
          {templateText}
        </div>
      )}
    </div>
  );
};

export default TemplateEditor;
