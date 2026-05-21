import React, { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface AdminToastProps {
  title: string
  message: string | string[]
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

/**
 * Alerta tipo notificación (toast) centrada en pantalla para el panel admin
 */
export const AdminToast: React.FC<AdminToastProps> = ({
  title,
  message,
  type,
  onClose,
  duration = 3000
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Esperar a que termine la animación de salida
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const isArray = Array.isArray(message)
  const isSuccess = type === 'success'
  
  const bgColor = isSuccess ? 'bg-white' : 'bg-white'
  const borderColor = isSuccess ? 'border-[#2e4b30]' : 'border-red-600'
  const iconColor = isSuccess ? 'text-[#2e4b30]' : 'text-red-600'
  const iconBg = isSuccess ? 'bg-[#2e4b30]/10' : 'bg-red-600/10'
  const progressBg = isSuccess ? 'bg-[#2e4b30]' : 'bg-red-600'

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`pointer-events-auto relative w-56 h-56 overflow-hidden ${bgColor} border-4 ${borderColor} shadow-2xl rounded-xl`}>
        <div className="flex flex-col h-full p-4">
          {/* Botón de cierre en la esquina superior derecha */}
          <div className="flex justify-end mb-2">
            <button 
              onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Contenido centrado */}
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center ${iconBg} rounded-full mb-3`}>
              {isSuccess ? (
                <CheckCircle className={`h-7 w-7 ${iconColor}`} />
              ) : (
                <AlertCircle className={`h-7 w-7 ${iconColor}`} />
              )}
            </div>

            <h3 className={`text-sm font-bold ${iconColor} uppercase tracking-wide mb-2`}>
              {title}
            </h3>
            
            {isArray ? (
              <ul className="list-disc list-inside text-xs text-gray-600 font-medium space-y-1 text-left max-w-40">
                {message.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-600 font-medium max-w-40">
                {message}
              </p>
            )}
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className={`absolute bottom-0 left-0 h-2 ${progressBg}/10 w-full overflow-hidden`}>
          <div 
            className={`h-full ${progressBg} animate-progress`} 
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminToast
