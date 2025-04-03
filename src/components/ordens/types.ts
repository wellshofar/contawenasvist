
import { jsPDF } from "jspdf";
import { TableProps } from "jspdf-autotable";
import { PubSub } from "@/types/supabase";

// Extend the internal property of jsPDF to include getNumberOfPages
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
    autoTable: (options: TableProps) => jsPDF;
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
