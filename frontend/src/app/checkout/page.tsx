"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useReservation } from '@/contexts/ReservationContext'
import { processCheckout, getUserCart, createStockReservation, cancelCheckout } from '@/services/checkoutService'
import { IOrder } from '@/types/Order'
import { ICartItem, ICartResponse } from '@/types/Cart'
import { IStockReservationResponse } from '@/types/StockReservation'

// Componentes modularizados
import { ReservationTimer } from '@/components/checkout/ReservationTimer'
import { PaymentForm } from '@/components/checkout/PaymentForm'
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation'
import { CartPreview } from '@/components/checkout/CartPreview'
import { LoadingState, EmptyCartState, CheckoutErrorState } from '@/components/checkout/CheckoutStates'

// Utilidades
import { 
  cleanPaymentData
} from '@/utils/paymentFormatters'
import { 
  calculateSubtotalFromCart, 
  calculateSubtotalFromOrder,
  calculateTax,
  calculateTotal,
  validatePaymentData
} from '@/utils/checkoutHelpers'

// Hook personalizado para la lógica del checkout
const useCheckoutLogic = () => {
  const router = useRouter()
  const { setReservation: setGlobalReservation, clearReservation } = useReservation()
  
  // Estados
  const [loading, setLoading] = useState<boolean>(true)
  const [cartItems, setCartItems] = useState<ICartItem[]>([])
  const [order, setOrder] = useState<IOrder | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)
  const [reservation, setReservation] = useState<IStockReservationResponse | null>(null)
  const [reservationExpired, setReservationExpired] = useState<boolean>(false)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: ''
  })

  // Efecto de inicialización
  useEffect(() => {
    const initializeCheckout = async () => {
      setLoading(true)
      setError(null)
      setReservationExpired(false)
      
      try {
        const cartData: ICartResponse = await getUserCart()
        setCartItems(cartData.items || [])
        
        if (cartData.items.length === 0) {
          router.push('/cart')
          return
        }

        const reservationData = await createStockReservation()
        setReservation(reservationData)
        setGlobalReservation(reservationData)
        
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al inicializar el checkout'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    initializeCheckout()
  }, [router, setGlobalReservation])

  const handleCheckout = async () => {
    // Validar reserva
    if (reservationExpired || !reservation) {
      setError('No puedes procesar el pago sin una reserva válida. Por favor, crea una nueva reserva.')
      return
    }

    // Validar datos de pago
    const validationError = validatePaymentData(cardData)
    if (validationError) {
      setError(validationError)
      return
    }

    setProcessing(true)
    setError(null)
    
    try {
      const cleanData = cleanPaymentData(cardData)
      const orderData = await processCheckout(cleanData)
      setOrder(orderData)
      setLoading(false)
      setProcessing(false)
      clearReservation()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago'
      setError(errorMessage)
      setProcessing(false)
    }
  }

  const handleCancelCheckout = async () => {
    try {
      await cancelCheckout()
      clearReservation()
      router.push('/cart')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cancelar el checkout'
      setError(errorMessage)
    }
  }

  const handleReservationExpired = () => {
    setReservationExpired(true)
    setError('Tu reserva de stock ha expirado. Por favor, crea una nueva reserva para continuar.')
  }

  const handleExtendReservation = async () => {
    try {
      const reservationData = await createStockReservation()
      setReservation(reservationData)
      setGlobalReservation(reservationData)
      setReservationExpired(false)
      setError(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al extender la reserva'
      setError(errorMessage)
    }
  }

  // Cálculos
  const calculateSubtotal = () => {
    return order ? calculateSubtotalFromOrder(order) : calculateSubtotalFromCart(cartItems)
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax(subtotal)
  const total = calculateTotal(subtotal)

  return {
    // Estados
    loading,
    cartItems,
    order,
    error,
    processing,
    reservation,
    reservationExpired,
    cardData,
    
    // Cálculos
    subtotal,
    tax,
    total,
    
    // Acciones
    handleCheckout,
    handleCancelCheckout,
    handleReservationExpired,
    handleExtendReservation,
    setCardData,
    
    // Utilidades
    router
  }
}

// Componente principal
const CheckoutPage = () => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const checkoutLogic = useCheckoutLogic()

  // Redirección si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Estados de carga
  if (checkoutLogic.loading) {
    return <LoadingState />
  }

  if (checkoutLogic.cartItems.length === 0 && !checkoutLogic.order) {
    return <EmptyCartState onBackToCart={() => router.push('/cart')} />
  }

  // Confirmación de orden
  if (checkoutLogic.order) {
    return <OrderConfirmation order={checkoutLogic.order} />
  }

  // Vista principal de checkout
  return <CheckoutMainView {...checkoutLogic} />
}

// Vista principal del checkout
const CheckoutMainView: React.FC<ReturnType<typeof useCheckoutLogic>> = ({
  cartItems,
  error,
  processing,
  reservation,
  reservationExpired,
  cardData,
  subtotal,
  tax,
  total,
  handleCheckout,
  handleCancelCheckout,
  handleReservationExpired,
  handleExtendReservation,
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
            <PaymentForm 
              cardData={cardData}
              setCardData={setCardData}
            />
          </div>
          
          <div>
            <CheckoutSummary 
              subtotal={subtotal}
              tax={tax}
              total={total}
              processing={processing}
              reservationExpired={reservationExpired}
              reservation={reservation}
              onCheckout={handleCheckout}
              onCancelCheckout={handleCancelCheckout}
              onReservationExpired={handleReservationExpired}
              onExtendReservation={handleExtendReservation}
            />
                  </div>
        </div>
      </div>
    </div>
  )
}

// Header del checkout
const CheckoutHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#2e4b30]">Checkout</h1>
    </div>
  )
}

// Resumen del checkout
const CheckoutSummary: React.FC<{
  subtotal: number
  tax: number
  total: number
  processing: boolean
  reservationExpired: boolean
  reservation: IStockReservationResponse | null
  onCheckout: () => void
  onCancelCheckout: () => void
  onReservationExpired: () => void
  onExtendReservation: () => void
}> = ({
  subtotal,
  tax,
  total,
  processing,
  reservationExpired,
  reservation,
  onCheckout,
  onCancelCheckout,
  onReservationExpired,
  onExtendReservation
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6">
      <ReservationTimer 
        reservation={reservation}
        onExpired={onReservationExpired}
        onExtend={onExtendReservation}
      />
      
      <CheckoutTotals subtotal={subtotal} tax={tax} total={total} />
      
      <CheckoutActions 
        processing={processing}
        reservationExpired={reservationExpired}
        onCheckout={onCheckout}
        onCancelCheckout={onCancelCheckout}
      />
    </div>
  )
}

// Totales del checkout
const CheckoutTotals: React.FC<{
  subtotal: number
  tax: number
  total: number
}> = ({ subtotal, tax, total }) => {
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
  )
}

// Acciones del checkout
const CheckoutActions: React.FC<{
  processing: boolean
  reservationExpired: boolean
  onCheckout: () => void
  onCancelCheckout: () => void
}> = ({ processing, reservationExpired, onCheckout, onCancelCheckout }) => {
  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={onCheckout}
        disabled={processing || reservationExpired}
        className="w-full bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {processing ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Procesando...
          </>
        ) : (
          'Confirmar Pago'
        )}
      </button>
      
      <button
        onClick={onCancelCheckout}
        disabled={processing}
        className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancelar Checkout
      </button>
      
      <button
        onClick={() => window.history.back()}
        className="w-full bg-[#2e4b30]/10 text-[#2e4b30] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/20 transition-all duration-200 font-medium"
      >
        Volver al Carrito
      </button>
    </div>
  )
}

export default CheckoutPage
