
import React from "react";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProductSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  categories: string[];
}

const ProductSearchFilter: React.FC<ProductSearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  categories
}) => {
  return (
    <div className="flex space-x-2 mb-4">
      <div className="flex-1">
        <Input 
          placeholder="Buscar produtos..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            {categoryFilter || "Todas Categorias"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="end">
          <Command>
            <CommandInput placeholder="Buscar categoria..." />
            <CommandEmpty>Nenhuma categoria encontrada</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => setCategoryFilter(null)}
                className={!categoryFilter ? "bg-accent" : ""}
              >
                Todas Categorias
              </CommandItem>
              {categories.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => setCategoryFilter(category)}
                  className={categoryFilter === category ? "bg-accent" : ""}
                >
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProductSearchFilter;
