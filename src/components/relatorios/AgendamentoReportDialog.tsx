
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AgendamentoReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agendamentos: any[];
  statusTranslations: Record<string, string>;
}

const AgendamentoReportDialog: React.FC<AgendamentoReportDialogProps> = ({
  open,
  onOpenChange,
  agendamentos,
  statusTranslations
}) => {
  const [selectedFields, setSelectedFields] = useState({
    titulo: true,
    cliente: true,
    data: true,
    horario: true,
    status: true,
    descricao: false,
  });

  const handleFieldChange = (field: string) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Relatório de Agendamentos", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Define the columns based on selected fields
    const columns = [];
    
    if (selectedFields.titulo) columns.push("Título");
    if (selectedFields.cliente) columns.push("Cliente");
    if (selectedFields.data) columns.push("Data");
    if (selectedFields.horario) columns.push("Horário");
    if (selectedFields.status) columns.push("Status");
    if (selectedFields.descricao) columns.push("Descrição");
    
    // Extract the data
    const data = agendamentos.map(agendamento => {
      const date = new Date(agendamento.scheduledDate);
      const row = [];
      if (selectedFields.titulo) row.push(agendamento.title);
      if (selectedFields.cliente) row.push(agendamento.customerName);
      if (selectedFields.data) row.push(format(date, "dd/MM/yyyy", { locale: ptBR }));
      if (selectedFields.horario) row.push(format(date, "HH:mm", { locale: ptBR }));
      if (selectedFields.status) row.push(statusTranslations[agendamento.status]);
      if (selectedFields.descricao) row.push(agendamento.description || "-");
      return row;
    });
    
    // @ts-ignore - jsPDF types are not properly defined
    doc.autoTable({
      head: [columns],
      body: data,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    
    // Save the PDF
    doc.save(`relatorio_agendamentos_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const printReport = () => {
    // Create a printable version in a new window
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    
    let htmlContent = `
      <html>
      <head>
        <title>Relatório de Agendamentos</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1, h2 { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>Relatório de Agendamentos</h1>
        <h2>Data: ${new Date().toLocaleDateString()}</h2>
        <table>
          <thead>
            <tr>
    `;
    
    // Add headers based on selected fields
    if (selectedFields.titulo) htmlContent += '<th>Título</th>';
    if (selectedFields.cliente) htmlContent += '<th>Cliente</th>';
    if (selectedFields.data) htmlContent += '<th>Data</th>';
    if (selectedFields.horario) htmlContent += '<th>Horário</th>';
    if (selectedFields.status) htmlContent += '<th>Status</th>';
    if (selectedFields.descricao) htmlContent += '<th>Descrição</th>';
    
    htmlContent += `
            </tr>
          </thead>
          <tbody>
    `;
    
    // Add rows
    agendamentos.forEach(agendamento => {
      const date = new Date(agendamento.scheduledDate);
      htmlContent += '<tr>';
      if (selectedFields.titulo) htmlContent += `<td>${agendamento.title}</td>`;
      if (selectedFields.cliente) htmlContent += `<td>${agendamento.customerName}</td>`;
      if (selectedFields.data) htmlContent += `<td>${format(date, "dd/MM/yyyy", { locale: ptBR })}</td>`;
      if (selectedFields.horario) htmlContent += `<td>${format(date, "HH:mm", { locale: ptBR })}</td>`;
      if (selectedFields.status) htmlContent += `<td>${statusTranslations[agendamento.status]}</td>`;
      if (selectedFields.descricao) htmlContent += `<td>${agendamento.description || '-'}</td>`;
      htmlContent += '</tr>';
    });
    
    htmlContent += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Relatório de Agendamentos</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <h3 className="font-medium text-lg">Selecione os campos para incluir no relatório:</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="titulo" 
                checked={selectedFields.titulo}
                onCheckedChange={() => handleFieldChange('titulo')}
              />
              <Label htmlFor="titulo">Título</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cliente" 
                checked={selectedFields.cliente}
                onCheckedChange={() => handleFieldChange('cliente')}
              />
              <Label htmlFor="cliente">Cliente</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="data" 
                checked={selectedFields.data}
                onCheckedChange={() => handleFieldChange('data')}
              />
              <Label htmlFor="data">Data</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="horario" 
                checked={selectedFields.horario}
                onCheckedChange={() => handleFieldChange('horario')}
              />
              <Label htmlFor="horario">Horário</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="status" 
                checked={selectedFields.status}
                onCheckedChange={() => handleFieldChange('status')}
              />
              <Label htmlFor="status">Status</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="descricao" 
                checked={selectedFields.descricao}
                onCheckedChange={() => handleFieldChange('descricao')}
              />
              <Label htmlFor="descricao">Descrição</Label>
            </div>
          </div>
          
          <div className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm mb-3">
                  O relatório incluirá {agendamentos.length} agendamentos com base nos filtros aplicados.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Button onClick={generatePDF} className="gap-2">
                    <FileText className="h-4 w-4" />
                    Baixar PDF
                  </Button>
                  
                  <Button onClick={printReport} variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgendamentoReportDialog;
