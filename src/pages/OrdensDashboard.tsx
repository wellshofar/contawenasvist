
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceOrder } from "@/types/supabase";
import OrdemServicoView from "@/components/ordens/OrdemServicoView";
import OrdensHeader from "@/components/ordens/OrdensHeader";
import OrdensSearch from "@/components/ordens/OrdensSearch";
import OrdensTable from "@/components/ordens/OrdensTable";
import OrdemServicoForm from "@/components/ordens/OrdemServicoForm";
import { mockOrders, mockCustomers, mockCustomerProducts, mockProducts, mockServiceItems } from "@/components/ordens/mockData";
import { getCustomerName } from "@/components/ordens/utils";
import { supabase } from "@/integrations/supabase/client";
import { ServiceItem } from "@/components/ordens/types";
import { extractServiceItems } from "@/components/ordens/services/orderService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const OrdensDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [showOrderView, setShowOrderView] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<ServiceOrder[]>(mockOrders);
  const [allOrders, setAllOrders] = useState<ServiceOrder[]>(mockOrders);
  const [orderServiceItems, setOrderServiceItems] = useState<ServiceItem[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("service_orders")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }
        
        if (data) {
          setAllOrders(data);
          setFilteredOrders(data);
        }
      } catch (error) {
        console.error("Error in fetchOrders:", error);
      }
    };
    
    fetchOrders();
  }, []);

  // Fetch service items for the selected order
  useEffect(() => {
    const loadServiceItems = async () => {
      if (selectedOrder) {
        try {
          // Try to extract service items from the order description
          const items = await extractServiceItems(selectedOrder);
          if (items.length > 0) {
            setOrderServiceItems(items);
            return;
          }
          
          // Fallback to mock data if no items were found
          const mockItems = selectedOrder.customer_product_id ? 
            mockServiceItems.filter(item => {
              const customerProduct = mockCustomerProducts.find(cp => cp.id === selectedOrder.customer_product_id);
              return customerProduct && item.productId === customerProduct.product_id;
            }) : [];
          setOrderServiceItems(mockItems);
        } catch (error) {
          console.error("Error loading service items:", error);
          setOrderServiceItems([]);
        }
      }
    };
    
    loadServiceItems();
  }, [selectedOrder]);

  // We need to refresh orders when returning from order view/form
  useEffect(() => {
    if (!showOrderView && !showOrderForm) {
      const fetchOrders = async () => {
        try {
          const { data, error } = await supabase
            .from("service_orders")
            .select("*")
            .order("created_at", { ascending: false });
            
          if (error) {
            console.error("Error fetching orders:", error);
            return;
          }
          
          if (data) {
            setAllOrders(data);
            setFilteredOrders(data);
          }
        } catch (error) {
          console.error("Error in fetchOrders:", error);
        }
      };
      
      fetchOrders();
    }
  }, [showOrderView, showOrderForm]);
  
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredOrders(allOrders);
      return;
    }
    
    // Filter based only on the fields we have directly available
    const filtered = allOrders.filter(order => 
      order.id.toLowerCase().includes(term) ||
      order.title.toLowerCase().includes(term) ||
      (order.status && order.status.toLowerCase().includes(term))
    );
    
    setFilteredOrders(filtered);
  };
  
  const handleOrderClick = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setShowOrderView(true);
    setShowOrderForm(false);
  };
  
  const handleCloseOrderView = () => {
    setShowOrderView(false);
  };
  
  const handleNewOrder = () => {
    setShowOrderForm(true);
    setShowOrderView(false);
    setSelectedOrder(null);
  };
  
  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
  };
  
  const handleDeleteOrder = (id: string) => {
    setOrderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    try {
      const { error } = await supabase
        .from("service_orders")
        .delete()
        .eq("id", orderToDelete);
        
      if (error) throw error;
      
      toast({
        title: "Ordem removida",
        description: "Ordem de serviço removida com sucesso."
      });
      
      // Refresh the orders list
      const { data, error: fetchError } = await supabase
        .from("service_orders")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (!fetchError && data) {
        setAllOrders(data);
        setFilteredOrders(data);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Erro ao remover ordem",
        description: "Não foi possível remover a ordem de serviço.",
        variant: "destructive"
      });
    } finally {
      setOrderToDelete(null);
      setDeleteDialogOpen(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {!showOrderView && !showOrderForm ? (
        <>
          <OrdensHeader 
            selectedOrder={selectedOrder} 
            setShowOrderView={setShowOrderView} 
            orders={filteredOrders}
            onNewOrder={handleNewOrder}
          />
          
          <Card>
            <CardContent className="p-6">
              <OrdensSearch 
                searchTerm={searchTerm} 
                onSearchChange={handleSearchInput} 
              />
              
              <OrdensTable 
                orders={filteredOrders} 
                onOrderClick={handleOrderClick}
                onDeleteOrder={handleDeleteOrder}
              />
            </CardContent>
          </Card>
        </>
      ) : showOrderView && selectedOrder ? (
        <OrdemServicoView 
          order={selectedOrder}
          customer={mockCustomers.find(c => c.id === selectedOrder.customer_id) || mockCustomers[0]}
          customerProduct={selectedOrder.customer_product_id ? 
            mockCustomerProducts.find(cp => cp.id === selectedOrder.customer_product_id) || null : null}
          product={selectedOrder.customer_product_id ? 
            mockProducts.find(p => {
              const customerProduct = mockCustomerProducts.find(cp => cp.id === selectedOrder.customer_product_id);
              return customerProduct && p.id === customerProduct.product_id;
            }) || null : null}
          serviceItems={orderServiceItems}
          onBack={handleCloseOrderView}
          onDelete={handleDeleteOrder}
        />
      ) : showOrderForm ? (
        <OrdemServicoForm onCancel={handleCloseOrderForm} />
      ) : null}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteOrder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrdensDashboard;
