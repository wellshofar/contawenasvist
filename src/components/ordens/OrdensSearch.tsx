
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface OrdensSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OrdensSearch: React.FC<OrdensSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar ordens de serviço..."
          className="pl-8"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <Button variant="outline" className="gap-2">
        <Filter className="h-4 w-4" /> Filtrar
      </Button>
    </div>
  );
};

export default OrdensSearch;
