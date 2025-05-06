import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ServiceItem } from "@/components/ordens/types";
import { useProdutos } from "@/hooks/useProdutos";
import { Product } from "@/types/supabase";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { X, Plus, Search, Filter, List, Grid3X3 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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

interface ServiceItemsFormProps {
  serviceItems: ServiceItem[];
  onAddItem: (item: ServiceItem) => void;
  onRemoveItem: (itemId: string) => void;
}

const ServiceItemsForm: React.FC<ServiceItemsFormProps> = ({
  serviceItems,
  onAddItem,
  onRemoveItem,
}) => {
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "category">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  
  // Fetch all products using the useProdutos hook
  const { produtos, loading } = useProdutos();
  
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

  const handleAddItem = () => {
    if (!itemName.trim()) return;

    // Create a new service item
    const newItem: ServiceItem = {
      id: crypto.randomUUID(),
      code: itemCode || "-",
      name: itemName,
      description: itemName,
      quantity: itemQuantity,
      price: itemPrice || 0,
    };

    onAddItem(newItem);

    // Reset form fields
    setItemCode("");
    setItemName("");
    setItemQuantity(1);
    setItemPrice(0);
  };

  const handleSelectProduct = (product: Product) => {
    setItemCode(product.model || product.id.substring(0, 8));
    setItemName(product.name);
    // Attempt to extract price from description if available
    if (product.description) {
      const priceMatch = product.description.match(/preço:\s*R?\$?\s*(\d+(?:[.,]\d+)?)/i);
      if (priceMatch && priceMatch[1]) {
        setItemPrice(parseFloat(priceMatch[1].replace(',', '.')));
      }
    }
    // Keep the product selector open to allow selecting multiple products
  };

  const handleSelectAndAddProduct = (product: Product) => {
    // Try to extract price from description if available
    let price = 0;
    if (product.description) {
      const priceMatch = product.description.match(/preço:\s*R?\$?\s*(\d+(?:[.,]\d+)?)/i);
      if (priceMatch && priceMatch[1]) {
        price = parseFloat(priceMatch[1].replace(',', '.'));
      }
    }

    // Set fields from the selected product
    const newItem: ServiceItem = {
      id: crypto.randomUUID(),
      code: product.model || product.id.substring(0, 8),
      name: product.name,
      description: product.name,
      quantity: 1,
      price: price,
    };

    // Add item directly
    onAddItem(newItem);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <FormLabel>Peças e Serviços</FormLabel>
          <p className="text-sm text-muted-foreground mb-4">
            Adicione peças, componentes ou serviços executados nessa ordem de serviço
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowProductSelector(!showProductSelector)}
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            Buscar Produtos
          </Button>
        </div>
      </div>

      {showProductSelector && (
        <div className="border rounded-md p-4">
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
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
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

          {loading ? (
            <div className="text-center p-4">Carregando produtos...</div>
          ) : (
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
              <TabsContent value="list" className="mt-0">
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
              </TabsContent>

              <TabsContent value="grid" className="mt-0">
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
              </TabsContent>

              <TabsContent value="category" className="mt-0">
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
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-2">
          <Input 
            placeholder="Código" 
            value={itemCode} 
            onChange={(e) => setItemCode(e.target.value)}
          />
        </div>
        <div className="sm:col-span-5">
          <Input 
            placeholder="Nome do item ou serviço" 
            value={itemName} 
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Input 
            type="number" 
            min="1" 
            value={itemQuantity} 
            onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
            placeholder="Qtde"
          />
        </div>
        <div className="sm:col-span-2">
          <Input 
            type="number" 
            min="0" 
            step="0.01"
            value={itemPrice} 
            onChange={(e) => setItemPrice(parseFloat(e.target.value) || 0)}
            placeholder="Preço R$"
          />
        </div>
        <div className="sm:col-span-1">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddItem}
            className="w-full"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {serviceItems.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Qtde</TableHead>
                <TableHead className="text-right">Preço Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[80px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell className="text-right">
                    {(item.quantity * item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="text-right font-semibold">TOTAL:</TableCell>
                <TableCell className="text-right font-semibold">{serviceItems.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-right font-semibold">
                  {serviceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground border rounded-md p-4 text-center">
          Nenhum item adicionado
        </div>
      )}
    </div>
  );
};

export default ServiceItemsForm;
