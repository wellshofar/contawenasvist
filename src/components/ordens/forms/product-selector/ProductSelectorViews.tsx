
import React from "react";
import { List, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/supabase";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus } from "lucide-react";

type ViewMode = "list" | "grid" | "category";

interface ProductSelectorViewsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filteredProducts: Product[];
  loading: boolean;
  categories: string[];
  handleSelectAndAddProduct: (product: Product) => void;
  handleSelectProduct: (product: Product) => void;
  categoryFilter: string | null;
}

export const ProductSelectorViews: React.FC<ProductSelectorViewsProps> = ({
  viewMode,
  setViewMode,
  filteredProducts,
  loading,
  categories,
  handleSelectAndAddProduct,
  handleSelectProduct,
  categoryFilter
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium">Selecionar Produto do Catálogo</h3>
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setViewMode("list")}
          className={viewMode === "list" ? "bg-secondary" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setViewMode("grid")}
          className={viewMode === "grid" ? "bg-secondary" : ""}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setViewMode("category")}
          className={viewMode === "category" ? "bg-secondary" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const ListView: React.FC<{
  filteredProducts: Product[];
  handleSelectAndAddProduct: (product: Product) => void;
}> = ({ filteredProducts, handleSelectAndAddProduct }) => {
  return (
    <div className="border rounded-md overflow-auto max-h-64">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="w-[100px]">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.model || "-"}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.categoria || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAndAddProduct(product)}
                    title="Adicionar à ordem de serviço"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export const GridView: React.FC<{
  filteredProducts: Product[];
  handleSelectProduct: (product: Product) => void;
  handleSelectAndAddProduct: (product: Product) => void;
}> = ({ filteredProducts, handleSelectProduct, handleSelectAndAddProduct }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-auto max-h-64 p-2">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="border rounded-md p-3 hover:bg-accent cursor-pointer relative"
            onClick={() => handleSelectProduct(product)}
          >
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.model || "-"}</div>
            <div className="text-xs mt-1 bg-secondary inline-block px-2 py-0.5 rounded">
              {product.categoria || "Sem categoria"}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAndAddProduct(product);
              }}
              title="Adicionar à ordem de serviço"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))
      ) : (
        <div className="col-span-3 text-center p-4">
          Nenhum produto encontrado
        </div>
      )}
    </div>
  );
};

export const CategoryView: React.FC<{
  categories: string[];
  produtos: Product[];
  handleSelectProduct: (product: Product) => void;
  handleSelectAndAddProduct: (product: Product) => void;
}> = ({ categories, produtos, handleSelectProduct, handleSelectAndAddProduct }) => {
  return (
    <div className="overflow-auto max-h-64">
      {categories.length > 0 ? (
        categories.map((category) => {
          const categoryProducts = produtos.filter(p => p.categoria === category);
          return (
            <div key={category} className="mb-4">
              <h4 className="font-medium mb-2 bg-secondary px-2 py-1 rounded">
                {category}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {categoryProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="border rounded-md p-2 hover:bg-accent cursor-pointer relative"
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.model || "-"}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAndAddProduct(product);
                      }}
                      title="Adicionar à ordem de serviço"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center p-4">
          Nenhuma categoria encontrada
        </div>
      )}
    </div>
  );
};
