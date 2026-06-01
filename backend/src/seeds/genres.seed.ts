import { AppDataSource } from "../../src/config/data-source";
import { Genre } from "../../src/entities/Genre";

const genreNames = [
  // Usados en books
  "Literatura Clásica",
  "Ficción Distópica",
  "Romance",
  "Ficción de Crecimiento",
  "Fantasía",
  "Ficción Filosófica",
  "Suspense",
  "Ficción Literaria",
  "Ficción Histórica",
  "Thriller Criminal",
  "Romance Juvenil",
  "Ciencia Ficción",
  "Thriller Psicológico",
  "Memorias",
  // Adicionales
  "Terror",
  "Biografía",
  "Autoayuda",
  "Negocios",
  "Poesía",
  "Novela Gráfica",
  "Aventura",
  "No Ficción",
  "Infantil",
  "Misterio",
  "Humor",
];

export const seedGenres = async () => {
  try {
    console.log("🌱 Iniciando seeding de géneros...");

    const repo = AppDataSource.getRepository(Genre);

    const records = genreNames.map((name) => ({ name }));

    // Upsert por 'name' para no duplicar si ya existen
    await repo.upsert(records, {
      conflictPaths: ["name"],
      skipUpdateIfNoValuesChanged: true,
    });

    const total = await repo.count();
    console.log(`✅ Géneros asegurados. Total en DB: ${total}`);
  } catch (error) {
    console.error("❌ Error al hacer seeding de géneros:", error);
    throw error;
  }
};

// Ejecutar seeding si se llama directamente
if (require.main === module) {
  AppDataSource.initialize()
    .then(async () => {
      await seedGenres();
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}
