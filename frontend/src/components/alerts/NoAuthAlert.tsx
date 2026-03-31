"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, X, AlertCircle } from 'lucide-react';

interface NoAuthAlertProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string; // e.g. "añadir a favoritos"
}

/**
 * Componente de alerta tipo Modal para usuarios no autenticados
 * Diseño brutalista coherente con la estética de Booker
 */
export const NoAuthAlert: React.FC<NoAuthAlertProps> = ({ isOpen, onClose, action }) => {
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

  const handleRegister = () => {
    onClose();
    router.push('/register');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px] transition-all duration-300">
      <div 
        className="w-full max-w-sm bg-[#f5efe1] border-2 border-[#2e4b30] shadow-[12px_12px_0px_0px_rgba(46,75,48,1)] overflow-hidden animate-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
      >
        {/* Header Ribbon */}
        <div className="bg-[#2e4b30] p-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[#f5efe1]">
            <AlertCircle className="w-4 h-4" />
            <span className="font-black uppercase tracking-[0.2em] text-[8px] sm:text-[9px]">Acceso Restringido</span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#f5efe1]/70 hover:text-[#f5efe1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Impactful Message */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-[#2e4b30] uppercase tracking-tighter leading-[0.9] mb-4">
              ¡Necesitas una cuenta!
            </h2>
            <div className="h-1.5 w-16 bg-red-600 mb-4" /> {/* Divisor brutalista */}
            
            <p className="text-[#2e4b30] font-black uppercase tracking-widest text-[10px] opacity-60 leading-relaxed">
              Para {action || 'realizar esta acción'}, debes formar parte del club Booker. ¡Únete y disfruta de todos los beneficios!
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Login Button - High Priority */}
            <button
              onClick={handleLogin}
              className="group w-full py-4 bg-[#2e4b30] text-[#f5efe1] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-black transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] relative overflow-hidden"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
            
            {/* Register Button - Secondary but important */}
            <button
              onClick={handleRegister}
              className="w-full py-4 bg-transparent border-2 border-[#2e4b30] text-[#2e4b30] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#2e4b30]/5 transition-all active:translate-x-1 active:translate-y-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>Crear Cuenta</span>
            </button>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onClose}
            className="mt-6 w-full text-center text-[10px] font-black uppercase tracking-[0.4em] text-[#2e4b30]/30 hover:text-[#2e4b30]/80 transition-colors py-2"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoAuthAlert;
