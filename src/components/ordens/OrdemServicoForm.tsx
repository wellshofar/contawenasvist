
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer, Product, CustomerProduct } from "@/types/supabase";
import { Plus, Trash2 } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  customerId: z.string({ required_error: "Selecione um cliente" }),
  status: z.string().default("pending"),
  scheduledDate: z.string().optional(),
  // We'll handle products separately as they can be multiple
});

type FormValues = z.infer<typeof formSchema>;

// Define a type for customer products with joined product data
type CustomerProductWithDetails = CustomerProduct & {
  product?: Product;
};

const OrdemServicoForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerProducts, setCustomerProducts] = useState<CustomerProductWithDetails[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
    },
  });

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");
      
      if (error) throw error;
      if (data) setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      });
    }
  };

  // Fetch customer products when a customer is selected
  const fetchCustomerProducts = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from("customer_products")
        .select(`
          *,
          product:product_id(id, name, model)
        `)
        .eq("customer_id", customerId);
      
      if (error) throw error;
      if (data) {
        const formattedData = data.map(item => ({
          ...item,
          product: item.product as unknown as Product
        }));
        setCustomerProducts(formattedData as CustomerProductWithDetails[]);
      }
    } catch (error) {
      console.error("Error fetching customer products:", error);
    }
  };

  // Handle customer selection
  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value);
    form.setValue("customerId", value);
    setSelectedProducts([]); // Reset product selection
    fetchCustomerProducts(value);
  };

  // Handle product selection
  const handleAddProduct = (productId: string) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Handle product removal
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
  };

  // Submit the form
  const onSubmit = async (values: FormValues) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Selecione pelo menos um produto",
        description: "É necessário selecionar pelo menos um produto para criar a ordem de serviço.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create one service order for each selected product
      const ordersToCreate = selectedProducts.map(productId => ({
        title: values.title,
        description: values.description || null,
        customer_id: values.customerId,
        customer_product_id: productId,
        status: values.status,
        scheduled_date: values.scheduledDate ? new Date(values.scheduledDate).toISOString() : null,
        created_by: user?.id || null,
      }));

      const { data, error } = await supabase
        .from("service_orders")
        .insert(ordersToCreate)
        .select();

      if (error) throw error;

      toast({
        title: "Ordens de serviço criadas",
        description: `${ordersToCreate.length} ordem(ns) de serviço foram criadas com sucesso.`,
      });

      // Navigate back to orders list
      navigate("/ordens");
    } catch (error) {
      console.error("Error creating service orders:", error);
      toast({
        title: "Erro ao criar ordens de serviço",
        description: "Não foi possível criar as ordens de serviço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Nova Ordem de Serviço</h1>
        <Button variant="outline" onClick={() => navigate("/ordens")}>
          Cancelar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Ordem</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Manutenção de Produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o serviço a ser realizado" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        onValueChange={handleCustomerChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Produtos</FormLabel>
                  <div className="flex items-center space-x-2 mb-2">
                    <Select
                      disabled={!selectedCustomer}
                      onValueChange={handleAddProduct}
                      value=""
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Adicionar produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerProducts.map((cp) => (
                          <SelectItem 
                            key={cp.id} 
                            value={cp.id}
                            disabled={selectedProducts.includes(cp.id)}
                          >
                            {cp.product?.name} - {cp.product?.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedProducts.length > 0 ? (
                    <div className="border rounded-md mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProducts.map(productId => {
                            const product = customerProducts.find(cp => cp.id === productId);
                            return (
                              <TableRow key={productId}>
                                <TableCell>
                                  {product?.product?.name} - {product?.product?.model}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveProduct(productId)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-2">
                      {selectedCustomer ? "Nenhum produto selecionado" : "Selecione um cliente primeiro"}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="scheduled">Agendado</SelectItem>
                          <SelectItem value="in_progress">Em Andamento</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="canceled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Agendada</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/ordens")}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Criando..." : "Criar Ordens de Serviço"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdemServicoForm;
