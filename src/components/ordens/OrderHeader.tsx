
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
    <div className="space-y-4">
      <OrderActionButtons
        orderId={order.id}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
        onBack={onBack}
      />
      {order.title && (
        <h2 className="text-xl font-semibold text-gray-700">{order.title}</h2>
      )}
    </div>
  );
};

export default OrderHeader;
