
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extending the jsPDF type to include jspdf-autotable functionality
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    previousAutoTable: any;
    lastAutoTable: any;
    internal: any;
    getNumberOfPages: () => number;
  }
}

// Export necessary types that are used by other components
export interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  code: string;  // Added code property
  name: string;  // Added name property
  productId?: string; // Added productId property
}

export interface CustomerInfoProps {
  customer: {
    name: string;
    address: string;
    city: string;
    state: string;
    document: string;
    postal_code: string;
  };
}

export interface ProductInfoProps {
  product: {
    name: string;
    model: string;
  };
  customerProduct: {
    installation_date: string | null;
  };
}

export interface OrderHeaderProps {
  order: {
    id: string;
  };
  handlePrint: () => void;
  handleDownloadPDF: () => void;
  onBack: () => void;
}

export interface OrdemServicoViewProps {
  order: {
    id: string;
    title: string;
    created_at: string;
    scheduled_date: string | null;
    status: string;
    assigned_to: string | null;
    created_by: string | null;
  };
  customer: {
    name: string;
    address: string;
    city: string;
    state: string;
    document: string;
    postal_code: string;
  };
  product: {
    name: string;
    model: string;
  };
  customerProduct: {
    id: string;
    installation_date: string | null;
  };
  serviceItems: ServiceItem[];
  onBack: () => void;
}

export interface ServiceItemsProps {
  serviceItems: ServiceItem[];
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
