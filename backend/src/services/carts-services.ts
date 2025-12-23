import { AppDataSource } from "../config/data-source";
import { Cart } from "../entities/Cart";
import { Book } from "../entities/Book";
import { AddToCartDto, UpdateCartDto, CartResponseDto, CartItemDto } from "../dto/CartDto";

//? Añadir un libro al carrito (POST).
export const addBookToCartService = async (userId: string, addToCartDto: AddToCartDto): Promise<CartItemDto> => {
  const cartRepository = AppDataSource.getRepository(Cart);
  const bookRepository = AppDataSource.getRepository(Book);

  try {
    const book = await bookRepository.findOne({ where: { id: addToCartDto.bookId } });
    if (!book) {
      throw { status: 404, message: "Libro no encontrado" };
    }

    const requestedQuantity = addToCartDto.quantity || 1;

    const existingCartItem = await cartRepository.findOne({
      where: {
        user: { id: userId },
        book: { id: addToCartDto.bookId },
      },
      relations: ["book"],
    });

    let cartItem: Cart;

    if (existingCartItem) {
      existingCartItem.quantity += requestedQuantity;
      cartItem = await cartRepository.save(existingCartItem);
    } else {
      cartItem = cartRepository.create({
        user: { id: userId } as any,
        book: { id: addToCartDto.bookId } as Book,
        quantity: requestedQuantity,
      });
      cartItem = await cartRepository.save(cartItem);
    }

    // Cargar relaciones para la respuesta
    const savedCartItem = await cartRepository.findOne({
      where: { id: cartItem.id },
      relations: ["book"],
    });

    if (!savedCartItem) {
      throw { status: 500, message: "Error al guardar el item del carrito" };
    }

    return {
      id: savedCartItem.id,
      book: {
        id: savedCartItem.book.id,
        title: savedCartItem.book.title,
        author: savedCartItem.book.author,
        price: Number(savedCartItem.book.price),
        image: savedCartItem.book.image || undefined,
        stock: savedCartItem.book.stock,
      },
      quantity: savedCartItem.quantity,
      createdAt: savedCartItem.createdAt,
      updatedAt: savedCartItem.updatedAt,
    };
  } catch (error: any) {
    console.error("Error adding book to cart:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo agregar el libro al carrito" };
  }
};

//? Obtener el carrito del usuario (GET).
export const getUserCartService = async (userId: string): Promise<CartResponseDto> => {
  const cartRepository = AppDataSource.getRepository(Cart);

  try {
    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
      relations: ["book"],
      order: { createdAt: "DESC" },
    });

    const items: CartItemDto[] = cartItems.map((item) => ({
      id: item.id,
      book: {
        id: item.book.id,
        title: item.book.title,
        author: item.book.author,
        price: Number(item.book.price),
        image: item.book.image || undefined,
        stock: item.book.stock,
      },
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );

    return {
      items,
      totalItems,
      totalPrice: Number(totalPrice.toFixed(2)),
    };
  } catch (error) {
    console.error("Error getting user cart:", error);
    throw { status: 500, message: "No se pudo obtener el carrito del usuario" };
  }
};

//? Actualizar cantidad de un item del carrito (PUT).
export const updateCartItemQuantityService = async (
  userId: string,
  cartId: string,
  updateCartDto: UpdateCartDto
): Promise<CartItemDto> => {
  const cartRepository = AppDataSource.getRepository(Cart);

  try {
    const cartItem = await cartRepository.findOne({
      where: { id: cartId, user: { id: userId } },
      relations: ["book"],
    });

    if (!cartItem) {
      throw { status: 404, message: "Item del carrito no encontrado" };
    }

    if (updateCartDto.quantity <= 0) {
      throw { status: 400, message: "La cantidad debe ser mayor que 0" };
    }

    cartItem.quantity = updateCartDto.quantity;
    const updatedCartItem = await cartRepository.save(cartItem);

    return {
      id: updatedCartItem.id,
      book: {
        id: updatedCartItem.book.id,
        title: updatedCartItem.book.title,
        author: updatedCartItem.book.author,
        price: Number(updatedCartItem.book.price),
        image: updatedCartItem.book.image || undefined,
        stock: updatedCartItem.book.stock,
      },
      quantity: updatedCartItem.quantity,
      createdAt: updatedCartItem.createdAt,
      updatedAt: updatedCartItem.updatedAt,
    };
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo actualizar el item del carrito" };
  }
};

//? Eliminar un item del carrito (DELETE).
export const removeBookFromCartService = async (
  userId: string,
  cartId: string
): Promise<void> => {
  const cartRepository = AppDataSource.getRepository(Cart);

  try {
    const cartItem = await cartRepository.findOne({
      where: { id: cartId, user: { id: userId } },
      relations: ["book"],
    });

    if (!cartItem) {
      throw { status: 404, message: "Item del carrito no encontrado" };
    }

    await cartRepository.remove(cartItem);
  } catch (error: any) {
    console.error("Error removing book from cart:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo eliminar el libro del carrito" };
  }
};

//? Limpiar todo el carrito del usuario (DELETE).
export const clearCartService = async (userId: string): Promise<void> => {
  const cartRepository = AppDataSource.getRepository(Cart);

  try {
    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
    });

    if (cartItems.length > 0) {
      await cartRepository.remove(cartItems);
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw { status: 500, message: "No se pudo vaciar el carrito" };
  }
};
