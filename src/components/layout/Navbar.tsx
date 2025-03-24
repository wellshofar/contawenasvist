
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BellIcon, SearchIcon, UserIcon, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { toast } = useToast();
  const { user, profile, signOut } = useAuth();

  const handleNotification = () => {
    toast({
      title: "Notificações",
      description: "Você não tem novas notificações neste momento.",
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso.",
    });
  };

  const userRole = profile?.role || 'Usuário';
  const displayName = profile?.full_name || user?.email || 'Usuário';
  
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'tecnico': return 'Técnico';
      case 'atendente': return 'Atendente';
      default: return 'Usuário';
    }
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
        <div className="relative ml-4 w-64 hidden md:block">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/50 border-0 text-sm focus:ring-2 ring-primary/30 transition-all outline-none" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-muted-foreground hover:text-foreground"
          onClick={handleNotification}
        >
          <BellIcon className="h-5 w-5" />
        </Button>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 ml-2 bg-background p-1.5 rounded-full border cursor-pointer">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium mr-2 hidden sm:inline-block">{displayName}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="text-muted-foreground">
                {getRoleDisplay(userRole)}
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="text-muted-foreground">
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3 ml-2 bg-background p-1.5 rounded-full border">
            <div className="rounded-full bg-primary/10 p-1.5">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium mr-2 hidden sm:inline-block">Guest</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
