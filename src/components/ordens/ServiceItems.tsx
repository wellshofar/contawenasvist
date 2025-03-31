
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServiceItemsProps } from "./types";

const ServiceItems: React.FC<ServiceItemsProps> = ({ serviceItems }) => {
  return (
    <div className="mb-6">
      <h2 className="font-bold text-lg mb-2">Peças/Serviços da O.S.</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ref. Produto</TableHead>
            <TableHead>Peça/Serviço da O.S.</TableHead>
            <TableHead className="text-right">Qtde</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceItems.length > 0 ? (
            serviceItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">Nenhum item de serviço registrado</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={2} className="text-right font-semibold">TOTAL:</TableCell>
            <TableCell className="text-right font-semibold">{serviceItems.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceItems;
