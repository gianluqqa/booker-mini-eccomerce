"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Clock, AlertCircle, ShoppingBag, Move } from 'lucide-react'
import Link from 'next/link'
import { useReservation } from '@/contexts/ReservationContext'
import { usePathname } from 'next/navigation'

interface GlobalReservationTimerProps {
  className?: string
}

export const GlobalReservationTimer: React.FC<GlobalReservationTimerProps> = ({ className = "" }) => {
  const { reservation, timeLeft, isVisible } = useReservation()
  const [position, setPosition] = useState({ x: 0, y: 0 }) // Posición inicial se establece en useEffect
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname() // Obtener la ruta actual

  // Establecer posición inicial solo en el cliente
  useEffect(() => {
    setPosition({ x: window.innerWidth - 350, y: 120 })
  }, [])

  // Formatear el tiempo
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Determinar el color según el tiempo restante
  const getTimeColor = (): string => {
    if (timeLeft > 300) return 'text-[#f5efe1]' // Beige - Más de 5 minutos
    if (timeLeft > 120) return 'text-[#fef3c7]' // Beige claro - Más de 2 minutos
    return 'text-[#fef2f2]' // Beige muy claro - Menos de 2 minutos
  }

  const getTimeBgColor = (): string => {
    if (timeLeft > 300) return 'bg-[#f5efe1]/20' // Beige con opacidad
    if (timeLeft > 120) return 'bg-[#fef3c7]/20' // Beige claro con opacidad
    return 'bg-[#fef2f2]/20' // Beige muy claro con opacidad
  }

  const getProgressColor = (): string => {
    if (timeLeft > 300) return 'bg-[#f5efe1]' // Beige
    if (timeLeft > 120) return 'bg-[#fef3c7]' // Beige claro
    return 'bg-[#fef2f2]' // Beige muy claro
  }

  // Animación de flotación suave
  useEffect(() => {
    if (!isVisible) return

    const animateFloat = () => {
      const duration = 8000 // 8 segundos para ciclo completo
      const startTime = Date.now()
      
      const animate = () => {
        if (!isVisible) return
        
        const elapsed = Date.now() - startTime
        const progress = (elapsed % duration) / duration
        
        // Movimiento suave en forma de 8
        const x = Math.sin(progress * Math.PI * 2) * 30
        const y = Math.sin(progress * Math.PI * 4) * 20
        
        setPosition({ x, y })
      }
      
      const animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }
    
    const cleanup = animateFloat()
    return cleanup
  }, [isVisible])

  // Manejo del drag - solo al presionar el botón
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault() // Evitar selección de texto
    
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    
    const handleMouseMove = (e: MouseEvent) => {
      // Limitar para no salir de la pantalla
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height
      const minY = 80 // altura del navbar + margen
      
      const newX = Math.max(0, Math.min(e.clientX - offsetX, maxX))
      const newY = Math.max(minY, Math.min(e.clientY - offsetY, maxY))
      
      setPosition({ x: newX, y: newY })
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Manejo del drag táctil
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const touch = e.touches[0]
    const offsetX = touch.clientX - rect.left
    const offsetY = touch.clientY - rect.top
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height
      const minY = 80
      
      const newX = Math.max(0, Math.min(touch.clientX - offsetX, maxX))
      const newY = Math.max(minY, Math.min(touch.clientY - offsetY, maxY))
      
      setPosition({ x: newX, y: newY })
    }
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  // No mostrar el temporizador global si estamos en checkout
  if (pathname === '/checkout' || !isVisible || !reservation || timeLeft <= 0) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 bg-[#2e4b30] border border-[#2e4b30]/30 rounded-2xl shadow-2xl p-5 max-w-sm transform transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm cursor-grab ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Header con ícono y tiempo */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center space-x-3 ${getTimeColor()}`}>
          <div className={`p-2 rounded-full ${getTimeBgColor()}`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono font-bold text-xl">
              {formatTime(timeLeft)}
            </span>
            <div className="flex items-center space-x-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${getProgressColor()} animate-pulse`}></div>
              <span className="text-xs font-medium text-[#f5efe1]/90">
                Activa
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <ShoppingBag className="w-5 h-5 text-[#f5efe1]/60" />
          <Move className="w-4 h-4 text-[#f5efe1]/40" />
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="space-y-3">
        <div className="bg-[#f5efe1]/10 rounded-lg p-3">
          <p className="text-sm font-semibold text-[#f5efe1] mb-2">
            🛒 Tu reserva está activa
          </p>
          <div className="space-y-1">
            <p className="text-xs text-[#f5efe1]/80">
              {reservation.items.length} {reservation.items.length === 1 ? 'producto' : 'productos'} reservados
            </p>
            <p className="text-sm font-bold text-[#f5efe1]">
              Total: ${Number(reservation.totalAmount).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Botón de acción */}
        <Link 
          href="/checkout"
          className="w-full bg-[#f5efe1] text-[#2e4b30] px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#f5efe1]/90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <span>Ir al Checkout</span>
          <span className="text-xs">→</span>
        </Link>
      </div>

      {/* Alerta de urgencia */}
      {timeLeft <= 120 && (
        <div className="mt-4 p-3 bg-[#fef2f2]/20 border border-[#fef2f2]/30 rounded-xl">
          <div className="flex items-center space-x-2 text-[#fef2f2]">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold">
              ¡Tu reserva expira pronto!
            </span>
          </div>
          <p className="text-xs text-[#fef2f2]/80 mt-1">
            Completa tu compra antes de que se libere el stock.
          </p>
        </div>
      )}

      {/* Indicador de progreso */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-[#f5efe1]/60">Tiempo restante</span>
          <span className="text-xs font-medium text-[#f5efe1]">
            {Math.floor((timeLeft / 60))} min
          </span>
        </div>
        <div className="w-full bg-[#f5efe1]/10 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${getProgressColor()}`}
            style={{ width: `${(timeLeft / 600) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
