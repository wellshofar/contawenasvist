
import { ServiceOrder } from "@/types/supabase";
import { mockCustomers, mockCustomerProducts, mockProducts } from "./mockData";

// Get customer name from customer id
export const getCustomerName = (customerId: string) => {
  return mockCustomers.find(customer => customer.id === customerId)?.name || "Cliente não encontrado";
};

// Get product name from customer product id
export const getProductName = (customerProductId: string | null) => {
  if (!customerProductId) return "Produto não especificado";
  
  const customerProduct = mockCustomerProducts.find(cp => cp.id === customerProductId);
  if (!customerProduct) return "Produto não encontrado";
  
  const product = mockProducts.find(p => p.id === customerProduct.product_id);
  return product ? product.name : "Produto não encontrado";
};

// Generate CSV content for orders
export const generateOrdersCsv = (orders: ServiceOrder[]) => {
  return "ID,Cliente,Produto,Data,Status,Técnico\n" +
    orders.map(order => 
      `${order.id},${getCustomerName(order.customer_id)},${getProductName(order.customer_product_id)},${new Date(order.scheduled_date || "").toLocaleDateString("pt-BR")},${order.status},${order.assigned_to || "Não atribuído"}`
    ).join("\n");
};

// Download CSV file
export const downloadCsv = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Download example CSV
export const downloadExampleCSV = (orders: ServiceOrder[]) => {
  const csvContent = generateOrdersCsv(orders);
  downloadCsv(csvContent, `ordens_servico_${new Date().toISOString().split('T')[0]}.csv`);
};
