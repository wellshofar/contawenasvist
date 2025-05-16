
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Printer } from "lucide-react";
import { OrderHeaderProps } from "./types";

const OrderHeader: React.FC<OrderHeaderProps> = ({ 
  order, 
  handlePrint, 
  handleDownloadPDF, 
  onBack 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Ordem de Serviço {order.id}</h1>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir
        </Button>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <FileDown className="mr-2 h-4 w-4" /> PDF
        </Button>
      </div>
    </div>
  );
};

export default OrderHeader;
