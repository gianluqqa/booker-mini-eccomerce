// Estructura de datos para OrderItem (respuesta del backend)
export interface IOrderItem {
  id: string;
  book: {
    id: string;
    title: string;
    author?: string;
    price: number;
  };
  quantity: number;
  price: number; // precio unitario
  unitPrice?: number; // precio unitario (para compatibilidad)
  totalPrice?: number; // precio total (para compatibilidad)
}

// Estructura de datos para Order (respuesta del backend)
export interface IOrder {
  id: string;
  total: number;
  status: string; // OrderStatus enum: "pending" | "paid" | "shipped" | "cancelled"
  createdAt: Date | string;
  expiresAt?: Date | string;
  items: IOrderItem[];
}
