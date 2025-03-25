
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon } from "lucide-react";

interface ProdutoSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProdutoSearch: React.FC<ProdutoSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Buscar produto..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" className="gap-2">
        <FilterIcon className="h-4 w-4" /> Filtrar
      </Button>
    </div>
  );
};

export default ProdutoSearch;
