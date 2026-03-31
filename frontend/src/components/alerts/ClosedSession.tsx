"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, LogIn, X, Clock } from 'lucide-react';

interface ClosedSessionProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Componente de alerta para notificar que la sesión ha expirado o se ha cerrado
 * Diseño brutalista coherente con la estética de Booker
 */
export const ClosedSession: React.FC<ClosedSessionProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleLogin = () => {
    onClose();
    router.push('/login');
  };

  const handleReload = () => {
      onClose();
      window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-red-950/40 backdrop-blur-[4px] transition-all duration-300">
      <div 
        className="w-full max-w-sm bg-[#f5efe1] border-2 border-red-600 shadow-[12px_12px_0px_0px_rgba(220,38,38,1)] overflow-hidden animate-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
      >
        {/* Header Ribbon - Red for urgency */}
        <div className="bg-red-600 p-3 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-black uppercase tracking-[0.2em] text-[8px] sm:text-[9px]">Sesión Expirada</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-red-600 uppercase tracking-tighter leading-[0.9] mb-4">
              Tu sesión ha terminado
            </h2>
            <div className="h-1.5 w-16 bg-[#2e4b30] mb-4" />
            
            <p className="text-red-900/60 font-black uppercase tracking-widest text-[10px] opacity-70 leading-relaxed">
              Por seguridad, tu sesión se ha cerrado automáticamente. Necesitas volver a ingresar para continuar con tus acciones registradas.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Action Buttons */}
            <button
              onClick={handleLogin}
              className="group w-full py-4 bg-red-600 text-[#f5efe1] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
            >
              <LogIn className="w-4 h-4" />
              <span>Volver a Conectarse</span>
            </button>
            
            <button
              onClick={handleReload}
              className="w-full py-4 bg-transparent border-2 border-[#2e4b30] text-[#2e4b30] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#2e4b30]/5 transition-all active:translate-x-1 active:translate-y-1"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar Página</span>
            </button>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onClose}
            className="mt-6 w-full text-center text-[10px] font-black uppercase tracking-[0.4em] text-red-900/30 hover:text-red-900/80 transition-colors py-2"
          >
            Entendido, navegar como invitado
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClosedSession;
