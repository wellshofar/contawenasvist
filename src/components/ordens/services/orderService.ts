import { supabase } from "@/integrations/supabase/client";
import { Customer, CustomerProduct } from "@/types/supabase";
import { CustomerProductWithDetails, DashboardStats, RecentOrder, ChartData } from "../forms/types";

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

// New functions for dashboard data
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Customers count
    const { count: clientCount, error: clientError } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true });
    
    if (clientError) throw clientError;
    
    // Products count
    const { count: productCount, error: productError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    
    if (productError) throw productError;
    
    // Orders count
    const { count: orderCount, error: orderError } = await supabase
      .from("service_orders")
      .select("*", { count: "exact", head: true });
    
    if (orderError) throw orderError;
    
    // Get appointments count from agendamentos table if it exists
    let appointmentCount = 0;
    try {
      const { count, error } = await supabase
        .from("service_orders")
        .select("*", { count: "exact", head: true });
      
      if (!error && count !== null) {
        appointmentCount = count;
      }
    } catch (e) {
      console.log("Appointments table might not exist", e);
    }
    
    return {
      clientCount: clientCount || 0,
      productCount: productCount || 0,
      orderCount: orderCount || 0,
      appointmentCount
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export const fetchRecentOrders = async (limit = 5): Promise<RecentOrder[]> => {
  try {
    const { data, error } = await supabase
      .from("service_orders")
      .select(`
        id,
        title,
        status,
        created_at,
        customers!inner(name),
        customer_product_id
      `)
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Fetch product details for each order
    const formattedData = await Promise.all(
      (data || []).map(async (order) => {
        let productName = "Não especificado";
        
        if (order.customer_product_id) {
          const { data: cpData, error: cpError } = await supabase
            .from("customer_products")
            .select(`
              product:product_id(name, model)
            `)
            .eq("id", order.customer_product_id)
            .single();
          
          if (!cpError && cpData?.product) {
            const product = cpData.product as { name: string; model?: string };
            productName = product.model 
              ? `${product.name} ${product.model}` 
              : product.name;
          }
        }
        
        // Format the status for display
        let displayStatus;
        switch (order.status) {
          case 'pending': displayStatus = 'Pendente'; break;
          case 'scheduled': displayStatus = 'Agendado'; break;
          case 'in_progress': displayStatus = 'Em andamento'; break;
          case 'completed': displayStatus = 'Concluído'; break;
          case 'canceled': displayStatus = 'Cancelado'; break;
          default: displayStatus = order.status;
        }
        
        return {
          id: order.id,
          client: (order.customers as any).name,
          product: productName,
          date: new Date(order.created_at).toLocaleDateString('pt-BR'),
          status: displayStatus
        };
      })
    );
    
    return formattedData;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

export const fetchUpcomingMaintenance = async (limit = 4): Promise<any[]> => {
  try {
    const today = new Date();
    const { data, error } = await supabase
      .from("customer_products")
      .select(`
        id,
        next_maintenance_date,
        customers!inner(name),
        product:product_id(name, model)
      `)
      .gte("next_maintenance_date", today.toISOString())
      .order("next_maintenance_date", { ascending: true })
      .limit(limit);
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      client: (item.customers as any).name,
      product: item.product 
        ? `${(item.product as any).name} ${(item.product as any).model || ''}`.trim()
        : "Não especificado",
      date: new Date(item.next_maintenance_date).toLocaleDateString('pt-BR')
    }));
  } catch (error) {
    console.error("Error fetching upcoming maintenance:", error);
    return [];
  }
};

export const fetchOrdersByStatus = async (): Promise<ChartData[]> => {
  try {
    const { data, error } = await supabase
      .from("service_orders")
      .select("status");
    
    if (error) throw error;
    
    // Count orders by status
    const statusCounts: Record<string, number> = {};
    (data || []).forEach(order => {
      const status = order.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Format for chart display
    const statusLabels: Record<string, string> = {
      'pending': 'Pendente',
      'scheduled': 'Agendado',
      'in_progress': 'Em Andamento',
      'completed': 'Concluído',
      'canceled': 'Cancelado',
      'unknown': 'Desconhecido'
    };
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count
    }));
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    return [];
  }
};

export const fetchProductDistribution = async (): Promise<ChartData[]> => {
  try {
    const { data, error } = await supabase
      .from("customer_products")
      .select(`
        product:product_id(id, name)
      `);
    
    if (error) throw error;
    
    const productCounts: Record<string, number> = {};
    
    (data || []).forEach(item => {
      const productName = (item.product as any)?.name || 'Desconhecido';
      productCounts[productName] = (productCounts[productName] || 0) + 1;
    });
    
    // Convert to chart data format
    return Object.entries(productCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 products
  } catch (error) {
    console.error("Error fetching product distribution:", error);
    return [];
  }
};
