
import { useState, useEffect } from "react";
import { Customer } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CustomerProduct {
  id: string;
  productId: string;
  name: string;
  model: string;
  displayName: string;
}

export const useCustomerProducts = (initialCustomerId?: string) => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerProducts, setCustomerProducts] = useState<CustomerProduct[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(initialCustomerId || null);
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

        if (initialCustomerId) {
          setSelectedCustomerId(initialCustomerId);
          fetchCustomerProducts(initialCustomerId);
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
  }, [initialCustomerId, toast]);

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
    fetchCustomerProducts(customerId);
  };

  return {
    customers,
    customerProducts,
    selectedCustomerId,
    isLoadingProducts,
    handleCustomerChange
  };
};
