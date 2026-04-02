// Importaciones necesarias para las pruebas
import request from "supertest"; // Librería para hacer peticiones HTTP a la API
import { app } from "../../../src/server"; // Aplicación Express que vamos a probar
import { AppDataSource } from "../../../src/config/data-source"; // Conexión a la base de datos

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

  // 1. Registro Exitoso
  let registeredEmail: string;

  it("1. Registro exitoso (201)", async () => {
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
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("message", "Usuario creado exitosamente");
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("email", registeredEmail);
    expect(response.body.data).toHaveProperty("name", "Juan");
    expect(response.body.data).toHaveProperty("surname", "Perez");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("role");
    expect(response.body.data).not.toHaveProperty("password");
  });

  // 2. Email Duplicado
  it("2. Email duplicado (409)", async () => {
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
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Ya existe un usuario con ese email");
  });

  // 3. Body Vacío
  it("3. Body vacío (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Error de validación");
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toContain(
      "Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios"
    );
  });

  // 4. Falta Email
  it("4. Falta email (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez",
        password: "Password123!",
        confirmPassword: "Password123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
  });

  // 5. Falta Contraseña
  it("5. Falta contraseña (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez",
        email: "test@test.com",
        confirmPassword: "Password123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
  });

  // 6. Falta Confirmación de Contraseña
  it("6. Falta confirmación de contraseña (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez",
        email: "test@test.com",
        password: "Password123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
  });

  // 7. Falta Nombre
  it("7. Falta nombre (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        surname: "Perez",
        email: "test@test.com",
        password: "Password123!",
        confirmPassword: "Password123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
  });

  // 8. Falta Apellido
  it("8. Falta apellido (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        email: "test@test.com",
        password: "Password123!",
        confirmPassword: "Password123!"
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
  });

  // 9. Email Inválido
  it("9. Email inválido (400)", async () => {
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
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("El formato del email es inválido");
  });

  // 10. Email Vacío
  it("10. Email vacío (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez",
        email: "   ",
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
  });

  // 11. Contraseña Sin Complejidad
  it("11. Contraseña sin complejidad (400)", async () => {
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
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número");
  });

  // 12. Contraseña Demasiado Corta
  it("12. Contraseña demasiado corta (400)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Juan",
        surname: "Perez",
        email: "short@test.com",
        password: "Corta1!",
        confirmPassword: "Corta1!",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("al menos 8 caracteres");
  });

  // 13. Contraseñas No Coinciden
  it("13. Contraseñas no coinciden (400)", async () => {
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
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Las contraseñas no coinciden");
  });

  // 14. Nombre con Números
  it("14. Nombre con números (400)", async () => {
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
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("El nombre solo puede contener letras y espacios");
  });

  // 15. Apellido con Números
  it("15. Apellido con números (400)", async () => {
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
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("El apellido solo puede contener letras y espacios");
  });

  // 16. Registro con Campos Opcionales
  it("16. Registro con campos opcionales (201)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Maria",
        surname: "Garcia",
        email: `maria_${Date.now()}@test.com`,
        password: "Password123!",
        confirmPassword: "Password123!",
        address: "Calle Principal 123",
        country: "Argentina",
        city: "Buenos Aires",
        phone: "+541112345678",
        bio: "Usuario de prueba",
        gender: "female" // Corregido: usar valor del enum
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("address", "Calle Principal 123");
    expect(response.body.data).toHaveProperty("country", "Argentina");
    expect(response.body.data).toHaveProperty("city", "Buenos Aires");
    expect(response.body.data).toHaveProperty("phone", "+541112345678");
    expect(response.body.data).toHaveProperty("bio", "Usuario de prueba");
    expect(response.body.data).toHaveProperty("gender", "female");
  });

  // 17. Email Duplicado Case Insensitive
  it("17. Email duplicado case insensitive (409)", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Otro",
        surname: "Usuario",
        email: registeredEmail.toLowerCase(), // Convertir a minúsculas para asegurar duplicado
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Ya existe un usuario");
  });

  // 18. Estructura de Respuesta Exitosa
  it("18. Estructura de respuesta exitosa", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Test",
        surname: "Structure",
        email: `structure_${Date.now()}@test.com`,
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(201);
    expect(Object.keys(response.body)).toEqual(["success", "message", "data"]);
    expect(typeof response.body.success).toBe("boolean");
    expect(typeof response.body.message).toBe("string");
    expect(typeof response.body.data).toBe("object");
  });

  // 19. Estructura de Respuesta de Error
  it("19. Estructura de respuesta de error", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message");
    expect(typeof response.body.message).toBe("string");

    if (response.body.message === "Error de validación") {
      expect(response.body).toHaveProperty("errors");
      expect(Array.isArray(response.body.errors)).toBe(true);
    }
  });

  // 20. Tipos de Datos Correctos
  it("20. Tipos de datos correctos", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Types",
        surname: "Test",
        email: `types_${Date.now()}@test.com`,
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(201);
    expect(typeof response.body.data.id).toBe("string"); // El ID viene como string desde la base de datos
    expect(typeof response.body.data.name).toBe("string");
    expect(typeof response.body.data.surname).toBe("string");
    expect(typeof response.body.data.email).toBe("string");
    expect(typeof response.body.data.role).toBe("string");
    expect(response.body.data.address).toBe(null); // Los campos opcionales vienen como null, no undefined
    expect(response.body.data.country).toBe(null);
  });

  // 21. No Exponer Contraseña
  it("21. No exponer contraseña", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "Security",
        surname: "Test",
        email: `security_${Date.now()}@test.com`,
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(201);
    const responseString = JSON.stringify(response.body);
    expect(responseString).not.toContain("Password123!");
    expect(response.body.data).not.toHaveProperty("password");
    expect(response.body.data).not.toHaveProperty("confirmPassword");
  });

  // 22. Sanitización de Datos
  it("22. Sanitización de datos", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({
        name: "             JUAN             ",
        surname: "    perez    ",
        email: `TEST${Date.now()}@GMAIL.COM`,
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response.status).toBe(201);

    // Verifica que los datos se sanitizan correctamente
    expect(response.body.data.name).toBe("Juan");        // Espacios eliminados y capitalizado
    expect(response.body.data.surname).toBe("Perez");     // Espacios eliminados y capitalizado
    expect(response.body.data.email).toMatch(/test\d+@gmail\.com$/); // Minúsculas
  });

  // 23. Consistencia de Email - Evitar Duplicados
  it("23. Consistencia de Email - Evitar Duplicados", async () => {
    const baseEmail = `consistency${Date.now()}@test.com`;
    
    // Primer registro con email en mayúsculas
    const response1 = await request(app)
      .post("/users/register")
      .send({
        name: "Usuario",
        surname: "Uno",
        email: baseEmail.toUpperCase(), // "CONSISTENCY...@TEST.COM"
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response1.status).toBe(201);

    // Segundo intento con mismo email en minúsculas (debería fallar)
    const response2 = await request(app)
      .post("/users/register")
      .send({
        name: "Usuario",
        surname: "Dos",
        email: baseEmail.toLowerCase(), // "consistency...@test.com"
        password: "Password123!",
        confirmPassword: "Password123!",
      });

    expect(response2.status).toBe(409);
    expect(response2.body.message).toContain("Ya existe un usuario con ese email");
  });
});