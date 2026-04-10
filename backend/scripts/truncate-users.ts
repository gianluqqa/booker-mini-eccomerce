import { AppDataSource } from "../src/config/data-source";
import { User } from "../src/entities/User";

async function clearDatabase() {
  try {
    console.log("⏳ Conectando a la base de datos...");
    await AppDataSource.initialize();
    
    // Obtenemos todas las entidades registradas
    const entities = AppDataSource.entityMetadatas;
    
    console.log("🧹 Iniciando limpieza total de la base de datos...");

    // Desactivamos temporalmente las restricciones de llaves foráneas para mayor velocidad (opcional en truncate cascade)
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      const tableName = entity.tableName;
      
      console.log(`   - Limpiando tabla: ${tableName}...`);
      await repository.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
    }

    console.log("✅ Base de datos totalmente limpia.");
  } catch (error) {
    console.error("❌ Error fatal durante la limpieza:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

clearDatabase();
