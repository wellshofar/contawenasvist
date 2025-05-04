
import React from "react";
import { CustomerInfoProps } from "./types";

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customer }) => {
  // Extract neighborhood from address if possible
  const extractNeighborhood = (address: string | null): string => {
    if (!address) return "-";
    const parts = address.split(',');
    return parts.length > 1 ? parts[1].trim() : "-";
  };
  
  const neighborhood = extractNeighborhood(customer.address);

  return (
    <div className="border-b pb-4 mb-6">
      <h2 className="font-bold text-lg mb-2">Dados do Cliente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><span className="font-semibold">Cliente:</span> {customer.name}</p>
          <p><span className="font-semibold">Endereço:</span> {customer.address || '-'}</p>
          <p><span className="font-semibold">Cidade:</span> {customer.city || '-'} - {customer.state || '-'}</p>
          <p><span className="font-semibold">Telefone:</span> {customer.phone || '-'}</p>
          <p><span className="font-semibold">Email:</span> {customer.email || '-'}</p>
        </div>
        <div className="text-right">
          <p><span className="font-semibold">CPF/CNPJ:</span> {customer.document || '-'}</p>
          <p><span className="font-semibold">Bairro:</span> {neighborhood}</p>
          <p><span className="font-semibold">CEP:</span> {customer.postal_code || '-'}</p>
          <p><span className="font-semibold">Ponto de Referência:</span> -</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
