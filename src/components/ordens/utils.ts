
import { ServiceOrder } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";

// Variable to cache customer names
let customerCache = {};
// Variable to cache product names
let productCache = {};

export const getCustomerName = async (customerId: string): Promise<string> => {
  // Check if customer name is already in cache
  if (customerCache[customerId]) {
    return customerCache[customerId];
  }

  try {
    const { data, error } = await supabase
      .from("customers")
      .select("name")
      .eq("id", customerId)
      .single();

    if (error) {
      console.error("Error fetching customer:", error);
      return "Cliente não encontrado";
    }

    const name = data.name;
    // Store name in cache
    customerCache[customerId] = name;
    return name;
  } catch (error) {
    console.error("Error in getCustomerName:", error);
    return "Cliente não encontrado";
  }
};

export const getProductName = async (customerProductId: string | null): Promise<string> => {
  if (!customerProductId) {
    return "Nenhum produto";
  }

  // Check if product name is already in cache
  if (productCache[customerProductId]) {
    return productCache[customerProductId];
  }

  try {
    const { data, error } = await supabase
      .from("customer_products")
      .select(`
        products (
          name,
          model
        )
      `)
      .eq("id", customerProductId)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return "Produto não encontrado";
    }

    const productName = data.products.name;
    const model = data.products.model;
    const fullName = model ? `${productName} (${model})` : productName;
    
    // Store name in cache
    productCache[customerProductId] = fullName;
    return fullName;
  } catch (error) {
    console.error("Error in getProductName:", error);
    return "Produto não encontrado";
  }
};

export const downloadExampleCSV = (orders: ServiceOrder[]) => {
  // Create CSV header row
  const headers = ["ID", "Título", "Cliente", "Status", "Data Agendada"];
  
  // Convert orders to CSV rows
  const rows = orders.map(order => {
    return [
      order.id,
      order.title,
      "[Cliente]", // Placeholder since we don't have the name here
      order.status,
      order.scheduled_date ? new Date(order.scheduled_date).toLocaleDateString("pt-BR") : "-"
    ];
  });
  
  // Combine headers and rows into CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  // Create a link and trigger the download
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `ordens_servico_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
