
import { ServiceOrder, Customer, Product, CustomerProduct } from "@/types/supabase";
import { ServiceItem } from "./types";

// Mock customers data
export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Maria Cecilia De Camargo Pente",
    email: "maria@example.com",
    phone: "21373380033",
    address: "Rua Coronel Quirino, 857",
    city: "Campinas",
    state: "SP",
    postal_code: "13025001",
    document: "630603054804",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: "1"
  },
  {
    id: "2",
    name: "SONIA MARIA BARBOSA EVARISTO",
    email: "sonia@example.com",
    phone: "1919 38272830",
    address: "RUA DAS ORQUIDEAS, 183",
    city: "HOLAMBRA",
    state: "SP",
    postal_code: "13825000",
    document: "087.678.83/0018-12",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: "1"
  }
];

// Mock products data
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "PURIFICADOR AGUA G/Q/N CHP05 METRO UF",
    model: "5286",
    description: "Purificador de água modelo CHP05",
    maintenance_interval_days: 180,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: "1",
    categoria: "Purificadores"
  },
  {
    id: "2",
    name: "PURIFICADOR AGUA G/Q/N CHP03 MACH",
    model: "5287",
    description: "Purificador de água modelo CHP03",
    maintenance_interval_days: 180,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: "1",
    categoria: "Purificadores"
  }
];

// Mock customer products data
export const mockCustomerProducts: CustomerProduct[] = [
  {
    id: "1",
    customer_id: "1",
    product_id: "2",
    installation_date: "2009-03-07T00:00:00Z",
    next_maintenance_date: "2015-01-13T00:00:00Z",
    notes: null,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: "1"
  },
  {
    id: "2",
    customer_id: "2",
    product_id: "1",
    installation_date: "2009-09-08T00:00:00Z",
    next_maintenance_date: "2024-04-17T00:00:00Z",
    notes: null,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: "1"
  }
];

// Mock service items data
export const mockServiceItems: ServiceItem[] = [
  { id: "1", productId: "2", code: "6918", name: "DISPOSITIVO FILTRANTE MEMB. UF 400/14003 FID", quantity: 1 },
  { id: "2", productId: "2", code: "6914", name: "DISPOSITIVO FILT. PRE CARBON 400/14003- FIDEL", quantity: 1 },
  { id: "3", productId: "2", code: "6921", name: "DISPOSITIVO FILT POS CARBON 5''/93/14003 FIDEL", quantity: 1 },
  { id: "4", productId: "2", code: "6912", name: "DISPOSITIVO FILT. SEDIMENTO HK 400/14003-FIDE", quantity: 1 },
];

// Mock orders data
export const mockOrders: ServiceOrder[] = [
  {
    id: "693221",
    customer_id: "1",
    customer_product_id: "1",
    title: "ORDEM DE SERVIÇO DE MANUTENÇÃO PROGRAMADA",
    description: "REALIZAR HIGIENIZAÇÃO DO PRODUTO PURIFICADOR MACH",
    status: "Agendado",
    scheduled_date: "2015-01-13T08:23:34Z",
    completed_date: null,
    assigned_to: "Arlindo Dias Do Prado Junior",
    created_at: "2015-01-13T06:00:00Z",
    updated_at: "2015-01-13T06:00:00Z",
    created_by: "1"
  },
  {
    id: "10765627",
    customer_id: "2",
    customer_product_id: "2",
    title: "ORDEM DE SERVIÇO HIGIENIZAÇÃO",
    description: "Higienização programada",
    status: "Agendado",
    scheduled_date: "2024-04-17T12:00:00Z",
    completed_date: null,
    assigned_to: "ARLINDO DIAS DO PRADO JUNIOR",
    created_at: "2024-04-15T08:44:29Z",
    updated_at: "2024-04-15T08:44:29Z",
    created_by: "1"
  }
];
