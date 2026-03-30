import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Book } from "../entities/Book";
import { OrderStatus } from "../enums/OrderStatus";
import { OrderResponseDto } from "../dto/OrderDto";

//? Obtener una orden por ID (GET).
export const getOrderByIdService = async (orderId: string, userId: string): Promise<OrderResponseDto> => {
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
export const getUserOrdersService = async (userId: string): Promise<OrderResponseDto[]> => {
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
export const getUserPendingOrdersService = async (userId: string): Promise<OrderResponseDto[]> => {
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
        }
      }
    }

    // Cambiar el estado a CANCELLED
    order.status = OrderStatus.CANCELLED;
    
    // Guardar los cambios
    await orderRepository.save(order);


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

//? Limpiar todas las órdenes de la base de datos (solo para administradores).
export const clearAllOrdersService = async (): Promise<{ deletedOrders: number; restoredStock: number }> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    const bookRepository = AppDataSource.getRepository(Book);
    

    // Primero obtener todas las órdenes para procesar stock y contar
    const orders = await orderRepository.find({
      relations: ["items", "items.book"],
    });

    let restoredStock = 0;
    let deletedOrders = orders.length;


    // Procesar restauración de stock para órdenes PENDING
    for (const order of orders) {
      if (order.status === OrderStatus.PENDING && order.items) {
        for (const item of order.items) {
          if (item.book) {
            const book = await bookRepository.findOne({ where: { id: item.book.id } });
            if (book) {
              book.stock += item.quantity;
              await bookRepository.save(book);
              restoredStock += item.quantity;
            }
          }
        }
      }
    }

    // USAR QUERY BUILDER PARA ELIMINACIÓN COMPLETA
    // Primero eliminar todos los OrderItems
    const orderItemRepository = AppDataSource.getRepository(OrderItem);
    const deletedItems = await orderItemRepository
      .createQueryBuilder()
      .delete()
      .from(OrderItem)
      .execute();


    // Luego eliminar todas las órdenes
    const deletedOrdersResult = await orderRepository
      .createQueryBuilder()
      .delete()
      .from(Order)
      .execute();


    return {
      deletedOrders: deletedOrdersResult.affected || 0,
      restoredStock,
    };
  } catch (error: any) {
    console.error("Error al limpiar todas las órdenes:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Error al limpiar todas las órdenes" };
  }
};

//? Limpiar todas las órdenes canceladas de la base de datos (solo para administradores).
export const clearCancelledOrdersService = async (): Promise<{ deletedOrders: number; restoredStock: number }> => {
  try {
    const orderRepository = AppDataSource.getRepository(Order);
    

    // Primero contar cuántas órdenes canceladas existen
    const cancelledOrdersCount = await orderRepository.count({
      where: { status: OrderStatus.CANCELLED }
    });


    if (cancelledOrdersCount === 0) {
      return { deletedOrders: 0, restoredStock: 0 };
    }

    // USAR QUERY BUILDER PARA ELIMINAR EFICIENTE
    // Primero eliminar los OrderItems de órdenes canceladas
    const orderItemRepository = AppDataSource.getRepository(OrderItem);
    
    // Obtener los IDs de las órdenes canceladas para eliminar sus items
    const cancelledOrders = await orderRepository.find({
      where: { status: OrderStatus.CANCELLED },
      select: ["id"]
    });

    const cancelledOrderIds = cancelledOrders.map(order => order.id);

    if (cancelledOrderIds.length > 0) {
      // Eliminar los items de las órdenes canceladas
      const deletedItems = await orderItemRepository
        .createQueryBuilder()
        .delete()
        .from(OrderItem)
        .where("orderId IN (:...orderIds)", { orderIds: cancelledOrderIds })
        .execute();


      // Luego eliminar las órdenes canceladas
      const deletedOrdersResult = await orderRepository
        .createQueryBuilder()
        .delete()
        .from(Order)
        .where("status = :status", { status: OrderStatus.CANCELLED })
        .execute();


      return {
        deletedOrders: deletedOrdersResult.affected || 0,
        restoredStock: 0, // Estandarizar estructura con clearAllOrdersService
      };
    }

    return { deletedOrders: 0, restoredStock: 0 }; // Estandarizar estructura
  } catch (error: any) {
    console.error("Error al limpiar órdenes canceladas:", error);
    if (error.status && error.message) throw error;
    throw { status: 500, message: "Error al limpiar órdenes canceladas" };
  }
};

