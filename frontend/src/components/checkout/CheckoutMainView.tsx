import React from "react";
import { IOrder } from "@/types/Order";
import { ICartItem } from "@/types/Cart";
import { CheckoutHeader } from "./CheckoutHeader";
import { CartPreview } from "./CartPreview";
import { PaymentForm } from "./PaymentForm";
import { CheckoutSummary } from "./CheckoutSummary";
import { CheckoutErrorState } from "./CheckoutStates";

interface CheckoutMainViewProps {
  cartItems: ICartItem[];
  order: IOrder | null;
  error: string | null;
  processing: boolean;
  orderExpired: boolean;
  cardData: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvc: string;
  };
  subtotal: number;
  tax: number;
  total: number;
  handleCheckout: () => void;
  handleCancelCheckout: () => void;
  handleOrderExpired: () => void;
  handleRestartCheckout: () => void;
  setCardData: React.Dispatch<React.SetStateAction<{
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvc: string;
  }>>;
}

export const CheckoutMainView: React.FC<CheckoutMainViewProps> = ({ 
  cartItems, 
  order, 
  error, 
  processing, 
  orderExpired, 
  cardData, 
  subtotal, 
  tax, 
  total, 
  handleCheckout, 
  handleCancelCheckout, 
  handleOrderExpired, 
  handleRestartCheckout, 
  setCardData 
}) => {
  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutHeader />

        {error && <CheckoutErrorState error={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartPreview cartItems={cartItems} />
            <PaymentForm cardData={cardData} setCardData={setCardData} />
          </div>

          <div>
            <CheckoutSummary 
              subtotal={subtotal} 
              tax={tax} 
              total={total} 
              processing={processing} 
              orderExpired={orderExpired} 
              order={order} 
              onCheckout={handleCheckout} 
              onCancelCheckout={handleCancelCheckout} 
              onOrderExpired={handleOrderExpired} 
              onRestartCheckout={handleRestartCheckout} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
