
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServiceOrder } from "@/types/supabase";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCustomerName, getProductName } from "./utils";

interface OrdensTableProps {
  orders: ServiceOrder[];
  onOrderClick: (order: ServiceOrder) => void;
}

const OrdensTable: React.FC<OrdensTableProps> = ({ orders, onOrderClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Data Agendada</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Técnico</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order.id} onClick={() => onOrderClick(order)} className="cursor-pointer">
              <TableCell>{order.id}</TableCell>
              <TableCell>{getCustomerName(order.customer_id)}</TableCell>
              <TableCell>{getProductName(order.customer_product_id)}</TableCell>
              <TableCell>{order.scheduled_date ? new Date(order.scheduled_date).toLocaleDateString("pt-BR") : "-"}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.assigned_to || "-"}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  onOrderClick(order);
                }}>
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">Ver</span>
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              Nenhuma ordem de serviço encontrada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OrdensTable;
