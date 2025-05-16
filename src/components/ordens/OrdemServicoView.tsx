
import React, { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceOrder, Customer, Product, CustomerProduct } from "@/types/supabase";
import { ServiceItem, OrdemServicoViewProps } from "./types";
import { generateServiceOrderPDF } from "./PdfGenerator";
import PrintStyles from "./PrintStyles";
import OrderActionButtons from "./OrderActionButtons";
import OrderDetailContent from "./OrderDetailContent";
import DeleteOrderDialog from "./DeleteOrderDialog";

const OrdemServicoView: React.FC<OrdemServicoViewProps> = ({
  order,
  customer,
  customerProduct,
  product,
  serviceItems,
  onBack,
  onDelete
}) => {
  const { systemSettings } = useSettings();
  const { user, profile } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cleanDescription, setCleanDescription] = useState("");
  
  // Parse and clean up the description when component loads
  useEffect(() => {
    if (order.description) {
      // Try to extract service items JSON from the description
      const regex = /\{.*"items":\s*\[.*\].*"__metadata":\s*\{\s*"type":\s*"serviceItems"\s*\}\}/s;
      const match = order.description.match(regex);
      
      if (match) {
        // Remove the JSON from the description to show only the actual text
        const cleanText = order.description.replace(match[0], "").trim();
        setCleanDescription(cleanText);
      } else {
        setCleanDescription(order.description);
      }
    }
  }, [order.description]);

  useEffect(() => {
    // Ensure the content is loaded before allowing print
    document.body.classList.add('print-ready');
    return () => {
      document.body.classList.remove('print-ready');
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      // Create a complete ServiceOrder object from the order prop
      const completeOrder: ServiceOrder = {
        id: order.id,
        title: order.title,
        description: order.description || null,
        customer_id: order.customer_id,
        customer_product_id: order.customer_product_id,
        status: order.status,
        scheduled_date: order.scheduled_date,
        completed_date: order.completed_date || null,
        assigned_to: order.assigned_to,
        created_at: order.created_at,
        updated_at: order.updated_at,
        created_by: order.created_by
      };

      // Create complete objects for the other parameters
      const completeCustomer: Customer = {
        id: customer.id || '', 
        name: customer.name,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        document: customer.document,
        postal_code: customer.postal_code,
        email: customer.email || null,
        phone: customer.phone || null,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        created_by: customer.created_by || null
      };

      let completeCustomerProduct: CustomerProduct | null = null;
      
      if (customerProduct) {
        completeCustomerProduct = {
          id: customerProduct.id,
          customer_id: customerProduct.customer_id,
          product_id: customerProduct.product_id,
          installation_date: customerProduct.installation_date,
          next_maintenance_date: customerProduct.next_maintenance_date,
          notes: customerProduct.notes,
          created_at: customerProduct.created_at,
          updated_at: customerProduct.updated_at,
          created_by: customerProduct.created_by
        };
      }

      // Only proceed if we have a product
      if (!product) {
        console.error("Cannot generate PDF: Product is undefined");
        return;
      }

      const completeProduct: Product = {
        id: product.id || '', 
        name: product.name,
        model: product.model,
        description: product.description || null,
        maintenance_interval_days: product.maintenance_interval_days || 0,
        created_at: product.created_at || '',
        updated_at: product.updated_at || '',
        created_by: product.created_by || null
      };

      // Only proceed if we have a valid customerProduct
      if (!completeCustomerProduct) {
        console.error("Cannot generate PDF: Customer product is undefined");
        return;
      }

      const doc = generateServiceOrderPDF(
        completeOrder, 
        completeCustomer, 
        completeCustomerProduct, 
        completeProduct, 
        serviceItems,
        systemSettings
      );
      
      doc.save(`ordem_servico_${order.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDescriptionUpdate = (updatedDesc: string, cleanDesc: string) => {
    order.description = updatedDesc;
    setCleanDescription(cleanDesc);
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(order.id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-6">
        <OrderActionButtons 
          orderId={order.id} 
          onPrint={handlePrint} 
          onDownloadPDF={handleDownloadPDF} 
          onBack={onBack} 
        />

        <div className="print:block">
          <OrderDetailContent 
            order={order}
            customer={customer}
            customerProduct={customerProduct}
            product={product}
            serviceItems={serviceItems}
            cleanDescription={cleanDescription}
            onDescriptionUpdate={handleDescriptionUpdate}
            onDeleteClick={handleDeleteClick}
          />
        </div>
      </div>

      <DeleteOrderDialog 
        isOpen={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        onConfirm={handleConfirmDelete} 
      />

      <PrintStyles />
    </>
  );
};

export default OrdemServicoView;
