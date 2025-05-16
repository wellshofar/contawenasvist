
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServiceOrder } from "@/types/supabase";
import { FileText, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerName, useProductName } from "./utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OrdensTableProps {
  orders: ServiceOrder[];
  onOrderClick: (order: ServiceOrder) => void;
  onDeleteOrder?: (id: string) => void;
}

// Customer name component to handle async loading
const CustomerName = ({ customerId }: { customerId: string }) => {
  const name = useCustomerName(customerId);
  return <>{name}</>;
};

// Product name component to handle async loading
const ProductName = ({ customerProductId }: { customerProductId: string | null }) => {
  const name = useProductName(customerProductId);
  return <>{name}</>;
};

const OrdensTable: React.FC<OrdensTableProps> = ({ orders, onOrderClick, onDeleteOrder }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOrderIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderIdToDelete && onDeleteOrder) {
      onDeleteOrder(orderIdToDelete);
      setOrderIdToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
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
                <TableCell><CustomerName customerId={order.customer_id} /></TableCell>
                <TableCell><ProductName customerProductId={order.customer_product_id} /></TableCell>
                <TableCell>{order.scheduled_date ? new Date(order.scheduled_date).toLocaleDateString("pt-BR") : "-"}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.assigned_to || "-"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Ações</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onOrderClick(order);
                      }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </DropdownMenuItem>
                      {onDeleteOrder && (
                        <DropdownMenuItem 
                          onClick={(e) => handleDeleteClick(e, order.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrdensTable;
