
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyAgendamentosProps {
  handleNewAgendamento: () => void;
}

const EmptyAgendamentos: React.FC<EmptyAgendamentosProps> = ({ 
  handleNewAgendamento 
}) => {
  return (
    <div className="py-20 text-center">
      <h3 className="text-lg font-medium mb-2">Nenhum agendamento encontrado</h3>
      <p className="text-muted-foreground mb-6">Não há agendamentos para exibir com os filtros atuais.</p>
      <Button onClick={handleNewAgendamento} variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        Criar um novo agendamento
      </Button>
    </div>
  );
};

export default EmptyAgendamentos;
