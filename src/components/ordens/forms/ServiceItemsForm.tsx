
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ServiceItem } from "@/components/ordens/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { X, Plus } from "lucide-react";

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

  const handleAddItem = () => {
    if (!itemName.trim()) return;

    // Create a new service item
    const newItem: ServiceItem = {
      id: crypto.randomUUID(),
      code: itemCode || "-",
      name: itemName,
      description: itemName,
      quantity: itemQuantity,
      price: 0, // Optional, not used in the current implementation
    };

    onAddItem(newItem);

    // Reset form fields
    setItemCode("");
    setItemName("");
    setItemQuantity(1);
  };

  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Peças e Serviços</FormLabel>
        <p className="text-sm text-muted-foreground mb-4">
          Adicione peças, componentes ou serviços executados nessa ordem de serviço
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-2">
          <Input 
            placeholder="Código" 
            value={itemCode} 
            onChange={(e) => setItemCode(e.target.value)}
          />
        </div>
        <div className="sm:col-span-7">
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
                <TableHead className="w-[100px] text-right">Qtde</TableHead>
                <TableHead className="w-[80px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
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
