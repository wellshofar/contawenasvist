
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductInfoProps } from "./types";

const ProductInfo: React.FC<ProductInfoProps> = ({ product, customerProduct }) => {
  return (
    <div className="mb-6">
      <h2 className="font-bold text-lg mb-2">Produto do Cliente</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Referência</TableHead>
            <TableHead>Produto do Cliente</TableHead>
            <TableHead>Cômodo/Setor</TableHead>
            <TableHead>Data Compra</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>{product.model} - {product.name}</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{customerProduct.installation_date ? new Date(customerProduct.installation_date).toLocaleDateString("pt-BR") : "-"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductInfo;
