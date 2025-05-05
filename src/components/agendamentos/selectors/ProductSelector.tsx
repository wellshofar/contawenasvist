
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "@/types/agendamentos";
import { Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductSelectorProps {
  form: UseFormReturn<AppointmentFormValues>;
  customerProducts: Array<{
    id: string;
    productId: string;
    name: string;
    model: string;
    displayName: string;
  }>;
  isLoadingProducts: boolean;
  selectedCustomerId: string | null;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  form,
  customerProducts,
  isLoadingProducts,
  selectedCustomerId,
}) => {
  const productIds = form.watch('productIds') || [];
  
  const toggleProduct = (productId: string) => {
    const currentIds = productIds || [];
    const newIds = currentIds.includes(productId) 
      ? currentIds.filter(id => id !== productId)
      : [...currentIds, productId];
      
    form.setValue('productIds', newIds);
  };

  return (
    <FormItem className="space-y-2">
      <FormLabel>Produtos</FormLabel>
      <div className="border rounded-md">
        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>Carregando produtos...</span>
          </div>
        ) : !selectedCustomerId ? (
          <div className="p-2 text-sm text-muted-foreground">
            Selecione um cliente primeiro
          </div>
        ) : customerProducts.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground">
            Nenhum produto encontrado para este cliente
          </div>
        ) : (
          <ScrollArea className="h-[200px] p-2">
            <div className="space-y-2">
              {customerProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`product-${product.id}`}
                    checked={productIds.includes(product.id)}
                    onCheckedChange={() => toggleProduct(product.id)}
                  />
                  <label 
                    htmlFor={`product-${product.id}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {product.displayName}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default ProductSelector;
