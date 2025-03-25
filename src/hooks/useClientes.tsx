
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ClienteFormValues } from "@/components/clientes/ClienteForm";

export const useClientes = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<ClienteFormValues>({
    nome: "",
    documento: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      
      const mappedData = data.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        postal_code: customer.postal_code || "",
        document: customer.document || "",
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        created_by: customer.created_by,
      }));
      
      setClientes(mappedData);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const openEditDialog = (cliente: Customer) => {
    setCurrentCliente({
      id: cliente.id,
      nome: cliente.name,
      documento: cliente.document || "",
      email: cliente.email || "",
      telefone: cliente.phone || "",
      endereco: cliente.address || "",
      cidade: cliente.city || "",
      estado: cliente.state || "",
      cep: cliente.postal_code || "",
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const openNewDialog = () => {
    setCurrentCliente({
      nome: "",
      documento: "",
      email: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleDeleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Cliente removido",
        description: "Cliente foi removido com sucesso.",
      });
      
      fetchClientes();
    } catch (error) {
      console.error("Error deleting cliente:", error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (values: ClienteFormValues) => {
    try {
      if (isEditing && values.id) {
        const { error } = await supabase
          .from("customers")
          .update({
            name: values.nome,
            document: values.documento,
            email: values.email || null,
            phone: values.telefone || null,
            address: values.endereco || null,
            city: values.cidade || null,
            state: values.estado || null,
            postal_code: values.cep || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", values.id);

        if (error) throw error;

        toast({
          title: "Cliente atualizado",
          description: `${values.nome} foi atualizado com sucesso.`,
        });
      } else {
        const { error } = await supabase
          .from("customers")
          .insert({
            name: values.nome,
            document: values.documento,
            email: values.email || null,
            phone: values.telefone || null,
            address: values.endereco || null,
            city: values.cidade || null,
            state: values.estado || null,
            postal_code: values.cep || null,
            created_by: user?.id || null,
          });

        if (error) throw error;

        toast({
          title: "Cliente adicionado",
          description: `${values.nome} foi adicionado com sucesso.`,
        });
      }
      
      setDialogOpen(false);
      fetchClientes();
    } catch (error) {
      console.error("Error saving cliente:", error);
      toast({
        title: "Erro ao salvar cliente",
        description: "Não foi possível salvar o cliente.",
        variant: "destructive",
      });
    }
  };

  return {
    clientes,
    loading,
    dialogOpen,
    setDialogOpen,
    isEditing,
    currentCliente,
    openEditDialog,
    openNewDialog,
    handleDeleteCliente,
    handleSubmit,
    refreshClientes: fetchClientes
  };
};
