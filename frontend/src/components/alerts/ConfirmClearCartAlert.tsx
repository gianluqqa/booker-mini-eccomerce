"use client";

import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmClearCartAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Componente de alerta tipo Modal para confirmar vaciar el carrito
 * Diseño brutalista coherente con la estética de Booker
 */
export const ConfirmClearCartAlert: React.FC<ConfirmClearCartAlertProps> = ({ isOpen, onClose, onConfirm }) => {
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

  const handleConfirm = () => {
    onConfirm();
    onClose();
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
            <AlertTriangle className="w-4 h-4" />
            <span className="font-black uppercase tracking-[0.2em] text-[8px] sm:text-[9px]">Acción Irreversible</span>
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
              ¿Vaciar el carrito?
            </h2>
            <div className="h-1.5 w-16 bg-red-600 mb-4" /> {/* Divisor brutalista */}
            
            <p className="text-[#2e4b30] font-black uppercase tracking-widest text-[10px] opacity-60 leading-relaxed">
              Estás a punto de eliminar todos los libros de tu selección. Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Confirm Button - High Priority */}
            <button
              onClick={handleConfirm}
              className="group w-full py-4 bg-red-600 text-[#f5efe1] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-red-700 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] relative overflow-hidden"
            >
              <Trash2 className="w-4 h-4" />
              <span>Sí, vaciar carrito</span>
            </button>
            
            {/* Cancel Button - Secondary */}
            <button
              onClick={onClose}
              className="w-full py-4 bg-transparent border-2 border-[#2e4b30] text-[#2e4b30] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-[#2e4b30]/5 transition-all active:translate-x-1 active:translate-y-1"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmClearCartAlert;
