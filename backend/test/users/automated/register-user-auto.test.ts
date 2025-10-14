import request from "supertest";
import { app } from "../../../src/server";

/**
 * ========================================
 * PRUEBAS DE REGISTRO DE USUARIOS
 * ========================================
 */

describe("User registration tests", () => {

  //! AUTO-001: Successful new user registration

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

  //! AUTO-002: Reject duplicate email

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

  //! AUTO-003: Basic validations (400 Bad Request)

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

  //! AUTO-004: Optional fields validations (400 Bad Request)

  it("should reject invalid phone format", async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: "Password123",
      confirmPassword: "Password123",
      name: "John",
      surname: "Doe",
      phone: "invalid-phone",
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Phone number must contain only digits");
  });

  it("should reject short address", async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: "Password123",
      confirmPassword: "Password123",
      name: "John",
      surname: "Doe",
      address: "AB", // Muy corto
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Address must be at least 3 characters long");
  });

  it("should reject short country", async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: "Password123",
      confirmPassword: "Password123",
      name: "John",
      surname: "Doe",
      country: "A", // Muy corto
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Country must be at least 2 characters long");
  });

  it("should reject short city", async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: "Password123",
      confirmPassword: "Password123",
      name: "John",
      surname: "Doe",
      city: "A", // Muy corto
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("City must be at least 2 characters long");
  });

  //! AUTO-005: Success with optional fields (201 Created)

  it("should accept valid optional fields", async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: "Password123",
      confirmPassword: "Password123",
      name: "John",
      surname: "Doe",
      address: "123 Main Street",
      country: "USA",
      city: "New York",
      phone: "1234567890",
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.address).toBe("123 Main Street");
    expect(response.body.country).toBe("USA");
    expect(response.body.city).toBe("New York");
    expect(response.body.phone).toBe("1234567890");
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
