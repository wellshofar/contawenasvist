
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import { AppointmentFormValues } from "@/types/agendamentos";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { supabase } from "@/integrations/supabase/client";
import { Customer, Product } from "@/types/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";

interface AgendamentoFormProps {
  isEditing: boolean;
  currentAgendamento: any;
  onClose: () => void;
}

export const AgendamentoForm: React.FC<AgendamentoFormProps> = ({
  isEditing,
  currentAgendamento,
  onClose,
}) => {
  const { toast } = useToast();
  const { addAgendamento, updateAgendamento } = useAgendamentos();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerProducts, setCustomerProducts] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Set up the form with default values
  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      title: isEditing ? currentAgendamento?.title : "",
      description: isEditing ? currentAgendamento?.description : "",
      customerId: isEditing ? currentAgendamento?.customerId : "",
      productId: isEditing ? currentAgendamento?.productId : "",
      scheduledDate: isEditing && currentAgendamento?.scheduledDate
        ? new Date(currentAgendamento.scheduledDate)
        : new Date(),
      status: isEditing ? currentAgendamento?.status : "pending",
    },
  });

  // Fetch customers from the database
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("id, name, document, email, phone, address, city, state, postal_code, created_at, updated_at, created_by")
          .order("name");

        if (error) throw error;
        
        // Ensure all required fields from Customer type are present
        const customersWithAllFields = data?.map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email || null,
          phone: customer.phone || null,
          address: customer.address || null,
          city: customer.city || null,
          state: customer.state || null,
          postal_code: customer.postal_code || null,
          document: customer.document || null,
          created_at: customer.created_at,
          updated_at: customer.updated_at,
          created_by: customer.created_by || null
        })) || [];
        
        setCustomers(customersWithAllFields);

        // If we're editing, set the initial customer ID and fetch products
        if (isEditing && currentAgendamento?.customerId) {
          setSelectedCustomerId(currentAgendamento.customerId);
          fetchCustomerProducts(currentAgendamento.customerId);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes.",
          variant: "destructive",
        });
      }
    };

    fetchCustomers();
  }, [isEditing, currentAgendamento]);

  // Fetch products associated with a customer
  const fetchCustomerProducts = async (customerId: string) => {
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from("customer_products")
        .select(`
          id,
          product_id,
          products (
            id,
            name,
            model
          )
        `)
        .eq("customer_id", customerId);

      if (error) throw error;
      
      const formattedData = data.map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.products.name,
        model: item.products.model,
        displayName: `${item.products.name} ${item.products.model ? `(${item.products.model})` : ''}`
      }));
      
      setCustomerProducts(formattedData);
    } catch (error) {
      console.error("Error fetching customer products:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos do cliente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Handle customer change
  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);
    form.setValue("customerId", customerId);
    form.setValue("productId", undefined); // Reset product when customer changes
    fetchCustomerProducts(customerId);
  };

  const onSubmit = async (values: AppointmentFormValues) => {
    setSubmitting(true);
    try {
      const success = isEditing
        ? await updateAgendamento({ id: currentAgendamento.id, ...values })
        : await addAgendamento(values);

      if (success) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Manutenção de filtro" {...field} />
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
                  placeholder="Detalhes sobre o agendamento"
                  className="resize-none min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {customer.document && ` - ${customer.document}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produto</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedCustomerId || isLoadingProducts}
                >
                  <FormControl>
                    <SelectTrigger>
                      {isLoadingProducts ? (
                        <div className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          <span>Carregando...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Selecione um produto" />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nenhum produto específico</SelectItem>
                    {customerProducts.map((cp) => (
                      <SelectItem key={cp.id} value={cp.id}>
                        {cp.displayName}
                      </SelectItem>
                    ))}
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
            name="scheduledDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data e Hora</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP 'às' HH:mm", {
                            locale: ptBR,
                          })
                        ) : (
                          <span>Selecione a data e hora</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          const currentValue = field.value;
                          const hours = currentValue.getHours();
                          const minutes = currentValue.getMinutes();
                          
                          date.setHours(hours);
                          date.setMinutes(minutes);
                          
                          field.onChange(date);
                        }
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      locale={ptBR}
                    />
                    <div className="p-3 border-t border-border">
                      <Input
                        type="time"
                        value={format(field.value, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":").map(Number);
                          const newDate = new Date(field.value);
                          newDate.setHours(hours);
                          newDate.setMinutes(minutes);
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? "Atualizar" : "Agendar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
