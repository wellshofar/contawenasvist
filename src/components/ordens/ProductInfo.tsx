
import React from "react";
import { ProductInfoProps } from "./types";

const ProductInfo: React.FC<ProductInfoProps> = ({ product, customerProduct }) => {
  return (
    <div className="border-b pb-4 mb-6">
      <h2 className="font-bold text-lg mb-2">Dados do Equipamento</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><span className="font-semibold">Equipamento:</span> {product?.name || "-"}</p>
          <p><span className="font-semibold">Modelo:</span> {product?.model || "-"}</p>
          <p><span className="font-semibold">Data de Instalação:</span> {customerProduct?.installation_date ? new Date(customerProduct.installation_date).toLocaleDateString("pt-BR") : "-"}</p>
        </div>
        <div className="text-right">
          <p><span className="font-semibold">Descrição:</span> {product?.description || "-"}</p>
          <p><span className="font-semibold">Próxima Manutenção:</span> {customerProduct?.next_maintenance_date ? new Date(customerProduct.next_maintenance_date).toLocaleDateString("pt-BR") : "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
