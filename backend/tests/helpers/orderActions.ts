import { AppDataSource } from "../../src/config/data-source";
import { Order } from "../../src/entities/Order";
import { OrderStatus } from "../../src/enums/OrderStatus";

/**
 * ACCIONES: Órdenes
 * ----------------
 */

export const cleanUserPendingOrders = async (userId: string) => {
  const orderRepository = AppDataSource.getRepository(Order);
  try {
    const result = await orderRepository.delete({
      user: { id: userId },
      status: OrderStatus.PENDING
    });
    console.log(`\x1b[32m✅ Usuario ${userId} no tiene órdenes pendientes\x1b[0m`);
    return result;
  } catch (error) {
    console.error(`❌ Error limpiando órdenes pendientes para el usuario ${userId}:`, error);
    throw error;
  }
};
