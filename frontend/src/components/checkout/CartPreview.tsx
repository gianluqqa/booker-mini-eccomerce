import React from 'react'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { ICartItem } from '@/types/Cart';

interface CartPreviewProps {
  cartItems: ICartItem[];
}

export const CartPreview: React.FC<CartPreviewProps> = ({ cartItems }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#2e4b30]/10 p-6 mb-6">
      <CartPreviewHeader />
      <CartItemsList cartItems={cartItems} />
    </div>
  );
};

// Header del carrito
const CartPreviewHeader: React.FC = () => {
  return (
    <div className="flex items-center mb-6">
      <Package className="w-6 h-6 text-[#2e4b30] mr-2" />
      <h2 className="text-xl font-bold text-[#2e4b30]">Previsualización de tu Pedido</h2>
    </div>
  );
};

// Lista de items del carrito
const CartItemsList: React.FC<{ cartItems: ICartItem[] }> = ({ cartItems }) => {
  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}
    </div>
  );
};

// Fila de item del carrito
const CartItemRow: React.FC<{ item: ICartItem }> = ({ item }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-[#f5efe1]/30 rounded-lg">
      <CartItemBookImage book={item.book} />
      <CartItemDetails item={item} />
      <CartItemPrice item={item} />
    </div>
  );
};

// Imagen del libro
const CartItemBookImage: React.FC<{ book: ICartItem['book'] }> = ({ book }) => {
  return (
    <div className="flex-shrink-0">
      <Image
        src={book.image || ''}
        alt={book.title}
        width={80}
        height={112}
        className="w-20 h-28 object-cover rounded-lg shadow-sm"
      />
    </div>
  );
};

// Detalles del item
const CartItemDetails: React.FC<{ item: ICartItem }> = ({ item }) => {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-semibold text-[#2e4b30] truncate">{item.book.title}</h3>
      <p className="text-[#2e4b30]/70 text-sm mb-1">por {item.book.author}</p>
      <CartItemMetadata item={item} />
    </div>
  );
};

// Metadatos del item
const CartItemMetadata: React.FC<{ item: ICartItem }> = ({ item }) => {
  return (
    <div className="flex items-center space-x-4 mt-2">
      <p className="text-sm text-[#2e4b30]/70">
        Cantidad: <span className="font-semibold">{item.quantity}</span>
      </p>
      <p className="text-sm text-[#2e4b30]/70">
        Precio unitario: <span className="font-semibold">${item.book.price.toFixed(2)}</span>
      </p>
    </div>
  );
};

// Precio del item
const CartItemPrice: React.FC<{ item: ICartItem }> = ({ item }) => {
  const totalPrice = item.book.price * item.quantity;

  return (
    <div className="text-right">
      <p className="text-lg font-bold text-[#2e4b30]">${totalPrice.toFixed(2)}</p>
    </div>
  );
};
