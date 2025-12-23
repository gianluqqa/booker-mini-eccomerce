// DTOs para Cart

export interface AddToCartDto {
  bookId: string;
  quantity?: number; // Opcional, por defecto 1
}

export interface UpdateCartDto {
  quantity: number;
}

export interface CartItemDto {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface CartResponseDto {
  items: CartItemDto[];
  totalItems: number;
  totalPrice: number;
}

