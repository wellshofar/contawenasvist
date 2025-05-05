
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, Calendar, ClipboardCheck } from "lucide-react";

interface StatsItem {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  link: string;
}

interface DashboardStatsProps {
  stats: StatsItem[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
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
  );
};

export default DashboardStats;
