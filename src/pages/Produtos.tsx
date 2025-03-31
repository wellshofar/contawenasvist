
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon, FileText, Printer, Download } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProdutoDialog from "@/components/produtos/ProdutoDialog";
import ProdutoSearch from "@/components/produtos/ProdutoSearch";
import ProdutoTable from "@/components/produtos/ProdutoTable";
import { useProdutos, ProdutoFormData, diasPrazoMap } from "@/hooks/useProdutos";
import { Product } from "@/types/supabase";
import ProdutoReportDialog from "@/components/relatorios/ProdutoReportDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Produtos: React.FC = () => {
  const { produtos, loading, addProduto, updateProduto, deleteProduto } = useProdutos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [currentProduto, setCurrentProduto] = useState<ProdutoFormData>({
    nome: "",
    categoria: "",
    modelo: "",
    descricao: "",
    prazoManutencao: "6 meses",
  });

  const openNewDialog = () => {
    setCurrentProduto({
      nome: "",
      categoria: "",
      modelo: "",
      descricao: "",
      prazoManutencao: "6 meses",
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEditDialog = (produto: Product) => {
    setCurrentProduto({
      id: produto.id,
      nome: produto.name,
      categoria: produto.categoria || "",
      modelo: produto.model || "",
      descricao: produto.description || "",
      prazoManutencao: diasPrazoMap(produto.maintenance_interval_days),
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = async (values: ProdutoFormData) => {
    const success = isEditing
      ? await updateProduto(values)
      : await addProduto(values);
    
    if (success) {
      setDialogOpen(false);
    }
  };

  const filteredProdutos = produtos.filter(produto => 
    produto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (produto.model && produto.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (produto.categoria && produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportToCSV = (produtos: Product[]) => {
    // Create CSV header row
    const headers = ['Nome', 'Categoria', 'Modelo', 'Descrição', 'Prazo de Manutenção'];
    
    // Convert each product to a row of data
    const rows = produtos.map(produto => [
      produto.name,
      produto.categoria || '',
      produto.model || '',
      produto.description || '',
      diasPrazoMap(produto.maintenance_interval_days)
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
    link.setAttribute('download', `relatorio_produtos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os produtos da linha HOKEN.</p>
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
                onClick={() => exportToCSV(filteredProdutos)}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={openNewDialog}>
                <PlusIcon className="h-4 w-4" /> Novo Produto
              </Button>
            </DialogTrigger>
            <ProdutoDialog
              isEditing={isEditing}
              defaultValues={currentProduto}
              onSubmit={handleSubmit}
            />
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <ProdutoSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <ProdutoTable 
            produtos={filteredProdutos}
            isLoading={loading}
            diasPrazoMap={diasPrazoMap}
            onEdit={openEditDialog}
            onDelete={deleteProduto}
          />
        </CardContent>
      </Card>

      <ProdutoReportDialog 
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        produtos={filteredProdutos}
        diasPrazoMap={diasPrazoMap}
      />
    </div>
  );
};

export default Produtos;
