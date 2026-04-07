import { AppDataSource } from "../../src/config/data-source";
import { Order } from "../../src/entities/Order";
import { OrderStatus } from "../../src/enums/OrderStatus";

/**
 * Limpia todas las órdenes pendientes de un usuario
 * para evitar bloqueos en tests del carrito
 */
export const cleanUserPendingOrders = async (userId: string) => {
  const orderRepository = AppDataSource.getRepository(Order);
  
  try {
    // Usamos el método delete directo del repositorio
    // Es la forma más robusta de evitar errores de alias y palabras reservadas en SQL
    const result = await orderRepository.delete({
      user: { id: userId },
      status: OrderStatus.PENDING
    });

    const deletedCount = result.affected || 0;
    
    if (deletedCount > 0) {
      console.log(`🧹 Eliminadas ${deletedCount} órdenes pendientes del usuario ${userId}`);
    } else {
      console.log(`✅ Usuario ${userId} no tiene órdenes pendientes`);
    }
    
    return deletedCount;
    
  } catch (error) {
    console.error('❌ Error limpiando órdenes pendientes:', error);
    return 0;
  }
};
