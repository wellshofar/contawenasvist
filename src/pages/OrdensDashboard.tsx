
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Download } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OrdensDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [exampleReportShown, setExampleReportShown] = useState(false);

  const showExampleReport = () => {
    setExampleReportShown(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const downloadExamplePDF = () => {
    // In a real implementation, we would generate a PDF here
    alert("Esta funcionalidade será implementada em breve.");
  };

  const downloadExampleCSV = () => {
    // In a real implementation, we would generate a CSV here
    const csvContent = "ID,Cliente,Produto,Data,Status,Técnico\n" +
                       "001,Cliente Exemplo,Purificador Modelo X,01/01/2023,Concluída,João Silva\n" +
                       "002,Empresa ABC,Filtro Modelo Y,15/02/2023,Em andamento,Maria Santos";
                       
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `exemplo_ordens_servico.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
          <p className="text-muted-foreground mt-1">Gerencie as ordens de serviço no sistema.</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Relatórios
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={showExampleReport}>
              <FileText className="mr-2 h-4 w-4" />
              Visualizar relatório exemplo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadExampleCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV exemplo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {exampleReportShown ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Relatório de Ordens de Serviço</h2>
              <p className="text-muted-foreground mb-6">Este é um exemplo de relatório. Em breve esta funcionalidade estará disponível.</p>
            </div>
            
            <div className="border rounded-md p-4 mb-6">
              <h3 className="font-medium mb-2">Resumo</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>Total de ordens: <span className="font-medium">25</span></div>
                <div>Concluídas: <span className="font-medium">18</span></div>
                <div>Em andamento: <span className="font-medium">5</span></div>
                <div>Pendentes: <span className="font-medium">2</span></div>
              </div>
            </div>
            
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Cliente</th>
                  <th className="border p-2 text-left">Produto</th>
                  <th className="border p-2 text-left">Data</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Técnico</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">001</td>
                  <td className="border p-2">Cliente Exemplo</td>
                  <td className="border p-2">Purificador Modelo X</td>
                  <td className="border p-2">01/01/2023</td>
                  <td className="border p-2">Concluída</td>
                  <td className="border p-2">João Silva</td>
                </tr>
                <tr>
                  <td className="border p-2">002</td>
                  <td className="border p-2">Empresa ABC</td>
                  <td className="border p-2">Filtro Modelo Y</td>
                  <td className="border p-2">15/02/2023</td>
                  <td className="border p-2">Em andamento</td>
                  <td className="border p-2">Maria Santos</td>
                </tr>
              </tbody>
            </table>
            
            <p className="text-sm text-muted-foreground mt-6">
              Este é apenas um exemplo de relatório. A funcionalidade completa será implementada em breve.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="min-h-[40vh] flex flex-col items-center justify-center">
              <h2 className="text-xl font-medium mb-2">Funcionalidade em desenvolvimento</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Esta página está sendo implementada. Em breve você poderá gerenciar ordens de serviço aqui.
              </p>
              {profile?.role === 'admin' && (
                <p className="text-sm text-blue-500 mt-4">
                  Como administrador, você terá acesso completo às funcionalidades de ordens.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdensDashboard;
