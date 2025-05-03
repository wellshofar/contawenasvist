
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
  return (
    <FormField
      control={form.control}
      name="productId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Produto</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={!selectedCustomerId || isLoadingProducts}
          >
            <FormControl>
              <SelectTrigger>
                {isLoadingProducts ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Carregando...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Selecione um produto" />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">Nenhum produto específico</SelectItem>
              {customerProducts.map((cp) => (
                <SelectItem key={cp.id} value={cp.id}>
                  {cp.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductSelector;
