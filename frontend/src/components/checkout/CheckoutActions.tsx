import React from "react";

interface CheckoutActionsProps {
  processing: boolean;
  orderExpired: boolean;
  onCheckout: () => void;
  onCancelCheckout: () => void;
  onRestartCheckout: () => void;
}

export const CheckoutActions: React.FC<CheckoutActionsProps> = ({ 
  processing, 
  orderExpired, 
  onCheckout, 
  onCancelCheckout, 
  onRestartCheckout 
}) => {
  return (
    <div className="mt-6 space-y-3">
      {!orderExpired ? (
        <button 
          onClick={onCheckout} 
          disabled={processing} 
          className="w-full bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Procesando...
            </>
          ) : (
            "Confirmar Pago"
          )}
        </button>
      ) : (
        <button 
          onClick={onRestartCheckout} 
          disabled={processing} 
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Reiniciando...
            </>
          ) : (
            "Iniciar Nuevo Checkout"
          )}
        </button>
      )}

      <button 
        onClick={onCancelCheckout} 
        disabled={processing} 
        className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancelar Checkout
      </button>

      <button 
        onClick={() => window.history.back()} 
        className="w-full bg-[#2e4b30]/10 text-[#2e4b30] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/20 transition-all duration-200 font-medium"
      >
        Volver al Carrito
      </button>
    </div>
  );
};
