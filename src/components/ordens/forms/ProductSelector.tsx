
import React from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { CustomerProductWithDetails } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface ProductSelectorProps {
  selectedCustomer: string | null;
  customerProducts: CustomerProductWithDetails[];
  selectedProducts: string[];
  onAddProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedCustomer,
  customerProducts,
  selectedProducts,
  onAddProduct,
  onRemoveProduct,
}) => {
  return (
    <div>
      <FormLabel>Produtos</FormLabel>
      <div className="flex items-center space-x-2 mb-2">
        <Select
          disabled={!selectedCustomer}
          onValueChange={onAddProduct}
          value=""
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Adicionar produto" />
          </SelectTrigger>
          <SelectContent>
            {customerProducts.map((cp) => (
              <SelectItem 
                key={cp.id} 
                value={cp.id}
                disabled={selectedProducts.includes(cp.id)}
              >
                {cp.product?.name} - {cp.product?.model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedProducts.length > 0 ? (
        <div className="border rounded-md mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts.map(productId => {
                const product = customerProducts.find(cp => cp.id === productId);
                return (
                  <TableRow key={productId}>
                    <TableCell>
                      {product?.product?.name} - {product?.product?.model}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveProduct(productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground mt-2">
          {selectedCustomer ? "Nenhum produto selecionado" : "Selecione um cliente primeiro"}
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
