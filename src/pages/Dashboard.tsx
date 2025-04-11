
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Calendar, ClipboardCheck, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  
  // Mock data
  const stats = [
    { title: "Clientes", value: "124", icon: Users, color: "bg-blue-50 text-blue-500", link: "/clientes" },
    { title: "Produtos", value: "356", icon: Package, color: "bg-purple-50 text-purple-500", link: "/produtos" },
    { title: "Ordens de Serviço", value: "82", icon: ClipboardCheck, color: "bg-amber-50 text-amber-500", link: "/ordens" },
    { title: "Agendamentos", value: "38", icon: Calendar, color: "bg-emerald-50 text-emerald-500", link: "/agendamentos" },
  ];

  // Mock recent service orders
  const recentOrders = [
    { id: "OS-1093", client: "João Silva", product: "Purificador HOKEN H2O", date: "21/06/2023", status: "Concluído" },
    { id: "OS-1092", client: "Maria Oliveira", product: "Filtro de Água Pure100", date: "20/06/2023", status: "Agendado" },
    { id: "OS-1091", client: "Pedro Santos", product: "Purificador HOKEN MAX", date: "19/06/2023", status: "Em andamento" },
    { id: "OS-1090", client: "Ana Costa", product: "Filtro Industrial H-200", date: "18/06/2023", status: "Concluído" },
  ];

  // Mock upcoming maintenance
  const upcomingMaintenance = [
    { client: "Carlos Ferreira", product: "Purificador HOKEN Classic", date: "25/06/2023" },
    { client: "Juliana Mendes", product: "Filtro de Água HOME", date: "27/06/2023" },
    { client: "Roberto Alves", product: "Purificador HOKEN Premium", date: "28/06/2023" },
    { client: "Fernanda Lima", product: "Sistema de Filtragem Industrial", date: "01/07/2023" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 
          Aqui está a visão geral do sistema de gerenciamento de serviços HOKEN.
        </p>
      </div>

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
              {recentOrders.map((order, index) => (
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
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === "Concluído" ? "bg-green-50 text-green-600" :
                      order.status === "Agendado" ? "bg-blue-50 text-blue-600" :
                      "bg-amber-50 text-amber-600"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
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
              {upcomingMaintenance.map((maintenance, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
