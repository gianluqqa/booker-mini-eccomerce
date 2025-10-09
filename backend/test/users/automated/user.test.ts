import request from "supertest";
import { app } from "../../../src/server";

/**
 * ========================================
 * PRUEBAS DE REGISTRO DE USUARIOS
 * ========================================
 */

describe("User registration tests", () => {

  //! TC001: Create a new user successfully

  it("should create a new user successfully", async () => {
    // Paso 1: Preparar datos de prueba con email único
    const userData = {
      email: `test-${Date.now()}@example.com`, // Email único usando timestamp
      password: "Password123",
      confirmPassword: "Password123",
      name: "John",
      surname: "Doe",
    };

    // Paso 2: Enviar petición a la API
    const response = await request(app).post("/users/register").send(userData);

    // Paso 3: Verificar que funcionó
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.name).toBe("John");
  });

  //! TC002: Reject duplicate email

  it("should reject duplicate email", async () => {
    // Usar un email único para esta prueba
    const uniqueEmail = `duplicate-${Date.now()}@example.com`;

    // Primero, crear un usuario
    const firstUser = {
      email: uniqueEmail,
      password: "Password123",
      confirmPassword: "Password123",
      name: "First",
      surname: "User",
    };

    await request(app).post("/users/register").send(firstUser);

    // Intentar crear otro usuario con el mismo email
    const duplicateUser = {
      email: uniqueEmail, // Mismo email que el primer usuario
      password: "Password123",
      confirmPassword: "Password123",
      name: "Second",
      surname: "User",
    };

    const response = await request(app)
      .post("/users/register")
      .send(duplicateUser);

    // Debe fallar con código 409
    expect(response.status).toBe(409);
  });

  //! TC003: Validaciones básicas (400 Bad Request)

  it("should reject incomplete data", async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`
      // Faltan campos requeridos
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Password is required");
  });

  it("should reject invalid email format", async () => {
    const userData = {
      email: "invalid-email-format",
      password: "Password123",
      confirmPassword: "Password123",
      name: "John",
      surname: "Doe",
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Email format is invalid");
  });

  it("should reject mismatched passwords", async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: "Password123",
      confirmPassword: "DifferentPassword456",
      name: "John",
      surname: "Doe",
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Passwords do not match");
  });
});

/**
 * ========================================
 * CÓMO LEER ESTAS PRUEBAS
 * ========================================
 *
 * Cada prueba tiene 3 partes:
 * 1. ARREGLAR: Preparar los datos de prueba
 * 2. ACTUAR: Hacer algo (llamada a la API)
 * 3. AFIRMAR: Verificar que funcionó como se esperaba
 *
 * Los nombres de las pruebas explican qué hacen:
 * - "should create a new user successfully"
 * - "should reject duplicate email"
 * - "should reject incomplete data"
 * - "should reject invalid email format"
 * - "should reject mismatched passwords"
 */
