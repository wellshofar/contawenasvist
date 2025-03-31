
import React from "react";
import { ServiceOrder, CustomerProduct } from "@/types/supabase";
import { formatDate } from "./types";

interface OrderInfoProps {
  order: ServiceOrder;
  customerProduct: CustomerProduct;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order, customerProduct }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
      <div>
        <p><span className="font-semibold">Formulário/Contrato:</span> {customerProduct.id}</p>
        <p><span className="font-semibold">Data/Hora Atendimento:</span> {formatDate(order.created_at)}</p>
        <p><span className="font-semibold">Atendimento Autorizado por:</span> {order.created_by || "-"}</p>
      </div>
      <div>
        <p><span className="font-semibold">Data do Contrato:</span> {customerProduct.installation_date ? new Date(customerProduct.installation_date).toLocaleDateString("pt-BR") : "-"}</p>
        <p><span className="font-semibold">Atendente:</span> {order.assigned_to || "-"}</p>
      </div>
    </div>
  );
};

export default OrderInfo;
