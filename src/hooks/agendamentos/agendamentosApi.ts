
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentFormValues } from "@/types/agendamentos";
import { useToast } from "@/hooks/use-toast";

export const fetchAppointmentsData = async () => {
  // Get appointments from service_orders table with scheduled_date
  const { data: serviceOrders, error } = await supabase
    .from("service_orders")
    .select(`
      id,
      title,
      description,
      customer_id,
      customer_product_id,
      status,
      scheduled_date,
      assigned_to,
      customers(
        name,
        city
      )
    `)
    .not('scheduled_date', 'is', null)
    .order('scheduled_date', { ascending: false });

  if (error) throw error;
  return serviceOrders;
};

export const fetchCustomerProductDetails = async (customerProductIds: string[]) => {
  if (customerProductIds.length === 0) return {};
  
  const { data: customerProducts, error } = await supabase
    .from("customer_products")
    .select(`
      id,
      product_id,
      products(name)
    `)
    .in('id', customerProductIds);
    
  if (error) throw error;
  
  return customerProducts.reduce((acc, cp) => {
    acc[cp.id] = {
      productId: cp.product_id,
      productName: cp.products?.name || 'Produto não informado'
    };
    return acc;
  }, {});
};

export const fetchTechnicianDetails = async (technicianIds: string[]) => {
  if (technicianIds.length === 0) return {};
  
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name
    `)
    .in('id', technicianIds);
    
  if (error) throw error;
  
  return profiles.reduce((acc, profile) => {
    acc[profile.id] = profile.full_name || 'Usuário sem nome';
    return acc;
  }, {});
};

export const addAppointmentToDb = async (values: AppointmentFormValues, userId: string | undefined) => {
  // Handle the "none" value for productId
  const productId = values.productId === "none" ? null : values.productId;
  
  const { data, error } = await supabase
    .from("service_orders")
    .insert({
      title: values.title,
      description: values.description || null,
      customer_id: values.customerId,
      customer_product_id: productId,
      scheduled_date: values.scheduledDate.toISOString(),
      status: values.status,
      created_by: userId || null,
    })
    .select();

  if (error) throw error;
  return data;
};

export const updateAppointmentInDb = async (values: AppointmentFormValues) => {
  if (!values.id) throw new Error("Appointment ID is required for updates");
  
  try {
    // Handle the "none" value for productId
    const productId = values.productId === "none" ? null : values.productId;
    
    // Log values for debugging
    console.log("Atualizando agendamento:", {
      id: values.id,
      title: values.title,
      status: values.status,
      scheduledDate: values.scheduledDate.toISOString()
    });
    
    const { data, error } = await supabase
      .from("service_orders")
      .update({
        title: values.title,
        description: values.description || null,
        customer_id: values.customerId,
        customer_product_id: productId,
        scheduled_date: values.scheduledDate.toISOString(),
        status: values.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", values.id)
      .select();

    if (error) {
      console.error("Erro ao atualizar agendamento:", error);
      throw new Error(`Erro ao atualizar: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error("Erro inesperado ao atualizar agendamento:", error);
    throw error;
  }
};

export const deleteAppointmentFromDb = async (id: string) => {
  const { error } = await supabase
    .from("service_orders")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
