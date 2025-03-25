
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, SearchIcon, FilterIcon, MoreHorizontalIcon, UserIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/supabase";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const clienteSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  documento: z.string().min(1, { message: "CPF ou CNPJ é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  telefone: z.string().min(8, { message: "Telefone inválido" }).optional().or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
  estado: z.string().optional().or(z.literal("")),
  cep: z.string().optional().or(z.literal("")),
});

type ClienteFormValues = z.infer<typeof clienteSchema>;

const Clientes: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clientes, setClientes] = useState<Customer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      documento: "",
      email: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      
      // Map the database fields to our front-end model
      const mappedData = data.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        postal_code: customer.postal_code || "",
        documento: customer.document || "",
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        created_by: customer.created_by,
      }));
      
      setClientes(mappedData);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const openEditDialog = (cliente: Customer) => {
    form.reset({
      id: cliente.id,
      nome: cliente.name,
      documento: cliente.documento || "",
      email: cliente.email || "",
      telefone: cliente.phone || "",
      endereco: cliente.address || "",
      cidade: cliente.city || "",
      estado: cliente.state || "",
      cep: cliente.postal_code || "",
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    form.reset({
      nome: "",
      documento: "",
      email: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleDeleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Cliente removido",
        description: "Cliente foi removido com sucesso.",
      });
      
      fetchClientes();
    } catch (error) {
      console.error("Error deleting cliente:", error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: ClienteFormValues) => {
    try {
      if (isEditing && values.id) {
        // Update existing client
        const { error } = await supabase
          .from("customers")
          .update({
            name: values.nome,
            document: values.documento,
            email: values.email || null,
            phone: values.telefone || null,
            address: values.endereco || null,
            city: values.cidade || null,
            state: values.estado || null,
            postal_code: values.cep || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", values.id);

        if (error) throw error;

        toast({
          title: "Cliente atualizado",
          description: `${values.nome} foi atualizado com sucesso.`,
        });
      } else {
        // Add new client
        const { error } = await supabase
          .from("customers")
          .insert({
            name: values.nome,
            document: values.documento,
            email: values.email || null,
            phone: values.telefone || null,
            address: values.endereco || null,
            city: values.cidade || null,
            state: values.estado || null,
            postal_code: values.cep || null,
            created_by: user?.id || null,
          });

        if (error) throw error;

        toast({
          title: "Cliente adicionado",
          description: `${values.nome} foi adicionado com sucesso.`,
        });
      }
      
      setDialogOpen(false);
      fetchClientes();
    } catch (error) {
      console.error("Error saving cliente:", error);
      toast({
        title: "Erro ao salvar cliente",
        description: "Não foi possível salvar o cliente.",
        variant: "destructive",
      });
    }
  };

  const filteredClientes = clientes.filter(cliente => 
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.documento && cliente.documento.includes(searchTerm)) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie os clientes cadastrados no sistema.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openNewDialog}>
              <PlusIcon className="h-4 w-4" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Cliente" : "Adicionar Novo Cliente"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do cliente para {isEditing ? "atualizá-lo" : "cadastrá-lo"} no sistema.
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
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="documento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF/CNPJ</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="000.000.000-00" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="endereco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                placeholder="Buscar cliente por nome, CPF/CNPJ ou email..." 
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
                  <TableHead className="hidden md:table-cell">CPF/CNPJ</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">Endereço</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredClientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{cliente.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                          {cliente.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{cliente.documento || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">{cliente.email || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">{cliente.phone || "-"}</TableCell>
                      <TableCell className="hidden lg:table-cell max-w-[250px] truncate">
                        {cliente.address ? `${cliente.address}, ${cliente.city || ''} ${cliente.state || ''}` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(cliente)}>
                              <PencilIcon className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCliente(cliente.id)}
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

export default Clientes;
