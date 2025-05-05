
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  customerId: string;
  customerName: string;
  customerCity?: string;
  productIds: string[] | null;
  productNames?: string[];
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
  productIds?: string[];
  status: string;
  scheduledDate: Date;
  assignedTo?: string | null;
}
