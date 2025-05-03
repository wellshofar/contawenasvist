
import React from "react";
import { Appointment } from "@/types/agendamentos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  handleDelete,
}) => {
  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agendamentos.map((agendamento) => (
            <TableRow key={agendamento.id}>
              <TableCell className="font-medium">
                {formatDate(agendamento.scheduledDate)}
              </TableCell>
              <TableCell>{agendamento.customerName}</TableCell>
              <TableCell>{agendamento.customerCity || "-"}</TableCell>
              <TableCell>{agendamento.title}</TableCell>
              <TableCell>
                <Badge className={`${statusColors[agendamento.status]}`}>
                  {statusTranslations[agendamento.status] || agendamento.status}
                </Badge>
              </TableCell>
              <TableCell>{agendamento.productName || "-"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                      <span className="sr-only">Abrir menu</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(agendamento)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(agendamento.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgendamentoTable;
