
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchDashboardStats, 
  fetchRecentOrders, 
  fetchUpcomingMaintenance,
  fetchOrdersByStatus,
  fetchProductDistribution
} from "@/components/ordens/services/orderService";
import { Users, Package, Calendar, ClipboardCheck } from "lucide-react";

// Import components
import DashboardStats from "@/components/dashboard/DashboardStats";
import StatusDistributionChart from "@/components/dashboard/StatusDistributionChart";
import ProductDistributionChart from "@/components/dashboard/ProductDistributionChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import UpcomingMaintenance from "@/components/dashboard/UpcomingMaintenance";
import DashboardLoader from "@/components/dashboard/DashboardLoader";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // State for dashboard data
  const [stats, setStats] = useState([
    { title: "Clientes", value: "0", icon: Users, color: "bg-blue-50 text-blue-500", link: "/clientes" },
    { title: "Produtos", value: "0", icon: Package, color: "bg-purple-50 text-purple-500", link: "/produtos" },
    { title: "Ordens de Serviço", value: "0", icon: ClipboardCheck, color: "bg-amber-50 text-amber-500", link: "/ordens" },
    { title: "Agendamentos", value: "0", icon: Calendar, color: "bg-emerald-50 text-emerald-500", link: "/agendamentos" },
  ]);
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [productDistribution, setProductDistribution] = useState<any[]>([]);
  
  // Status colors
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'concluído': return 'bg-green-50 text-green-600';
      case 'agendado': return 'bg-blue-50 text-blue-600';
      case 'em andamento': return 'bg-amber-50 text-amber-600';
      case 'pendente': return 'bg-gray-50 text-gray-600';
      case 'cancelado': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard statistics - real data only
        const statsData = await fetchDashboardStats();
        setStats([
          { title: "Clientes", value: statsData.clientCount.toString(), icon: Users, color: "bg-blue-50 text-blue-500", link: "/clientes" },
          { title: "Produtos", value: statsData.productCount.toString(), icon: Package, color: "bg-purple-50 text-purple-500", link: "/produtos" },
          { title: "Ordens de Serviço", value: statsData.orderCount.toString(), icon: ClipboardCheck, color: "bg-amber-50 text-amber-500", link: "/ordens" },
          { title: "Agendamentos", value: statsData.appointmentCount.toString(), icon: Calendar, color: "bg-emerald-50 text-emerald-500", link: "/agendamentos" },
        ]);
        
        // Fetch real data for recent orders
        const orders = await fetchRecentOrders();
        setRecentOrders(orders);
        
        // Fetch real data for upcoming maintenance
        const maintenance = await fetchUpcomingMaintenance();
        setUpcomingMaintenance(maintenance);
        
        // Fetch real data for orders by status for pie chart
        const statusData = await fetchOrdersByStatus();
        setOrdersByStatus(statusData);
        
        // Fetch real data for product distribution for bar chart
        const productData = await fetchProductDistribution();
        setProductDistribution(productData);
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 
          Aqui está a visão geral do sistema de gerenciamento de serviços HOKEN.
        </p>
      </div>

      {loading ? (
        <DashboardLoader />
      ) : (
        <>
          <DashboardStats stats={stats} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusDistributionChart ordersByStatus={ordersByStatus} />
            <ProductDistributionChart productDistribution={productDistribution} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentOrders 
              recentOrders={recentOrders} 
              getStatusColor={getStatusColor} 
            />
            <UpcomingMaintenance upcomingMaintenance={upcomingMaintenance} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
