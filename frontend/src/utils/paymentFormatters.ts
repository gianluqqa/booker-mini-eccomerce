import React, { ChangeEvent } from 'react'

// Formatear número de tarjeta (agregar espacios cada 4 dígitos)
export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = matches && matches[0] || ''
  const parts = []
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }
  if (parts.length) {
    return parts.join(' ')
  } else {
    return v
  }
}

// Formatear fecha de vencimiento (MM/YY)
export const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) {
    return v.slice(0, 2) + '/' + v.slice(2, 4)
  }
  return v
}

// Limpiar datos de pago para enviar al backend
export const cleanPaymentData = (cardData: {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvc: string;
}) => {
  return {
    cardNumber: cardData.cardNumber.replace(/\s+/g, ''), // Eliminar espacios
    cardName: cardData.cardName.trim(),
    expiryDate: cardData.expiryDate,
    cvc: cardData.cvc
  }
}

// Manejador de cambio para número de tarjeta
export const handleCardNumberChange = (
  e: ChangeEvent<HTMLInputElement>,
  setCardData: React.Dispatch<React.SetStateAction<{ cardNumber: string; cardName: string; expiryDate: string; cvc: string }>>
) => {
  const formatted = formatCardNumber(e.target.value)
  setCardData((prev) => ({ ...prev, cardNumber: formatted }))
}

// Manejador de cambio para fecha de vencimiento
export const handleExpiryDateChange = (
  e: ChangeEvent<HTMLInputElement>,
  setCardData: React.Dispatch<React.SetStateAction<{ cardNumber: string; cardName: string; expiryDate: string; cvc: string }>>
) => {
  const formatted = formatExpiryDate(e.target.value)
  setCardData((prev) => ({ ...prev, expiryDate: formatted }))
}
