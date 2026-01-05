import React from "react";
import { AlertCircle, Loader2, ShoppingBag } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "Cargando carrito..." }) => {
  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#2e4b30] animate-spin mx-auto mb-4" />
            <p className="text-[#2e4b30] text-lg">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface EmptyCartProps {
  onBackToCart: () => void;
}

export const EmptyCartState: React.FC<EmptyCartProps> = ({ onBackToCart }) => {
  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-8 text-center">
          <ShoppingBag className="w-24 h-24 text-[#2e4b30]/30 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#2e4b30] mb-4">Tu carrito está vacío</h2>
          <p className="text-[#2e4b30]/70 mb-8">No hay productos para procesar el checkout</p>
          <button
            onClick={onBackToCart}
            className="bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium inline-block"
          >
            Volver al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

interface CheckoutErrorProps {
  error: string;
  onRetry?: () => void;
}

export const CheckoutErrorState: React.FC<CheckoutErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
      <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-red-800">Error</p>
        <p className="text-sm text-red-700">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};
