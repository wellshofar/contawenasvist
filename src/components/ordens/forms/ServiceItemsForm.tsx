
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Search } from "lucide-react";
import { ServiceItem } from "@/components/ordens/types";
import { useProdutos } from "@/hooks/useProdutos";
import { Product } from "@/types/supabase";

// Import our new components
import ProductSelector from "./product-selector/ProductSelector";
import ServiceItemForm from "./service-items/ServiceItemForm";
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
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [showProductSelector, setShowProductSelector] = useState(false);
  
  // Fetch all products using the useProdutos hook
  const { produtos, loading } = useProdutos();

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
        <ProductSelector
          produtos={produtos}
          loading={loading}
          onSelectProduct={handleSelectProduct}
          onSelectAndAddProduct={handleSelectAndAddProduct}
        />
      )}

      <ServiceItemForm
        itemCode={itemCode}
        setItemCode={setItemCode}
        itemName={itemName}
        setItemName={setItemName}
        itemQuantity={itemQuantity}
        setItemQuantity={setItemQuantity}
        itemPrice={itemPrice}
        setItemPrice={setItemPrice}
        onAddItem={handleAddItem}
      />

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
