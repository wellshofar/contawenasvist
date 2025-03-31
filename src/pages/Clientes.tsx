
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon, FileText, Printer, Download, FileDown } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useClientes } from "@/hooks/useClientes";
import ClienteTable from "@/components/clientes/ClienteTable";
import ClienteSearch from "@/components/clientes/ClienteSearch";
import ClienteDialog from "@/components/clientes/ClienteDialog";
import ClienteReportDialog from "@/components/relatorios/ClienteReportDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Clientes: React.FC = () => {
  const {
    clientes,
    loading,
    dialogOpen,
    setDialogOpen,
    isEditing,
    currentCliente,
    openEditDialog,
    openNewDialog,
    handleDeleteCliente,
    handleSubmit
  } = useClientes();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const filteredClientes = clientes.filter(cliente => 
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.document && cliente.document.includes(searchTerm)) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie os clientes cadastrados no sistema.</p>
        </div>
        
        <div className="flex items-center gap-2">
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
                onClick={() => exportToCSV(filteredClientes)}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={openNewDialog}>
                <PlusIcon className="h-4 w-4" /> Novo Cliente
              </Button>
            </DialogTrigger>
            <ClienteDialog 
              isEditing={isEditing}
              defaultValues={currentCliente}
              onSubmit={handleSubmit}
            />
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <ClienteSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <ClienteTable 
            clientes={filteredClientes}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={handleDeleteCliente}
          />
        </CardContent>
      </Card>

      <ClienteReportDialog 
        open={reportDialogOpen} 
        onOpenChange={setReportDialogOpen}
        clientes={filteredClientes}
      />
    </div>
  );
};

// Helper function to export data as CSV
const exportToCSV = (clientes) => {
  // Create CSV header row
  const headers = ['Nome', 'CPF/CNPJ', 'Email', 'Telefone', 'Endereço', 'Cidade', 'Estado', 'CEP'];
  
  // Convert each customer to a row of data
  const rows = clientes.map(cliente => [
    cliente.name,
    cliente.document || '',
    cliente.email || '',
    cliente.phone || '',
    cliente.address || '',
    cliente.city || '',
    cliente.state || '',
    cliente.postal_code || ''
  ]);
  
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
  link.setAttribute('download', `relatorio_clientes_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default Clientes;
