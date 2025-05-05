
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Calendar } from "lucide-react";

interface MaintenanceItem {
  client: string;
  product: string;
  date: string;
}

interface UpcomingMaintenanceProps {
  upcomingMaintenance: MaintenanceItem[];
}

const UpcomingMaintenance: React.FC<UpcomingMaintenanceProps> = ({ upcomingMaintenance }) => {
  return (
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
  );
};

export default UpcomingMaintenance;
