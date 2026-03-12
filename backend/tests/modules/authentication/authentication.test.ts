import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";

describe("Authentication Module - API Tests", () => {
  let testUser: { email: string; password: string };

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

  it("TC-AUTH-001: debería registrar un nuevo usuario con éxito y devolver status 201", async () => {
    const uniqueSuffix = Date.now();

    const userData = {
      name: "Test",
      surname: "User",
      email: `test_${uniqueSuffix}@example.com`,
      password: "Password123!",
      confirmPassword: "Password123!",
      address: "Calle Falsa 123",
      country: "Argentina",
      city: "CABA",
      phone: "1122334455",
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.anything(),
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
      })
    );

    expect(response.body).not.toHaveProperty("password");

    // Guardamos credenciales para login
    testUser = {
      email: userData.email,
      password: userData.password,
    };
  });

  it("TC-AUTH-004: Iniciar sesión con cuenta de Cliente - debería permitir login con credenciales válidas", async () => {
    expect(testUser).toBeDefined();

    const response = await request(app)
      .post("/users/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);

    // El controlador devuelve {...user, accessToken}
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body.email).toBe(testUser.email);
    expect(response.body).not.toHaveProperty("password");
  });
});