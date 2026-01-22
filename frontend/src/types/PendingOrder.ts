// Tipos para manejo de órdenes pendientes

import { ICartItem } from './Cart';

export interface IPendingOrder {
  id: string;
  total: number;
  createdAt: string | Date;
  expiresAt?: string | Date;
  itemsCount: number;
  message: string;
  actionRequired: string;
}

export interface ICartResponseWithPendingOrder {
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  pendingOrder?: IPendingOrder;
}

export interface IPendingOrderError {
  success: false;
  message: string;
  data: IPendingOrder;
}
