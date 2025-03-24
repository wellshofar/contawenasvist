
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } 
          />
          <Route 
            path="/clientes" 
            element={
              <AppLayout>
                <Clientes />
              </AppLayout>
            } 
          />
          <Route 
            path="/produtos" 
            element={
              <AppLayout>
                <Produtos />
              </AppLayout>
            } 
          />
          {/* Placeholder routes for future implementation */}
          <Route 
            path="/ordens" 
            element={
              <AppLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold mb-2">Ordens de Serviço</h1>
                  <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
                </div>
              </AppLayout>
            } 
          />
          <Route 
            path="/agendamentos" 
            element={
              <AppLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold mb-2">Agendamentos</h1>
                  <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
                </div>
              </AppLayout>
            } 
          />
          <Route 
            path="/configuracoes" 
            element={
              <AppLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                  <h1 className="text-2xl font-bold mb-2">Configurações</h1>
                  <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
                </div>
              </AppLayout>
            } 
          />
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
