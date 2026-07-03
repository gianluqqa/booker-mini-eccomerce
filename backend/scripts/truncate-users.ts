import { AppDataSource } from "../src/config/data-source";
import { UserRole } from "../src/enums/UserRole";
import { User } from "../src/entities/User";
import { Book } from "../src/entities/Book";

const seedBookTitles = [
  "The Great Gatsby",
  "1984",
  "To Kill a Mockingbird",
  "Pride and Prejudice",
  "The Catcher in the Rye",
  "The Lord of the Rings",
  "Harry Potter and the Philosopher's Stone",
  "The Hobbit",
  "The Chronicles of Narnia",
  "The Alchemist",
  "The Da Vinci Code",
  "The Kite Runner",
  "The Book Thief",
  "The Hunger Games",
  "The Girl with the Dragon Tattoo",
  "The Handmaid's Tale",
  "The Fault in Our Stars",
  "The Martian",
  "The Silent Patient",
  "Educated"
];

// Prefijos de emails utilizados en pruebas E2E
const testEmailPrefixes = [
  "qa.test",
  "auth.test",
  "login.empty-password",
  "login.nonexistent",
  "duplicate.test",
  "mandatory.only"
];

// Prefijos de títulos de libros utilizados en pruebas E2E
const testBookTitlePrefixes = [
  "Test Book",
  "Booker Test Book"
];

async function clearDatabase() {
  try {
    console.log("⏳ Conectando a la base de datos para limpieza selectiva...");
    await AppDataSource.initialize();
    
    console.log("🧹 Iniciando limpieza selectiva de la base de datos...");

    // 1. Limpiar tablas transaccionales/dependientes (ignora errores si no existen)
    const tablesToEmpty = [
      "user_favorites",
      "review",
      "order_item",
      "order",
      "cart_item",
      "cart",
      "stock_reservation"
    ];

    for (const tableName of tablesToEmpty) {
      try {
        await AppDataSource.query(`DELETE FROM "${tableName}";`);
        console.log(`   - Limpiada tabla: ${tableName}`);
      } catch (e) {
        // La tabla puede llamarse diferente o no existir aún
      }
    }

    // 2. Eliminar usuarios de prueba basados en prefijos de email
    const emailConditions = testEmailPrefixes.map(prefix => `email LIKE '${prefix}.%'`);
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(User)
      .where(`(${emailConditions.join(' OR ')})`)
      .execute();
    console.log(`   - Usuarios de prueba eliminados (basado en prefijos: ${testEmailPrefixes.join(', ')}).`);

    // 3. Eliminar usuarios que no sean admin (para limpieza adicional)
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(User)
      .where("role != :role", { role: UserRole.ADMIN })
      .execute();
    console.log(`   - Usuarios no-admin eliminados (Admin conservado).`);

    // 4. Eliminar libros de prueba basados en prefijos de título
    const titleConditions = testBookTitlePrefixes.map(prefix => `title LIKE '${prefix} %'`);
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Book)
      .where(`(${titleConditions.join(' OR ')})`)
      .execute();
    console.log(`   - Libros de prueba eliminados (basado en prefijos: ${testBookTitlePrefixes.join(', ')}).`);

    // 5. Eliminar libros que no sean los SEEDS (para limpieza adicional)
    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Book)
      .where("title NOT IN (:...titles)", { titles: seedBookTitles })
      .execute();
    console.log(`   - Libros no-SEED eliminados (Semillas conservadas).`);

    console.log("✅ Base de datos limpiada selectivamente.");
  } catch (error) {
    console.error("❌ Error fatal durante la limpieza:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

clearDatabase();
