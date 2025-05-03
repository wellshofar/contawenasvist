
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  customerId: string;
  customerName: string;
  customerCity?: string;
  productId: string | null;
  productName?: string;
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
  productId?: string;
  status: string;
  scheduledDate: Date;
  assignedTo?: string | null;
}
