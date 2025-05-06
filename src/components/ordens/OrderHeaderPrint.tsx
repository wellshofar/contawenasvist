
import React from "react";
import { ServiceOrder, CustomerProduct } from "@/types/supabase";
import { formatDate } from "./types";
import { useSettings } from "@/contexts/SettingsContext";

interface OrderHeaderPrintProps {
  order: ServiceOrder;
  customerProduct: CustomerProduct | null;
}

const OrderHeaderPrint: React.FC<OrderHeaderPrintProps> = ({ order, customerProduct }) => {
  const { systemSettings } = useSettings();
  
  return (
    <div className="mb-6">
      <div className="flex flex-col border-b pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{systemSettings.companyName || "Ordem de Serviço"}</h1>
            {systemSettings.companyCode && (
              <p className="text-sm">Cód: {systemSettings.companyCode}</p>
            )}
            {systemSettings.companyDocument && (
              <p className="text-sm">CNPJ: {systemSettings.companyDocument}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold">OS Nº {order.id}</p>
            <p>Data: {formatDate(order.created_at)}</p>
            <p>Status: {order.status}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
          <div>
            {systemSettings.responsibleName && (
              <p>Responsável: {systemSettings.responsibleName}</p>
            )}
            {systemSettings.phone && (
              <p>Tel: {systemSettings.phone}</p>
            )}
            {systemSettings.email && (
              <p>E-mail: {systemSettings.email}</p>
            )}
          </div>
          <div className="text-right">
            {(systemSettings.address || systemSettings.addressNumber) && (
              <p>{systemSettings.address}{systemSettings.addressNumber ? `, ${systemSettings.addressNumber}` : ""}</p>
            )}
            {(systemSettings.neighborhood || systemSettings.city || systemSettings.state) && (
              <p>
                {systemSettings.neighborhood ? `${systemSettings.neighborhood}, ` : ""}
                {systemSettings.city}{systemSettings.state ? ` - ${systemSettings.state}` : ""}
              </p>
            )}
            {systemSettings.postalCode && (
              <p>CEP: {systemSettings.postalCode}</p>
            )}
            {systemSettings.businessHours && (
              <p>Horário: {systemSettings.businessHours}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeaderPrint;
