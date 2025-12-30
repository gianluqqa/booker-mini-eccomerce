// Servicios para operaciones de pago con Mercado Pago

import { apiClient, extractData } from '@/config/api'

export interface PaymentRequest {
  orderId: string
}

export interface PaymentResponse {
  success: boolean
  message: string
  data: {
    init_point: string
    preferenceId: string
    orderId: string
  }
}

/**
 * Crea una preferencia de pago con Mercado Pago
 * @param paymentRequest Datos del pago (orderId)
 * @returns URL de redirección a Mercado Pago
 * @throws Error si no se puede crear el pago
 */
export const createMercadoPagoPayment = async (paymentRequest: PaymentRequest): Promise<PaymentResponse> => {
  try {
    console.log('🚀 Enviando solicitud de pago:', paymentRequest)
    const response = await apiClient.post<PaymentResponse>('/payments/create-payment', paymentRequest)
    console.log('📨 Respuesta del backend:', response)
    const data = extractData<PaymentResponse>(response)
    console.log('✅ Datos extraídos:', data)
    return data
  } catch (error: unknown) {
    console.error('❌ Error en createMercadoPagoPayment:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error al crear el pago con Mercado Pago'
    throw new Error(errorMessage)
  }
}
