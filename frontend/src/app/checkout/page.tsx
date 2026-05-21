"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckoutLogic } from "@/hooks/useCheckoutLogic";

// Componentes modularizados
import { CheckoutMainView } from "@/components/checkout/CheckoutMainView";
import { LoadingState, EmptyCartState } from "@/components/checkout/CheckoutStates";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

// Componente principal
const CheckoutPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const checkoutLogic = useCheckoutLogic();

  // Redirección si no está autenticado (esperando a que termine de cargar la sesión)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Estados de carga (tanto de auth como de lógica de checkout)
  if (authLoading || checkoutLogic.loading) {
    return <LoadingState />;
  }

  if (checkoutLogic.cartItems.length === 0 && !checkoutLogic.order) {
    return <EmptyCartState onBackToCart={() => router.push("/cart")} />;
  }

  // Confirmación de orden solo si está PAID
  if (checkoutLogic.order && checkoutLogic.order.status === "paid") {
    return <OrderConfirmation order={checkoutLogic.order} />;
  }

  // Vista principal de checkout
  return <CheckoutMainView {...checkoutLogic} />;
};

export default CheckoutPage;
