import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { OrderStatus } from "../enums/OrderStatus";
import { In } from "typeorm";

interface CreateOrderItemDto {
  bookId: string;
  quantity: number;
}

interface CreateOrderDto {
  items: CreateOrderItemDto[];
}

interface OrderResponseDto {
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

//? Crear una nueva orden (POST).
export const createOrderService = async (
  userId: string,
  createOrderDto: CreateOrderDto
): Promise<OrderResponseDto> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { items } = createOrderDto;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw { status: 400, message: "Debe proporcionar al menos un ítem para la orden" };
    }

    const orderRepository = queryRunner.manager.getRepository(Order);
    const orderItemRepository = queryRunner.manager.getRepository(OrderItem);
    const bookRepository = queryRunner.manager.getRepository(Book);
    const userRepository = queryRunner.manager.getRepository(User);

    // Obtener el usuario
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    // Verificar stock y calcular total
    let total = 0;
    const orderItems = [];
    const booksToUpdate = [];

    for (const item of items) {
      const book = await bookRepository.findOneBy({ id: item.bookId });
      if (!book) {
        throw { status: 404, message: `Libro con ID ${item.bookId} no encontrado` };
      }

      if (book.stock < item.quantity) {
        throw {
          status: 400,
          message: `Stock insuficiente para el libro: ${book.title}`,
        };
      }

      // Calcular precio total del ítem
      const itemTotal = book.price * item.quantity;
      total += itemTotal;

      // Crear order item
      const orderItem = new OrderItem();
      orderItem.book = book;
      orderItem.quantity = item.quantity;
      orderItem.price = itemTotal; // Precio total del item (precio unitario * cantidad)

      orderItems.push(orderItem);

      // Actualizar stock
      book.stock -= item.quantity;
      booksToUpdate.push(book);
    }

    // Crear la orden
    const order = new Order();
    order.user = user;
    order.status = OrderStatus.PENDING;
    order.total = total; // Asignar el total calculado
    order.items = orderItems;

    // Guardar todo en una transacción
    await orderRepository.save(order);
    await bookRepository.save(booksToUpdate);

    await queryRunner.commitTransaction();

    // Recargar la orden con las relaciones para la respuesta
    const savedOrder = await orderRepository.findOne({
      where: { id: order.id },
      relations: ["items", "items.book"],
    });

    if (!savedOrder) {
      throw { status: 500, message: "Error al guardar la orden" };
    }

    return {
      id: savedOrder.id,
      total: savedOrder.total,
      status: savedOrder.status,
      createdAt: savedOrder.createdAt,
      items: savedOrder.items.map((item) => {
        const unitPrice = Number(item.book.price); // precio unitario del libro
        const totalPrice = Number(item.price); // precio total guardado
        return {
          id: item.id,
          book: {
            id: item.book.id,
            title: item.book.title,
            author: item.book.author,
            price: unitPrice,
          },
          quantity: item.quantity,
          price: unitPrice,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        };
      }),
    };
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error("Error al crear la orden:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: error.message || "Error al crear la orden" };
  } finally {
    await queryRunner.release();
  }
};

//? Obtener una orden por ID (GET).
export const getOrderByIdService = async (
  orderId: string,
  userId: string
): Promise<OrderResponseDto> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id: orderId },
      relations: ["user", "items", "items.book"],
    });

    if (!order) {
      throw { status: 404, message: "Orden no encontrada" };
    }

    // Verificar que el usuario sea el dueño de la orden
    if (order.user.id !== userId) {
      throw { status: 403, message: "No tienes permiso para ver esta orden" };
    }

    return {
      id: order.id,
      total: order.total,
      status: order.status,
      items: order.items.map((item) => {
        const unitPrice = Number(item.price); // precio unitario guardado
        const totalPrice = unitPrice * item.quantity;
        return {
          id: item.id,
          book: {
            id: item.book.id,
            title: item.book.title,
            author: item.book.author,
            price: Number(item.book.price),
          },
          quantity: item.quantity,
          price: unitPrice,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        };
      }),
      createdAt: order.createdAt,
    };
  } catch (error: any) {
    console.error("Error al obtener la orden:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Error al obtener la orden" };
  }
};

//? Obtener todas las órdenes confirmadas del usuario (GET).
export const getUserOrdersService = async (
  userId: string
): Promise<OrderResponseDto[]> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    
    // Obtener órdenes confirmadas (PAID o SHIPPED) del usuario
    const orders = await orderRepository.find({
      where: {
        user: { id: userId },
        status: In([OrderStatus.PAID, OrderStatus.SHIPPED]),
      },
      relations: ["items", "items.book"],
      order: { createdAt: "DESC" },
    });

    return orders.map((order) => ({
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((item) => {
        const unitPrice = Number(item.book.price); // precio unitario del libro
        const totalPrice = Number(item.price); // precio total guardado
        return {
          id: item.id,
          book: {
            id: item.book.id,
            title: item.book.title,
            author: item.book.author,
            price: unitPrice,
          },
          quantity: item.quantity,
          price: unitPrice,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        };
      }),
    }));
  } catch (error: any) {
    console.error("Error al obtener las órdenes del usuario:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Error al obtener las órdenes del usuario" };
  }
};

//? Obtener todas las órdenes pendientes del usuario (GET).
export const getUserPendingOrdersService = async (
  userId: string
): Promise<OrderResponseDto[]> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    
    // Obtener órdenes pendientes (PENDING) del usuario
    const orders = await orderRepository.find({
      where: {
        user: { id: userId },
        status: OrderStatus.PENDING,
      },
      relations: ["items", "items.book"],
      order: { createdAt: "DESC" },
    });

    return orders.map((order) => ({
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((item) => {
        const unitPrice = Number(item.book.price); // precio unitario del libro
        const totalPrice = Number(item.price); // precio total guardado
        return {
          id: item.id,
          book: {
            id: item.book.id,
            title: item.book.title,
            author: item.book.author,
            price: unitPrice,
          },
          quantity: item.quantity,
          price: unitPrice,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
        };
      }),
    }));
  } catch (error: any) {
    console.error("Error al obtener las órdenes pendientes del usuario:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Error al obtener las órdenes pendientes del usuario" };
  }
};

