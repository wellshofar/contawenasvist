
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer } from "@/types/supabase";
import { FileText, Printer, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ClienteReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientes: Customer[];
}

const ClienteReportDialog: React.FC<ClienteReportDialogProps> = ({
  open,
  onOpenChange,
  clientes
}) => {
  const [selectedFields, setSelectedFields] = useState({
    nome: true,
    documento: true,
    email: true,
    telefone: true,
    endereco: false,
    cidade: true,
    estado: true,
    cep: false,
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
    doc.text("Relatório de Clientes", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Define the columns based on selected fields
    const columns = [];
    const columnsKeys = [];
    
    if (selectedFields.nome) { columns.push("Nome"); columnsKeys.push("name"); }
    if (selectedFields.documento) { columns.push("CPF/CNPJ"); columnsKeys.push("document"); }
    if (selectedFields.email) { columns.push("Email"); columnsKeys.push("email"); }
    if (selectedFields.telefone) { columns.push("Telefone"); columnsKeys.push("phone"); }
    if (selectedFields.endereco) { columns.push("Endereço"); columnsKeys.push("address"); }
    if (selectedFields.cidade) { columns.push("Cidade"); columnsKeys.push("city"); }
    if (selectedFields.estado) { columns.push("Estado"); columnsKeys.push("state"); }
    if (selectedFields.cep) { columns.push("CEP"); columnsKeys.push("postal_code"); }
    
    // Extract the data
    const data = clientes.map(cliente => {
      const row = [];
      for (const key of columnsKeys) {
        row.push(cliente[key] || "-");
      }
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
    doc.save(`relatorio_clientes_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const printReport = () => {
    // Create a printable version in a new window
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    
    const selectedClientes = clientes;
    
    let htmlContent = `
      <html>
      <head>
        <title>Relatório de Clientes</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1, h2 { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>Relatório de Clientes</h1>
        <h2>Data: ${new Date().toLocaleDateString()}</h2>
        <table>
          <thead>
            <tr>
    `;
    
    // Add headers based on selected fields
    if (selectedFields.nome) htmlContent += '<th>Nome</th>';
    if (selectedFields.documento) htmlContent += '<th>CPF/CNPJ</th>';
    if (selectedFields.email) htmlContent += '<th>Email</th>';
    if (selectedFields.telefone) htmlContent += '<th>Telefone</th>';
    if (selectedFields.endereco) htmlContent += '<th>Endereço</th>';
    if (selectedFields.cidade) htmlContent += '<th>Cidade</th>';
    if (selectedFields.estado) htmlContent += '<th>Estado</th>';
    if (selectedFields.cep) htmlContent += '<th>CEP</th>';
    
    htmlContent += `
            </tr>
          </thead>
          <tbody>
    `;
    
    // Add rows
    selectedClientes.forEach(cliente => {
      htmlContent += '<tr>';
      if (selectedFields.nome) htmlContent += `<td>${cliente.name}</td>`;
      if (selectedFields.documento) htmlContent += `<td>${cliente.document || '-'}</td>`;
      if (selectedFields.email) htmlContent += `<td>${cliente.email || '-'}</td>`;
      if (selectedFields.telefone) htmlContent += `<td>${cliente.phone || '-'}</td>`;
      if (selectedFields.endereco) htmlContent += `<td>${cliente.address || '-'}</td>`;
      if (selectedFields.cidade) htmlContent += `<td>${cliente.city || '-'}</td>`;
      if (selectedFields.estado) htmlContent += `<td>${cliente.state || '-'}</td>`;
      if (selectedFields.cep) htmlContent += `<td>${cliente.postal_code || '-'}</td>`;
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
          <DialogTitle>Relatório de Clientes</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <h3 className="font-medium text-lg">Selecione os campos para incluir no relatório:</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="nome" 
                checked={selectedFields.nome}
                onCheckedChange={() => handleFieldChange('nome')}
              />
              <Label htmlFor="nome">Nome</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="documento" 
                checked={selectedFields.documento}
                onCheckedChange={() => handleFieldChange('documento')}
              />
              <Label htmlFor="documento">CPF/CNPJ</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="email" 
                checked={selectedFields.email}
                onCheckedChange={() => handleFieldChange('email')}
              />
              <Label htmlFor="email">Email</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="telefone" 
                checked={selectedFields.telefone}
                onCheckedChange={() => handleFieldChange('telefone')}
              />
              <Label htmlFor="telefone">Telefone</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="endereco" 
                checked={selectedFields.endereco}
                onCheckedChange={() => handleFieldChange('endereco')}
              />
              <Label htmlFor="endereco">Endereço</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cidade" 
                checked={selectedFields.cidade}
                onCheckedChange={() => handleFieldChange('cidade')}
              />
              <Label htmlFor="cidade">Cidade</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="estado" 
                checked={selectedFields.estado}
                onCheckedChange={() => handleFieldChange('estado')}
              />
              <Label htmlFor="estado">Estado</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cep" 
                checked={selectedFields.cep}
                onCheckedChange={() => handleFieldChange('cep')}
              />
              <Label htmlFor="cep">CEP</Label>
            </div>
          </div>
          
          <div className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm mb-3">
                  O relatório incluirá {clientes.length} clientes com base nos filtros aplicados.
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

export default ClienteReportDialog;
