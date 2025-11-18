import { AppDataSource } from "../config/data-source";
import { Cart } from "../entities/Cart";
import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { OrderStatus } from "../enums/OrderStatus";
import { AddToCartDto, UpdateCartDto, CartResponseDto, CartItemDto } from "../dto/CartDto";

//? Añadir un libro al carrito (POST).
export const addBookToCartService = async (userId: string, addToCartDto: AddToCartDto): Promise<CartItemDto> => {
  const cartRepository = AppDataSource.getRepository(Cart);
  const bookRepository = AppDataSource.getRepository(Book);
  const userRepository = AppDataSource.getRepository(User);

  try {
    // Verificar que el usuario existe
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    // Verificar que el libro existe
    const book = await bookRepository.findOne({ where: { id: addToCartDto.bookId } });
    if (!book) {
      throw { status: 404, message: "Book not found" };
    }

    // Verificar stock disponible
    const requestedQuantity = addToCartDto.quantity || 1;
    if (book.stock < requestedQuantity) {
      throw { status: 400, message: `Insufficient stock. Available: ${book.stock}` };
    }

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
      // Si ya existe, actualizar la cantidad
      const newQuantity = existingCartItem.quantity + requestedQuantity;
      
      // Verificar que la nueva cantidad no exceda el stock
      if (newQuantity > book.stock) {
        throw { 
          status: 400, 
          message: `Cannot add ${requestedQuantity} items. Total would exceed available stock (${book.stock})` 
        };
      }

      existingCartItem.quantity = newQuantity;
      cartItem = await cartRepository.save(existingCartItem);
    } else {
      // Si no existe, crear nuevo item en el carrito
      cartItem = cartRepository.create({
        user: { id: userId } as User,
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
      throw { status: 500, message: "Error saving cart item" };
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
    throw { status: 500, message: "Could not add book to cart" };
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
    throw { status: 500, message: "Could not get user cart" };
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
    if (updateCartDto.quantity <= 0) {
      throw { status: 400, message: "Quantity must be greater than 0" };
    }

    const cartItem = await cartRepository.findOne({
      where: { id: cartId, user: { id: userId } },
      relations: ["book"],
    });

    if (!cartItem) {
      throw { status: 404, message: "Cart item not found" };
    }

    // Verificar stock disponible
    if (updateCartDto.quantity > cartItem.book.stock) {
      throw {
        status: 400,
        message: `Insufficient stock. Available: ${cartItem.book.stock}`,
      };
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
    throw { status: 500, message: "Could not update cart item" };
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
    });

    if (!cartItem) {
      throw { status: 404, message: "Cart item not found" };
    }

    await cartRepository.remove(cartItem);
  } catch (error: any) {
    console.error("Error removing book from cart:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Could not remove book from cart" };
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
    throw { status: 500, message: "Could not clear cart" };
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
    // Obtener todos los items del carrito
    const cartItems = await cartRepository.find({
      where: { user: { id: userId } },
      relations: ["book"],
    });

    if (cartItems.length === 0) {
      throw { status: 400, message: "Cart is empty" };
    }

    // Verificar usuario
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    // Validar stock antes de crear la orden
    for (const cartItem of cartItems) {
      if (cartItem.quantity > cartItem.book.stock) {
        throw {
          status: 400,
          message: `Insufficient stock for book "${cartItem.book.title}". Available: ${cartItem.book.stock}, Requested: ${cartItem.quantity}`,
        };
      }
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

      // Actualizar stock del libro
      cartItem.book.stock -= cartItem.quantity;
      await bookRepository.save(cartItem.book);
    }

    // Limpiar el carrito después de crear la orden
    await cartRepository.remove(cartItems);

    // Cargar relaciones para la respuesta (los items ya están guardados)
    const orderWithRelations = await orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ["user", "items", "items.book"],
    });

    if (!orderWithRelations) {
      throw { status: 500, message: "Error creating order" };
    }

    return orderWithRelations;
  } catch (error: any) {
    console.error("Error during checkout:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Could not process checkout" };
  }
};

