
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Dashboard from './pages/Dashboard';
import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';
import Produtos from './pages/Produtos';
import OrdensDashboard from './pages/OrdensDashboard';
import ProfilePage from './pages/ProfilePage';
import Configuracoes from './pages/Configuracoes';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster";
import OrdemServicoForm from './components/ordens/OrdemServicoForm';
import Auth from './pages/Auth';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Auth defaultTab="login" />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Home page (public but redirects authenticated users) */}
            <Route path="/" element={<HomePage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/agendamentos" element={<ProtectedRoute><Agendamentos /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
            <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
            <Route path="/ordens" element={<ProtectedRoute><OrdensDashboard /></ProtectedRoute>} />
            <Route path="/ordens/new" element={<ProtectedRoute><OrdemServicoForm /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
            
            {/* Redirect /index to home page */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            
            {/* 404 page for non-existent routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
