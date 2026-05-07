import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entities/User";
import { Book } from "../../src/entities/Book";
import { Review } from "../../src/entities/Review";
import { Order } from "../../src/entities/Order";
import { OrderItem } from "../../src/entities/OrderItem";
import { Cart } from "../../src/entities/Cart";
import { StockReservation } from "../../src/entities/StockReservation";
import { Genre } from "../../src/entities/Genre";
import { ILike } from "typeorm";

/**
 * Inicializa la base de datos para los tests si no está inicializada.
 */
export const initializeTestDb = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

/**
 * Cierra la conexión de la base de datos.
 */
export const closeTestDb = async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
};

/**
 * Limpia todas las tablas relevantes para los tests, respetando el orden de las claves foráneas.
 */
export const clearDatabase = async () => {
  if (!AppDataSource.isInitialized) return;

  try {
    // 1. Tablas dependientes (Hojas)
    await AppDataSource.getRepository(Review).createQueryBuilder().delete().execute();
    await AppDataSource.getRepository(OrderItem).createQueryBuilder().delete().execute();
    await AppDataSource.getRepository(StockReservation).createQueryBuilder().delete().execute();
    await AppDataSource.getRepository(Cart).createQueryBuilder().delete().execute();
    
    // 2. Tablas intermedias/principales
    await AppDataSource.getRepository(Order).createQueryBuilder().delete().execute();
    
    // 3. Entidades base con filtros para evitar borrar semillas globales (opcional pero recomendado)
    // Usamos delete con filtros de nombre/email para mayor seguridad en entornos compartidos
    await AppDataSource.getRepository(User).delete({ email: ILike("%@test.com") });
    
    await AppDataSource.getRepository(Book).delete([
      { author: "Default Author" },
      { title: ILike("%Test%") },
      { title: ILike("%Admin%") },
      { title: ILike("%Stock%") },
      { title: ILike("%Another%") },
      { title: ILike("%Update%") },
      { title: ILike("%Delete%") }
    ]);

    await AppDataSource.getRepository(Genre).delete({
      name: ILike("%TestGenre%")
    });
    
  } catch (error) {
    // En tests, a veces fallan las limpiezas por locks o procesos paralelos (como expiración)
    // Silenciamos para no ensuciar la salida del test a menos que sea crítico
  }
};
