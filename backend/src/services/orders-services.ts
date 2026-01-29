import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { Book } from "../entities/Book";
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

//? Obtener todas las órdenes de todos los usuarios (solo administradores).
export const getAllOrdersService = async (): Promise<OrderResponseDto[]> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);

    // Obtener todas las órdenes de todos los usuarios
    const orders = await orderRepository.find({
      relations: ["user", "items", "items.book"],
      order: { createdAt: "DESC" },
    });

    return orders.map((order) => ({
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      expiresAt: order.expiresAt,
      user: {
        id: order.user.id,
        email: order.user.email,
        name: order.user.name,
        surname: order.user.surname,
      },
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
    console.error("Error al obtener todas las órdenes:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Error al obtener todas las órdenes" };
  }
};

//? Cancelar una orden pagada (solo para administradores).
export const cancelPaidOrderService = async (orderId: string): Promise<OrderResponseDto> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    
    // Buscar la orden con todas sus relaciones
    const order = await orderRepository.findOne({
      where: { id: orderId },
      relations: ["user", "items", "items.book"],
    });

    if (!order) {
      throw { status: 404, message: "Orden no encontrada" };
    }

    // Verificar que la orden esté en estado PAID o PENDING
    if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.PENDING) {
      throw { status: 400, message: "Solo se pueden cancelar órdenes en estado PAID o PENDING" };
    }

    // Si es una orden PENDING, devolver el stock
    if (order.status === OrderStatus.PENDING) {
      const bookRepository = AppDataSource.getRepository(Book);
      
      for (const item of order.items) {
        const book = await bookRepository.findOne({ where: { id: item.book.id } });
        if (book) {
          book.stock += item.quantity;
          await bookRepository.save(book);
          console.log(`📈 [BACKEND] Stock devuelto: ${book.title} +${item.quantity} unidades`);
        }
      }
    }

    // Cambiar el estado a CANCELLED
    order.status = OrderStatus.CANCELLED;
    
    // Guardar los cambios
    await orderRepository.save(order);

    console.log(`🚫 [BACKEND] Orden ${orderId} cancelada por administrador. Estado: ${order.status}`);

    // Devolver la orden actualizada
    return {
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      expiresAt: order.expiresAt,
      user: {
        id: order.user.id,
        email: order.user.email,
        name: order.user.name,
        surname: order.user.surname,
      },
      items: order.items.map((item) => {
        const unitPrice = Number(item.book.price);
        const totalPrice = Number(item.price);
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
    console.error("Error al cancelar la orden:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Error al cancelar la orden" };
  }
};

