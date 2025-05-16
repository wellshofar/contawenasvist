
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Printer } from "lucide-react";

interface OrderActionButtonsProps {
  onPrint: () => void;
  onDownloadPDF: () => void;
  onBack: () => void;
  orderId: string;
}

const OrderActionButtons: React.FC<OrderActionButtonsProps> = ({
  onPrint,
  onDownloadPDF,
  onBack,
  orderId,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Ordem de Serviço {orderId}</h1>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onPrint}>
          <Printer className="mr-2 h-4 w-4" /> Imprimir
        </Button>
        <Button variant="outline" onClick={onDownloadPDF}>
          <FileDown className="mr-2 h-4 w-4" /> PDF
        </Button>
      </div>
    </div>
  );
};

export default OrderActionButtons;
