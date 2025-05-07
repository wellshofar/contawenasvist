
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ServiceItem } from "@/components/ordens/types";

interface ServiceItemsTableProps {
  serviceItems: ServiceItem[];
  onRemoveItem: (itemId: string) => void;
}

const ServiceItemsTable: React.FC<ServiceItemsTableProps> = ({ 
  serviceItems, 
  onRemoveItem 
}) => {
  // Calculate total quantity and value
  const totalQuantity = serviceItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = serviceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  return (
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
            <TableCell className="text-right font-semibold">{totalQuantity}</TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right font-semibold">
              {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceItemsTable;
