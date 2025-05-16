
import React from "react";
import OrderActionButtons from "./OrderActionButtons";
import { OrderHeaderProps } from "./types";

const OrderHeader: React.FC<OrderHeaderProps> = ({ 
  order, 
  handlePrint, 
  handleDownloadPDF, 
  onBack 
}) => {
  return (
    <OrderActionButtons
      orderId={order.id}
      onPrint={handlePrint}
      onDownloadPDF={handleDownloadPDF}
      onBack={onBack}
    />
  );
};

export default OrderHeader;
