import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import bcrypt from "bcryptjs";
import { User } from "../../../src/entities/User";
import { UserRole } from "../../../src/enums/UserRole";

describe("Authentication - Login", () => {
  
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  // 1. CAMPOS OBLIGATORIOS FALTANTES
  it("debería fallar si faltan campos obligatorios (400)", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({}); // Enviamos body vacío

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Los campos email y contraseña son obligatorios");
  });

  // 2. EMAIL INVÁLIDO
  it("debería fallar si el formato del email es inválido (400)", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "correo-invalido",
        password: "Password123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El formato del email es inválido");
  });

  // 3. EMAIL VACÍO
  it("debería fallar si el email está vacío (400)", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "",
        password: "Password123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Los campos email y contraseña son obligatorios");
  });

  // 4. CONTRASEÑA VACÍA
  it("debería fallar si la contraseña está vacía (400)", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "test@test.com",
        password: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Los campos email y contraseña son obligatorios");
  });

  // 5. EMAIL NO EXISTE
  it("debería fallar si el email no existe (401)", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "noexiste@test.com",
        password: "Password123!",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Credenciales inválidas");
  });

  // 6. CONTRASEÑA INCORRECTA
  it("debería fallar si la contraseña es incorrecta (401)", async () => {
    // Primero creamos un usuario para la prueba
    const userRepo = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    
    const testUser = userRepo.create({
      email: "login@test.com",
      password: hashedPassword,
      name: "Usuario",
      surname: "Test",
      role: UserRole.CUSTOMER,
    });
    
    await userRepo.save(testUser);

    // Intentamos login con contraseña incorrecta
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "login@test.com",
        password: "PasswordIncorrecta!",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Credenciales inválidas");

    // Limpiamos el usuario de prueba
    await userRepo.remove(testUser);
  });

  // 7. LOGIN EXITOSO - CLIENTE
  it("debería permitir login exitoso de cliente (200)", async () => {
    // Creamos un usuario cliente para la prueba
    const userRepo = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    
    const testUser = userRepo.create({
      email: "cliente@test.com",
      password: hashedPassword,
      name: "Cliente",
      surname: "Test",
      role: UserRole.CUSTOMER,
    });
    
    await userRepo.save(testUser);

    // Login exitoso
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "cliente@test.com",
        password: "Password123!",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("email", "cliente@test.com");
    expect(response.body).toHaveProperty("name", "Cliente");
    expect(response.body).toHaveProperty("surname", "Test");
    expect(response.body).toHaveProperty("role", "customer");
    expect(response.body).not.toHaveProperty("password");

    // Limpiamos el usuario de prueba
    await userRepo.remove(testUser);
  });

  // 8. LOGIN EXITOSO - ADMINISTRADOR
  it("debería permitir login exitoso de administrador (200)", async () => {
    // Creamos un usuario administrador para la prueba
    const userRepo = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    
    const testUser = userRepo.create({
      email: "admin@test.com",
      password: hashedPassword,
      name: "Admin",
      surname: "Test",
      role: UserRole.ADMIN,
    });
    
    await userRepo.save(testUser);

    // Login exitoso
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "admin@test.com",
        password: "Admin123!",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("email", "admin@test.com");
    expect(response.body).toHaveProperty("name", "Admin");
    expect(response.body).toHaveProperty("surname", "Test");
    expect(response.body).toHaveProperty("role", "admin");
    expect(response.body).not.toHaveProperty("password");

    // Limpiamos el usuario de prueba
    await userRepo.remove(testUser);
  });

  // 9. VERIFICACIÓN DE TOKEN JWT
  it("debería generar un token JWT válido (200)", async () => {
    // Creamos un usuario para la prueba
    const userRepo = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash("Token123!", 10);
    
    const testUser = userRepo.create({
      email: "token@test.com",
      password: hashedPassword,
      name: "Token",
      surname: "Test",
      role: UserRole.CUSTOMER,
    });
    
    await userRepo.save(testUser);

    // Login para obtener token
    const response = await request(app)
      .post("/users/login")
      .send({
        email: "token@test.com",
        password: "Token123!",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    
    // Verificamos que el token tenga el formato JWT (3 partes separadas por puntos)
    const token = response.body.accessToken;
    const tokenParts = token.split('.');
    expect(tokenParts).toHaveLength(3);

    // Limpiamos el usuario de prueba
    await userRepo.remove(testUser);
  });

  // 10. CONSISTENCIA DE MENSAJES DE ERROR
  it("debería mostrar el mismo mensaje para usuario no existe y contraseña incorrecta (401)", async () => {
    // Creamos un usuario para la prueba
    const userRepo = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash("Consistencia123!", 10);
    
    const testUser = userRepo.create({
      email: "consistencia@test.com",
      password: hashedPassword,
      name: "Consistencia",
      surname: "Test",
      role: UserRole.CUSTOMER,
    });
    
    await userRepo.save(testUser);

    // Test 1: Email que no existe
    const response1 = await request(app)
      .post("/users/login")
      .send({
        email: "noexiste@test.com",
        password: "Consistencia123!",
      });

    expect(response1.status).toBe(401);
    expect(response1.body.message).toBe("Credenciales inválidas");

    // Test 2: Contraseña incorrecta
    const response2 = await request(app)
      .post("/users/login")
      .send({
        email: "consistencia@test.com",
        password: "Incorrecta123!",
      });

    expect(response2.status).toBe(401);
    expect(response2.body.message).toBe("Credenciales inválidas");

    // Ambos mensajes deben ser idénticos
    expect(response1.body.message).toBe(response2.body.message);

    // Limpiamos el usuario de prueba
    await userRepo.remove(testUser);
  });
});