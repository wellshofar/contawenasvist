
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ServiceItemFormProps {
  itemCode: string;
  setItemCode: (code: string) => void;
  itemName: string;
  setItemName: (name: string) => void;
  itemQuantity: number;
  setItemQuantity: (quantity: number) => void;
  itemPrice: number;
  setItemPrice: (price: number) => void;
  onAddItem: () => void;
}

const ServiceItemForm: React.FC<ServiceItemFormProps> = ({
  itemCode,
  setItemCode,
  itemName,
  setItemName,
  itemQuantity,
  setItemQuantity,
  itemPrice,
  setItemPrice,
  onAddItem
}) => {
  return (
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
          onClick={onAddItem}
          className="w-full"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ServiceItemForm;
