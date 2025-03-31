
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/supabase";
import { FileText, Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ProdutoReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produtos: Product[];
  diasPrazoMap: (days: number | undefined | null) => string;
}

const ProdutoReportDialog: React.FC<ProdutoReportDialogProps> = ({
  open,
  onOpenChange,
  produtos,
  diasPrazoMap
}) => {
  const [selectedFields, setSelectedFields] = useState({
    nome: true,
    categoria: true,
    modelo: true,
    descricao: false,
    prazoManutencao: true,
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
    doc.text("Relatório de Produtos", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Define the columns based on selected fields
    const columns = [];
    
    if (selectedFields.nome) columns.push("Nome");
    if (selectedFields.categoria) columns.push("Categoria");
    if (selectedFields.modelo) columns.push("Modelo");
    if (selectedFields.descricao) columns.push("Descrição");
    if (selectedFields.prazoManutencao) columns.push("Prazo de Manutenção");
    
    // Extract the data
    const data = produtos.map(produto => {
      const row = [];
      if (selectedFields.nome) row.push(produto.name);
      if (selectedFields.categoria) row.push(produto.categoria || "-");
      if (selectedFields.modelo) row.push(produto.model || "-");
      if (selectedFields.descricao) row.push(produto.description || "-");
      if (selectedFields.prazoManutencao) row.push(diasPrazoMap(produto.maintenance_interval_days));
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
    doc.save(`relatorio_produtos_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const printReport = () => {
    // Create a printable version in a new window
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    
    let htmlContent = `
      <html>
      <head>
        <title>Relatório de Produtos</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1, h2 { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>Relatório de Produtos</h1>
        <h2>Data: ${new Date().toLocaleDateString()}</h2>
        <table>
          <thead>
            <tr>
    `;
    
    // Add headers based on selected fields
    if (selectedFields.nome) htmlContent += '<th>Nome</th>';
    if (selectedFields.categoria) htmlContent += '<th>Categoria</th>';
    if (selectedFields.modelo) htmlContent += '<th>Modelo</th>';
    if (selectedFields.descricao) htmlContent += '<th>Descrição</th>';
    if (selectedFields.prazoManutencao) htmlContent += '<th>Prazo de Manutenção</th>';
    
    htmlContent += `
            </tr>
          </thead>
          <tbody>
    `;
    
    // Add rows
    produtos.forEach(produto => {
      htmlContent += '<tr>';
      if (selectedFields.nome) htmlContent += `<td>${produto.name}</td>`;
      if (selectedFields.categoria) htmlContent += `<td>${produto.categoria || '-'}</td>`;
      if (selectedFields.modelo) htmlContent += `<td>${produto.model || '-'}</td>`;
      if (selectedFields.descricao) htmlContent += `<td>${produto.description || '-'}</td>`;
      if (selectedFields.prazoManutencao) htmlContent += `<td>${diasPrazoMap(produto.maintenance_interval_days)}</td>`;
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
          <DialogTitle>Relatório de Produtos</DialogTitle>
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
                id="categoria" 
                checked={selectedFields.categoria}
                onCheckedChange={() => handleFieldChange('categoria')}
              />
              <Label htmlFor="categoria">Categoria</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="modelo" 
                checked={selectedFields.modelo}
                onCheckedChange={() => handleFieldChange('modelo')}
              />
              <Label htmlFor="modelo">Modelo</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="descricao" 
                checked={selectedFields.descricao}
                onCheckedChange={() => handleFieldChange('descricao')}
              />
              <Label htmlFor="descricao">Descrição</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="prazoManutencao" 
                checked={selectedFields.prazoManutencao}
                onCheckedChange={() => handleFieldChange('prazoManutencao')}
              />
              <Label htmlFor="prazoManutencao">Prazo de Manutenção</Label>
            </div>
          </div>
          
          <div className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground text-sm mb-3">
                  O relatório incluirá {produtos.length} produtos com base nos filtros aplicados.
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

export default ProdutoReportDialog;
