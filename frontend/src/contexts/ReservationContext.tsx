"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { checkExistingReservation } from '@/services/checkoutService'
import { IStockReservationResponse } from '@/types/StockReservation'

interface ReservationContextType {
  reservation: IStockReservationResponse | null
  timeLeft: number
  isVisible: boolean
  checkReservation: () => Promise<void>
  clearReservation: () => void
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined)

export const useReservation = () => {
  const context = useContext(ReservationContext)
  if (!context) {
    throw new Error('useReservation debe ser usado dentro de ReservationProvider')
  }
  return context
}

interface ReservationProviderProps {
  children: React.ReactNode
}

export const ReservationProvider: React.FC<ReservationProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [reservation, setReservation] = useState<IStockReservationResponse | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  // Verificar si existe reserva activa
  const checkReservation = useCallback(async () => {
    if (!isAuthenticated) {
      setReservation(null)
      setIsVisible(false)
      return
    }

    try {
      const existingReservation = await checkExistingReservation()
      
      if (existingReservation) {
        // Asegurar que totalAmount sea número
        const normalizedReservation = {
          ...existingReservation,
          totalAmount: Number(existingReservation.totalAmount)
        }
        setReservation(normalizedReservation)
        setIsVisible(true)
      } else {
        setReservation(null)
        setIsVisible(false)
      }
    } catch {
      setReservation(null)
      setIsVisible(false)
    }
  }, [isAuthenticated])

  // Limpiar reserva
  const clearReservation = () => {
    setReservation(null)
    setIsVisible(false)
    setTimeLeft(0)
  }

  // Calcular tiempo restante
  useEffect(() => {
    if (!reservation) {
      setTimeLeft(0)
      return
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expiresAt = new Date(reservation.expiresAt).getTime()
      const difference = expiresAt - now

      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000))
      } else {
        setTimeLeft(0)
        clearReservation()
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [reservation])

  // Verificar reserva cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated) {
      checkReservation()
    } else {
      clearReservation()
    }
  }, [isAuthenticated, checkReservation])

  // Verificar periódicamente si hay reserva activa
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(checkReservation, 30000) // Verificar cada 30 segundos
    return () => clearInterval(interval)
  }, [isAuthenticated, checkReservation])

  const value: ReservationContextType = {
    reservation,
    timeLeft,
    isVisible,
    checkReservation,
    clearReservation
  }

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  )
}
