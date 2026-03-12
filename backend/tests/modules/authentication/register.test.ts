import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";

describe("Authentication - Registro (Register)", () => {
  
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
      .post("/users/register")
      .send({}); // Enviamos body vacío

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
  });

  // 2. EMAIL INVÁLIDO
  it("debería fallar si el formato del email es inválido (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez",
        email: "correo-invalido",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El formato del email es inválido");
  });

  // 3. CONTRASEÑA INVÁLIDA (Complejidad)
  it("debería fallar si la contraseña no cumple la complejidad (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez",
        email: "pass@test.com",
        password: "solo_minusculas",
        confirmPassword: "solo_minusculas",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número");
  });

  // 4. CONTRASEÑAS DISTINTAS
  it("debería fallar si las contraseñas no coinciden (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez",
        email: "mismatch@test.com",
        password: "Password123!",
        confirmPassword: "Different123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Las contraseñas no coinciden");
  });

  // 5. NOMBRE INVÁLIDO
  it("debería fallar si el nombre contiene números o símbolos (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan123",
        surname: "Perez",
        email: "name@test.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El nombre solo puede contener letras y espacios");
  });

  // 6. APELLIDO INVÁLIDO
  it("debería fallar si el apellido contiene números o símbolos (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez99",
        email: "surname@test.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("El apellido solo puede contener letras y espacios");
  });

  // 7. REGISTRO EXITOSO Y EMAIL DUPLICADO
  let registeredEmail: string;

  it("debería registrar un usuario con éxito (201)", async () => {
    registeredEmail = `success_${Date.now()}@test.com`;
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez",
        email: registeredEmail,
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(registeredEmail);
    expect(response.body).not.toHaveProperty("password");
  });

  it("debería fallar si el email ya existe (409)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Otro",
        surname: "Usuario",
        email: registeredEmail,
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("Ya existe un usuario con ese email");
  });
});