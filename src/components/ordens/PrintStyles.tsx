
import React from "react";

const PrintStyles: React.FC = () => (
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
);

export default PrintStyles;
