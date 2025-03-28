
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Produtos from "./pages/Produtos";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/clientes" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Clientes />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/produtos" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Produtos />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Placeholder routes for future implementation */}
            <Route 
              path="/ordens" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="min-h-[60vh] flex flex-col items-center justify-center">
                      <h1 className="text-2xl font-bold mb-2">Ordens de Serviço</h1>
                      <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/agendamentos" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="min-h-[60vh] flex flex-col items-center justify-center">
                      <h1 className="text-2xl font-bold mb-2">Agendamentos</h1>
                      <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/configuracoes" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="min-h-[60vh] flex flex-col items-center justify-center">
                      <h1 className="text-2xl font-bold mb-2">Configurações</h1>
                      <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Root redirect to dashboard */}
            <Route path="" element={<Navigate to="/" replace />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
