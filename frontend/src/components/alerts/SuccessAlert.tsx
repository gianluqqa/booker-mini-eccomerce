import React from 'react'
import { CheckCircle } from 'lucide-react'

interface SuccessAlertProps {
  title: string
  message: string
  className?: string
}

/**
 * Componente de alerta para mostrar mensajes de éxito con la estética de Booker
 */
export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  title,
  message,
  className = ''
}) => {
  return (
    <div className={`relative overflow-hidden bg-white border-t-4 border-t-[#2e4b30] shadow-md animate-fade-in-up ${className}`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#2e4b30]/10">
            <CheckCircle className="h-5 w-5 text-[#2e4b30]" />
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#2e4b30] uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-xs text-[#2e4b30]/70 font-medium mt-0.5">
              {message}
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 h-0.5 bg-[#2e4b30]/20 w-full overflow-hidden">
        <div className="h-full bg-[#2e4b30] animate-progress" />
      </div>
    </div>
  )
}

export default SuccessAlert
