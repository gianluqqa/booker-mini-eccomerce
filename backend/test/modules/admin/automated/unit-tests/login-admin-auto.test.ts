import request from "supertest"; // Para realizar peticiones HTTP
import { app } from "../../../../../src/server"; // Para acceder a la API

/**
 * ========================================
 * PRUEBAS DE LOGUEO DE USUARIOS: ADMIN.
 * ========================================
 */

describe("Admin user login tests", () => {
  //! AUTO-012: Successful admin user login
  it("AUTO-012: should login an admin user successfully", async () => {
    // Paso 1: Crear un usuario con rol 'admin'
    const adminUserData = {
      email: `login-admin-${Date.now()}@example.com`,
      password: "AdminStrongPass123",
      confirmPassword: "AdminStrongPass123",
      name: "Admin",
      surname: "LoginTest",
      role: "admin", // Especificar el rol de admin
    };

    await request(app).post("/users/register").send(adminUserData);

    // Paso 2: Intentar hacer login con las credenciales del admin
    const loginData = {
      email: adminUserData.email,
      password: adminUserData.password,
    };

    const response = await request(app).post("/users/login").send(loginData);

    // Paso 3: Verificar que el login fue exitoso y que el rol es 'admin'
    expect(response.status).toBe(200);
    expect(response.body.role).toBe("admin");
    expect(response.body.email).toBe(adminUserData.email);
  });
});
