
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrdemServicoViewProps } from "./types";
import OrderHeader from "./OrderHeader";
import OrderHeaderPrint from "./OrderHeaderPrint";
import OrderInfo from "./OrderInfo";
import CustomerInfo from "./CustomerInfo";
import ProductInfo from "./ProductInfo";
import ServiceItems from "./ServiceItems";
import SignatureFields from "./SignatureFields";
import FooterInfo from "./FooterInfo";
import PrintStyles from "./PrintStyles";
import { generateServiceOrderPDF } from "./PdfGenerator";
import { ServiceOrder, Customer, Product, CustomerProduct } from "@/types/supabase";
import { Edit, Save } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";

const OrdemServicoView: React.FC<OrdemServicoViewProps> = ({
  order,
  customer,
  customerProduct,
  product,
  serviceItems,
  onBack
}) => {
  const { toast } = useToast();
  const { systemSettings } = useSettings();
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(order.description || "");
  const [isSaving, setIsSaving] = useState(false);

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
        id: customer.id || '', // Add missing id property with default
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
        created_by: customer.created_by || null // Add missing created_by property with default
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
        id: product.id || '', // Add missing id property with default
        name: product.name,
        model: product.model,
        description: product.description || null, // Add missing description property with default
        maintenance_interval_days: product.maintenance_interval_days || 0, // Add missing maintenance_interval_days property with default
        created_at: product.created_at || '', // Add missing created_at property with default
        updated_at: product.updated_at || '', // Add missing updated_at property with default
        created_by: product.created_by || null // Add missing created_by property with default
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

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveDescription = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("service_orders")
        .update({ description: editedDescription })
        .eq("id", order.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Ordem de serviço atualizada com sucesso.",
      });

      // Update the local order object
      order.description = editedDescription;
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating service order:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a ordem de serviço.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Component for the editable description
  const OrderDescription = () => (
    <div className="mb-6 border-b pb-4 print:mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-lg">Detalhes do Atendimento</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={isEditing ? handleSaveDescription : handleToggleEdit}
          className="flex items-center gap-1 print:hidden"
          disabled={isSaving}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Editar
            </>
          )}
        </Button>
      </div>
      
      {isEditing ? (
        <Textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="min-h-[200px] font-mono print:hidden"
        />
      ) : (
        <div className="whitespace-pre-wrap">
          {editedDescription || "Nenhum detalhe informado."}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="flex flex-col space-y-6">
        <OrderHeader
          order={order}
          handlePrint={handlePrint}
          handleDownloadPDF={handleDownloadPDF}
          onBack={onBack}
        />

        <div className="print:block">
          <Card className="p-6 print:shadow-none print:border-none">
            <div className="a4-page">
              {/* Header */}
              <OrderHeaderPrint order={order} customerProduct={customerProduct} />

              {/* Order Info */}
              <OrderInfo order={order} customerProduct={customerProduct} />

              {/* Customer Info */}
              <CustomerInfo customer={customer} />

              {/* Product Info */}
              {product && <ProductInfo product={product} customerProduct={customerProduct} />}

              {/* Order Description (Editable) */}
              <OrderDescription />

              {/* Service Items */}
              <ServiceItems serviceItems={serviceItems} />

              {/* Signature fields */}
              <SignatureFields />

              {/* Footer Info */}
              <FooterInfo />
            </div>
          </Card>
        </div>
      </div>

      <PrintStyles />
    </>
  );
};

export default OrdemServicoView;
