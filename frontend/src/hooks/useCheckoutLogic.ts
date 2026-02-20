import { useState, useEffect, useRef } from "react";
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

  // 🔒 useRef para bloqueo real (persiste entre re-renders)
  const isInitializingRef = useRef<boolean>(false);

  // Efecto de inicialización
  useEffect(() => {
    const initializeCheckout = async () => {
      // 🔒 Evitar múltiples inicializaciones simultáneas con useRef
      if (isInitializingRef.current) {
        console.log('🔒 [FRONTEND] initializeCheckout - Ya se está inicializando, evitando duplicación');
        return;
      }

      isInitializingRef.current = true;
      setLoading(true);
      setError(null);
      setOrderExpired(false);

      try {
        console.log('🚀 [FRONTEND] initializeCheckout - Iniciando inicialización');
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
          console.log('🔍 [FRONTEND] initializeCheckout - Orden PENDING existente encontrada:', existingOrder.id);
          console.log('📅 [FRONTEND] initializeCheckout - expiresAt:', existingOrder.expiresAt);
          console.log('📅 [FRONTEND] initializeCheckout - createdAt:', existingOrder.createdAt);
          console.log('📅 [FRONTEND] initializeCheckout - status:', existingOrder.status);
          setOrder(existingOrder);

          // Verificar si la orden ha expirado
          if (existingOrder.expiresAt) {
            const expiryTime = new Date(existingOrder.expiresAt).getTime();
            const now = new Date().getTime();
            const timeRemaining = expiryTime - now;
            
            console.log('⏰ [FRONTEND] initializeCheckout - Verificando expiración:');
            console.log('   - Tiempo de expiración (ms):', expiryTime);
            console.log('   - Tiempo actual (ms):', now);
            console.log('   - Tiempo restante (ms):', timeRemaining);
            console.log('   - Tiempo restante (min):', Math.floor(timeRemaining / 60000));

            if (expiryTime <= now) {
              console.log('⏰ [FRONTEND] initializeCheckout - Orden PENDING ha expirado');
              setOrderExpired(true);
              setError("Tu orden ha expirado. Por favor, inicia un nuevo checkout.");
            } else {
              console.log('✅ [FRONTEND] initializeCheckout - Orden PENDING válida encontrada');
              setOrderExpired(false); // Asegurar que el estado sea correcto
            }
          } else {
            console.log('⚠️ [FRONTEND] initializeCheckout - Orden PENDING sin expiresAt');
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
            console.log('🆕 [FRONTEND] initializeCheckout - Creando nueva orden PENDING');
            try {
              const newOrder = await startCheckout();
              setOrder(newOrder);
              console.log('✅ [FRONTEND] initializeCheckout - Nueva orden creada:', newOrder.id);
            } catch (orderError: unknown) {
              // Si el error es por orden pendiente existente, es normal en Strict Mode
              const errorMessage = orderError instanceof Error ? orderError.message : '';
              if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
                console.log('🔄 [FRONTEND] initializeCheckout - Orden pendiente detectada, verificando si es la misma...');
                
                // Verificar si ya existe una orden (puede ser la que acabamos de crear)
                const existingOrder = await checkPendingOrder();
                if (existingOrder) {
                  console.log('✅ [FRONTEND] initializeCheckout - Usando orden existente:', existingOrder.id);
                  setOrder(existingOrder);
                } else {
                  console.log('⚠️ [FRONTEND] initializeCheckout - No se encontró orden existente después del error');
                }
              } else {
                // Para otros errores, lanzar la excepción
                throw orderError;
              }
            }
          } else {
            console.log('⚠️ [FRONTEND] initializeCheckout - Orden expirada, no se crea nueva');
          }
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error al inicializar el checkout";
        setError(errorMessage);
        console.error("❌ [FRONTEND] Error en initializeCheckout:", error);
      } finally {
        setLoading(false);
        isInitializingRef.current = false;
        console.log('✅ [FRONTEND] initializeCheckout - Inicialización completada');
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
      console.log('💳 [FRONTEND] handleCheckout - Iniciando procesamiento de pago');
      const cleanData = cleanPaymentData(cardData);
      const paidOrder = await processPayment(cleanData);
      setOrder(paidOrder);
      setLoading(false);
      setProcessing(false);
      clearReservation();
      console.log('✅ [FRONTEND] handleCheckout - Pago procesado exitosamente');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar el pago";
      setError(errorMessage);
      setProcessing(false);
      console.error("❌ [FRONTEND] Error en handleCheckout:", error);
    }
  };

  const handleCancelCheckout = async () => {
    try {
      console.log('🔄 [FRONTEND] handleCancelCheckout - Cancelando checkout');
      await cancelCheckout();
      clearReservation();
      setOrder(null);
      router.push("/cart");
      console.log('✅ [FRONTEND] handleCancelCheckout - Checkout cancelado exitosamente');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al cancelar el checkout";
      setError(errorMessage);
      console.error('❌ [FRONTEND] Error en handleCancelCheckout:', error);
    }
  };

  const handleOrderExpired = () => {
    setOrderExpired(true);
    setError("Tu orden ha expirado. Por favor, inicia un nuevo checkout para continuar.");
  };

  const handleRestartCheckout = async () => {
    // 🔒 Evitar múltiples reinicios simultáneos
    if (isInitializingRef.current) {
      console.log('🔒 [FRONTEND] handleRestartCheckout - Ya se está inicializando, evitando duplicación');
      return;
    }

    try {
      console.log('🔄 [FRONTEND] handleRestartCheckout - Reiniciando checkout');
      isInitializingRef.current = true;
      setLoading(true);
      setError(null);
      setOrderExpired(false);

      // Cancelar checkout actual
      await cancelCheckout();
      setOrder(null);

      // Crear nueva orden PENDING
      try {
        const newOrder = await startCheckout();
        setOrder(newOrder);
        console.log('✅ [FRONTEND] handleRestartCheckout - Nueva orden creada:', newOrder.id);
      } catch (orderError: unknown) {
        // Si el error es por orden pendiente existente, verificar y usar la existente
        const errorMessage = orderError instanceof Error ? orderError.message : '';
        if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
          console.log('🔄 [FRONTEND] handleRestartCheckout - Orden pendiente detectada, verificando...');
          
          const existingOrder = await checkPendingOrder();
          if (existingOrder) {
            console.log('✅ [FRONTEND] handleRestartCheckout - Usando orden existente:', existingOrder.id);
            setOrder(existingOrder);
          } else {
            console.log('⚠️ [FRONTEND] handleRestartCheckout - No se encontró orden existente');
            throw orderError;
          }
        } else {
          throw orderError;
        }
      }

      setLoading(false);
      console.log('✅ [FRONTEND] handleRestartCheckout - Checkout reiniciado exitosamente');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error al reiniciar el checkout";
      setError(errorMessage);
      setLoading(false);
      console.error("❌ [FRONTEND] Error en handleRestartCheckout:", error);
    } finally {
      isInitializingRef.current = false;
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
