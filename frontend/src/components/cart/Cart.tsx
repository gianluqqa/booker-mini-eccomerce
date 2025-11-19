"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ICartItem } from '@/types/Cart'
import { getUserCart } from '@/services/cartService'
import { useAuth } from '@/contexts/AuthContext'

const Cart = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState<ICartItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchCart = async () => {
      setLoading(true)
      setError(null)
      try {
        const cartData = await getUserCart()
        setCartItems(cartData.items || [])
      } catch (err: any) {
        setError(err?.message || 'Error al cargar el carrito')
        setCartItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [isAuthenticated, router])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId)
      return
    }
    // TODO: Implementar actualización de cantidad en el carrito usando el servicio
    // Por ahora solo actualizamos el estado local
    setCartItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = async (itemId: string) => {
    // TODO: Implementar eliminación de item del carrito usando el servicio
    // Por ahora solo actualizamos el estado local
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.book.price * item.quantity), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.21 // 21% IVA
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleCheckout = () => {
    // Aquí iría la lógica para proceder al pago
    console.log('Proceder al checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <Link 
                href="/"
                className="bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium inline-block"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Encabezado */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => router.back()}
              className="text-[#2e4b30] hover:bg-[#2e4b30]/10 p-2 rounded-lg transition-all duration-200 mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-[#2e4b30]">Carrito de Compras</h1>
          </div>

          {/* Carrito Vacío */}
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-[#2e4b30]/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#2e4b30] mb-4">Tu carrito está vacío</h2>
            <p className="text-[#2e4b30]/70 mb-8">¡Añade algunos libros para comenzar!</p>
            <Link 
              href="/"
              className="bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Encabezado */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.back()}
            className="text-[#2e4b30] hover:bg-[#2e4b30]/10 p-2 rounded-lg transition-all duration-200 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-[#2e4b30]">Carrito de Compras</h1>
          <span className="ml-4 bg-[#2e4b30] text-[#f5efe1] px-3 py-1 rounded-full text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Artículos del Carrito */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#2e4b30] mb-6">Artículos del Carrito</h2>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-[#f5efe1]/30 rounded-lg">
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
                        <p className="text-lg font-bold text-[#2e4b30]">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Controles de Cantidad */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-[#2e4b30]/10 hover:bg-[#2e4b30]/20 text-[#2e4b30] p-1.5 rounded-lg transition-all duration-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-[#2e4b30] font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-[#2e4b30]/10 hover:bg-[#2e4b30]/20 text-[#2e4b30] p-1.5 rounded-lg transition-all duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Botón de Eliminar */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#2e4b30] mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#2e4b30]">
                  <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} artículos)</span>
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

              <button
                onClick={handleCheckout}
                className="w-full bg-[#2e4b30] text-[#f5efe1] py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium text-lg mb-4"
              >
                Proceder al Pago
              </button>

              <Link 
                href="/"
                className="block w-full text-center text-[#2e4b30] hover:text-[#2e4b30]/70 transition-colors duration-200 font-medium"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart