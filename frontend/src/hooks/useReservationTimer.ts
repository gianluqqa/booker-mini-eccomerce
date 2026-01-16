import { useState, useEffect } from 'react'
import { ITimerState } from '@/types/StockReservation'

/**
 * Hook personalizado para manejar el temporizador de reserva de stock
 * @param expiresAt Fecha de expiración de la reserva
 * @param onExpired Callback cuando el temporizador expira
 * @returns Estado del temporizador y función de limpieza
 */
export const useReservationTimer = (
  expiresAt: string | null,
  onExpired?: () => void
) => {
  const [timer, setTimer] = useState<ITimerState>({
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    if (!expiresAt) return

    const calculateTimeRemaining = () => {
      if (!expiresAt) return { minutes: 0, seconds: 0, isExpired: true }

      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const difference = expiry - now

      if (difference <= 0) {
        return { minutes: 0, seconds: 0, isExpired: true }
      }

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { minutes, seconds, isExpired: false }
    }

    const updateTimer = () => {
      const newTimer = calculateTimeRemaining()
      setTimer(newTimer)

      if (newTimer.isExpired && onExpired) {
        onExpired()
      }
    }

    // Actualizar inmediatamente
    updateTimer()

    // Configurar intervalo para actualizar cada segundo
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpired])

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return {
    ...timer,
    formattedTime: formatTime(timer.minutes, timer.seconds),
    isWarning: timer.minutes === 0 && timer.seconds <= 30 && !timer.isExpired,
    isDanger: timer.minutes === 0 && timer.seconds <= 10 && !timer.isExpired
  }
}
