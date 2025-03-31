
import React from "react";
import { Card } from "@/components/ui/card";
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

const OrdemServicoView: React.FC<OrdemServicoViewProps> = ({
  order,
  customer,
  customerProduct,
  product,
  serviceItems,
  onBack
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = generateServiceOrderPDF(order, customer, customerProduct, product, serviceItems);
    doc.save(`ordem_servico_${order.id}.pdf`);
  };

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
              <ProductInfo product={product} customerProduct={customerProduct} />

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
