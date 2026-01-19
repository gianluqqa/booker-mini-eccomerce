import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useReservation } from "@/contexts/ReservationContext";
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

  // Efecto de inicialización
  useEffect(() => {
    const initializeCheckout = async () => {
      setLoading(true);
      setError(null);
      setOrderExpired(false);

      try {
        // Si se proporciona un orderId, cargar esa orden específica
        if (orderId) {
          console.log("🎯 Cargando orden específica:", orderId);
          const specificOrder = await getOrderById(orderId);

          if (specificOrder.status !== "PENDING") {
            setError("Esta orden ya no está pendiente. Redirigiendo...");
            setTimeout(() => router.push("/profile"), 2000);
            return;
          }

          // Verificar si la orden ha expirado
          if (specificOrder.expiresAt) {
            const expiryTime = new Date(specificOrder.expiresAt).getTime();
            const now = new Date().getTime();

            if (expiryTime <= now) {
              console.log("⏰ La orden específica ha expirado");
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
          console.log("✅ Orden específica cargada:", specificOrder);
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
        console.log("🔍 Verificando si existe orden PENDING...");
        const existingOrder = await checkPendingOrder();

        if (existingOrder) {
          console.log("✅ Orden PENDING existente encontrada:", existingOrder);
          setOrder(existingOrder);

          // Verificar si la orden ha expirado
          if (existingOrder.expiresAt) {
            const expiryTime = new Date(existingOrder.expiresAt).getTime();
            const now = new Date().getTime();

            if (expiryTime <= now) {
              console.log("⏰ La orden PENDING ha expirado");
              setOrderExpired(true);
              setError("Tu orden ha expirado. Por favor, inicia un nuevo checkout.");
            }
          }
        } else {
          // Verificar si hay items en el carrito antes de crear nueva orden
          if (cartData.items.length === 0) {
            console.log("🛒 Carrito vacío - No se puede crear nueva orden");
            router.push("/cart");
            return;
          }

          // Crear nueva orden PENDING solo si no hay error de expiración
          if (!orderExpired) {
            console.log("🆕 Creando nueva orden PENDING...");
            const newOrder = await startCheckout();
            setOrder(newOrder);
            console.log("✅ Orden PENDING creada:", newOrder);
          } else {
            console.log("⏰ Orden expirada - Esperando acción del usuario para crear nueva orden");
          }
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error al inicializar el checkout";
        setError(errorMessage);
        console.error("❌ Error en initializeCheckout:", error);
      } finally {
        setLoading(false);
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
      console.log("💳 Procesando pago de orden PENDING...");
      const paidOrder = await processPayment(cleanData);
      setOrder(paidOrder);
      setLoading(false);
      setProcessing(false);
      clearReservation();
      console.log("✅ Pago procesado exitosamente:", paidOrder);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar el pago";
      setError(errorMessage);
      setProcessing(false);
      console.error("❌ Error en handleCheckout:", error);
    }
  };

  const handleCancelCheckout = async () => {
    try {
      await cancelCheckout();
      clearReservation();
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
      setOrderExpired(false);

      // Cancelar checkout actual
      await cancelCheckout();
      setOrder(null);

      // Crear nueva orden PENDING
      const newOrder = await startCheckout();
      setOrder(newOrder);

      setLoading(false);
      console.log("✅ Nuevo checkout iniciado:", newOrder);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al reiniciar el checkout";
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
