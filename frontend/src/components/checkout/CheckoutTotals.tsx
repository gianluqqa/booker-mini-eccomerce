import React from "react";

interface CheckoutTotalsProps {
  subtotal: number;
  tax: number;
  total: number;
}

export const CheckoutTotals: React.FC<CheckoutTotalsProps> = ({ subtotal, tax, total }) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-[#2e4b30]/10">
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-[#2e4b30]">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#2e4b30]">
          <span>Impuestos (21%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>
      <div className="border-t border-[#2e4b30]/20 pt-4">
        <div className="flex justify-between text-xl font-bold text-[#2e4b30]">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
