import request from "supertest";
import { app } from "../../../../src/server";

/**
 * ========================================
 * PRUEBAS AUTOMATIZADAS DE LOGIN DE USUARIOS
 * ========================================
 *
 * Basado en los casos de prueba manuales:
 * - TC-007: Successful user login
 * - TC-008: Login with incorrect password
 * - TC-009: Login with non-existent user
 */

describe("User login automated tests", () => {
  //! AUTO-006: Successful user login (TC-007)
  it("AUTO-006: should login user successfully with valid credentials", async () => {
    // Paso 1: Crear un usuario primero para poder hacer login
    const userData = {
      email: `login-success-${Date.now()}@example.com`,
      password: "StrongPass123",
      confirmPassword: "StrongPass123",
      name: "Login",
      surname: "Test",
      address: "123 Main Street",
      country: "Argentina",
      city: "Buenos Aires",
      phone: "541112345678",
    };

    // Registrar el usuario
    await request(app).post("/users/register").send(userData);

    // Paso 2: Intentar hacer login con credenciales válidas
    const loginData = {
      email: userData.email,
      password: userData.password,
    };

    const response = await request(app).post("/users/login").send(loginData);

    // Paso 3: Verificar que el login fue exitoso
    expect(response.status).toBe(200);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.name).toBe("Login");
    expect(response.body.surname).toBe("Test");
    expect(response.body.address).toBe("123 Main Street");
    expect(response.body.country).toBe("Argentina");
    expect(response.body.city).toBe("Buenos Aires");
    expect(response.body.phone).toBe("541112345678");
    expect(response.body.role).toBe("customer");
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();

    // Verificar que la contraseña NO está en la respuesta (seguridad)
    expect(response.body.password).toBeUndefined();
  });

  //! AUTO-007: Login with incorrect password (TC-008)
  it("AUTO-007: should reject login with incorrect password", async () => {
    // Paso 1: Crear un usuario
    const userData = {
      email: `incorrect-password-${Date.now()}@example.com`,
      password: "StrongPass123",
      confirmPassword: "StrongPass123",
      name: "Test",
      surname: "User",
    };

    await request(app).post("/users/register").send(userData);

    // Paso 2: Intentar login con contraseña incorrecta
    const loginData = {
      email: userData.email,
      password: "WrongPassword123", // Contraseña incorrecta
    };

    const response = await request(app).post("/users/login").send(loginData);

    // Paso 3: Verificar que el login fue rechazado
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
    expect(response.body.user).toBeUndefined();
  });

  //! AUTO-008: Login with non-existent user (TC-009)
  it("AUTO-008: should reject login with non-existent user", async () => {
    // Paso 1: Intentar login con usuario que no existe
    const loginData = {
      email: "nonexistent@example.com",
      password: "AnyPassword123",
    };

    const response = await request(app).post("/users/login").send(loginData);

    // Paso 2: Verificar que el login fue rechazado con mensaje genérico por seguridad
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
    expect(response.body.user).toBeUndefined();
  });

  //! AUTO-009: Login with missing email (TC-010)
  it("AUTO-009: should reject login with missing email", async () => {
    // Paso 1: Intentar login sin email
    const loginData = {
      password: "StrongPass123",
    };

    const response = await request(app).post("/users/login").send(loginData);

    // Paso 2: Verificar que el login fue rechazado
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Email is required");
  });

  //! AUTO-010: Login with missing password (TC-011)
  it("AUTO-010: should reject login with missing password", async () => {
    // Paso 1: Intentar login sin contraseña
    const loginData = {
      email: "test@example.com",
    };

    const response = await request(app).post("/users/login").send(loginData);

    // Paso 2: Verificar que el login fue rechazado
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Password is required");
  });

  //! AUTO-011: Login with invalid email format (TC-012)
  it("AUTO-011: should reject login with invalid email format", async () => {
    // Paso 1: Intentar login con email inválido
    const loginData = {
      email: "invalid-email-format",
      password: "StrongPass123",
    };

    const response = await request(app).post("/users/login").send(loginData);

    // Paso 2: Verificar que el login fue rechazado
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Email format is invalid");
  });
});
