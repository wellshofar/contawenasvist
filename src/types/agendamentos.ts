
export interface Appointment {
  id: string;
  title: string;
  description: string;
  customerId: string;
  customerName: string;
  productId: string | null;
  productName: string | null;
  scheduledDate: string;
  assignedToId: string | null;
  assignedToName: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface AppointmentFormValues {
  id?: string;
  title: string;
  description: string;
  customerId: string;
  productId?: string;
  scheduledDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
