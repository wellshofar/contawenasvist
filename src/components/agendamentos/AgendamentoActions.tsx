
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Printer, Download } from "lucide-react";
import { Appointment } from "@/types/agendamentos";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { exportAppointmentsToCsv } from "@/hooks/agendamentos/agendamentoUtils";

interface AgendamentoActionsProps {
  handleNewAgendamento: () => void;
  setReportDialogOpen: (value: boolean) => void;
  filteredAgendamentos: Appointment[];
  statusTranslations: Record<string, string>;
}

const AgendamentoActions: React.FC<AgendamentoActionsProps> = ({
  handleNewAgendamento,
  setReportDialogOpen,
  filteredAgendamentos,
  statusTranslations
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" /> Relatórios
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setReportDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Gerar relatório
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => exportAppointmentsToCsv(filteredAgendamentos, statusTranslations)}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={handleNewAgendamento} className="gap-2">
        <Plus className="mr-2 h-4 w-4" />
        Novo Agendamento
      </Button>
    </div>
  );
};

export default AgendamentoActions;
