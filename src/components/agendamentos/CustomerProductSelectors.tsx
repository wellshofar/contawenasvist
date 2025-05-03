
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "@/types/agendamentos";
import { useCustomerProducts } from "@/hooks/agendamentos/useCustomerProducts";
import CustomerSelector from "./selectors/CustomerSelector";
import ProductSelector from "./selectors/ProductSelector";

interface CustomerProductSelectorsProps {
  form: UseFormReturn<AppointmentFormValues>;
  isEditing: boolean;
  currentAgendamento: any;
}

const CustomerProductSelectors: React.FC<CustomerProductSelectorsProps> = ({
  form,
  isEditing,
  currentAgendamento,
}) => {
  const initialCustomerId = isEditing ? currentAgendamento?.customerId : undefined;
  
  const {
    customers,
    customerProducts,
    selectedCustomerId,
    isLoadingProducts,
    handleCustomerChange
  } = useCustomerProducts(initialCustomerId);

  const onCustomerChange = (customerId: string) => {
    handleCustomerChange(customerId);
    form.setValue("customerId", customerId);
    form.setValue("productId", undefined);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CustomerSelector 
        form={form} 
        customers={customers} 
        onCustomerChange={onCustomerChange} 
      />
      <ProductSelector 
        form={form} 
        customerProducts={customerProducts} 
        isLoadingProducts={isLoadingProducts} 
        selectedCustomerId={selectedCustomerId} 
      />
    </div>
  );
};

export default CustomerProductSelectors;
