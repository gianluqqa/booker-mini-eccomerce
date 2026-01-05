import React from "react";
import { CreditCard } from "lucide-react";
import { handleCardNumberChange, handleExpiryDateChange } from "@/utils/paymentFormatters";

interface CardData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvc: string;
}

interface PaymentFormProps {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ cardData, setCardData }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6">
      <div className="flex items-center mb-4">
        <CreditCard className="w-6 h-6 text-[#2e4b30] mr-2" />
        <h2 className="text-xl font-bold text-[#2e4b30]">Información de Pago</h2>
      </div>

      <div className="space-y-4 mb-4">
        <PaymentCardNumberInput value={cardData.cardNumber} onChange={(e) => handleCardNumberChange(e, setCardData)} />

        <PaymentCardNameInput value={cardData.cardName} onChange={(value) => setCardData({ ...cardData, cardName: value })} />

        <div className="grid grid-cols-2 gap-4">
          <PaymentExpiryDateInput value={cardData.expiryDate} onChange={(e) => handleExpiryDateChange(e, setCardData)} />

          <PaymentCvcInput value={cardData.cvc} onChange={(value) => setCardData({ ...cardData, cvc: value })} />
        </div>
      </div>

      <PaymentSecurityNote />
    </div>
  );
};

// Componente para número de tarjeta
const PaymentCardNumberInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="cardNumber" className="block text-sm font-medium text-[#2e4b30] mb-1">
        Número de tarjeta
      </label>
      <input
        type="text"
        id="cardNumber"
        placeholder="1234 5678 9012 3456"
        maxLength={19} // 16 dígitos + 3 espacios
        className="w-full px-4 py-2 border border-[#2e4b30]/20 rounded-lg focus:ring-2 focus:ring-[#2e4b30]/50 focus:border-[#2e4b30] outline-none transition-all duration-200 text-[#2e4b30] placeholder:text-[#2e4b30]/50"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

// Componente para nombre en tarjeta
const PaymentCardNameInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="cardName" className="block text-sm font-medium text-[#2e4b30] mb-1">
        Nombre en la tarjeta
      </label>
      <input
        type="text"
        id="cardName"
        placeholder="JUAN PEREZ"
        className="w-full px-4 py-2 border border-[#2e4b30]/20 rounded-lg focus:ring-2 focus:ring-[#2e4b30]/50 focus:border-[#2e4b30] outline-none transition-all duration-200 text-[#2e4b30] placeholder:text-[#2e4b30]/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

// Componente para fecha de vencimiento
const PaymentExpiryDateInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="expiryDate" className="block text-sm font-medium text-[#2e4b30] mb-1">
        Vencimiento (MM/AA)
      </label>
      <input
        type="text"
        id="expiryDate"
        placeholder="12/25"
        maxLength={5} // MM/YY
        className="w-full px-4 py-2 border border-[#2e4b30]/20 rounded-lg focus:ring-2 focus:ring-[#2e4b30]/50 focus:border-[#2e4b30] outline-none transition-all duration-200 text-[#2e4b30] placeholder:text-[#2e4b30]/50"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

// Componente para CVC
const PaymentCvcInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="cvc" className="block text-sm font-medium text-[#2e4b30] mb-1">
        CVC
      </label>
      <input
        type="text"
        id="cvc"
        placeholder="123"
        maxLength={4}
        className="w-full px-4 py-2 border border-[#2e4b30]/20 rounded-lg focus:ring-2 focus:ring-[#2e4b30]/50 focus:border-[#2e4b30] outline-none transition-all duration-200 text-[#2e4b30] placeholder:text-[#2e4b30]/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

// Componente para nota de seguridad
const PaymentSecurityNote: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <p className="text-sm text-blue-800">
        <strong>Nota:</strong> Esta es una simulación. Los datos de pago no se envían a ningún servidor.
      </p>
    </div>
  );
};
