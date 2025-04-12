
import { Appointment } from "@/types/agendamentos";

export const mapServiceOrdersToAppointments = (
  serviceOrders: any[], 
  productData: Record<string, any>, 
  technicianData: Record<string, any>
): Appointment[] => {
  return serviceOrders.map(order => ({
    id: order.id,
    title: order.title,
    description: order.description || '',
    customerId: order.customer_id,
    customerName: order.customers?.name || 'Cliente não informado',
    productId: order.customer_product_id ? productData[order.customer_product_id]?.productId : null,
    productName: order.customer_product_id ? productData[order.customer_product_id]?.productName : null,
    scheduledDate: order.scheduled_date,
    assignedToId: order.assigned_to,
    assignedToName: order.assigned_to ? technicianData[order.assigned_to] : null,
    status: order.status || 'pending'
  })) as Appointment[];
};
