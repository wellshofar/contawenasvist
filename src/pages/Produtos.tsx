import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, SearchIcon, FilterIcon, MoreHorizontalIcon, Layers, PencilIcon, TrashIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Product } from "@/types/supabase";

const produtoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  categoria: z.string().min(1, { message: "Categoria é obrigatória" }),
  modelo: z.string().min(1, { message: "Modelo é obrigatório" }),
  descricao: z.string().optional().or(z.literal("")),
  prazoManutencao: z.string().min(1, { message: "Prazo de manutenção é obrigatório" }),
});

type ProdutoFormValues = z.infer<typeof produtoSchema>;

// Map prazo to days
const prazoDiasMap: Record<string, number> = {
  "3 meses": 90,
  "6 meses": 180,
  "12 meses": 365,
  "18 meses": 547,
  "24 meses": 730,
};

// Map days to prazo
const diasPrazoMap = (dias: number): string => {
  if (dias <= 90) return "3 meses";
  if (dias <= 180) return "6 meses";
  if (dias <= 365) return "12 meses";
  if (dias <= 547) return "18 meses";
  return "24 meses";
};

const Produtos: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: "",
      categoria: "",
      modelo: "",
      descricao: "",
      prazoManutencao: "6 meses",
    },
  });

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      
      const mappedData = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        model: product.model || "",
        maintenance_interval_days: product.maintenance_interval_days || 180,
        created_at: product.created_at,
        updated_at: product.updated_at,
        created_by: product.created_by,
        // Additional frontend properties
        categoria: getCategoryFromName(product.name), // Derive from name initially
      }));
      
      setProdutos(mappedData);
    } catch (error) {
      console.error("Error fetching produtos:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Helper function to derive category from product name
  const getCategoryFromName = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("purificador")) return "Purificador";
    if (lowerName.includes("filtro industrial")) return "Filtro Industrial";
    if (lowerName.includes("filtro")) return "Filtro";
    if (lowerName.includes("bebedouro")) return "Bebedouro";
    return "Acessório";
  };

  const openEditDialog = (produto: Product) => {
    form.reset({
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

  const openNewDialog = () => {
    form.reset({
      nome: "",
      categoria: "",
      modelo: "",
      descricao: "",
      prazoManutencao: "6 meses",
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleDeleteProduto = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Produto removido",
        description: "Produto foi removido com sucesso.",
      });
      
      fetchProdutos();
    } catch (error) {
      console.error("Error deleting produto:", error);
      toast({
        title: "Erro ao remover produto",
        description: "Não foi possível remover o produto.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: ProdutoFormValues) => {
    try {
      if (isEditing && values.id) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            name: values.nome,
            description: values.descricao || null,
            model: values.modelo,
            maintenance_interval_days: prazoDiasMap[values.prazoManutencao],
            updated_at: new Date().toISOString(),
          })
          .eq("id", values.id);

        if (error) throw error;

        toast({
          title: "Produto atualizado",
          description: `${values.nome} foi atualizado com sucesso.`,
        });
      } else {
        // Add new product
        const { error } = await supabase
          .from("products")
          .insert({
            name: values.nome,
            description: values.descricao || null,
            model: values.modelo,
            maintenance_interval_days: prazoDiasMap[values.prazoManutencao],
            created_by: user?.id || null,
          });

        if (error) throw error;

        toast({
          title: "Produto adicionado",
          description: `${values.nome} foi adicionado com sucesso.`,
        });
      }
      
      setDialogOpen(false);
      fetchProdutos();
    } catch (error) {
      console.error("Error saving produto:", error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto.",
        variant: "destructive",
      });
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
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openNewDialog}>
              <PlusIcon className="h-4 w-4" /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do produto HOKEN para {isEditing ? "atualizá-lo" : "cadastrá-lo"} no sistema.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do produto</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="categoria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Purificador">Purificador</SelectItem>
                              <SelectItem value="Filtro">Filtro</SelectItem>
                              <SelectItem value="Filtro Industrial">Filtro Industrial</SelectItem>
                              <SelectItem value="Bebedouro">Bebedouro</SelectItem>
                              <SelectItem value="Acessório">Acessório</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="modelo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="prazoManutencao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prazo de Manutenção</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um prazo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="3 meses">3 meses</SelectItem>
                              <SelectItem value="6 meses">6 meses</SelectItem>
                              <SelectItem value="12 meses">12 meses</SelectItem>
                              <SelectItem value="18 meses">18 meses</SelectItem>
                              <SelectItem value="24 meses">24 meses</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {isEditing ? "Atualizar" : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar produto..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <FilterIcon className="h-4 w-4" /> Filtrar
            </Button>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden md:table-cell">Modelo</TableHead>
                  <TableHead className="hidden lg:table-cell">Prazo Manutenção</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredProdutos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProdutos.map((produto) => (
                    <TableRow key={produto.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{produto.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-hoken-100 rounded-full flex items-center justify-center">
                            <Layers className="h-4 w-4 text-hoken-600" />
                          </div>
                          {produto.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{produto.categoria}</TableCell>
                      <TableCell className="hidden md:table-cell">{produto.model || "-"}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {diasPrazoMap(produto.maintenance_interval_days)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(produto)}>
                              <PencilIcon className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProduto(produto.id)}
                              className="text-destructive"
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Produtos;

