
import React, { useState } from "react";
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

const OrdensDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [showOrderView, setShowOrderView] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term) {
      setFilteredOrders(mockOrders);
      return;
    }
    
    const filtered = mockOrders.filter(order => 
      order.id.toLowerCase().includes(term.toLowerCase()) ||
      order.title.toLowerCase().includes(term.toLowerCase()) ||
      getCustomerName(order.customer_id).toLowerCase().includes(term.toLowerCase())
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
                onSearchChange={handleSearch} 
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
          customer={mockCustomers.find(c => c.id === selectedOrder.customer_id)!}
          customerProduct={mockCustomerProducts.find(cp => cp.id === selectedOrder.customer_product_id)!}
          product={mockProducts.find(p => p.id === mockCustomerProducts.find(cp => cp.id === selectedOrder.customer_product_id)?.product_id)!}
          serviceItems={mockServiceItems.filter(item => item.productId === mockCustomerProducts.find(cp => cp.id === selectedOrder.customer_product_id)?.product_id)}
          onBack={handleCloseOrderView}
        />
      ) : showOrderForm ? (
        <OrdemServicoForm />
      ) : null}
    </div>
  );
};

export default OrdensDashboard;
