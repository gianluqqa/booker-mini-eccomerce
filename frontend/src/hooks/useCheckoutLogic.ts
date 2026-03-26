import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useReservation } from "@/contexts/ReservationContext";
import { useCart } from "@/contexts/CartContext";
import { startCheckout, processPayment, checkPendingOrder, cancelCheckout, getUserCart } from "@/services/checkoutService";
import { getOrderById } from "@/services/orderService";
import { IOrder } from "@/types/Order";
import { ICartItem, ICartResponse } from "@/types/Cart";
import { cleanPaymentData } from "@/utils/paymentFormatters";
import { calculateSubtotalFromCart, calculateSubtotalFromOrder, calculateTax, calculateTotal, validatePaymentData } from "@/utils/checkoutHelpers";

export const useCheckoutLogic = () => {
  const router = useRouter();
  const params = useParams();
  const { clearReservation } = useReservation();
  const { refreshCart } = useCart();
  const orderId = params.orderId as string | undefined;

  // Estados
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [orderExpired, setOrderExpired] = useState<boolean>(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvc: "",
  });

  // 🔒 useRef para bloqueo real (persiste entre re-renders)
  const isInitializingRef = useRef<boolean>(false);

  // Efecto de inicialización
  useEffect(() => {
    const initializeCheckout = async () => {
      // 🔒 Evitar múltiples inicializaciones simultáneas con useRef
      if (isInitializingRef.current) {
        return;
      }

      isInitializingRef.current = true;
      setLoading(true);
      setError(null);
      setOrderExpired(false);

      try {
        // Si se proporciona un orderId, cargar esa orden específica
        if (orderId) {
          const specificOrder = await getOrderById(orderId);

          if (specificOrder.status !== "pending") {
            setError("Esta orden ya no está pendiente. Redirigiendo...");
            setTimeout(() => router.push("/profile"), 2000);
            return;
          }

          // Verificar si la orden ha expirado
          if (specificOrder.expiresAt) {
            const expiryTime = new Date(specificOrder.expiresAt).getTime();
            const now = new Date().getTime();

            if (expiryTime <= now) {
              setOrderExpired(true);
              setError("Esta orden ha expirado. Por favor, inicia un nuevo checkout.");
              return;
            }
          }

          setOrder(specificOrder);
          setCartItems(
            specificOrder.items.map((item) => ({
              id: item.id,
              book: {
                id: item.book.id,
                title: item.book.title,
                author: item.book.author || "",
                price: item.book.price,
                stock: 0, // No tenemos stock en IOrderItem, usamos 0 como placeholder
              },
              quantity: item.quantity,
              createdAt: new Date(),
              updatedAt: new Date(),
            }))
          );
          return;
        }

        // Flujo normal: Obtener carrito primero
        const cartData: ICartResponse = await getUserCart();
        setCartItems(cartData.items || []);

        if (cartData.items.length === 0) {
          router.push("/cart");
          return;
        }

        // Verificar si ya existe una orden PENDING
        const existingOrder = await checkPendingOrder();

        if (existingOrder) {
          setOrder(existingOrder);

          // Verificar si la orden ha expirado
          if (existingOrder.expiresAt) {
            const expiryTime = new Date(existingOrder.expiresAt).getTime();
            const now = new Date().getTime();

            if (expiryTime <= now) {
              setOrderExpired(true);
              setError("Tu orden ha expirado. Por favor, inicia un nuevo checkout.");
            } else {
              setOrderExpired(false); // Asegurar que el estado sea correcto
            }
          } else {
            setOrderExpired(false);
          }
        } else {
          // Verificar si hay items en el carrito antes de crear nueva orden
          if (cartData.items.length === 0) {
            router.push("/cart");
            return;
          }

          // Crear nueva orden PENDING solo si no hay error de expiración
          if (!orderExpired) {
            try {
              const newOrder = await startCheckout();
              setOrder(newOrder);
              await refreshCart(); // 🔔 Notificar al contexto global
            } catch (orderError: unknown) {
              // Si el error es por orden pendiente existente, es normal en Strict Mode
              const errorMessage = orderError instanceof Error ? orderError.message : '';
              if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
                
                // Verificar si ya existe una orden (puede ser la que acabamos de crear)
                const existingOrder = await checkPendingOrder();
                if (existingOrder) {
                  setOrder(existingOrder);
                }
              } else {
                // Para otros errores, lanzar la excepción
                throw orderError;
              }
            }
          } else {
            // Orden expirada, no se crea nueva
          }
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error al inicializar el checkout";
        setError(errorMessage);
      } finally {
        setLoading(false);
        isInitializingRef.current = false;
      }
    };

    initializeCheckout();
  }, [router, orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckout = async () => {
    // Validar que haya una orden PENDING y no haya expirado
    if (!order || order.status !== "pending") {
      setError("No hay una orden válida para procesar el pago.");
      return;
    }

    if (orderExpired) {
      setError("Tu orden ha expirado. Por favor, inicia un nuevo checkout.");
      return;
    }

    // Validar datos de pago
    const validationError = validatePaymentData(cardData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cleanData = cleanPaymentData(cardData);
      const paidOrder = await processPayment(cleanData);
      setOrder(paidOrder);
      setProcessing(false);
      clearReservation();
      await refreshCart(); // 🔔 Notificar que ya no hay pendiente
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar el pago";
      setError(errorMessage);
      setProcessing(false);
    }
  };

  const handleCancelCheckout = async () => {
    try {
      await cancelCheckout();
      clearReservation();
      await refreshCart(); // 🔔 Notificar cancelación
      setOrder(null);
      router.push("/cart");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cancelar el checkout";
      setError(errorMessage);
    }
  };

  const handleOrderExpired = () => {
    setOrderExpired(true);
    setError("Tu orden ha expirado. Por favor, inicia un nuevo checkout para continuar.");
  };

  const handleRestartCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cancelar la orden expirada para liberar stock
      if (order) {
        await cancelCheckout();
        clearReservation();
        await refreshCart(); // 🔔 Notificar cancelación
      }

      // Redirigir a la tienda para "añadir libros otra vez"
      router.push("/");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar la solicitud";
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Cálculos
  const calculateSubtotal = () => {
    return order ? calculateSubtotalFromOrder(order) : calculateSubtotalFromCart(cartItems);
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal);

  return {
    // Estados
    loading,
    cartItems,
    order,
    error,
    processing,
    orderExpired,
    cardData,

    // Cálculos
    subtotal,
    tax,
    total,

    // Acciones
    handleCheckout,
    handleCancelCheckout,
    handleOrderExpired,
    handleRestartCheckout,
    setCardData,

    // Utilidades
    router,
  };
};
