
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Appointment, AppointmentFormValues } from "@/types/agendamentos";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchAppointmentsData, 
  fetchCustomerProductDetails, 
  fetchTechnicianDetails,
  addAppointmentToDb,
  updateAppointmentInDb,
  deleteAppointmentFromDb
} from "./agendamentos/agendamentosApi";
import { mapServiceOrdersToAppointments } from "./agendamentos/agendamentoMappers";

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
      // Get service orders data
      const serviceOrders = await fetchAppointmentsData();
      
      // Get product details for customer products
      const customerProductIds = serviceOrders
        .filter(order => order.customer_product_id)
        .map(order => order.customer_product_id);
      
      const productData = await fetchCustomerProductDetails(customerProductIds);
      
      // Get assigned technicians
      const technicianIds = serviceOrders
        .filter(order => order.assigned_to)
        .map(order => order.assigned_to);
      
      const technicianData = await fetchTechnicianDetails(technicianIds);
      
      // Map the service orders to the appointment format
      const mappedAgendamentos = mapServiceOrdersToAppointments(
        serviceOrders, 
        productData, 
        technicianData
      );
      
      setAgendamentos(mappedAgendamentos);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
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
  const addAgendamento = async (values: AppointmentFormValues) => {
    try {
      await addAppointmentToDb(values, user?.id);
      
      toast({
        title: "Agendamento adicionado",
        description: `${values.title} foi agendado com sucesso.`,
      });
      
      await fetchAgendamentos();
      return true;
    } catch (error) {
      console.error("Erro ao adicionar agendamento:", error);
      toast({
        title: "Erro ao salvar agendamento",
        description: "Não foi possível salvar o agendamento.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update existing appointment
  const updateAgendamento = async (values: AppointmentFormValues) => {
    if (!values.id) return false;
    
    try {
      // Log values for debugging
      console.log("Enviando atualização:", values);
      
      await updateAppointmentInDb(values);

      toast({
        title: "Agendamento atualizado",
        description: `${values.title} foi atualizado com sucesso.`,
      });
      
      await fetchAgendamentos();
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar agendamento:", error);
      toast({
        title: "Erro ao atualizar agendamento",
        description: error.message || "Não foi possível atualizar o agendamento.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete appointment
  const deleteAgendamento = async (id: string) => {
    try {
      await deleteAppointmentFromDb(id);

      toast({
        title: "Agendamento removido",
        description: "Agendamento foi removido com sucesso.",
      });
      
      await fetchAgendamentos();
      return true;
    } catch (error) {
      console.error("Erro ao remover agendamento:", error);
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

export default useAgendamentos;
