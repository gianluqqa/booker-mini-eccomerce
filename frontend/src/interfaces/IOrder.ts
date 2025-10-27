
export interface IOrderItem {
    id: string;
    orderId: string;
    bookId: string;
    quantity: number;
    price: number;
}

export interface IOrder {
  id: string;
  userId: string;
  bookId: string;
  items: IOrderItem[];
  status: string;
}
