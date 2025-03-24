
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BellIcon, SearchIcon, UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const { toast } = useToast();

  const handleNotification = () => {
    toast({
      title: "Notificações",
      description: "Você não tem novas notificações neste momento.",
    });
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
        
        <div className="flex items-center gap-3 ml-2 bg-background p-1.5 rounded-full border">
          <div className="rounded-full bg-primary/10 p-1.5">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium mr-2 hidden sm:inline-block">Administrador</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
