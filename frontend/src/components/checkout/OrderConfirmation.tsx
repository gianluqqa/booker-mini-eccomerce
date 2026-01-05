import React from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { IOrder } from "@/types/Order";

interface OrderConfirmationProps {
  order: IOrder;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
  return (
    <div className="min-h-screen bg-[#f5efe1] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-8 text-center">
          <OrderConfirmationHeader />
          <OrderConfirmationDetails order={order} />
          <OrderConfirmationItems order={order} />
          <OrderConfirmationTotal order={order} />
          <OrderConfirmationActions />
        </div>
      </div>
    </div>
  );
};

// Header de confirmación
const OrderConfirmationHeader: React.FC = () => {
  return (
    <>
      <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-[#2e4b30] mb-4">¡Orden Confirmada!</h1>
      <p className="text-[#2e4b30]/70 text-lg mb-8">Tu pedido ha sido procesado exitosamente</p>
    </>
  );
};

// Detalles de la orden
const OrderConfirmationDetails: React.FC<{ order: IOrder }> = ({ order }) => {
  return (
    <div className="bg-[#f5efe1]/30 rounded-lg p-6 mb-6 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <OrderDetailItem label="Número de Orden" value={order.id} isBold />
        <OrderStatusBadge status={order.status} />
        {order.createdAt && <OrderDetailItem label="Fecha" value={formatDate(order.createdAt)} />}
      </div>
    </div>
  );
};

// Badge de estado
const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "paid":
        return { bg: "bg-green-100 text-green-800", text: "Confirmada" };
      case "pending":
        return { bg: "bg-yellow-100 text-yellow-800", text: "Pendiente de pago" };
      default:
        return { bg: "bg-gray-100 text-gray-800", text: status };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="text-center sm:text-left">
      <p className="text-sm text-[#2e4b30]/70 mb-1">Estado</p>
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg}`}>{config.text}</div>
    </div>
  );
};

// Item de detalle genérico
const OrderDetailItem: React.FC<{
  label: string;
  value: string;
  isBold?: boolean;
}> = ({ label, value, isBold = false }) => {
  return (
    <div className="text-center sm:text-left">
      <p className="text-sm text-[#2e4b30]/70 mb-1">{label}</p>
      <p className={`text-sm font-medium text-[#2e4b30] ${isBold ? "text-lg font-bold" : ""}`}>{value}</p>
    </div>
  );
};

// Items de la orden
const OrderConfirmationItems: React.FC<{ order: IOrder }> = ({ order }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[#2e4b30] mb-4 text-left">Resumen de tu Pedido</h2>
      <div className="space-y-3">{order.items?.map((item) => <OrderItemRow key={item.id} item={item} />) || []}</div>
    </div>
  );
};

// Fila de item
const OrderItemRow: React.FC<{ item: IOrder['items'][0] }> = ({ item }) => {
  const unitPrice = item.unitPrice || item.price;
  const totalPrice = item.totalPrice || item.price * item.quantity;

  return (
    <div className="flex justify-between items-center p-4 bg-[#f5efe1]/30 rounded-lg">
      <div className="flex-1">
        <p className="font-semibold text-[#2e4b30]">{item.book.title}</p>
        <p className="text-sm text-[#2e4b30]/70">
          {item.quantity} x ${unitPrice.toFixed(2)}
        </p>
      </div>
      <p className="font-bold text-[#2e4b30]">${totalPrice.toFixed(2)}</p>
    </div>
  );
};

// Total de la orden
const OrderConfirmationTotal: React.FC<{ order: IOrder }> = ({ order }) => {
  const subtotal = calculateSubtotal(order);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-lg p-6 border border-[#2e4b30]/10">
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-[#2e4b30]">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#2e4b30]">
          <span>Impuestos (21%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>
      <div className="border-t border-[#2e4b30]/20 pt-4">
        <div className="flex justify-between text-xl font-bold text-[#2e4b30]">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Botones de acción
const OrderConfirmationActions: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        href="/"
        className="flex-1 bg-[#2e4b30] text-[#f5efe1] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/90 transition-all duration-200 font-medium text-center"
      >
        Volver al Inicio
      </Link>
      <Link
        href="/profile"
        className="flex-1 bg-[#2e4b30]/10 text-[#2e4b30] px-6 py-3 rounded-lg hover:bg-[#2e4b30]/20 transition-all duration-200 font-medium text-center"
      >
        Ver Mis Pedidos
      </Link>
    </div>
  );
};

// Utilidades
const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateSubtotal = (order: IOrder) => {
  return (
    order.items?.reduce((total, item) => {
      return total + (item.totalPrice || item.price * item.quantity);
    }, 0) || 0
  );
};
