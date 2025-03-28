
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useClientes } from "@/hooks/useClientes";
import ClienteTable from "@/components/clientes/ClienteTable";
import ClienteSearch from "@/components/clientes/ClienteSearch";
import ClienteDialog from "@/components/clientes/ClienteDialog";

const Clientes: React.FC = () => {
  const {
    clientes,
    loading,
    dialogOpen,
    setDialogOpen,
    isEditing,
    currentCliente,
    openEditDialog,
    openNewDialog,
    handleDeleteCliente,
    handleSubmit
  } = useClientes();
  
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClientes = clientes.filter(cliente => 
    cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.document && cliente.document.includes(searchTerm)) ||
    (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie os clientes cadastrados no sistema.</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openNewDialog}>
              <PlusIcon className="h-4 w-4" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <ClienteDialog 
            isEditing={isEditing}
            defaultValues={currentCliente}
            onSubmit={handleSubmit}
          />
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <ClienteSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <ClienteTable 
            clientes={filteredClientes}
            loading={loading}
            onEdit={openEditDialog}
            onDelete={handleDeleteCliente}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;
