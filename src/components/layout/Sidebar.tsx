
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Users, Package, ClipboardCheck, Calendar, Settings, Home, User, KeyRound, Globe, Building } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  // Navigation items with routes
  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Clientes", path: "/clientes" },
    { icon: Package, label: "Produtos", path: "/produtos" },
    { icon: ClipboardCheck, label: "Ordens de Serviço", path: "/ordens" },
    { icon: Calendar, label: "Agendamentos", path: "/agendamentos" },
    { icon: Settings, label: "Configurações", path: "/configuracoes" },
  ];

  return (
    <SidebarComponent>
      <div className="py-6 flex items-center justify-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className="font-semibold text-xl">HOKEN</span>
        </Link>
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-2">
            MENU PRINCIPAL
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors",
                        location.pathname === item.path && "text-primary font-medium bg-primary/10 rounded-md"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="mt-auto p-4">
        <div className="glass p-4 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium mb-2">HOKEN SERVICE</p>
          <p className="text-sm font-medium">Controle de manutenções e filtros</p>
        </div>
      </div>
    </SidebarComponent>
  );
};

export default Sidebar;
