
import { ServiceOrder, Customer, Product, CustomerProduct } from "@/types/supabase";
import { jsPDF } from "jspdf";

// Augment jsPDF to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: any;
    previousAutoTable?: {
      finalY?: number;
    };
  }
}

export interface ServiceItem {
  id: string;
  code?: string;
  name?: string;
  description: string;
  quantity: number;
}

export interface OrdemServicoViewProps {
  order: ServiceOrder;
  customer: Customer;
  customerProduct: CustomerProduct | null;
  product: Product | null;
  serviceItems: ServiceItem[];
  onBack: () => void;
  onDelete?: (id: string) => void;
}

export interface OrderHeaderProps {
  order: {
    id: string;
    title?: string;
  };
  handlePrint: () => void;
  handleDownloadPDF: () => void;
  onBack: () => void;
}

export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
