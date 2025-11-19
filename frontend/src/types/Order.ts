// Estructura de datos para OrderItem (respuesta del backend)
export interface IOrderItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    image?: string;
    stock: number;
  };
  quantity: number;
  price: number; // precio total del item (precio unitario × cantidad) al momento de la compra
}

// Estructura de datos para Order (respuesta del backend)
export interface IOrder {
  id: string;
  user?: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
  items: IOrderItem[];
  status: string; // OrderStatus enum: "pending" | "paid" | "shipped" | "cancelled"
  createdAt?: Date;
}
