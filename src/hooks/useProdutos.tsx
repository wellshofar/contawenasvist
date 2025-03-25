
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";

// Map prazo to days
const prazoDiasMap: Record<string, number> = {
  "3 meses": 90,
  "6 meses": 180,
  "12 meses": 365,
  "18 meses": 547,
  "24 meses": 730,
};

// Map days to prazo
export const diasPrazoMap = (dias: number): string => {
  if (dias <= 90) return "3 meses";
  if (dias <= 180) return "6 meses";
  if (dias <= 365) return "12 meses";
  if (dias <= 547) return "18 meses";
  return "24 meses";
};

// Helper function to derive category from product name
const getCategoryFromName = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("purificador")) return "Purificador";
  if (lowerName.includes("filtro industrial")) return "Filtro Industrial";
  if (lowerName.includes("filtro")) return "Filtro";
  if (lowerName.includes("bebedouro")) return "Bebedouro";
  return "Acessório";
};

export interface ProdutoFormData {
  id?: string;
  nome: string;
  categoria: string;
  modelo: string;
  descricao: string;
  prazoManutencao: string;
}

export const useProdutos = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      
      const mappedData = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        model: product.model || "",
        maintenance_interval_days: product.maintenance_interval_days || 180,
        created_at: product.created_at,
        updated_at: product.updated_at,
        created_by: product.created_by,
        // Additional frontend properties
        categoria: getCategoryFromName(product.name), // Derive from name initially
      }));
      
      setProdutos(mappedData);
    } catch (error) {
      console.error("Error fetching produtos:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduto = async (values: ProdutoFormData) => {
    try {
      const { error } = await supabase
        .from("products")
        .insert({
          name: values.nome,
          description: values.descricao || null,
          model: values.modelo,
          maintenance_interval_days: prazoDiasMap[values.prazoManutencao],
          created_by: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Produto adicionado",
        description: `${values.nome} foi adicionado com sucesso.`,
      });
      
      await fetchProdutos();
      return true;
    } catch (error) {
      console.error("Error adding produto:", error);
      toast({
        title: "Erro ao salvar produto",
        description: "Não foi possível salvar o produto.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProduto = async (values: ProdutoFormData) => {
    if (!values.id) return false;
    
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: values.nome,
          description: values.descricao || null,
          model: values.modelo,
          maintenance_interval_days: prazoDiasMap[values.prazoManutencao],
          updated_at: new Date().toISOString(),
        })
        .eq("id", values.id);

      if (error) throw error;

      toast({
        title: "Produto atualizado",
        description: `${values.nome} foi atualizado com sucesso.`,
      });
      
      await fetchProdutos();
      return true;
    } catch (error) {
      console.error("Error updating produto:", error);
      toast({
        title: "Erro ao atualizar produto",
        description: "Não foi possível atualizar o produto.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProduto = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Produto removido",
        description: "Produto foi removido com sucesso.",
      });
      
      await fetchProdutos();
      return true;
    } catch (error) {
      console.error("Error deleting produto:", error);
      toast({
        title: "Erro ao remover produto",
        description: "Não foi possível remover o produto.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return {
    produtos,
    loading,
    fetchProdutos,
    addProduto,
    updateProduto,
    deleteProduto,
    prazoDiasMap,
    diasPrazoMap
  };
};
