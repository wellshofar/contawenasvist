
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  customerId: string;
  customerName: string;
  customerCity?: string;
  productIds: string[] | null; // Changed to array of product IDs
  productNames?: string[]; // Changed to array of product names
  status: string;
  scheduledDate: Date;
  technicianId?: string | null;
  technicianName?: string | null;
}

export interface AppointmentFormValues {
  id?: string;
  title: string;
  description?: string;
  customerId: string;
  productIds?: string[]; // Changed to array
  status: string;
  scheduledDate: Date;
  assignedTo?: string | null;
}
