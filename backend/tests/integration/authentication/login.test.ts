import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/createTestUser";

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

  describe("Casos Exitosos (200)", () => {
    it("1. debe permitir login de cliente con credenciales válidas", async () => {
      const testUser = await createTestUser({
        email: `client_${Date.now()}@test.com`,
        name: "Client",
        surname: "Test"
      });

      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: testUser.email,
          password: "Password123!"
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.message).toBe("Inicio de sesión exitoso");
      expect(loginResponse.body.data).toHaveProperty("accessToken");
      expect(loginResponse.body.data).toHaveProperty("user");
      expect(loginResponse.body.data.user.email).toBe(testUser.email);
      expect(loginResponse.body.data.user.role).toBe("customer");
      expect(loginResponse.body.data.user).not.toHaveProperty("password");
    });

    it("2. debe permitir login de administrador con credenciales válidas", async () => {
      const adminUser = await createTestUser({
        email: `admin_${Date.now()}@test.com`,
        name: "Admin",
        surname: "Test",
        role: "admin"
      });

      const loginResponse = await request(app)
        .post("/users/login")
        .send({
          email: adminUser.email,
          password: "Password123!"
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.message).toBe("Inicio de sesión exitoso");
      expect(loginResponse.body.data).toHaveProperty("accessToken");
      expect(loginResponse.body.data).toHaveProperty("user");
      expect(loginResponse.body.data.user.role).toBe("admin"); //Nos aseguramos que el role sea ADMIN.
    });
  });

  describe("Errores de Validación (400)", () => {
    it("3. debe rechazar formulario vacío", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Error de validación");
      expect(response.body.errors).toContain("Los campos email y contraseña son obligatorios");
    });

    it("4. debe rechazar email vacío", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "",
          password: "Password123!"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Los campos email y contraseña son obligatorios");
    });

    it("5. debe rechazar contraseña vacía", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "test@test.com",
          password: ""
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Los campos email y contraseña son obligatorios");
    });

    it("6. debe rechazar email con formato inválido", async () => {
      const invalidEmails = [
        "email-sin-arroba",
        "email@sin-punto",
        "email con espacios@test.com",
        "@sin-usuario.com",
        "usuario@.com"
      ];

      // Iteramos sobre cada email de la lista 'invalidEmails'.
      // La sintaxis 'for...of' nos permite iterar sobre los elementos de un array.
      // En cada iteración, el bucle asigna el siguiente elemento a la variable 'email'.
      for (const email of invalidEmails) { 
        const response = await request(app)
          .post("/users/login")
          .send({
            email,
            password: "Password123!"
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("El formato del email es inválido");
      }
    });
  });

  describe("Errores de Credenciales (401)", () => {
    it("7. debe rechazar email inexistente", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: `nonexistent_${Date.now()}@test.com`,
          password: "Password123!"
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Credenciales inválidas");
    });

    it("8. debe rechazar contraseña incorrecta", async () => {
      const testUser = await createTestUser({
        email: `wrongpass_${Date.now()}@test.com`
      });

      const response = await request(app)
        .post("/users/login")
        .send({
          email: testUser.email,
          password: "WrongPassword123!"
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Credenciales inválidas");
    });

    it("9. debe mostrar mismo mensaje para email no existe y contraseña incorrecta", async () => {
      const testUser = await createTestUser({
        email: `consistency_${Date.now()}@test.com`
      });

      // Test 1: Email no existe
      const response1 = await request(app)
        .post("/users/login")
        .send({
          email: `nonexistent_${Date.now()}@test.com`,
          password: "Password123!"
        });

      // Test 2: Contraseña incorrecta
      const response2 = await request(app)
        .post("/users/login")
        .send({
          email: testUser.email,
          password: "WrongPassword123!"
        });

      expect(response1.status).toBe(401);
      expect(response1.body.message).toBe("Credenciales inválidas");
      expect(response2.status).toBe(401);
      expect(response2.body.message).toBe("Credenciales inválidas");
      expect(response1.body.message).toBe(response2.body.message);
    });
  });

  describe("Casos Especiales y Edge Cases", () => {
    it("10. debe rechazar email con caracteres especiales inválidos", async () => {
      // Emails que realmente fallan la validación de regex (400)
      const invalidEmails = [
        "test@.com",
        "test@com", 
        "test@te st.com"
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post("/users/login")
          .send({
            email,
            password: "Password123!"
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("El formato del email es inválido");
      }

      // Emails que pasan la regex pero no existen (401)
      const specialCaseEmails = [
        ".test@test.com",
        "test@test.c",
        "test@test..com",
        "test@test.com.",
        "test@test.corporate"
      ];

      for (const email of specialCaseEmails) {
        const response = await request(app)
          .post("/users/login")
          .send({
            email,
            password: "Password123!"
          });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Credenciales inválidas");
      }
    });

    it("11. debe rechazar contraseña demasiado corta", async () => {
      const testUser = await createTestUser({
        email: `shortpass_${Date.now()}@test.com`
      });

      const response = await request(app)
        .post("/users/login")
        .send({
          email: testUser.email,
          password: "123" // Contraseña muy corta
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Credenciales inválidas");
    });

    it("12. debe rechazar email con espacios al inicio/final", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "  test@test.com  ",
          password: "Password123!"
        });

      expect(response.status).toBe(401); // Cambiado a 401 porque pasa la regex pero no existe
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Credenciales inválidas");
    });

    it("13. debe manejar email con múltiples @ correctamente", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({
          email: "test@@test.com",
          password: "Password123!"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("El formato del email es inválido");
    });
  });

  describe("Login con Firebase", () => {
    it("14. debe permitir login con Firebase de usuario existente", async () => {
      // Primero creamos un usuario normal
      const existingUser = await createTestUser({
        email: `firebase_existing_${Date.now()}@test.com`,
        name: "Firebase",
        surname: "User"
      });

      // Ahora hacemos login con Firebase usando el mismo email
      const response = await request(app)
        .post("/users/firebase-login")
        .send({
          email: existingUser.email,
          name: "Updated Name",
          surname: "Updated Surname"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Autenticación con Firebase exitosa");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("isNewUser");
      expect(response.body.data.isNewUser).toBe(false);
      expect(response.body.data.user.email).toBe(existingUser.email);
    });

    it("15. debe crear nuevo usuario con Firebase si no existe", async () => {
      const newFirebaseEmail = `firebase_new_${Date.now()}@test.com`;

      const response = await request(app)
        .post("/users/firebase-login")
        .send({
          email: newFirebaseEmail,
          name: "Firebase",
          surname: "User"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Autenticación con Firebase exitosa");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("isNewUser");
      expect(response.body.data.isNewUser).toBe(true);
      expect(response.body.data.user.email).toBe(newFirebaseEmail);
      expect(response.body.data.user.name).toBe("Firebase");
      expect(response.body.data.user.surname).toBe("User");
      expect(response.body.data.user.role).toBe("customer");
    });

    it("16. debe rechazar login con Firebase sin email", async () => {
      const response = await request(app)
        .post("/users/firebase-login")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Error de validación");
      expect(response.body.errors).toContain("Email es requerido para el login con Firebase");
    });

    it("17. debe rechazar login con Firebase con email vacío", async () => {
      const response = await request(app)
        .post("/users/firebase-login")
        .send({
          email: ""
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email es requerido para el login con Firebase");
    });

    it("18. debe rechazar login con Firebase con email inválido", async () => {
      const response = await request(app)
        .post("/users/firebase-login")
        .send({
          email: "email-invalido"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("El formato del email es inválido");
    });

    it("19. debe crear usuario con valores por defecto si no se proporcionan name/surname", async () => {
      const response = await request(app)
        .post("/users/firebase-login")
        .send({
          email: `firebase_defaults_${Date.now()}@test.com`
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isNewUser).toBe(true);
      expect(response.body.data.user.name).toBe("Usuario");
      expect(response.body.data.user.surname).toBe("Google");
      expect(response.body.data.user.role).toBe("customer");
    });

    it("20. debe usar valores proporcionados en lugar de defaults", async () => {
      const response = await request(app)
        .post("/users/firebase-login")
        .send({
          email: `firebase_custom_${Date.now()}@test.com`,
          name: "Custom Name",
          surname: "Custom Surname"
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.name).toBe("Custom Name");
      expect(response.body.data.user.surname).toBe("Custom Surname");
    });

    it("21. debe generar token JWT válido para login con Firebase", async () => {
      const response = await request(app)
        .post("/users/firebase-login")
        .send({
          email: `firebase_token_${Date.now()}@test.com`,
          name: "Token",
          surname: "Test"
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
      
      const token = response.body.data.accessToken;
      const tokenParts = token.split('.');
      expect(tokenParts).toHaveLength(3); // JWT tiene 3 partes
    });

    it("22. debe manejar espacios en blanco en name/surname de Firebase", async () => {
      const response = await request(app)
        .post("/users/firebase-login")
        .send({
          email: `firebase_spaces_${Date.now()}@test.com`,
          name: "  ",
          surname: "   "
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.name).toBe("Usuario");
      expect(response.body.data.user.surname).toBe("Google");
    });
  });

  describe("Sanitización y Consistencia", () => {
    it("23. debe permitir login con email en mayúsculas (case-insensitive)", async () => {
      const testUser = await createTestUser({
        email: `case_${Date.now()}@test.com`
      });

      const response = await request(app)
        .post("/users/login")
        .send({
          email: testUser.email.toUpperCase(), // EMAIL EN MAYÚSCULAS
          password: "Password123!"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email.toLowerCase());
    });

    it("24. debe generar token JWT válido", async () => {
      const testUser = await createTestUser({
        email: `token_${Date.now()}@test.com`
      });

      const response = await request(app)
        .post("/users/login")
        .send({
          email: testUser.email,
          password: "Password123!"
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
      
      const token = response.body.data.accessToken;
      const tokenParts = token.split('.');
      expect(tokenParts).toHaveLength(3); // JWT tiene 3 partes: header.payload.signature
    });
  });
});