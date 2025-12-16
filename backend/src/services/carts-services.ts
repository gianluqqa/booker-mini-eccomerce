import { AppDataSource } from "../config/data-source";
import { Cart } from "../entities/Cart";
import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { OrderStatus } from "../enums/OrderStatus";
import { AddToCartDto, UpdateCartDto, CartResponseDto, CartItemDto } from "../dto/CartDto";
import { LessThan } from "typeorm";

const RESERVATION_TTL_MS = 10 * 60 * 1000; // 10 minutos

const getReservationExpiry = () => new Date(Date.now() + RESERVATION_TTL_MS);

const releaseExpiredCartReservations = async (): Promise<void> => {
  const cartRepository = AppDataSource.getRepository(Cart);
  const bookRepository = AppDataSource.getRepository(Book);

  const now = new Date();
  const expiredCartItems = await cartRepository.find({
    where: { reservedUntil: LessThan(now) },
    relations: ["book"],
  });

  if (expiredCartItems.length === 0) return;

  const booksToUpdate = new Map<string, Book>();

  for (const cartItem of expiredCartItems) {
    const book = cartItem.book;
    book.stock += cartItem.quantity;
    booksToUpdate.set(book.id, book);
  }

  await bookRepository.save(Array.from(booksToUpdate.values()));
  await cartRepository.remove(expiredCartItems);
};

const reserveStock = async (book: Book, quantity: number): Promise<void> => {
  if (book.stock < quantity) {
    throw {
      status: 400,
      message: `Stock insuficiente. Disponible: ${book.stock}`,
    };
  }

  book.stock -= quantity;
  await AppDataSource.getRepository(Book).save(book);
};

const releaseStock = async (book: Book, quantity: number): Promise<void> => {
  book.stock += quantity;
  await AppDataSource.getRepository(Book).save(book);
};

//? Añadir un libro al carrito (POST).
export const addBookToCartService = async (userId: string, addToCartDto: AddToCartDto): Promise<CartItemDto> => {
  const cartRepository = AppDataSource.getRepository(Cart);
  const bookRepository = AppDataSource.getRepository(Book);
  const userRepository = AppDataSource.getRepository(User);

  try {
    await releaseExpiredCartReservations();

    // Verificar que el usuario existe
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    // Verificar que el libro existe
    const book = await bookRepository.findOne({ where: { id: addToCartDto.bookId } });
    if (!book) {
      throw { status: 404, message: "Libro no encontrado" };
    }

    const requestedQuantity = addToCartDto.quantity || 1;

    // Buscar si el libro ya está en el carrito del usuario
    const existingCartItem = await cartRepository.findOne({
      where: {
        user: { id: userId },
        book: { id: addToCartDto.bookId },
      },
      relations: ["book"],
    });

    let cartItem: Cart;

    if (existingCartItem) {
      // Validar stock adicional requerido (ya hay cantidad reservada)
      await reserveStock(book, requestedQuantity);
      existingCartItem.quantity += requestedQuantity;
      existingCartItem.reservedUntil = getReservationExpiry();
      cartItem = await cartRepository.save(existingCartItem);
    } else {
      // Si no existe, crear nuevo item en el carrito
      await reserveStock(book, requestedQuantity);
      cartItem = cartRepository.create({
        user: { id: userId } as User,
        book: { id: addToCartDto.bookId } as Book,
        quantity: requestedQuantity,
        reservedUntil: getReservationExpiry(),
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
      reservedUntil: savedCartItem.reservedUntil,
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
    await releaseExpiredCartReservations();

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
      reservedUntil: item.reservedUntil,
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
    await releaseExpiredCartReservations();

    if (updateCartDto.quantity <= 0) {
      throw { status: 400, message: "La cantidad debe ser mayor que 0" };
    }

    const cartItem = await cartRepository.findOne({
      where: { id: cartId, user: { id: userId } },
      relations: ["book"],
    });

    if (!cartItem) {
      throw { status: 404, message: "Item del carrito no encontrado" };
    }

    const currentQuantity = cartItem.quantity;
    const newQuantity = updateCartDto.quantity;

    if (newQuantity > currentQuantity) {
      const difference = newQuantity - currentQuantity;
      await reserveStock(cartItem.book, difference);
    } else if (newQuantity < currentQuantity) {
      const difference = currentQuantity - newQuantity;
      await releaseStock(cartItem.book, difference);
    }

    cartItem.quantity = newQuantity;
    cartItem.reservedUntil = getReservationExpiry();
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
      reservedUntil: updatedCartItem.reservedUntil,
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
    await releaseExpiredCartReservations();

    const cartItem = await cartRepository.findOne({
      where: { id: cartId, user: { id: userId } },
      relations: ["book"],
    });

    if (!cartItem) {
      throw { status: 404, message: "Item del carrito no encontrado" };
    }

    await releaseStock(cartItem.book, cartItem.quantity);
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
    await releaseExpiredCartReservations();

    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
      relations: ["book"],
    });

    if (cartItems.length > 0) {
      for (const cartItem of cartItems) {
        await releaseStock(cartItem.book, cartItem.quantity);
      }
      await cartRepository.remove(cartItems);
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw { status: 500, message: "No se pudo vaciar el carrito" };
  }
};

//? Convertir carrito a orden (checkout) (POST).
export const checkoutCartService = async (userId: string): Promise<Order> => {
  const cartRepository = AppDataSource.getRepository(Cart);
  const orderRepository = AppDataSource.getRepository(Order);
  const orderItemRepository = AppDataSource.getRepository(OrderItem);
  const bookRepository = AppDataSource.getRepository(Book);
  const userRepository = AppDataSource.getRepository(User);

  try {
    await releaseExpiredCartReservations();

    // Obtener todos los items del carrito
    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
      relations: ["book"],
    });

    if (cartItems.length === 0) {
      throw { status: 400, message: "El carrito está vacío" };
    }

    // Verificar usuario
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    // Crear la orden primero
    const order = orderRepository.create({
      user: user,
      status: OrderStatus.PENDING,
    });
    const savedOrder = await orderRepository.save(order);
    
    // Crear los OrderItems y actualizar stock
    const orderItems: OrderItem[] = [];

    for (const cartItem of cartItems) {
      // Crear OrderItem con el precio total (precio unitario * cantidad)
      const unitPrice = Number(cartItem.book.price);
      const totalPrice = unitPrice * cartItem.quantity;

      const orderItem = orderItemRepository.create({
        order: savedOrder,
        book: cartItem.book,
        quantity: cartItem.quantity,
        price: totalPrice, // Precio total del item al momento de la compra
      });

      const savedOrderItem = await orderItemRepository.save(orderItem);
      orderItems.push(savedOrderItem);
    }

    // Limpiar el carrito después de crear la orden
    await cartRepository.remove(cartItems);

    // Cargar relaciones para la respuesta (los items ya están guardados)
    const orderWithRelations = await orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ["user", "items", "items.book"],
    });

    if (!orderWithRelations) {
      throw { status: 500, message: "Error al crear la orden" };
    }

    return orderWithRelations;
  } catch (error: any) {
    console.error("Error during checkout:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "No se pudo procesar el checkout" };
  }
};
