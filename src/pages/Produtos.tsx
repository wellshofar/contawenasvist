
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, SearchIcon, FilterIcon, MoreHorizontalIcon, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  modelo: string;
  prazoManutencao: string;
  dataCadastro: string;
}

const Produtos: React.FC = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    modelo: "",
    prazoManutencao: "",
  });

  // Mock data
  const produtos: Produto[] = [
    {
      id: "P001",
      nome: "Purificador HOKEN H2O",
      categoria: "Purificador",
      modelo: "H2O-2023",
      prazoManutencao: "6 meses",
      dataCadastro: "10/01/2023",
    },
    {
      id: "P002",
      nome: "Filtro de Água Pure100",
      categoria: "Filtro",
      modelo: "PURE-100",
      prazoManutencao: "12 meses",
      dataCadastro: "15/01/2023",
    },
    {
      id: "P003",
      nome: "Purificador HOKEN MAX",
      categoria: "Purificador",
      modelo: "MAX-PRO",
      prazoManutencao: "6 meses",
      dataCadastro: "22/01/2023",
    },
    {
      id: "P004",
      nome: "Filtro Industrial H-200",
      categoria: "Filtro Industrial",
      modelo: "H200-IND",
      prazoManutencao: "3 meses",
      dataCadastro: "05/02/2023",
    },
    {
      id: "P005",
      nome: "Purificador HOKEN Classic",
      categoria: "Purificador",
      modelo: "HC-100",
      prazoManutencao: "6 meses",
      dataCadastro: "12/02/2023",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation logic would go here
    
    toast({
      title: "Produto adicionado",
      description: `${formData.nome} foi adicionado com sucesso.`,
    });
    
    setDialogOpen(false);
    setFormData({ nome: "", categoria: "", modelo: "", prazoManutencao: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os produtos da linha HOKEN.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>
                Preencha os dados do produto HOKEN para cadastrá-lo no sistema.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome do produto</Label>
                  <Input 
                    id="nome" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Purificador">Purificador</SelectItem>
                      <SelectItem value="Filtro">Filtro</SelectItem>
                      <SelectItem value="Filtro Industrial">Filtro Industrial</SelectItem>
                      <SelectItem value="Bebedouro">Bebedouro</SelectItem>
                      <SelectItem value="Acessório">Acessório</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input 
                    id="modelo" 
                    name="modelo" 
                    value={formData.modelo} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="prazoManutencao">Prazo de Manutenção</Label>
                  <Select value={formData.prazoManutencao} onValueChange={(value) => handleSelectChange("prazoManutencao", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3 meses">3 meses</SelectItem>
                      <SelectItem value="6 meses">6 meses</SelectItem>
                      <SelectItem value="12 meses">12 meses</SelectItem>
                      <SelectItem value="18 meses">18 meses</SelectItem>
                      <SelectItem value="24 meses">24 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Buscar produto..." className="pl-10" />
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
                  <TableHead className="hidden sm:table-cell">Data Cadastro</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => (
                  <TableRow key={produto.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{produto.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-hoken-100 rounded-full flex items-center justify-center">
                          <Layers className="h-4 w-4 text-hoken-600" />
                        </div>
                        {produto.nome}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{produto.categoria}</TableCell>
                    <TableCell className="hidden md:table-cell">{produto.modelo}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {produto.prazoManutencao}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{produto.dataCadastro}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Produtos;
