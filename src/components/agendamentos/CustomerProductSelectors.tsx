
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Customer, Product } from "@/types/supabase";
import { AppointmentFormValues } from "@/types/agendamentos";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerProductSelectorsProps {
  form: UseFormReturn<AppointmentFormValues>;
  isEditing: boolean;
  currentAgendamento: any;
}

const CustomerProductSelectors: React.FC<CustomerProductSelectorsProps> = ({
  form,
  isEditing,
  currentAgendamento,
}) => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerProducts, setCustomerProducts] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("id, name, document, email, phone, address, city, state, postal_code, created_at, updated_at, created_by")
          .order("name");

        if (error) throw error;
        
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
  }, [isEditing, currentAgendamento, toast]);

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

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);
    form.setValue("customerId", customerId);
    form.setValue("productId", undefined);
    fetchCustomerProducts(customerId);
  };

  return (
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
                <SelectItem value="none">Nenhum produto específico</SelectItem>
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
  );
};

export default CustomerProductSelectors;
