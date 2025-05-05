
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface RecentOrder {
  id: string;
  client: string;
  product: string;
  date: string;
  status: string;
}

interface RecentOrdersProps {
  recentOrders: RecentOrder[];
  getStatusColor: (status: string) => string;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ recentOrders, getStatusColor }) => {
  return (
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
  );
};

export default RecentOrders;
