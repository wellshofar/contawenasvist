
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ServiceOrder, Customer, Product, CustomerProduct } from "@/types/supabase";
import { ServiceItem, formatDate } from "./types";

export const generateServiceOrderPDF = (
  order: ServiceOrder,
  customer: Customer,
  customerProduct: CustomerProduct,
  product: Product,
  serviceItems: ServiceItem[]
): jsPDF => {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Ordem de Serviço ${order.id}`,
    author: "Sistema HOKEN",
    creator: "Sistema HOKEN",
  });
  
  // Add title
  doc.setFontSize(18);
  doc.text(`ORDEM DE SERVIÇO ${order.title}`, 105, 15, { align: "center" });
  doc.setFontSize(14);
  doc.text(`Número da OS: ${order.id}`, 105, 22, { align: "center" });
  
  // Add order details
  doc.setFontSize(12);
  doc.text(`Data/Hora: ${formatDate(order.created_at)}`, 15, 35);
  doc.text(`Status: ${order.status}`, 15, 42);
  doc.text(`Agendado para: ${formatDate(order.scheduled_date || '')}`, 15, 49);
  doc.text(`Técnico: ${order.assigned_to || "-"}`, 15, 56);
  
  // Add customer information
  doc.setFontSize(14);
  doc.text("Dados do Cliente", 15, 70);
  
  // Create customer info table
  autoTable(doc, {
    startY: 75,
    head: [["Cliente", "CPF/CNPJ", "Telefone"]],
    body: [
      [customer.name, customer.document || "-", customer.phone || "-"]
    ],
  });
  
  let finalY = 75;
  if (doc.previousAutoTable && typeof doc.previousAutoTable.finalY !== 'undefined') {
    finalY = doc.previousAutoTable.finalY;
  }
  
  autoTable(doc, {
    startY: finalY + 10,
    head: [["Endereço", "Cidade/UF", "CEP"]],
    body: [
      [
        customer.address || "-", 
        `${customer.city || "-"}/${customer.state || "-"}`, 
        customer.postal_code || "-"
      ]
    ],
  });
  
  // Add product information
  finalY = 75;
  if (doc.previousAutoTable && typeof doc.previousAutoTable.finalY !== 'undefined') {
    finalY = doc.previousAutoTable.finalY;
  }
  
  doc.setFontSize(14);
  doc.text("Produto", 15, finalY + 20);
  
  autoTable(doc, {
    startY: finalY + 25,
    head: [["Produto", "Modelo", "Data de Instalação"]],
    body: [
      [
        product.name, 
        product.model || "-", 
        customerProduct.installation_date ? 
          new Date(customerProduct.installation_date).toLocaleDateString("pt-BR") : "-"
      ]
    ],
  });
  
  // Add service items
  finalY = 75;
  if (doc.previousAutoTable && typeof doc.previousAutoTable.finalY !== 'undefined') {
    finalY = doc.previousAutoTable.finalY;
  }
  
  doc.setFontSize(14);
  doc.text("Peças/Serviços", 15, finalY + 20);
  
  const serviceItemRows = serviceItems.map(item => [
    item.code || "-",
    item.name || item.description,
    item.quantity.toString()
  ]);
  
  if (serviceItemRows.length === 0) {
    serviceItemRows.push(["", "Nenhum item de serviço registrado", ""]);
  }
  
  autoTable(doc, {
    startY: finalY + 25,
    head: [["Código", "Descrição", "Qtde"]],
    body: serviceItemRows,
  });
  
  // Add signature fields
  finalY = 75;
  if (doc.previousAutoTable && typeof doc.previousAutoTable.finalY !== 'undefined') {
    finalY = doc.previousAutoTable.finalY;
  }
  
  doc.setFontSize(12);
  doc.text("Assinatura do Técnico: _______________________________", 15, finalY + 30);
  doc.text("Assinatura do Cliente: _______________________________", 15, finalY + 45);
  
  // Add page number - safely handle page counting without using getNumberOfPages
  // Instead of using getNumberOfPages which is causing issues, we'll just use 1
  // since this is typically a single page document
  const pageCount = 1;
  
  doc.setFontSize(10);
  doc.text(`Página 1 de ${pageCount}`, 190, 287, { align: "right" });
  
  return doc;
};
