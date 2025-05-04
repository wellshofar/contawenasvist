
import React from "react";
import { ServiceOrder, CustomerProduct } from "@/types/supabase";
import { formatDate } from "./types";

interface OrderHeaderPrintProps {
  order: ServiceOrder;
  customerProduct: CustomerProduct | null;
}

const OrderHeaderPrint: React.FC<OrderHeaderPrintProps> = ({ order, customerProduct }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Ordem de Serviço</h1>
          <p className="text-sm text-gray-500">Nº {order.id}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Data: {formatDate(order.created_at)}</p>
          <p>Status: {order.status}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderHeaderPrint;
