
import { z } from "zod";
import { Customer, Product, CustomerProduct } from "@/types/supabase";

// Define the form schema for service orders
export const formSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  customerId: z.string({ required_error: "Selecione um cliente" }),
  status: z.string().default("pending"),
  scheduledDate: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

// Define a type for customer products with joined product data
export type CustomerProductWithDetails = CustomerProduct & {
  product?: Product;
};

// Props interface for the form
export interface OrdemServicoFormProps {
  onCancel?: () => void;
}
