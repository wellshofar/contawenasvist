
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

const OrdensDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [showOrderView, setShowOrderView] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<ServiceOrder[]>(mockOrders);
  const [allOrders, setAllOrders] = useState<ServiceOrder[]>(mockOrders);
  
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
  
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term) {
      setFilteredOrders(allOrders);
      return;
    }
    
    const filtered = allOrders.filter(async (order) => {
      const customerName = await getCustomerName(order.customer_id);
      return order.id.toLowerCase().includes(term.toLowerCase()) ||
             order.title.toLowerCase().includes(term.toLowerCase()) ||
             (customerName && customerName.toLowerCase().includes(term.toLowerCase()));
    });
    
    setFilteredOrders(filtered);
  };
  
  // Updated search function that doesn't use async/await in filter
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
  };
  
  const handleCloseOrderForm = () => {
    setShowOrderForm(false);
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
          serviceItems={selectedOrder.customer_product_id ? 
            mockServiceItems.filter(item => {
              const customerProduct = mockCustomerProducts.find(cp => cp.id === selectedOrder.customer_product_id);
              return customerProduct && item.productId === customerProduct.product_id;
            }) : []}
          onBack={handleCloseOrderView}
        />
      ) : showOrderForm ? (
        <OrdemServicoForm />
      ) : null}
    </div>
  );
};

export default OrdensDashboard;
