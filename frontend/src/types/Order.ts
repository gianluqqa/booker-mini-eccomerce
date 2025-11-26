// Estructura de datos para OrderItem (respuesta del backend)
export interface IOrderItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number; // precio unitario del libro
  };
  quantity: number;
  unitPrice: number; // precio unitario al momento de la compra
  totalPrice: number; // precio total (unitario * cantidad)
}

// Estructura de datos para Order (respuesta del backend)
export interface IOrder {
  id: string;
  userId?: string;
  total?: number;
  status: string; // OrderStatus enum: "pending" | "paid" | "shipped" | "cancelled"
  items: IOrderItem[];
  createdAt?: Date | string;
}
