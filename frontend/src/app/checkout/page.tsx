"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle2, Loader2, CreditCard, Package, AlertCircle, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { checkout, getUserCart } from '@/services/cartService'
import { IOrder } from '@/types/Order'
import { ICartItem, ICartResponse } from '@/types/Cart'

const CheckoutPage = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState<boolean>(true)
  const [cartItems, setCartItems] = useState<ICartItem[]>([])
  const [order, setOrder] = useState<IOrder | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchCart = async () => {
      setLoading(true)
      setError(null)
      try {
        const cartData: ICartResponse = await getUserCart()
        setCartItems(cartData.items || [])
        
        if (cartData.items.length === 0) {
          router.push('/cart')
          return
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar el carrito'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [isAuthenticated, router])

  const handleCheckout = async () => {
    setProcessing(true)
    setError(null)
    
    try {
      const orderData = await checkout()
      setOrder(orderData)
      setLoading(false)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago'
      setError(errorMessage)
      setProcessing(false)
    }
  }

  const calculateSubtotal = () => {
    if (order) {
      return order.items.reduce((total, item) => total + item.totalPrice, 0)
    }
    // Calcular desde el carrito si aún no hay orden
    return cartItems.reduce((total, item) => total + (item.book.price * item.quantity), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.21 // 21% IVA
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin mx-auto mb-4" />
              <p className="text-[#2e4b30] text-lg">Cargando carrito...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0 && !order) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-8 text-center">
            <ShoppingBag className="w-24 h-24 text-[#2e4b30]/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#2e4b30] mb-4">Tu carrito está vacío</h2>
            <p className="text-[#2e4b30]/70 mb-8">No hay productos para procesar el checkout</p>
            <Link
              href="/cart"
              className="bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium inline-block"
            >
              Volver al Carrito
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Si ya se procesó la orden, mostrar confirmación
  if (order) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Confirmación de Orden */}
          <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-8 text-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#2e4b30] mb-4">
              ¡Orden Confirmada!
            </h1>
            <p className="text-[#2e4b30]/70 text-lg mb-8">
              Tu pedido ha sido procesado exitosamente
            </p>

            {/* Detalles de la Orden */}
            <div className="bg-[#f5efe1]/30 rounded-lg p-6 mb-6 text-left">
              <div className="mb-4">
                <p className="text-sm text-[#2e4b30]/70">Número de Orden</p>
                <p className="text-lg font-bold text-[#2e4b30]">{order.id}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-[#2e4b30]/70">Estado</p>
                <p className="text-lg font-semibold text-[#2e4b30] capitalize">
                  {order.status === 'pending' ? 'Pendiente' : order.status}
                </p>
              </div>
              {order.createdAt && (
                <div>
                  <p className="text-sm text-[#2e4b30]/70">Fecha</p>
                  <p className="text-lg font-medium text-[#2e4b30]">
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Resumen de Items */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#2e4b30] mb-4 text-left">
                Resumen de tu Pedido
              </h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 bg-[#f5efe1]/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-[#2e4b30]">
                        {item.book.title}
                      </p>
                      <p className="text-sm text-[#2e4b30]/70">
                        {item.quantity} x ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-[#2e4b30]">
                      ${item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-[#2e4b30]/20 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold text-[#2e4b30] mb-2">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#2e4b30] mb-2">
                <span>Impuestos (21%)</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-[#2e4b30] pt-2 border-t border-[#2e4b30]/20">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Nota sobre el pago */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Por ahora, el pago se procesa de forma simple. 
                Próximamente se integrará Mercado Pago para procesar los pagos de forma segura.
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium text-center"
              >
                Volver al Inicio
              </Link>
              <Link
                href="/profile"
                className="flex-1 bg-[#2e4b30]/10 text-[#2e4b30] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/20 transition-all duration-200 font-medium text-center"
              >
                Ver Mis Pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Página de checkout inicial con previsualización
  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2e4b30]">Checkout</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Previsualización de Productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6 mb-6">
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-[#2e4b30] mr-2" />
                <h2 className="text-xl font-bold text-[#2e4b30]">
                  Previsualización de tu Pedido
                </h2>
              </div>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 bg-[#f5efe1]/30 rounded-lg"
                  >
                    {/* Imagen del Libro */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.book.image || ''}
                        alt={item.book.title}
                        width={80}
                        height={120}
                        className="w-20 h-28 object-cover rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Detalles del Libro */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[#2e4b30] truncate">
                        {item.book.title}
                      </h3>
                      <p className="text-[#2e4b30]/70 text-sm mb-1">
                        por {item.book.author}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-sm text-[#2e4b30]/70">
                          Cantidad: <span className="font-semibold">{item.quantity}</span>
                        </p>
                        <p className="text-sm text-[#2e4b30]/70">
                          Precio unitario: <span className="font-semibold">${item.book.price.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Precio Total del Item */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#2e4b30]">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Información de Pago */}
            <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-[#2e4b30] mr-2" />
                <h2 className="text-xl font-bold text-[#2e4b30]">
                  Información de Pago
                </h2>
              </div>
              <div className="space-y-4 mb-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-[#2e4b30] mb-1">
                    Número de tarjeta
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-[#2e4b30]/20 rounded-lg focus:ring-2 focus:ring-[#2e4b30]/50 focus:border-[#2e4b30] outline-none transition-all duration-200 text-[#2e4b30] placeholder:text-[#2e4b30]/50"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-[#2e4b30] mb-1">
                    Nombre en la tarjeta
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    placeholder="JUAN PEREZ"
                    className="w-full px-4 py-2 border border-[#2e4b30]/20 rounded-lg focus:ring-2 focus:ring-[#2e4b30]/50 focus:border-[#2e4b30] outline-none transition-all duration-200 text-[#2e4b30] placeholder:text-[#2e4b30]/50"
                    value={cardData.cardName}
                    onChange={(e) => setCardData({...cardData, cardName: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-[#2e4b30] mb-1">
                      Vencimiento (MM/AA)
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      placeholder="12/25"
                      className="w-full px-4 py-2 border border-[#2e4b30]/20 rounded-lg focus:ring-2 focus:ring-[#2e4b30]/50 focus:border-[#2e4b30] outline-none transition-all duration-200 text-[#2e4b30] placeholder:text-[#2e4b30]/50"
                      value={cardData.expiryDate}
                      onChange={(e) => setCardData({...cardData, expiryDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-[#2e4b30] mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cvc"
                      placeholder="123"
                      className="w-full px-4 py-2 border border-[#2e4b30]/20 rounded-lg focus:ring-2 focus:ring-[#2e4b30]/50 focus:border-[#2e4b30] outline-none transition-all duration-200 text-[#2e4b30] placeholder:text-[#2e4b30]/50"
                      value={cardData.cvc}
                      onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Esta es una simulación. Los datos de pago no se envían a ningún servidor.
                </p>
              </div>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#2e4b30] mb-6">
                Resumen del Pedido
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#2e4b30]">
                  <span>
                    Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} artículos)
                  </span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2e4b30]">
                  <span>Impuestos (21%)</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="border-t border-[#2e4b30]/20 pt-4">
                  <div className="flex justify-between text-[#2e4b30] text-lg font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleCheckout}
                  disabled={processing || !cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvc}
                  className="w-full bg-[#2e4b30] text-[#f5efe1] py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title={!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvc ? "Por favor complete todos los datos de la tarjeta" : ""}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Pago'
                  )}
                </button>
                <button
                  onClick={() => router.back()}
                  className="w-full bg-[#2e4b30]/10 text-[#2e4b30] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/20 transition-all duration-200 font-medium"
                >
                  Volver al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
