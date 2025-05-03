
import { Appointment } from "@/types/agendamentos";

export const mapServiceOrdersToAppointments = (
  serviceOrders: any[], 
  productData: any = {}, 
  technicianData: any = {}
): Appointment[] => {
  if (!serviceOrders) return [];
  
  return serviceOrders.map(order => {
    const customerProduct = order.customer_product_id ? productData[order.customer_product_id] : null;
    
    return {
      id: order.id,
      title: order.title,
      description: order.description || "",
      customerId: order.customer_id,
      customerName: order.customers?.name || "Cliente não encontrado",
      customerCity: order.customers?.city || "",
      productId: order.customer_product_id || null,
      productName: customerProduct?.productName || "",
      status: order.status || "pending",
      scheduledDate: order.scheduled_date ? new Date(order.scheduled_date) : new Date(),
      technicianId: order.assigned_to || null,
      technicianName: order.assigned_to ? technicianData[order.assigned_to] || "Técnico não encontrado" : null
    };
  });
};
