
import React, { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface AgendamentoSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  cityFilter: string | null;
  setCityFilter: (value: string | null) => void;
}

const AgendamentoSearch: React.FC<AgendamentoSearchProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  cityFilter,
  setCityFilter,
}) => {
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Fetch unique cities from customers table
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("city")
          .not("city", "is", null)
          .order("city");

        if (error) throw error;
        
        // Filter out null values and duplicates
        const uniqueCities = [...new Set(data
          .map(customer => customer.city)
          .filter(city => city && city.trim() !== "")
        )].sort();
        
        setAvailableCities(uniqueCities);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    
    fetchCities();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center">
      <div className="relative w-full md:w-64">
        <Input
          placeholder="Buscar agendamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      <Select
        value={statusFilter || ""}
        onValueChange={(value) => setStatusFilter(value || null)}
      >
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="confirmed">Confirmado</SelectItem>
          <SelectItem value="completed">Concluído</SelectItem>
          <SelectItem value="cancelled">Cancelado</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={cityFilter || ""}
        onValueChange={(value) => setCityFilter(value || null)}
      >
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Filtrar por cidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as cidades</SelectItem>
          {isLoadingCities ? (
            <SelectItem value="loading" disabled>Carregando cidades...</SelectItem>
          ) : (
            availableCities.map(city => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AgendamentoSearch;
