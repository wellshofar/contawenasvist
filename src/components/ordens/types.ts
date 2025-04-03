
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extending the jsPDF type to include jspdf-autotable functionality
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    previousAutoTable: any;
    lastAutoTable: any;
    getNumberOfPages: () => number;
  }
}

// Export necessary types that are used by other components
export interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface CustomerInfoProps {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface ProductInfoProps {
  name: string;
  model: string;
}

export interface OrderHeaderProps {
  orderNumber: string;
  date: string;
  printMode?: boolean;
}

export interface OrdemServicoViewProps {
  orderData: {
    id: string;
    number: string;
    date: string;
    customer: CustomerInfoProps;
    product: ProductInfoProps;
    items: ServiceItem[];
    technicalReport: string;
    customerSignature: string | null;
    technicianSignature: string | null;
  };
  printMode?: boolean;
}

export interface ServiceItemsProps {
  items: ServiceItem[];
}

export interface SignatureFieldProps {
  title: string;
  signature: string | null;
  onSign?: () => void;
}

// Helper function to format dates consistently
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
};
