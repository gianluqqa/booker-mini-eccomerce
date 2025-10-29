import request from "supertest";
import { app } from "../../../../../src/server";

/**
 * ========================================
 * PRUEBAS DE REGISTRO DE USUARIOS: ADMIN.
 * ========================================
 */

describe("Admin user registration tests", () => {
  //! AUTO-006: Allow creating a user with admin role (TC-013)
  it("AUTO-006: should allow creating a user with admin role", async () => {
    // Paso 1: Preparar datos de prueba con email unico y rol de admin
    const userData = {
      email: `admin-${Date.now()}@example.com`, // Email unico
      password: "AdminPassword123",
      confirmPassword: "AdminPassword123",
      name: "Admin",
      surname: "User",
      role: "admin", // Especificar el rol de admin
    };

    // Paso 2: Enviar peticion a la API
    const response = await request(app).post("/users/register").send(userData);

    // Paso 3: Verificar que funciono y que el rol es 'admin'
    expect(response.status).toBe(201);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.name).toBe("Admin");
    expect(response.body.role).toBe("admin");
  });
});
