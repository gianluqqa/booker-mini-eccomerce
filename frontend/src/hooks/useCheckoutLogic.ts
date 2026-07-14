import { useState, useEffect, useRef, SetStateAction } from "react";
import { useRouter, useParams } from "next/navigation";
import { useReservation } from "@/contexts/ReservationContext";
import { useCart } from "@/contexts/CartContext";
import { startCheckout, processPayment, checkPendingOrder, cancelCheckout, getUserCart, createStockReservation } from "@/services/checkoutService";
import { getOrderById } from "@/services/orderService";
import { IOrder } from "@/types/Order";
import { ICartItem, ICartResponse } from "@/types/Cart";
import { cleanPaymentData } from "@/utils/paymentFormatters";
import { calculateSubtotalFromCart, calculateSubtotalFromOrder, calculateTax, calculateTotal, validatePaymentData } from "@/utils/checkoutHelpers";

export const useCheckoutLogic = () => {
  const router = useRouter();
  const params = useParams();
  const { setReservation, clearReservation } = useReservation();
  const { refreshCart } = useCart();
  const orderId = params.orderId as string | undefined;

  // Estados
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState<string | string[] | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [orderExpired, setOrderExpired] = useState<boolean>(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvc: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

        // 1. Verificar primero si ya existe una orden PENDING activa
        const existingOrder = await checkPendingOrder();

        if (existingOrder) {
          setOrder(existingOrder);
          
          // Sincronizar items del carrito con los de la orden existente
          if (existingOrder.items && existingOrder.items.length > 0) {
            setCartItems(existingOrder.items.map(item => ({
              id: item.id,
              book: {
                id: item.book.id,
                title: item.book.title,
                author: item.book.author || '',
                price: item.book.price,
                stock: 0,
                image: item.book.image
              },
              quantity: item.quantity,
              createdAt: new Date(),
              updatedAt: new Date()
            })));
          }

          // Verificar si la orden ha expirado
          if (existingOrder.expiresAt) {
            const expiryTime = new Date(existingOrder.expiresAt).getTime();
            const now = new Date().getTime();

            if (expiryTime <= now) {
              setOrderExpired(true);
              setError("Tu orden ha expirado. Por favor, inicia un nuevo checkout.");
            } else {
              setOrderExpired(false);
            }
          } else {
            setOrderExpired(false);
          }
          return; // Finalizar inicialización si ya hay orden
        }

        // 2. Si no hay orden, proceder con el flujo de carrito normal
        const cartData: ICartResponse = await getUserCart();
        setCartItems(cartData.items || []);

        if (cartData.items.length === 0) {
          router.push("/cart");
          return;
        }

        // 3. Flujo de nueva orden: Reserva -> Orden
        if (!orderExpired) {
          try {
            // A. Crear reserva de stock
            const reservation = await createStockReservation();
            setReservation(reservation);
            
            // B. Crear orden PENDING
            const newOrder = await startCheckout();
            setOrder(newOrder);
            
            // C. Sincronizar items
            if (newOrder.items && newOrder.items.length > 0) {
              setCartItems(newOrder.items.map(item => ({
                id: item.id,
                book: {
                  id: item.book.id,
                  title: item.book.title,
                  author: item.book.author || '',
                  price: item.book.price,
                  stock: 0,
                  image: item.book.image
                },
                quantity: item.quantity,
                createdAt: new Date(),
                updatedAt: new Date()
              })));
            }
            
            await refreshCart();
          } catch (orderError: unknown) {
            const errorMessage = orderError instanceof Error ? orderError.message : '';
            if (errorMessage.includes('orden pendiente') || errorMessage.includes('409')) {
              const retryOrder = await checkPendingOrder();
              if (retryOrder) setOrder(retryOrder);
            } else {
              throw orderError;
            }
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
    const validationErrors = validatePaymentData(cardData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Por favor, corrige los errores en el formulario.");
      return;
    }

    setProcessing(true);
    setError(null);
    setFieldErrors({});

    try {
      const cleanData = cleanPaymentData(cardData);
      const paidOrder = await processPayment(cleanData);
      setOrder(paidOrder);
      setProcessing(false);
      clearReservation();
      await refreshCart(); // 🔔 Notificar que ya no hay pendiente
    } catch (error: unknown) {
      // Priorizar la lista detallada de errores de validación para el componente CheckoutErrorState
      const validationErrors = error instanceof Error && 'validationErrors' in error ? (error as { validationErrors?: string[] }).validationErrors || [] : [];
      
      if (validationErrors.length > 0) {
        const mappedErrors: Record<string, string> = {};
        
        validationErrors.forEach((err: string) => {
          if (err.toLowerCase().includes("número") || err.toLowerCase().includes("tarjeta")) {
            mappedErrors.cardNumber = err;
          } else if (err.toLowerCase().includes("nombre")) {
            mappedErrors.cardName = err;
          } else if (err.toLowerCase().includes("vencimiento") || err.toLowerCase().includes("vencida") || err.toLowerCase().includes("mes")) {
            mappedErrors.expiryDate = err;
          } else if (err.toLowerCase().includes("cvc")) {
            mappedErrors.cvc = err;
          }
        });
        
        setFieldErrors(mappedErrors);
        setError("Por favor, corrige los errores en el formulario.");
      } else {
        setError(error instanceof Error ? error.message : "Error al procesar el pago");
      }
      
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

  const calculateTotalVal = () => {
    return order ? Number(order.total) : calculateTotal(subtotal);
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotalVal();

  return {
    // Estados
    loading,
    cartItems,
    order,
    error,
    processing,
    orderExpired,
    cardData,
    fieldErrors,

    // Cálculos
    subtotal,
    tax,
    total,

    // Acciones
    handleCheckout,
    handleCancelCheckout,
    handleOrderExpired,
    handleRestartCheckout,
    setCardData: (data: SetStateAction<{ cardNumber: string; cardName: string; expiryDate: string; cvc: string }>) => {
      setCardData(data);
      setFieldErrors({}); // Limpiar errores al interactuar
    },

    // Utilidades
    router,
  };
};
