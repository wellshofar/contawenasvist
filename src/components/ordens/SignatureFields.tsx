
import React from "react";

const SignatureFields: React.FC = () => {
  return (
    <div className="mt-12 grid grid-cols-2 gap-8">
      <div className="text-center">
        <div className="border-t border-dashed mt-8 pt-2">Assinatura do Técnico</div>
      </div>
      <div className="text-center">
        <div className="border-t border-dashed mt-8 pt-2">Assinatura do Cliente</div>
      </div>
    </div>
  );
};

export default SignatureFields;
