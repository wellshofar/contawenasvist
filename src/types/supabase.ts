
export type UserRole = 'admin' | 'tecnico' | 'atendente';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  document: string | null;  // Added document field for CPF/CNPJ
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  model: string | null;
  maintenance_interval_days: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  categoria?: string;  // Added categoria as an optional field for frontend use
}

export interface CustomerProduct {
  id: string;
  customer_id: string;
  product_id: string;
  installation_date: string | null;
  next_maintenance_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface ServiceOrder {
  id: string;
  customer_id: string;
  customer_product_id: string | null;
  title: string;
  description: string | null;
  status: string;
  scheduled_date: string | null;
  completed_date: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
