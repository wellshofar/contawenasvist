
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Customer } from "@/types/supabase";

// Import our components and types
import { formSchema, FormValues, CustomerProductWithDetails, OrdemServicoFormProps } from "./forms/types";
import { ServiceItem } from "./types";
import TemplateEditor from "./forms/TemplateEditor";
import ProductSelector from "./forms/ProductSelector";
import OrderFormFields from "./forms/OrderFormFields";
import ServiceItemsForm from "./forms/ServiceItemsForm";
import { fetchCustomers, fetchCustomerProducts, createServiceOrders } from "./services/orderService";

const OrdemServicoForm: React.FC<OrdemServicoFormProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerProducts, setCustomerProducts] = useState<CustomerProductWithDetails[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [templateText, setTemplateText] = useState<string>(
    "Detalhes do atendimento:\n\n" +
    "1. Procedimentos realizados:\n\n\n" +
    "2. Peças substituídas:\n\n\n" +
    "3. Recomendações técnicas:\n\n\n" +
    "4. Observações adicionais:"
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
    },
  });

  // Handle customer selection
  const handleCustomerChange = (value: string) => {
    setSelectedCustomer(value);
    form.setValue("customerId", value);
    setSelectedProducts([]); // Reset product selection
    loadCustomerProducts(value);
  };

  // Load customer products
  const loadCustomerProducts = async (customerId: string) => {
    try {
      const data = await fetchCustomerProducts(customerId);
      setCustomerProducts(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos deste cliente.",
        variant: "destructive",
      });
    }
  };

  // Handle product selection
  const handleAddProduct = (productId: string) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Handle product removal
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
  };

  // Handle service item addition
  const handleAddServiceItem = (item: ServiceItem) => {
    setServiceItems([...serviceItems, item]);
  };

  // Handle service item removal
  const handleRemoveServiceItem = (itemId: string) => {
    setServiceItems(serviceItems.filter(item => item.id !== itemId));
  };

  // Handle template edit mode toggle
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Submit the form
  const onSubmit = async (values: FormValues) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Selecione pelo menos um produto",
        description: "É necessário selecionar pelo menos um produto para criar a ordem de serviço.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create one service order for each selected product
      const ordersToCreate = selectedProducts.map(productId => ({
        title: values.title,
        description: templateText || values.description || null,
        customer_id: values.customerId,
        customer_product_id: productId,
        status: values.status,
        scheduled_date: values.scheduledDate ? new Date(values.scheduledDate).toISOString() : null,
        created_by: user?.id || null,
        // We'll store service items in the description for now, as we don't have a separate table for them
        serviceItems: serviceItems
      }));

      await createServiceOrders(ordersToCreate, user?.id);

      toast({
        title: "Ordens de serviço criadas",
        description: `${ordersToCreate.length} ordem(ns) de serviço foram criadas com sucesso.`,
      });

      // Navigate back to orders list
      navigate("/ordens");
    } catch (error) {
      console.error("Error creating service orders:", error);
      toast({
        title: "Erro ao criar ordens de serviço",
        description: "Não foi possível criar as ordens de serviço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load customers on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes.",
          variant: "destructive",
        });
      }
    };
    
    loadCustomers();
  }, [toast]);

  // Handle cancel - use the provided onCancel prop if available, otherwise navigate back
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/ordens");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Nova Ordem de Serviço</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Ordem</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <OrderFormFields 
                form={form}
                customers={customers}
                onCustomerChange={handleCustomerChange}
              />

              <TemplateEditor
                templateText={templateText}
                editMode={editMode}
                onTemplateChange={setTemplateText}
                onToggleEditMode={toggleEditMode}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProductSelector
                  selectedCustomer={selectedCustomer}
                  customerProducts={customerProducts}
                  selectedProducts={selectedProducts}
                  onAddProduct={handleAddProduct}
                  onRemoveProduct={handleRemoveProduct}
                />
                
                <div>
                  {/* This is intentionally empty to maintain grid layout */}
                </div>
              </div>

              <ServiceItemsForm 
                serviceItems={serviceItems}
                onAddItem={handleAddServiceItem}
                onRemoveItem={handleRemoveServiceItem}
              />

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Criando..." : "Criar Ordens de Serviço"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdemServicoForm;
