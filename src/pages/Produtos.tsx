
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import ProdutoDialog from "@/components/produtos/ProdutoDialog";
import ProdutoSearch from "@/components/produtos/ProdutoSearch";
import ProdutoTable from "@/components/produtos/ProdutoTable";
import { useProdutos, ProdutoFormData, diasPrazoMap } from "@/hooks/useProdutos";
import { Product } from "@/types/supabase";

const Produtos: React.FC = () => {
  const { produtos, loading, addProduto, updateProduto, deleteProduto } = useProdutos();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os produtos da linha HOKEN.</p>
        </div>
        
        <ProdutoDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          isEditing={isEditing}
          defaultValues={currentProduto}
          onSubmit={handleSubmit}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openNewDialog}>
              <PlusIcon className="h-4 w-4" /> Novo Produto
            </Button>
          </DialogTrigger>
        </ProdutoDialog>
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
    </div>
  );
};

export default Produtos;
