import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, 
} from "@/components/ui/dialog";
import { AgendamentoForm } from "@/components/agendamentos/AgendamentoForm";
import { useAuth } from "@/contexts/AuthContext";
import AgendamentoSearch from "@/components/agendamentos/AgendamentoSearch";
import AgendamentoActions from "@/components/agendamentos/AgendamentoActions";
import AgendamentoTable from "@/components/agendamentos/AgendamentoTable";
import EmptyAgendamentos from "@/components/agendamentos/EmptyAgendamentos";
import AgendamentoReportDialog from "@/components/relatorios/AgendamentoReportDialog";

const statusColors = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

const statusTranslations = {
  pending: "Pendente",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const Agendamentos: React.FC = () => {
  const { profile } = useAuth();
  const { 
    agendamentos, 
    loading, 
    deleteAgendamento,
    dialogOpen,
    setDialogOpen,
    isEditing,
    setIsEditing,
    currentAgendamento,
    setCurrentAgendamento
  } = useAgendamentos();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleEdit = (agendamento) => {
    setCurrentAgendamento(agendamento);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      deleteAgendamento(id);
    }
  };

  const handleNewAgendamento = () => {
    setCurrentAgendamento(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const matchesSearch = searchTerm === "" || 
      agendamento.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agendamento.description && agendamento.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === null || statusFilter === "all" || agendamento.status === statusFilter;
    
    const matchesCity = cityFilter === null || cityFilter === "all" || 
      (agendamento.customerCity && agendamento.customerCity.toLowerCase() === cityFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
        <p className="text-muted-foreground mt-1">Gerencie os agendamentos de serviços.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <AgendamentoSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          cityFilter={cityFilter}
          setCityFilter={setCityFilter}
        />

        <AgendamentoActions 
          handleNewAgendamento={handleNewAgendamento}
          setReportDialogOpen={setReportDialogOpen}
          filteredAgendamentos={filteredAgendamentos}
          statusTranslations={statusTranslations}
        />
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle>Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredAgendamentos.length > 0 ? (
            <AgendamentoTable 
              agendamentos={filteredAgendamentos}
              statusColors={statusColors}
              statusTranslations={statusTranslations}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <EmptyAgendamentos handleNewAgendamento={handleNewAgendamento} />
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Edite os detalhes do agendamento de serviço" : "Adicione um novo agendamento de serviço"}
            </DialogDescription>
          </DialogHeader>
          
          <AgendamentoForm 
            isEditing={isEditing}
            currentAgendamento={currentAgendamento}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AgendamentoReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        agendamentos={filteredAgendamentos}
        statusTranslations={statusTranslations}
      />
    </div>
  );
};

export default Agendamentos;
