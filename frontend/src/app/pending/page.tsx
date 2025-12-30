"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clock, Loader2, Home, Package } from 'lucide-react'
import Link from 'next/link'

const PendingPage = () => {
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
          <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#2e4b30] mb-4">
            Pago Pendiente
          </h1>
          <p className="text-[#2e4b30]/70 text-lg mb-8">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
          </p>

          {orderId && (
            <div className="bg-[#f5efe1]/30 rounded-lg p-6 mb-6">
              <p className="text-sm text-[#2e4b30]/70 mb-2">Número de Orden</p>
              <p className="text-xl font-bold text-[#2e4b30]">{orderId}</p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>¿Qué significa?</strong> Tu pago está en proceso de verificación. Esto puede ocurrir con pagos en efectivo, transferencias bancarias, o cuando el método de pago requiere aprobación manual.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Próximos pasos:</strong> Recibirás un correo electrónico cuando tu pago sea aprobado. También puedes verificar el estado de tu orden en tu perfil.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/profile"
              className="flex-1 bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium text-center flex items-center justify-center"
            >
              <Package className="w-5 h-5 mr-2" />
              Ver Mis Pedidos
            </Link>
            <Link
              href="/"
              className="flex-1 bg-[#2e4b30]/10 text-[#2e4b30] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/20 transition-all duration-200 font-medium text-center flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PendingPage
