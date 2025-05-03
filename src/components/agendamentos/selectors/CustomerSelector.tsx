
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Customer } from "@/types/supabase";
import { AppointmentFormValues } from "@/types/agendamentos";
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

interface CustomerSelectorProps {
  form: UseFormReturn<AppointmentFormValues>;
  customers: Customer[];
  onCustomerChange: (customerId: string) => void;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  form,
  customers,
  onCustomerChange,
}) => {
  return (
    <FormField
      control={form.control}
      name="customerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente</FormLabel>
          <Select
            onValueChange={onCustomerChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                  {customer.document && ` - ${customer.document}`}
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

export default CustomerSelector;
