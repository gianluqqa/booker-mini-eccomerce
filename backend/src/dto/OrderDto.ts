import { OrderStatus } from "../enums/OrderStatus";

export interface OrderResponseDto {
  id: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  items: {
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
  }[];
}