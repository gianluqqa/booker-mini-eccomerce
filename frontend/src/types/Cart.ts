// DTOs para Cart

// Estructura para añadir libro al carrito (POST /carts/add)
export interface IAddToCart {
  bookId: string;
  quantity?: number; // Opcional, por defecto 1
}

// Estructura para actualizar cantidad en el carrito (PUT /carts/:cartId)
export interface IUpdateCart {
  quantity: number;
}

// Estructura de un item del carrito (respuesta del backend)
export interface ICartItem {
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
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Estructura de respuesta completa del carrito (GET /carts)
export interface ICartResponse {
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
}

