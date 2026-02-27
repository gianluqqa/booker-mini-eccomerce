import React from "react";
import { IOrder } from "@/types/Order";
import { ReservationTimer } from "./ReservationTimer";
import { CheckoutTotals } from "./CheckoutTotals";
import { CheckoutActions } from "./CheckoutActions";

interface CheckoutSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  processing: boolean;
  orderExpired: boolean;
  order: IOrder | null;
  onCheckout: () => void;
  onCancelCheckout: () => void;
  onOrderExpired: () => void;
  onRestartCheckout: () => void;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  subtotal,
  tax,
  total,
  processing,
  orderExpired,
  order,
  onCheckout,
  onCancelCheckout,
  onOrderExpired,
  onRestartCheckout
}) => {
  return (
    <div className="bg-white p-6">
      <ReservationTimer order={order} onExpired={onOrderExpired} onExtend={onRestartCheckout} />

      <CheckoutTotals subtotal={subtotal} tax={tax} total={total} />

      <CheckoutActions
        processing={processing}
        orderExpired={orderExpired}
        onCheckout={onCheckout}
        onCancelCheckout={onCancelCheckout}
        onRestartCheckout={onRestartCheckout}
      />
    </div>
  );
};
