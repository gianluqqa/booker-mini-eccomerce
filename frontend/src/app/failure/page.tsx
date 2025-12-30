"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { XCircle, Loader2, Home, ShoppingCart, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const FailurePage = () => {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId')
    if (orderIdParam) {
      setOrderId(orderIdParam)
    }
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5efe1] pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin mx-auto mb-4" />
          <p className="text-[#2e4b30] text-lg">Procesando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-8 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#2e4b30] mb-4">
            Pago Fallido
          </h1>
          <p className="text-[#2e4b30]/70 text-lg mb-8">
            Lamentamos las molestias. Tu pago no pudo ser procesado. Por favor, intenta nuevamente.
          </p>

          {orderId && (
            <div className="bg-[#f5efe1]/30 rounded-lg p-6 mb-6">
              <p className="text-sm text-[#2e4b30]/70 mb-2">Número de Orden</p>
              <p className="text-xl font-bold text-[#2e4b30]">{orderId}</p>
            </div>
          )}

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>¿Qué sucedió?</strong> El pago fue cancelado o rechazado. Esto puede ocurrir por problemas con la tarjeta, fondos insuficientes, o si decidiste cancelar la transacción.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Recomendación:</strong> Verifica los datos de tu método de pago o intenta con otro método. Tu orden sigue activa y puedes completar el pago cuando quieras.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/checkout"
              className="flex-1 bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium text-center flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reintentar Pago
            </Link>
            <Link
              href="/cart"
              className="flex-1 bg-[#2e4b30]/10 text-[#2e4b30] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/20 transition-all duration-200 font-medium text-center flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Ver Carrito
            </Link>
            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium text-center flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FailurePage
