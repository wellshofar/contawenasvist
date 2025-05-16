
import React from "react";
import { Card } from "@/components/ui/card";
import OrderHeaderPrint from "./OrderHeaderPrint";
import OrderInfo from "./OrderInfo";
import CustomerInfo from "./CustomerInfo";
import ProductInfo from "./ProductInfo";
import OrderDescription from "./OrderDescription";
import ServiceItems from "./ServiceItems";
import SignatureFields from "./SignatureFields";
import FooterInfo from "./FooterInfo";
import { ServiceOrder, Customer, CustomerProduct, Product } from "@/types/supabase";
import { ServiceItem } from "./types";

interface OrderDetailContentProps {
  order: ServiceOrder;
  customer: Customer;
  customerProduct: CustomerProduct | null;
  product: Product | null;
  serviceItems: ServiceItem[];
  cleanDescription: string;
  onDescriptionUpdate: (updatedDesc: string, cleanDesc: string) => void;
  onDeleteClick: () => void;
}

const OrderDetailContent: React.FC<OrderDetailContentProps> = ({
  order,
  customer,
  customerProduct,
  product,
  serviceItems,
  cleanDescription,
  onDescriptionUpdate,
  onDeleteClick
}) => {
  const handleDescriptionSave = async (result: { updatedDescription: string, cleanDescription: string } | null) => {
    if (result) {
      onDescriptionUpdate(result.updatedDescription, result.cleanDescription);
    }
  };

  return (
    <Card className="p-6 print:shadow-none print:border-none">
      <div className="a4-page">
        {/* Header */}
        <OrderHeaderPrint order={order} customerProduct={customerProduct} />

        {/* Order Info */}
        <OrderInfo order={order} customerProduct={customerProduct} />

        {/* Customer Info */}
        <CustomerInfo customer={customer} />

        {/* Product Info */}
        {product && <ProductInfo product={product} customerProduct={customerProduct} />}

        {/* Order Description (Editable) */}
        <OrderDescription 
          orderId={order.id}
          initialDescription={order.description}
          cleanDescription={cleanDescription}
          onDelete={onDeleteClick}
        />

        {/* Service Items */}
        <ServiceItems serviceItems={serviceItems} />

        {/* Signature fields */}
        <SignatureFields />

        {/* Footer Info */}
        <FooterInfo />
      </div>
    </Card>
  );
};

export default OrderDetailContent;
