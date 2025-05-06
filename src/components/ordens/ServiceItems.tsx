
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServiceItemsProps } from "./types";

const ServiceItems: React.FC<ServiceItemsProps> = ({ serviceItems }) => {
  // Calculate total quantity and value
  const totalQuantity = serviceItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = serviceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  return (
    <div className="mb-6">
      <h2 className="font-bold text-lg mb-2">Peças/Serviços da O.S.</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ref. Produto</TableHead>
            <TableHead>Peça/Serviço da O.S.</TableHead>
            <TableHead className="text-right">Qtde</TableHead>
            <TableHead className="text-right">Valor Unit.</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceItems.length > 0 ? (
            serviceItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell className="text-right">
                  {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Nenhum item de serviço registrado</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={2} className="text-right font-semibold">TOTAL:</TableCell>
            <TableCell className="text-right font-semibold">{totalQuantity}</TableCell>
            <TableCell className="text-right font-semibold"></TableCell>
            <TableCell className="text-right font-semibold">
              {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceItems;
