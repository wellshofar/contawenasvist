
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/types/agendamentos";
import { useAuth } from "@/contexts/AuthContext";

export const useAgendamentos = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAgendamento, setCurrentAgendamento] = useState<any>(null);

  // Function to fetch appointments from service_orders table
  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
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
          customers(name)
        `)
        .not('scheduled_date', 'is', null)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      
      // Get product details for customer products
      const customerProductIds = serviceOrders
        .filter(order => order.customer_product_id)
        .map(order => order.customer_product_id);
      
      let productData = {};
      
      if (customerProductIds.length > 0) {
        const { data: customerProducts, error: cpError } = await supabase
          .from("customer_products")
          .select(`
            id,
            product_id,
            products(name)
          `)
          .in('id', customerProductIds);
          
        if (!cpError && customerProducts) {
          productData = customerProducts.reduce((acc, cp) => {
            acc[cp.id] = {
              productId: cp.product_id,
              productName: cp.products?.name || 'Produto não informado'
            };
            return acc;
          }, {});
        }
      }
      
      // Get assigned technicians
      const technicianIds = serviceOrders
        .filter(order => order.assigned_to)
        .map(order => order.assigned_to);
      
      let technicianData = {};
      
      if (technicianIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select(`
            id,
            full_name
          `)
          .in('id', technicianIds);
          
        if (!profilesError && profiles) {
          technicianData = profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.full_name || profile.email;
            return acc;
          }, {});
        }
      }
      
      // Map the service orders to the appointment format
      const mappedAgendamentos = serviceOrders.map(order => ({
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
      
      setAgendamentos(mappedAgendamentos);
    } catch (error) {
      console.error("Error fetching agendamentos:", error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Não foi possível carregar a lista de agendamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new appointment
  const addAgendamento = async (values) => {
    try {
      const { error } = await supabase
        .from("service_orders")
        .insert({
          title: values.title,
          description: values.description || null,
          customer_id: values.customerId,
          customer_product_id: values.productId || null,
          scheduled_date: values.scheduledDate.toISOString(),
          status: values.status,
          created_by: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Agendamento adicionado",
        description: `${values.title} foi agendado com sucesso.`,
      });
      
      await fetchAgendamentos();
      return true;
    } catch (error) {
      console.error("Error adding agendamento:", error);
      toast({
        title: "Erro ao salvar agendamento",
        description: "Não foi possível salvar o agendamento.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update existing appointment
  const updateAgendamento = async (values) => {
    if (!values.id) return false;
    
    try {
      const { error } = await supabase
        .from("service_orders")
        .update({
          title: values.title,
          description: values.description || null,
          customer_id: values.customerId,
          customer_product_id: values.productId || null,
          scheduled_date: values.scheduledDate.toISOString(),
          status: values.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id);

      if (error) throw error;

      toast({
        title: "Agendamento atualizado",
        description: `${values.title} foi atualizado com sucesso.`,
      });
      
      await fetchAgendamentos();
      return true;
    } catch (error) {
      console.error("Error updating agendamento:", error);
      toast({
        title: "Erro ao atualizar agendamento",
        description: "Não foi possível atualizar o agendamento.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete appointment
  const deleteAgendamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from("service_orders")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Agendamento removido",
        description: "Agendamento foi removido com sucesso.",
      });
      
      await fetchAgendamentos();
      return true;
    } catch (error) {
      console.error("Error deleting agendamento:", error);
      toast({
        title: "Erro ao remover agendamento",
        description: "Não foi possível remover o agendamento.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  return {
    agendamentos,
    loading,
    fetchAgendamentos,
    addAgendamento,
    updateAgendamento,
    deleteAgendamento,
    dialogOpen,
    setDialogOpen,
    isEditing,
    setIsEditing,
    currentAgendamento,
    setCurrentAgendamento
  };
};
