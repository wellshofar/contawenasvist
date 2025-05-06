
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ServiceOrder, Customer, Product, CustomerProduct } from "@/types/supabase";
import { ServiceItem, formatDate } from "./types";
import { SystemSettings } from "@/types/settings";

export const generateServiceOrderPDF = (
  order: ServiceOrder,
  customer: Customer,
  customerProduct: CustomerProduct,
  product: Product,
  serviceItems: ServiceItem[],
  companySettings: SystemSettings
): jsPDF => {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Ordem de Serviço ${order.id}`,
    author: companySettings.companyName || "Sistema HOKEN",
    creator: companySettings.companyName || "Sistema HOKEN",
  });
  
  // Add company header
  doc.setFontSize(16);
  doc.text(companySettings.companyName || `ORDEM DE SERVIÇO ${order.title}`, 105, 15, { align: "center" });
  
  // Add company info in smaller font
  doc.setFontSize(10);
  let yPos = 22;
  
  if (companySettings.companyDocument) {
    doc.text(`CNPJ: ${companySettings.companyDocument}`, 105, yPos, { align: "center" });
    yPos += 5;
  }
  
  if (companySettings.phone) {
    doc.text(`Tel: ${companySettings.phone}`, 105, yPos, { align: "center" });
    yPos += 5;
  }
  
  // Add address in one line if available
  if (companySettings.address) {
    const addressStr = `${companySettings.address}${companySettings.addressNumber ? `, ${companySettings.addressNumber}` : ""}${
      companySettings.city ? ` - ${companySettings.city}/${companySettings.state || ""}` : ""
    }`;
    doc.text(addressStr, 105, yPos, { align: "center" });
    yPos += 5;
  }
  
  // Add order number
  doc.setFontSize(14);
  doc.text(`Número da OS: ${order.id}`, 105, yPos + 5, { align: "center" });
  yPos += 10;
  
  // Add order details
  doc.setFontSize(12);
  doc.text(`Data/Hora: ${formatDate(order.created_at)}`, 15, yPos + 5);
  doc.text(`Status: ${order.status}`, 15, yPos + 12);
  doc.text(`Agendado para: ${formatDate(order.scheduled_date || '')}`, 15, yPos + 19);
  doc.text(`Técnico: ${order.assigned_to || "-"}`, 15, yPos + 26);
  
  // Add customer information
  doc.setFontSize(14);
  doc.text("Dados do Cliente", 15, yPos + 40);
  
  // Create customer info table
  autoTable(doc, {
    startY: yPos + 45,
    head: [["Cliente", "CPF/CNPJ", "Telefone"]],
    body: [
      [customer.name, customer.document || "-", customer.phone || "-"]
    ],
  });
  
  let finalY = yPos + 45;
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
  finalY = finalY + 10;
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
  finalY = finalY + 25;
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
  finalY = finalY + 25;
  if (doc.previousAutoTable && typeof doc.previousAutoTable.finalY !== 'undefined') {
    finalY = doc.previousAutoTable.finalY;
  }
  
  doc.setFontSize(12);
  doc.text("Assinatura do Técnico: _______________________________", 15, finalY + 30);
  doc.text("Assinatura do Cliente: _______________________________", 15, finalY + 45);
  
  // Add support channels if available
  if (companySettings.supportChannels) {
    doc.setFontSize(10);
    doc.text("Canais de Atendimento:", 105, finalY + 70, { align: "center" });
    const supportLines = companySettings.supportChannels.split('\n');
    supportLines.forEach((line, index) => {
      doc.text(line, 105, finalY + 75 + (index * 5), { align: "center" });
    });
  }
  
  // Add page number
  const pageCount = 1;
  
  doc.setFontSize(10);
  doc.text(`Página 1 de ${pageCount}`, 190, 287, { align: "right" });
  
  return doc;
};
