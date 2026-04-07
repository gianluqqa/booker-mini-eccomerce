import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/createTestUser";

describe("Authentication - Registro", () => {

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

  describe("Casos Exitosos (201)", () => {
    let registeredUserEmail: string;

    it("1. debe registrar usuario con datos básicos exitosamente", async () => {
      registeredUserEmail = `success_${Date.now()}@test.com`;
      
      const registrationResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          surname: "Perez",
          email: registeredUserEmail,
          password: "Password123!",
          confirmPassword: "Password123!"
        });

      // Verificar el contrato API completo
      expect(registrationResponse.status).toBe(201);
      expect(registrationResponse.body.success).toBe(true);
      expect(registrationResponse.body.message).toBe("Usuario creado exitosamente");
      expect(registrationResponse.body).toHaveProperty("data");
      
      // Verificar datos del usuario
      const newUser = registrationResponse.body.data; //Resumimos creando una variable que engloba todo el body de la response.
      expect(newUser.email).toBe(registeredUserEmail);
      expect(newUser.name).toBe("Juan");
      expect(newUser.surname).toBe("Perez");
      expect(newUser.role).toBe("customer");
      expect(newUser).toHaveProperty("id");
      expect(newUser).not.toHaveProperty("password");
      expect(newUser).not.toHaveProperty("confirmPassword");
    });

    it("2. debe registrar usuario con campos opcionales correctamente", async () => {
      const optionalFieldsResponse = await request(app)
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
          gender: "female"
        });

      // Verificar el contrato API completo
      expect(optionalFieldsResponse.status).toBe(201);
      expect(optionalFieldsResponse.body.success).toBe(true);
      expect(optionalFieldsResponse.body.message).toBe("Usuario creado exitosamente");
      expect(optionalFieldsResponse.body).toHaveProperty("data");
      
      // Verificar campos opcionales
      const userWithOptionalFields = optionalFieldsResponse.body.data;
      expect(userWithOptionalFields.address).toBe("Calle Principal 123");
      expect(userWithOptionalFields.country).toBe("Argentina");
      expect(userWithOptionalFields.city).toBe("Buenos Aires");
      expect(userWithOptionalFields.phone).toBe("+541112345678");
      expect(userWithOptionalFields.bio).toBe("Usuario de prueba");
      expect(userWithOptionalFields.gender).toBe("female");
      expect(userWithOptionalFields).toHaveProperty("id");
      expect(userWithOptionalFields).not.toHaveProperty("password");
    });

    it("3. debe rechazar registro con email duplicado", async () => {
      const duplicateResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Otro",
          surname: "Usuario",
          email: registeredUserEmail, // Usar el email del test #1
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(duplicateResponse.status).toBe(409);
      expect(duplicateResponse.body.success).toBe(false);
      expect(duplicateResponse.body.message).toBe("Ya existe un usuario con ese email");
    });

    it("4. debe rechazar email duplicado sin importar mayúsculas/minúsculas", async () => {
      const baseEmail = `consistency${Date.now()}@test.com`;
      
      // Primer registro con email en mayúsculas
      const firstRegistration = await createTestUser({
        email: baseEmail.toUpperCase(),
        name: "Usuario",
        surname: "Uno"
      });

      expect(firstRegistration.email).toBe(baseEmail.toLowerCase());

      // Segundo intento con mismo email en minúsculas (debería fallar)
      const secondAttempt = await request(app)
        .post("/users/register")
        .send({
          name: "Usuario",
          surname: "Dos",
          email: baseEmail.toLowerCase(),
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(secondAttempt.status).toBe(409);
      expect(secondAttempt.body.message).toContain("Ya existe un usuario con ese email");
    });
  });

  describe("Errores de Validación (400)", () => {
    it("5. debe rechazar registro con cuerpo vacío", async () => {
      const emptyResponse = await request(app)
        .post("/users/register")
        .send({});

      expect(emptyResponse.status).toBe(400);
      expect(emptyResponse.body.success).toBe(false);
      expect(emptyResponse.body.message).toBe("Error de validación");
      expect(emptyResponse.body).toHaveProperty("errors");
      expect(emptyResponse.body.errors).toContain(
        "Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios"
      );
    });

    it("6. debe rechazar registro sin email", async () => {
      const noEmailResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          surname: "Perez",
          password: "Password123!",
          confirmPassword: "Password123!"
        });

      expect(noEmailResponse.status).toBe(400);
      expect(noEmailResponse.body.success).toBe(false);
      expect(noEmailResponse.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
    });

    it("7. debe rechazar registro sin contraseña", async () => {
      const noPasswordResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          surname: "Perez",
          email: "test@test.com",
          confirmPassword: "Password123!"
        });

      expect(noPasswordResponse.status).toBe(400);
      expect(noPasswordResponse.body.success).toBe(false);
      expect(noPasswordResponse.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
    });

    it("8. debe rechazar registro sin confirmación de contraseña", async () => {
      const noConfirmResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          surname: "Perez",
          email: "test@test.com",
          password: "Password123!"
        });

      expect(noConfirmResponse.status).toBe(400);
      expect(noConfirmResponse.body.success).toBe(false);
      expect(noConfirmResponse.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
    });

    it("9. debe rechazar registro sin nombre", async () => {
      const noNameResponse = await request(app)
        .post("/users/register")
        .send({
          surname: "Perez",
          email: "test@test.com",
          password: "Password123!",
          confirmPassword: "Password123!"
        });

      expect(noNameResponse.status).toBe(400);
      expect(noNameResponse.body.success).toBe(false);
      expect(noNameResponse.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
    });

    it("10. debe rechazar registro sin apellido", async () => {
      const noSurnameResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          email: "test@test.com",
          password: "Password123!",
          confirmPassword: "Password123!"
        });

      expect(noSurnameResponse.status).toBe(400);
      expect(noSurnameResponse.body.success).toBe(false);
      expect(noSurnameResponse.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
    });

    it("11. debe rechazar registro con formato de email inválido", async () => {
      const invalidEmails = [
        "correo-sin-arroba",
        "email@sin-punto",
        "email con espacios@test.com",
        "@sin-usuario.com",
        "usuario@.com"
      ];

      for (const invalidEmail of invalidEmails) {
        const invalidEmailResponse = await request(app)
          .post("/users/register")
          .send({
            name: "Juan",
            surname: "Perez",
            email: invalidEmail,
            password: "Password123!",
            confirmPassword: "Password123!",
          });

        expect(invalidEmailResponse.status).toBe(400);
        expect(invalidEmailResponse.body.success).toBe(false);
        expect(invalidEmailResponse.body.message).toBe("El formato del email es inválido");
      }
    });

    it("12. debe rechazar registro con email vacío", async () => {
      const emptyEmailResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          surname: "Perez",
          email: "   ",
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(emptyEmailResponse.status).toBe(400);
      expect(emptyEmailResponse.body.success).toBe(false);
      expect(emptyEmailResponse.body.message).toBe("Los campos email, contraseña, confirmación de contraseña, nombre y apellido son obligatorios");
    });

    it("13. debe rechazar registro con contraseña sin complejidad", async () => {
      const simplePasswordResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          surname: "Perez",
          email: "pass@test.com",
          password: "solo_minusculas",
          confirmPassword: "solo_minusculas",
        });

      expect(simplePasswordResponse.status).toBe(400);
      expect(simplePasswordResponse.body.success).toBe(false);
      expect(simplePasswordResponse.body.message).toBe("La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número");
    });

    it("14. debe rechazar registro con contraseña demasiado corta", async () => {
      const shortPasswordResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          surname: "Perez",
          email: "short@test.com",
          password: "Corta1!",
          confirmPassword: "Corta1!",
        });

      expect(shortPasswordResponse.status).toBe(400);
      expect(shortPasswordResponse.body.success).toBe(false);
      expect(shortPasswordResponse.body.message).toContain("al menos 8 caracteres");
    });

    it("15. debe rechazar registro con contraseñas que no coinciden", async () => {
      const mismatchPasswordResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          surname: "Perez",
          email: "mismatch@test.com",
          password: "Password123!",
          confirmPassword: "Different123!",
        });

      expect(mismatchPasswordResponse.status).toBe(400);
      expect(mismatchPasswordResponse.body.success).toBe(false);
      expect(mismatchPasswordResponse.body.message).toBe("Las contraseñas no coinciden");
    });

    it("16. debe rechazar registro con nombre que contiene números", async () => {
      const numericNameResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan123",
          surname: "Perez",
          email: "name@test.com",
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(numericNameResponse.status).toBe(400);
      expect(numericNameResponse.body.success).toBe(false);
      expect(numericNameResponse.body.message).toBe("El nombre solo puede contener letras y espacios");
    });

    it("17. debe rechazar registro con apellido que contiene números", async () => {
      const numericSurnameResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Juan",
          surname: "Perez99",
          email: "surname@test.com",
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(numericSurnameResponse.status).toBe(400);
      expect(numericSurnameResponse.body.success).toBe(false);
      expect(numericSurnameResponse.body.message).toBe("El apellido solo puede contener letras y espacios");
    });
  });

  describe("Estructura y Tipos de Datos", () => {
    it("18. debe verificar estructura de respuesta exitosa", async () => {
      const successStructureResponse = await request(app)
        .post("/users/register")
        .send({
          name: "Test",
          surname: "Structure",
          email: `structure_${Date.now()}@test.com`,
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(successStructureResponse.status).toBe(201);
      expect(Object.keys(successStructureResponse.body)).toEqual(["success", "message", "data"]);
      expect(typeof successStructureResponse.body.success).toBe("boolean");
      expect(typeof successStructureResponse.body.message).toBe("string");
      expect(typeof successStructureResponse.body.data).toBe("object");
    });

    it("19. debe verificar estructura de respuesta de error", async () => {
      const errorStructureResponse = await request(app)
        .post("/users/register")
        .send({});

      expect(errorStructureResponse.status).toBe(400);
      expect(errorStructureResponse.body).toHaveProperty("success", false);
      expect(errorStructureResponse.body).toHaveProperty("message");
      expect(typeof errorStructureResponse.body.message).toBe("string");

      if (errorStructureResponse.body.message === "Error de validación") {
        expect(errorStructureResponse.body).toHaveProperty("errors");
        expect(Array.isArray(errorStructureResponse.body.errors)).toBe(true);
      }
    });

    it("20. debe verificar tipos de datos correctos en respuesta", async () => {
      const userWithCorrectTypes = await createTestUser({
        name: "Types",
        surname: "Test",
        email: `types_${Date.now()}@test.com`
      });

      expect(typeof userWithCorrectTypes.id).toBe("string");
      expect(typeof userWithCorrectTypes.name).toBe("string");
      expect(typeof userWithCorrectTypes.surname).toBe("string");
      expect(typeof userWithCorrectTypes.email).toBe("string");
      expect(typeof userWithCorrectTypes.role).toBe("string");
      expect(userWithCorrectTypes.address).toBe(null);
      expect(userWithCorrectTypes.country).toBe(null);
    });

    it("21. debe garantizar que las contraseñas no se expongan", async () => {
      const userWithSecurityTest = await createTestUser({
        name: "Security",
        surname: "Test",
        email: `security_${Date.now()}@test.com`
      });

      // Verificar que el helper no expone contraseñas
      expect(userWithSecurityTest).not.toHaveProperty("password");
      expect(userWithSecurityTest).not.toHaveProperty("confirmPassword");
      
      // Verificación adicional con request directo para confirmar seguridad en respuesta HTTP
      const securityResponse = await request(app)
        .post("/users/register")
        .send({
          name: "SecurityCheck",
          surname: "Test",
          email: `security_check_${Date.now()}@test.com`,
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(securityResponse.status).toBe(201);
      const responseString = JSON.stringify(securityResponse.body);
      expect(responseString).not.toContain("Password123!");
      expect(securityResponse.body.data).not.toHaveProperty("password");
      expect(securityResponse.body.data).not.toHaveProperty("confirmPassword");
    });
  });

  describe("Sanitización y Consistencia", () => {
    it("22. debe sanitizar datos correctamente", async () => {
      const sanitizationResponse = await request(app)
        .post("/users/register")
        .send({
          name: "             JUAN             ",
          surname: "    perez    ",
          email: `TEST${Date.now()}@GMAIL.COM`,
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(sanitizationResponse.status).toBe(201);

      // Verifica que los datos se sanitizan correctamente
      expect(sanitizationResponse.body.data.name).toBe("Juan");
      expect(sanitizationResponse.body.data.surname).toBe("Perez");
      expect(sanitizationResponse.body.data.email).toMatch(/test\d+@gmail\.com$/);
    });

    it("23. debe mantener consistencia de email y evitar duplicados", async () => {
      const baseEmail = `consistency${Date.now()}@test.com`;
      
      // Primer registro con email en mayúsculas
      const firstRegistration = await request(app)
        .post("/users/register")
        .send({
          name: "Usuario",
          surname: "Uno",
          email: baseEmail.toUpperCase(),
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(firstRegistration.status).toBe(201);

      // Segundo intento con mismo email en minúsculas (debería fallar)
      const secondAttempt = await request(app)
        .post("/users/register")
        .send({
          name: "Usuario",
          surname: "Dos",
          email: baseEmail.toLowerCase(),
          password: "Password123!",
          confirmPassword: "Password123!",
        });

      expect(secondAttempt.status).toBe(409);
      expect(secondAttempt.body.message).toContain("Ya existe un usuario con ese email");
    });
  });
});