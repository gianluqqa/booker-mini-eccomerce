"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clock, Loader2, CreditCard, AlertCircle } from 'lucide-react'

const PendingPaymentPage = () => {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId')
    const redirectUrlParam = searchParams.get('redirectUrl')
    
    if (orderIdParam) {
      setOrderId(orderIdParam)
    }
    
    if (redirectUrlParam) {
      setRedirectUrl(decodeURIComponent(redirectUrlParam))
    }
    
    setLoading(false)
  }, [searchParams])

  useEffect(() => {
    if (!loading && redirectUrl && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      
      return () => clearTimeout(timer)
    } else if (!loading && redirectUrl && countdown === 0) {
      window.location.href = redirectUrl
    }
  }, [loading, redirectUrl, countdown])

  const handlePayNow = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

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
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Clock className="w-20 h-20 text-yellow-500 animate-pulse" />
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {countdown}
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-[#2e4b30] mb-4">
            Orden Pendiente de Pago
          </h1>
          
          <p className="text-[#2e4b30]/70 text-lg mb-8">
            Tu orden ha sido creada exitosamente. Serás redirigido a la plataforma de pago segura de Mercado Pago para completar tu compra.
          </p>

          {orderId && (
            <div className="bg-[#f5efe1]/30 rounded-lg p-6 mb-6">
              <p className="text-sm text-[#2e4b30]/70 mb-2">Número de Orden</p>
              <p className="text-xl font-bold text-[#2e4b30]">{orderId}</p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  Redirección automática en {countdown} segundos
                </p>
                <p className="text-sm text-yellow-700">
                  Estás siendo redirigido a Mercado Pago, donde podrás elegir tu método de pago preferido de forma segura.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Métodos de pago disponibles
                </p>
                <p className="text-sm text-blue-700">
                  Tarjeta de crédito/débito, transferencia bancaria, efectivo (Pago Fácil, Rapipago) y más opciones seguras.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePayNow}
              disabled={!redirectUrl}
              className="flex-1 bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {redirectUrl ? (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pagar Ahora con Mercado Pago
                </>
              ) : (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Preparando pago...
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-sm text-[#2e4b30]/60">
            <p>
              Una vez completado el pago, serás redirigido automáticamente a la página de confirmación de tu orden.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PendingPaymentPage
