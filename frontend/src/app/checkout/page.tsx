"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useReservation } from '@/contexts/ReservationContext'
import { startCheckout, processPayment, checkPendingOrder, cancelCheckout, getUserCart } from '@/services/checkoutService'
import { IOrder } from '@/types/Order'
import { ICartItem, ICartResponse } from '@/types/Cart'

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
  const { clearReservation } = useReservation()
  
  // Estados
  const [loading, setLoading] = useState<boolean>(true)
  const [cartItems, setCartItems] = useState<ICartItem[]>([])
  const [order, setOrder] = useState<IOrder | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)
  const [orderExpired, setOrderExpired] = useState<boolean>(false)
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
      setOrderExpired(false)
      
      try {
        // Obtener carrito primero
        const cartData: ICartResponse = await getUserCart()
        setCartItems(cartData.items || [])
        
        if (cartData.items.length === 0) {
          router.push('/cart')
          return
        }

        // Verificar si ya existe una orden PENDING
        console.log('🔍 Verificando si existe orden PENDING...')
        const existingOrder = await checkPendingOrder()
        
        if (existingOrder) {
          console.log('✅ Orden PENDING existente encontrada:', existingOrder)
          setOrder(existingOrder)
          
          // Verificar si la orden ha expirado
          if (existingOrder.expiresAt) {
            const expiryTime = new Date(existingOrder.expiresAt).getTime()
            const now = new Date().getTime()
            
            if (expiryTime <= now) {
              console.log('⏰ La orden PENDING ha expirado')
              setOrderExpired(true)
              setError('Tu orden ha expirado. Por favor, inicia un nuevo checkout.')
            }
          }
        } else {
          // Crear nueva orden PENDING
          console.log('🆕 Creando nueva orden PENDING...')
          const newOrder = await startCheckout()
          setOrder(newOrder)
          console.log('✅ Orden PENDING creada:', newOrder)
        }
        
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al inicializar el checkout'
        setError(errorMessage)
        console.error('❌ Error en initializeCheckout:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeCheckout()
  }, [router])

  const handleCheckout = async () => {
    // Validar que haya una orden PENDING y no haya expirado
    if (!order || order.status !== 'pending') {
      setError('No hay una orden válida para procesar el pago.')
      return
    }

    if (orderExpired) {
      setError('Tu orden ha expirado. Por favor, inicia un nuevo checkout.')
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
      console.log('💳 Procesando pago de orden PENDING...')
      const paidOrder = await processPayment(cleanData)
      setOrder(paidOrder)
      setLoading(false)
      setProcessing(false)
      clearReservation()
      console.log('✅ Pago procesado exitosamente:', paidOrder)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago'
      setError(errorMessage)
      setProcessing(false)
      console.error('❌ Error en handleCheckout:', error)
    }
  }

  const handleCancelCheckout = async () => {
    try {
      await cancelCheckout()
      clearReservation()
      setOrder(null)
      router.push('/cart')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cancelar el checkout'
      setError(errorMessage)
    }
  }

  const handleOrderExpired = () => {
    setOrderExpired(true)
    setError('Tu orden ha expirado. Por favor, inicia un nuevo checkout para continuar.')
  }

  const handleRestartCheckout = async () => {
    try {
      setLoading(true)
      setError(null)
      setOrderExpired(false)
      
      // Cancelar checkout actual
      await cancelCheckout()
      setOrder(null)
      
      // Crear nueva orden PENDING
      const newOrder = await startCheckout()
      setOrder(newOrder)
      
      setLoading(false)
      console.log('✅ Nuevo checkout iniciado:', newOrder)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al reiniciar el checkout'
      setError(errorMessage)
      setLoading(false)
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

  // Confirmación de orden solo si está PAID
  if (checkoutLogic.order && checkoutLogic.order.status === 'paid') {
    return <OrderConfirmation order={checkoutLogic.order} />
  }

  // Vista principal de checkout
  return <CheckoutMainView {...checkoutLogic} />
}

// Vista principal del checkout
const CheckoutMainView: React.FC<ReturnType<typeof useCheckoutLogic>> = ({
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
  orderExpired: boolean
  order: IOrder | null
  onCheckout: () => void
  onCancelCheckout: () => void
  onOrderExpired: () => void
  onRestartCheckout: () => void
}> = ({
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
    <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6">
      <ReservationTimer 
        order={order}
        onExpired={onOrderExpired}
      />
      
      <CheckoutTotals subtotal={subtotal} tax={tax} total={total} />
      
      <CheckoutActions 
        processing={processing}
        orderExpired={orderExpired}
        onCheckout={onCheckout}
        onCancelCheckout={onCancelCheckout}
        onRestartCheckout={onRestartCheckout}
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
  orderExpired: boolean
  onCheckout: () => void
  onCancelCheckout: () => void
  onRestartCheckout: () => void
}> = ({ processing, orderExpired, onCheckout, onCancelCheckout, onRestartCheckout }) => {
  return (
    <div className="mt-6 space-y-3">
      {!orderExpired ? (
        <button
          onClick={onCheckout}
          disabled={processing}
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
      ) : (
        <button
          onClick={onRestartCheckout}
          disabled={processing}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Reiniciando...
            </>
          ) : (
            'Iniciar Nuevo Checkout'
          )}
        </button>
      )}
      
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
