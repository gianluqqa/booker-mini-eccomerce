import { AppDataSource } from "../../src/config/data-source";
import { Genre } from "../../src/entities/Genre";

const genreNames = [
  // Usados en books
  "Classic Literature",
  "Dystopian Fiction",
  "Romance",
  "Coming-of-Age",
  "Fantasy",
  "Philosophical Fiction",
  "Thriller",
  "Literary Fiction",
  "Historical Fiction",
  "Crime Thriller",
  "Young Adult Romance",
  "Science Fiction",
  "Psychological Thriller",
  "Memoir",
  // Adicionales
  "Horror",
  "Biography",
  "Self-Help",
  "Business",
  "Poetry",
  "Graphic Novel",
  "Adventure",
  "Non-Fiction",
  "Children",
  "Mystery",
  "Humor",
];

export const seedGenres = async () => {
  try {
    console.log("🌱 Iniciando seeding de géneros...");

    const repo = AppDataSource.getRepository(Genre);

    const slugify = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const records = genreNames.map((name) => ({ id: slugify(name), name }));

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
