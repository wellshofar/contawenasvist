
import React from "react";
import { ServiceOrder, Customer, Product, CustomerProduct } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Define augmented types to handle the autoTable plugin
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => any;
    previousAutoTable?: {
      finalY: number;
    };
    internal: {
      events: any;
      scaleFactor: number;
      pageSize: {
        width: number;
        getWidth: () => number;
        height: number;
        getHeight: () => number;
      };
      pages: any[];
      getEncryptor(objectId: number): (data: string) => string;
      getNumberOfPages(): number;
    }
  }
}

interface ServiceItem {
  id: string;
  productId: string;
  code: string;
  name: string;
  quantity: number;
}

interface OrdemServicoViewProps {
  order: ServiceOrder;
  customer: Customer;
  customerProduct: CustomerProduct;
  product: Product;
  serviceItems: ServiceItem[];
  onBack: () => void;
}

const OrdemServicoView: React.FC<OrdemServicoViewProps> = ({
  order,
  customer,
  customerProduct,
  product,
  serviceItems,
  onBack
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
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
    doc.text(`Agendado para: ${formatDate(order.scheduled_date)}`, 15, 49);
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
    
    let finalY = doc.previousAutoTable?.finalY || 75;
    
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
    finalY = doc.previousAutoTable?.finalY || finalY + 10;
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
    finalY = doc.previousAutoTable?.finalY || finalY + 25;
    doc.setFontSize(14);
    doc.text("Peças/Serviços", 15, finalY + 20);
    
    const serviceItemRows = serviceItems.map(item => [
      item.code,
      item.name,
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
    finalY = doc.previousAutoTable?.finalY || finalY + 25;
    doc.setFontSize(12);
    doc.text("Assinatura do Técnico: _______________________________", 15, finalY + 30);
    doc.text("Assinatura do Cliente: _______________________________", 15, finalY + 45);
    
    // Add page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, 190, 287, { align: "right" });
    }
    
    // Save the PDF
    doc.save(`ordem_servico_${order.id}.pdf`);
  };

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">Ordem de Serviço {order.id}</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <FileDown className="mr-2 h-4 w-4" /> PDF
            </Button>
          </div>
        </div>

        <div className="print:block">
          <Card className="p-6 print:shadow-none print:border-none">
            <div className="a4-page">
              {/* Header */}
              <div className="border-b pb-4 mb-4 text-center">
                <h1 className="text-2xl font-bold">{order.title}</h1>
                <p className="text-lg">Número da OS: {order.id}</p>
                {order.scheduled_date && (
                  <p className="text-sm text-muted-foreground">
                    Vencimento da O.S.: {new Date(order.scheduled_date).toLocaleDateString("pt-BR")}
                    {" - "}
                    {new Date(order.scheduled_date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4">
                <div>
                  <p><span className="font-semibold">Formulário/Contrato:</span> {customerProduct.id}</p>
                  <p><span className="font-semibold">Data/Hora Atendimento:</span> {formatDate(order.created_at)}</p>
                  <p><span className="font-semibold">Atendimento Autorizado por:</span> {order.created_by || "-"}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Data do Contrato:</span> {customerProduct.installation_date ? new Date(customerProduct.installation_date).toLocaleDateString("pt-BR") : "-"}</p>
                  <p><span className="font-semibold">Atendente:</span> {order.assigned_to || "-"}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-b pb-4 mb-6">
                <h2 className="font-bold text-lg mb-2">Dados do Cliente</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-semibold">Cliente:</span> {customer.name}</p>
                    <p><span className="font-semibold">Endereço:</span> {customer.address}</p>
                    <p><span className="font-semibold">Cidade:</span> {customer.city} - {customer.state}</p>
                    <p><span className="font-semibold">Ponto de Referência:</span> -</p>
                  </div>
                  <div className="text-right">
                    <p><span className="font-semibold">CPF/CNPJ:</span> {customer.document}</p>
                    <p><span className="font-semibold">Bairro:</span> -</p>
                    <p><span className="font-semibold">CEP:</span> {customer.postal_code}</p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-2">Produto do Cliente</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referência</TableHead>
                      <TableHead>Produto do Cliente</TableHead>
                      <TableHead>Cômodo/Setor</TableHead>
                      <TableHead>Data Compra</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>{product.model} - {product.name}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{customerProduct.installation_date ? new Date(customerProduct.installation_date).toLocaleDateString("pt-BR") : "-"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Service Items */}
              <div className="mb-6">
                <h2 className="font-bold text-lg mb-2">Peças/Serviços da O.S.</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ref. Produto</TableHead>
                      <TableHead>Peça/Serviço da O.S.</TableHead>
                      <TableHead className="text-right">Qtde</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceItems.length > 0 ? (
                      serviceItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">Nenhum item de serviço registrado</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-semibold">TOTAL:</TableCell>
                      <TableCell className="text-right font-semibold">{serviceItems.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Signature fields */}
              <div className="mt-12 grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="border-t border-dashed mt-8 pt-2">Assinatura do Técnico</div>
                </div>
                <div className="text-center">
                  <div className="border-t border-dashed mt-8 pt-2">Assinatura do Cliente</div>
                </div>
              </div>

              <div className="mt-8 text-xs text-muted-foreground">
                <p className="mb-2">Via Cliente</p>
                <p>Coletamos os seguintes dados fornecidos pelo titular: nome completo, CPF, e-mail, endereço, bairro, cidade, CEP e comunicações verbais e escritas mantidas entre o titular e a empresa. Referidos dados são coletados em conformidade com a Lei 13.709/18 - LGPD cuja base legal que autoriza o tratamento é a execução de contratos ou de procedimentos preliminares relacionados a contrato do qual seja parte o titular, nos termos do art. 7°, inciso V.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
          .a4-page {
            width: 100%;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none;
          }
        }
      `}
      </style>
    </>
  );
};

export default OrdemServicoView;
