
import { supabase } from "@/integrations/supabase/client";
import { Customer, CustomerProduct } from "@/types/supabase";
import { CustomerProductWithDetails } from "../forms/types";

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("name");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const fetchCustomerProducts = async (customerId: string): Promise<CustomerProductWithDetails[]> => {
  try {
    const { data, error } = await supabase
      .from("customer_products")
      .select(`
        *,
        product:product_id(id, name, model)
      `)
      .eq("customer_id", customerId);
    
    if (error) throw error;
    
    const formattedData = data?.map(item => ({
      ...item,
      product: item.product as unknown as any
    })) || [];
    
    return formattedData as CustomerProductWithDetails[];
  } catch (error) {
    console.error("Error fetching customer products:", error);
    throw error;
  }
};

export const createServiceOrders = async (
  ordersData: any[],
  userId: string | undefined
) => {
  try {
    const { data, error } = await supabase
      .from("service_orders")
      .insert(ordersData)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating service orders:", error);
    throw error;
  }
};
