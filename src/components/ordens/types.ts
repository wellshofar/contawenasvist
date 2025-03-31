
// Type definitions for PDF and service order types
import { jsPDF } from "jspdf";
import { ServiceOrder, Customer, Product, CustomerProduct } from "@/types/supabase";

// Define augmented types to handle the autoTable plugin
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => any;
    previousAutoTable?: {
      finalY: number;
    };
    internal: {
      events: any;
      scaleFactor: number;
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      pages: any[];
      getEncryptor(objectId: number): (data: string) => string;
      getNumberOfPages(): number; // Added this method which was missing
    }
  }
}

export interface ServiceItem {
  id: string;
  productId: string;
  code: string;
  name: string;
  quantity: number;
}

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

export interface ServiceItemsProps {
  serviceItems: ServiceItem[];
}

export interface SignatureFieldProps {}

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};
