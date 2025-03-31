
import React from "react";
import { ServiceOrder, CustomerProduct } from "@/types/supabase";
import { formatDate } from "./types";

interface OrderHeaderPrintProps {
  order: ServiceOrder;
  customerProduct: CustomerProduct;
}

const OrderHeaderPrint: React.FC<OrderHeaderPrintProps> = ({ order, customerProduct }) => {
  return (
    <div className="border-b pb-4 mb-4 text-center">
      <h1 className="text-2xl font-bold">{order.title}</h1>
      <p className="text-lg">Número da OS: {order.id}</p>
      {order.scheduled_date && (
        <p className="text-sm text-muted-foreground">
          Vencimento da O.S.: {new Date(order.scheduled_date).toLocaleDateString("pt-BR")}
          {" - "}
          {new Date(order.scheduled_date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}
    </div>
  );
};

export default OrderHeaderPrint;
