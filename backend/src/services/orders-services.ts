import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { OrderStatus } from "../enums/OrderStatus";
import { OrderResponseDto } from "../dto/OrderDto";

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
      createdAt: order.createdAt,
      expiresAt: order.expiresAt,
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

    // Obtener órdenes confirmadas (PAID) del usuario
    const orders = await orderRepository.find({
      where: {
        user: { id: userId },
        status: OrderStatus.PAID,
      },
      relations: ["items", "items.book"],
      order: { createdAt: "DESC" },
    });

    return orders.map((order) => ({
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      expiresAt: order.expiresAt,
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
      expiresAt: order.expiresAt,
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

