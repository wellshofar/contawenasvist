
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, SearchIcon, FilterIcon, MoreHorizontalIcon, UserIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataCadastro: string;
}

const Clientes: React.FC = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  // Mock data
  const clientes: Cliente[] = [
    {
      id: "C001",
      nome: "João Silva",
      email: "joao.silva@exemplo.com",
      telefone: "(11) 98765-4321",
      endereco: "Rua das Flores, 123 - São Paulo, SP",
      dataCadastro: "15/01/2023",
    },
    {
      id: "C002",
      nome: "Maria Oliveira",
      email: "maria.oliveira@exemplo.com",
      telefone: "(11) 91234-5678",
      endereco: "Av. Paulista, 1000 - São Paulo, SP",
      dataCadastro: "22/02/2023",
    },
    {
      id: "C003",
      nome: "Pedro Santos",
      email: "pedro.santos@exemplo.com",
      telefone: "(11) 93456-7890",
      endereco: "Rua Augusta, 500 - São Paulo, SP",
      dataCadastro: "10/03/2023",
    },
    {
      id: "C004",
      nome: "Ana Costa",
      email: "ana.costa@exemplo.com",
      telefone: "(11) 97890-1234",
      endereco: "Av. Rebouças, 750 - São Paulo, SP",
      dataCadastro: "05/04/2023",
    },
    {
      id: "C005",
      nome: "Carlos Ferreira",
      email: "carlos.ferreira@exemplo.com",
      telefone: "(11) 96543-2109",
      endereco: "Rua Oscar Freire, 300 - São Paulo, SP",
      dataCadastro: "18/05/2023",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation logic would go here
    
    toast({
      title: "Cliente adicionado",
      description: `${formData.nome} foi adicionado com sucesso.`,
    });
    
    setDialogOpen(false);
    setFormData({ nome: "", email: "", telefone: "", endereco: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie os clientes cadastrados no sistema.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados do cliente para cadastrá-lo no sistema.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input 
                    id="nome" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    name="telefone" 
                    value={formData.telefone} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input 
                    id="endereco" 
                    name="endereco" 
                    value={formData.endereco} 
                    onChange={handleInputChange} 
                    required 
                  />
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
              <Input placeholder="Buscar cliente..." className="pl-10" />
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
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">Endereço</TableHead>
                  <TableHead className="hidden sm:table-cell">Data Cadastro</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{cliente.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </div>
                        {cliente.nome}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{cliente.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{cliente.telefone}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[250px] truncate">{cliente.endereco}</TableCell>
                    <TableCell className="hidden sm:table-cell">{cliente.dataCadastro}</TableCell>
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

export default Clientes;
