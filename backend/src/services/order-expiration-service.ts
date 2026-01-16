import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Book } from "../entities/Book";
import { StockReservation } from "../entities/StockReservation";
import { OrderStatus } from "../enums/OrderStatus";

// Mapa para almacenar los timeouts activos
const activeTimeouts = new Map<string, NodeJS.Timeout>();

//? Configurar expiración automática para una orden PENDING
export const setupOrderExpiration = (orderId: string, expirationMinutes: number = 2): void => {
  console.log(`⏰ [${new Date().toISOString()}] Configurando expiración automática para orden ${orderId} en ${expirationMinutes} minutos`);

  // Limpiar timeout existente si hay uno
  if (activeTimeouts.has(orderId)) {
    clearTimeout(activeTimeouts.get(orderId)!);
    console.log(`🔄 [${new Date().toISOString()}] Timeout existente limpiado para orden ${orderId}`);
  }

  // Configurar timeout para expiración
  const expirationTimeout = setTimeout(async () => {
    console.log(`⏰ [${new Date().toISOString()}] Tiempo expirado para orden ${orderId} - Marcando como EXPIRED`);
    try {
      await markOrderAsExpired(orderId);
      
      // Configurar segundo timeout para eliminación (2 minutos después)
      const deletionTimeout = setTimeout(async () => {
        console.log(`🗑️ [${new Date().toISOString()}] Tiempo de eliminación para orden ${orderId} - Eliminando de la BD`);
        try {
          await deleteExpiredOrder(orderId);
        } catch (error) {
          console.error(`❌ [${new Date().toISOString()}] Error al eliminar orden ${orderId}:`, error);
        }
      }, 2 * 60 * 1000); // 2 minutos

      activeTimeouts.set(`${orderId}_deletion`, deletionTimeout);
      console.log(`⏰ [${new Date().toISOString()}] Timeout de eliminación configurado para orden ${orderId} (2 minutos)`);
    } catch (error) {
      console.error(`❌ [${new Date().toISOString()}] Error al marcar orden ${orderId} como EXPIRED:`, error);
    }
  }, expirationMinutes * 60 * 1000); // X minutos

  activeTimeouts.set(orderId, expirationTimeout);
  console.log(`✅ [${new Date().toISOString()}] Timeout de expiración configurado para orden ${orderId} (${expirationMinutes} minutos)`);
  console.log(`📊 [${new Date().toISOString()}] Timeouts activos: ${activeTimeouts.size}`);
};

//? Marcar orden como EXPIRED y devolver stock
export const markOrderAsExpired = async (orderId: string): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const orderRepository = queryRunner.manager.getRepository(Order);
    const orderItemRepository = queryRunner.manager.getRepository(OrderItem);
    const bookRepository = queryRunner.manager.getRepository(Book);
    const stockReservationRepository = queryRunner.manager.getRepository(StockReservation);

    // Buscar la orden PENDING
    const order = await orderRepository.findOne({
      where: { id: orderId, status: OrderStatus.PENDING },
      relations: ['user', 'items', 'items.book']
    });

    if (!order) {
      console.log(`❌ Orden ${orderId} no encontrada o no está PENDING`);
      return;
    }

    console.log(`📋 Marcando orden ${orderId} como EXPIRED`);

    // Devolver stock de los items
    for (const item of order.items) {
      const book = await bookRepository.findOne({ 
        where: { id: item.book.id } 
      });
      
      if (book) {
        console.log(`📚 Devolviendo stock: ${item.quantity} unidades del libro ${book.title}`);
        book.stock += item.quantity;
        await bookRepository.save(book);
      }
    }

    // Cambiar estado a EXPIRED
    order.status = OrderStatus.EXPIRED;
    await orderRepository.save(order);

    // Eliminar reserva de stock si existe
    const reservation = await stockReservationRepository.findOne({
      where: { userId: order.user.id },
    });

    if (reservation) {
      await stockReservationRepository.remove(reservation);
      console.log('🗑️ Reserva de stock eliminada por expiración');
    }

    await queryRunner.commitTransaction();
    console.log(`✅ Orden ${orderId} marcada como EXPIRED y stock devuelto`);

  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error(`❌ Error al marcar orden ${orderId} como EXPIRED:`, error);
  } finally {
    await queryRunner.release();
  }
};

//? Eliminar orden EXPIRED de la base de datos
export const deleteExpiredOrder = async (orderId: string): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const orderRepository = queryRunner.manager.getRepository(Order);
    const orderItemRepository = queryRunner.manager.getRepository(OrderItem);
    const stockReservationRepository = queryRunner.manager.getRepository(StockReservation);

    // Buscar la orden EXPIRED
    const order = await orderRepository.findOne({
      where: { id: orderId, status: OrderStatus.EXPIRED },
      relations: ['items', 'user']
    });

    if (!order) {
      console.log(`❌ Orden ${orderId} no encontrada o no está EXPIRED`);
      return;
    }

    console.log(`🗑️ Eliminando orden EXPIRED ${orderId} de la base de datos`);

    // Eliminar reserva de stock si existe
    const reservation = await stockReservationRepository.findOne({
      where: { userId: order.user.id },
    });

    if (reservation) {
      await stockReservationRepository.remove(reservation);
      console.log('🗑️ Reserva de stock eliminada durante limpieza de orden EXPIRED');
    }

    // Eliminar items de la orden
    await orderItemRepository.delete({ order: { id: orderId } });
    
    // Eliminar la orden
    await orderRepository.delete({ id: orderId });

    // Limpiar timeouts del mapa
    activeTimeouts.delete(orderId);
    activeTimeouts.delete(`${orderId}_deletion`);

    await queryRunner.commitTransaction();
    console.log(`✅ Orden ${orderId} eliminada completamente de la BD con su reserva de stock`);

  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error(`❌ Error al eliminar orden ${orderId}:`, error);
  } finally {
    await queryRunner.release();
  }
};

//? Cancelar expiración automática de una orden
export const cancelOrderExpiration = (orderId: string): void => {
  if (activeTimeouts.has(orderId)) {
    clearTimeout(activeTimeouts.get(orderId)!);
    activeTimeouts.delete(orderId);
    console.log(`⏹️ Expiración cancelada para orden ${orderId}`);
  }

  if (activeTimeouts.has(`${orderId}_deletion`)) {
    clearTimeout(activeTimeouts.get(`${orderId}_deletion`)!);
    activeTimeouts.delete(`${orderId}_deletion`);
    console.log(`🗑️ Eliminación automática cancelada para orden ${orderId}`);
  }
};

//? Obtener timeouts activos (para debugging)
export const getActiveTimeouts = (): Map<string, NodeJS.Timeout> => {
  return new Map(activeTimeouts);
};
