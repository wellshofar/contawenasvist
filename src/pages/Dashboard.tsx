
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Calendar, ClipboardCheck, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchDashboardStats, 
  fetchRecentOrders, 
  fetchUpcomingMaintenance,
  fetchOrdersByStatus,
  fetchProductDistribution
} from "@/components/ordens/services/orderService";
import { useToast } from "@/hooks/use-toast";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

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
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
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
        
        // Fetch dashboard statistics
        const statsData = await fetchDashboardStats();
        setStats([
          { title: "Clientes", value: statsData.clientCount.toString(), icon: Users, color: "bg-blue-50 text-blue-500", link: "/clientes" },
          { title: "Produtos", value: statsData.productCount.toString(), icon: Package, color: "bg-purple-50 text-purple-500", link: "/produtos" },
          { title: "Ordens de Serviço", value: statsData.orderCount.toString(), icon: ClipboardCheck, color: "bg-amber-50 text-amber-500", link: "/ordens" },
          { title: "Agendamentos", value: statsData.appointmentCount.toString(), icon: Calendar, color: "bg-emerald-50 text-emerald-500", link: "/agendamentos" },
        ]);
        
        // Fetch recent orders
        const orders = await fetchRecentOrders();
        setRecentOrders(orders);
        
        // Fetch upcoming maintenance
        const maintenance = await fetchUpcomingMaintenance();
        setUpcomingMaintenance(maintenance);
        
        // Fetch orders by status for pie chart
        const statusData = await fetchOrdersByStatus();
        setOrdersByStatus(statusData);
        
        // Fetch product distribution for bar chart
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
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Link to={stat.link} key={index} className="transition-all duration-300 hover:scale-105">
                <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: stat.color.split(' ')[1].replace('text-', 'var(--') + ')' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-full`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution Pie Chart */}
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Distribuição de Status</CardTitle>
                <CardDescription>Status das ordens de serviço</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {ordersByStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-[300px] text-muted-foreground">
                    Sem dados disponíveis
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Distribution Bar Chart */}
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Produtos Mais Comuns</CardTitle>
                <CardDescription>Os produtos mais instalados nos clientes</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                {productDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={productDistribution}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={70} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Quantidade" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-[300px] text-muted-foreground">
                    Sem dados disponíveis
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Ordens de Serviço Recentes</CardTitle>
                  <CardDescription>Últimas ordens de serviço registradas no sistema</CardDescription>
                </div>
                <Link 
                  to="/ordens" 
                  className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                >
                  Ver todas <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-accent/20 p-2 rounded-md transition-colors">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{order.id}</span>
                          <span className="text-sm text-muted-foreground">• {order.client}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{order.product}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-3">{order.date}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhuma ordem de serviço registrada
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Próximas Manutenções</CardTitle>
                  <CardDescription>Manutenções programadas para os próximos dias</CardDescription>
                </div>
                <Link 
                  to="/agendamentos" 
                  className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                >
                  Ver todas <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMaintenance.length > 0 ? upcomingMaintenance.map((maintenance, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-accent/20 p-2 rounded-md transition-colors">
                      <div className="flex flex-col">
                        <span className="font-semibold">{maintenance.client}</span>
                        <span className="text-sm text-muted-foreground">{maintenance.product}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">{maintenance.date}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhuma manutenção programada
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
