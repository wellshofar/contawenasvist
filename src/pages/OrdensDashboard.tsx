
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Printer, 
  Download, 
  Plus, 
  BarChart, 
  ClipboardList,
  Search,
  Filter 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceOrder, Customer, Product, CustomerProduct } from "@/types/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OrdemServicoView from "@/components/ordens/OrdemServicoView";

// Mock data for demonstration purposes
const mockCustomers: Customer[] = [
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

const mockProducts: Product[] = [
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

const mockCustomerProducts: CustomerProduct[] = [
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

// Mock service items (peças/serviços)
const mockServiceItems = [
  { id: "1", productId: "2", code: "6918", name: "DISPOSITIVO FILTRANTE MEMB. UF 400/14003 FID", quantity: 1 },
  { id: "2", productId: "2", code: "6914", name: "DISPOSITIVO FILT. PRE CARBON 400/14003- FIDEL", quantity: 1 },
  { id: "3", productId: "2", code: "6921", name: "DISPOSITIVO FILT POS CARBON 5''/93/14003 FIDEL", quantity: 1 },
  { id: "4", productId: "2", code: "6912", name: "DISPOSITIVO FILT. SEDIMENTO HK 400/14003-FIDE", quantity: 1 },
];

const mockOrders: ServiceOrder[] = [
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

const OrdensDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [showOrderView, setShowOrderView] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term) {
      setFilteredOrders(mockOrders);
      return;
    }
    
    const filtered = mockOrders.filter(order => 
      order.id.toLowerCase().includes(term.toLowerCase()) ||
      order.title.toLowerCase().includes(term.toLowerCase()) ||
      mockCustomers.find(c => c.id === order.customer_id)?.name.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredOrders(filtered);
  };
  
  const handleOrderClick = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setShowOrderView(true);
  };
  
  const handleCloseOrderView = () => {
    setShowOrderView(false);
  };
  
  const getCustomerName = (customerId: string) => {
    return mockCustomers.find(customer => customer.id === customerId)?.name || "Cliente não encontrado";
  };
  
  const getProductName = (customerProductId: string | null) => {
    if (!customerProductId) return "Produto não especificado";
    
    const customerProduct = mockCustomerProducts.find(cp => cp.id === customerProductId);
    if (!customerProduct) return "Produto não encontrado";
    
    const product = mockProducts.find(p => p.id === customerProduct.product_id);
    return product ? product.name : "Produto não encontrado";
  };

  const downloadExampleCSV = () => {
    // In a real implementation, we would generate a CSV here
    const csvContent = "ID,Cliente,Produto,Data,Status,Técnico\n" +
                     filteredOrders.map(order => 
                       `${order.id},${getCustomerName(order.customer_id)},${getProductName(order.customer_product_id)},${new Date(order.scheduled_date || "").toLocaleDateString("pt-BR")},${order.status},${order.assigned_to || "Não atribuído"}`
                     ).join("\n");
                     
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ordens_servico_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      {!showOrderView ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
              <p className="text-muted-foreground mt-1">Gerencie as ordens de serviço no sistema.</p>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" /> Relatórios
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => selectedOrder && setShowOrderView(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Visualizar ordem de serviço
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadExampleCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Nova Ordem
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar ordens de serviço..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> Filtrar
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Data Agendada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} onClick={() => handleOrderClick(order)} className="cursor-pointer">
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{getCustomerName(order.customer_id)}</TableCell>
                        <TableCell>{getProductName(order.customer_product_id)}</TableCell>
                        <TableCell>{order.scheduled_date ? new Date(order.scheduled_date).toLocaleDateString("pt-BR") : "-"}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.assigned_to || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order);
                          }}>
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Ver</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Nenhuma ordem de serviço encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <OrdemServicoView 
          order={selectedOrder!} 
          customer={mockCustomers.find(c => c.id === selectedOrder!.customer_id)!}
          customerProduct={mockCustomerProducts.find(cp => cp.id === selectedOrder!.customer_product_id)!}
          product={mockProducts.find(p => p.id === mockCustomerProducts.find(cp => cp.id === selectedOrder!.customer_product_id)?.product_id)!}
          serviceItems={mockServiceItems.filter(item => item.productId === mockCustomerProducts.find(cp => cp.id === selectedOrder!.customer_product_id)?.product_id)}
          onBack={handleCloseOrderView}
        />
      )}
    </div>
  );
};

export default OrdensDashboard;
