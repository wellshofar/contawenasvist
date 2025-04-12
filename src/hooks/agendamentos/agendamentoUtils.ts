
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment } from "@/types/agendamentos";

export const exportAppointmentsToCsv = (agendamentos: Appointment[], statusTranslations: Record<string, string>) => {
  // Create CSV header row
  const headers = ['Título', 'Cliente', 'Data', 'Horário', 'Status', 'Descrição'];
  
  // Convert each appointment to a row of data
  const rows = agendamentos.map(agendamento => {
    const date = new Date(agendamento.scheduledDate);
    return [
      agendamento.title,
      agendamento.customerName,
      format(date, "dd/MM/yyyy", { locale: ptBR }),
      format(date, "HH:mm", { locale: ptBR }),
      statusTranslations[agendamento.status],
      agendamento.description || ''
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `relatorio_agendamentos_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
