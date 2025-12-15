import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entities/User";
import { UserRole } from "../../src/enums/UserRole";
import { UserGender } from "../../src/enums/UserGender";
import bcrypt from "bcrypt";

// ⚠️ Obligatorio: definir ADMIN_EMAIL y ADMIN_PASSWORD en el .env del backend
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error(
    "Variables de entorno ADMIN_EMAIL y ADMIN_PASSWORD son requeridas para el seed de admin."
  );
}

export const seedAdminUser = async () => {
  try {
    console.log("🌱 Iniciando seeding de usuario admin...");

    const userRepo = AppDataSource.getRepository(User);

    // Verificar si ya existe un admin con ese email
    const existingAdmin = await userRepo.findOne({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log(
        `👑 Usuario admin ya existe con email ${ADMIN_EMAIL}. Saltando creación.`
      );
      return;
    }

    // Si no existe, crear uno nuevo
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const adminUser = userRepo.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: "Admin",
      surname: "Booker",
      address: null,
      country: null,
      city: null,
      phone: null,
      bio: "Usuario administrador generado automáticamente por seed.",
      gender: UserGender.NOT_SPECIFIC,
      role: UserRole.ADMIN,
    });

    await userRepo.save(adminUser);

    console.log(
      `✅ Usuario admin creado con éxito (email: ${ADMIN_EMAIL}).`
    );
  } catch (error) {
    console.error("❌ Error al hacer seeding de usuario admin:", error);
    throw error;
  }
};

// Ejecutar seeding si se llama directamente con ts-node
if (require.main === module) {
  AppDataSource.initialize()
    .then(async () => {
      await seedAdminUser();
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}


