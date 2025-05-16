
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { ServiceItem } from "@/components/ordens/types";
import { useProdutos } from "@/hooks/useProdutos";
import { Product } from "@/types/supabase";

// Import our components
import ProductSelector from "./product-selector/ProductSelector";
import ServiceItemsTable from "./service-items/ServiceItemsTable";

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
  const [showProductSelector, setShowProductSelector] = useState(false);
  
  // Fetch all products using the useProdutos hook
  const { produtos, loading } = useProdutos();

  const handleSelectProduct = (product: Product) => {
    // Do nothing, handled by handleSelectAndAddProduct directly
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
        <div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowProductSelector(!showProductSelector)}
            className="flex items-center gap-1"
          >
            {showProductSelector ? "Fechar Seleção" : "Buscar Produtos"}
          </Button>
        </div>
      </div>

      {showProductSelector && (
        <ProductSelector
          produtos={produtos}
          loading={loading}
          onSelectProduct={handleSelectProduct}
          onSelectAndAddProduct={handleSelectAndAddProduct}
        />
      )}

      {serviceItems.length > 0 ? (
        <ServiceItemsTable 
          serviceItems={serviceItems} 
          onRemoveItem={onRemoveItem} 
        />
      ) : (
        <div className="text-sm text-muted-foreground border rounded-md p-4 text-center">
          Nenhum item adicionado
        </div>
      )}
    </div>
  );
};

export default ServiceItemsForm;
