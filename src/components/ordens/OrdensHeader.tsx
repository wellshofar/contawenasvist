
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Printer, Download, Plus } from "lucide-react";
import { ServiceOrder } from "@/types/supabase";
import { downloadExampleCSV } from "./utils";

interface OrdensHeaderProps {
  selectedOrder: ServiceOrder | null;
  setShowOrderView: (show: boolean) => void;
  orders: ServiceOrder[];
}

const OrdensHeader: React.FC<OrdensHeaderProps> = ({ selectedOrder, setShowOrderView, orders }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
        <p className="text-muted-foreground mt-1">Gerencie as ordens de serviço no sistema.</p>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Relatórios
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => selectedOrder && setShowOrderView(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Visualizar ordem de serviço
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadExampleCSV(orders)}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Nova Ordem
        </Button>
      </div>
    </div>
  );
};

export default OrdensHeader;
