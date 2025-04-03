
import { jsPDF } from "jspdf";
import { UserOptions } from "jspdf-autotable";
import { Customer, CustomerProduct, Product, ServiceOrder } from "@/types/supabase";

// Define PubSub interface
export interface PubSub {
  publish: (eventName: string, ...args: any[]) => void;
  subscribe: (eventName: string, callback: Function) => void;
  unsubscribe: (eventName: string, callback: Function) => void;
}

// Extend the jsPDF type with the methods we need
declare module "jspdf" {
  interface jsPDF {
    internal: {
      events: PubSub;
      scaleFactor: number;
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      pages: number[];
      getEncryptor(objectId: number): (data: string) => string;
      getNumberOfPages(): number;
    };
    previousAutoTable?: {
      finalY?: number;
    };
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export interface OrdemServicoData {
  id: string;
  title: string;
  description?: string;
  customer: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    document?: string;
  };
  product?: {
    name: string;
    model?: string;
  };
  serviceItems: {
    description: string;
    quantity: number;
    value: number;
  }[];
  subtotal: number;
  discount?: number;
  total: number;
  createdAt: string;
  status: string;
  technician?: {
    name: string;
  };
  notes?: string;
  signatures?: {
    client?: string;
    technician?: string;
  };
}

export interface PdfOptions {
  showHeader?: boolean;
  showFooter?: boolean;
  showSignatures?: boolean;
  showNotes?: boolean;
}

// Component interfaces
export interface OrdemServicoViewProps {
  order: ServiceOrder;
  customer: Customer;
  customerProduct: CustomerProduct;
  product: Product;
  serviceItems: ServiceItem[];
  onBack: () => void;
}

export interface OrderHeaderProps {
  order: ServiceOrder;
  handlePrint: () => void;
  handleDownloadPDF: () => void;
  onBack: () => void;
}

export interface CustomerInfoProps {
  customer: Customer;
}

export interface ProductInfoProps {
  product: Product;
  customerProduct: CustomerProduct;
}

export interface ServiceItem {
  id: string;
  productId: string;
  code: string;
  name: string;
  quantity: number;
}

export interface ServiceItemsProps {
  serviceItems: ServiceItem[];
}

export interface SignatureFieldProps {
  // Add properties as needed
}

// Helper function to format dates
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
};
