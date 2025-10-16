import request from "supertest";
import { app } from "../../../../src/server";

/**
 * ========================================
 * PRUEBAS DE REGISTRO DE USUARIOS
 * ========================================
 */

describe("User registration tests", () => {
  //! AUTO-001: Successful new user registration
  it("AUTO-001: should create a new user successfully", async () => {
    // Paso 1: Preparar datos de prueba con email unico
    const userData = {
      email: `test-${Date.now()}@example.com`, // Email unico usando timestamp
      password: "Password123",
      confirmPassword: "Password123",
      name: "John",
      surname: "Doe",
    };

    // Paso 2: Enviar peticion a la API
    const response = await request(app).post("/users/register").send(userData);

    // Paso 3: Verificar que funciono
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.name).toBe("John");
  });

  //! AUTO-002: Reject duplicate email
  it("AUTO-002: should reject duplicate email", async () => {
    // Usar un email unico para esta prueba
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

    // Debe fallar con codigo 409
    expect(response.status).toBe(409);
  });

  //! AUTO-003: Reject incomplete data
  it("AUTO-003: should reject incomplete data", async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      // Faltan campos requeridos
    };

    const response = await request(app).post("/users/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "Email, password, confirmPassword, name and surname are required"
    );
  });

  //! AUTO-004: Reject invalid email format
  it("AUTO-004: should reject invalid email format", async () => {
    const userData = {
      email: "invalid-email-format",
      password: "Password123",
      confirmPassword: "Password123",
      name: "John",
      surname: "Doe",
    };

    const response = await request(app).post("/users/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Email format is invalid");
  });

  //! AUTO-005: Reject mismatched passwords
  it("AUTO-005: should reject mismatched passwords", async () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: "Password123",
      confirmPassword: "DifferentPassword456",
      name: "John",
      surname: "Doe",
    };

    const response = await request(app).post("/users/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Passwords do not match");
  });
});