
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Product } from "@/types/supabase";
import ProductSearchFilter from "./ProductSearchFilter";
import { ProductSelectorViews, ListView, GridView, CategoryView } from "./ProductSelectorViews";

interface ProductSelectorProps {
  produtos: Product[];
  loading: boolean;
  onSelectProduct: (product: Product) => void;
  onSelectAndAddProduct: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  produtos,
  loading,
  onSelectProduct,
  onSelectAndAddProduct
}) => {
  const [viewMode, setViewMode] = useState<"list" | "grid" | "category">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Get unique categories from products
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    produtos.forEach((product) => {
      if (product.categoria) {
        uniqueCategories.add(product.categoria);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [produtos]);

  // Filter products based on search term and category
  const filteredProducts = React.useMemo(() => {
    return produtos.filter((product) => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !categoryFilter || product.categoria === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [produtos, searchTerm, categoryFilter]);

  return (
    <div className="border rounded-md p-4">
      <ProductSelectorViews 
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredProducts={filteredProducts}
        loading={loading}
        categories={categories}
        handleSelectAndAddProduct={onSelectAndAddProduct}
        handleSelectProduct={onSelectProduct}
        categoryFilter={categoryFilter}
      />
      
      <ProductSearchFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
      />

      {loading ? (
        <div className="text-center p-4">Carregando produtos...</div>
      ) : (
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
          <TabsContent value="list" className="mt-0">
            <ListView 
              filteredProducts={filteredProducts} 
              handleSelectAndAddProduct={onSelectAndAddProduct} 
            />
          </TabsContent>

          <TabsContent value="grid" className="mt-0">
            <GridView 
              filteredProducts={filteredProducts}
              handleSelectProduct={onSelectProduct}
              handleSelectAndAddProduct={onSelectAndAddProduct}
            />
          </TabsContent>

          <TabsContent value="category" className="mt-0">
            <CategoryView 
              categories={categories}
              produtos={produtos}
              handleSelectProduct={onSelectProduct}
              handleSelectAndAddProduct={onSelectAndAddProduct}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ProductSelector;
