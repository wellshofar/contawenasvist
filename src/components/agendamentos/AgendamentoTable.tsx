
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Edit, Trash2, ListFilter } from "lucide-react";
import { Appointment } from "@/types/agendamentos";
import { 
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface AgendamentoTableProps {
  agendamentos: Appointment[];
  statusColors: Record<string, string>;
  statusTranslations: Record<string, string>;
  handleEdit: (agendamento: Appointment) => void;
  handleDelete: (id: string) => void;
}

const AgendamentoTable: React.FC<AgendamentoTableProps> = ({
  agendamentos,
  statusColors,
  statusTranslations,
  handleEdit,
  handleDelete
}) => {
  if (agendamentos.length === 0) return null;
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agendamentos.map((agendamento) => {
            const date = new Date(agendamento.scheduledDate);
            return (
              <TableRow key={agendamento.id}>
                <TableCell className="font-medium">{agendamento.title}</TableCell>
                <TableCell>{agendamento.customerName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {format(date, "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {format(date, "HH:mm", { locale: ptBR })}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors[agendamento.status]}`}>
                    {statusTranslations[agendamento.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ListFilter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(agendamento)}>
                        <Edit className="h-4 w-4 mr-2" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(agendamento.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgendamentoTable;
