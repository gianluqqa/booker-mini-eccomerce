import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/createTestUser";
import { createTestBook } from "../../helpers/createTestBook";

describe("Cart - Carrito de Compras", () => {
  let testUser: any;
  let authToken: string;
  let testBook: any;

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

  beforeEach(async () => {
    // Escenario inicial: Usuario y Libro listos
    testUser = await createTestUser({
      email: `cart_user_${Date.now()}@test.com`,
      name: "Cart",
      surname: "User"
    });

    const loginResponse = await request(app)
      .post("/users/login")
      .send({
        email: testUser.email,
        password: "Password123!"
      });

    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Cart",
      author: "Test Author",
      price: 29.99,
      stock: 10
    });
  });

  // 📦 A. ENDPOINT: POST /carts/add
  describe("POST /carts/add - Agregar al Carrito", () => {
    it("1. debe agregar libro al carrito exitosamente", async () => {
      const addToCartResponse = await request(app)
        .post("/carts/add")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          bookId: testBook.id,
          quantity: 2
        });

      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      expect(addToCartResponse.body.message).toBe("Libro agregado al carrito exitosamente");
      expect(addToCartResponse.body.data).toHaveProperty("id");
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
      expect(addToCartResponse.body.data.quantity).toBe(2);
    });

    it("2. debe agregar libro sin cantidad (usa defecto = 1)", async () => {
      const addToCartResponse = await request(app)
        .post("/carts/add")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          bookId: testBook.id
        });

      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
      expect(addToCartResponse.body.data.quantity).toBe(1);
    });

    it("3. debe acumular cantidad si libro ya existe en carrito", async () => {
      // 1ra adición
      await request(app)
        .post("/carts/add")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ bookId: testBook.id, quantity: 1 });

      // 2da adición
      const addToCartResponse = await request(app)
        .post("/carts/add")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ bookId: testBook.id, quantity: 2 });

      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      expect(addToCartResponse.body.data.quantity).toBe(3); // Suma total
    });

    it("4. debe rechazar agregar sin autenticación (401)", async () => {
      const addToCartResponse = await request(app)
        .post("/carts/add")
        .send({ bookId: testBook.id, quantity: 1 });

      expect(addToCartResponse.status).toBe(401);
      expect(addToCartResponse.body.success).toBe(false);
      expect(addToCartResponse.body.message).toBe("No autorizado: se requiere un token de autenticación");
    });
  });

  // 📋 B. ENDPOINT: GET /carts/
  describe("GET /carts/ - Obtener Carrito", () => {
    // Casos 16 al 23 pendientes de implementación
  });

  // ✏️ C. ENDPOINT: PUT /carts/:cartId
  describe("PUT /carts/:cartId - Actualizar Cantidad", () => {
    // Casos 24 al 33 pendientes de implementación
  });

  // 🗑️ D. ENDPOINT: DELETE /carts/:cartId
  describe("DELETE /carts/:cartId - Eliminar Item", () => {
    // Casos 34 al 38 pendientes de implementación
  });

  // 🧹 E. ENDPOINT: DELETE /carts/
  describe("DELETE /carts/ - Vaciar Carrito", () => {
    // Casos 39 al 43 pendientes de implementación
  });

  // 🔄 F. INTEGRACIÓN Y LÓGICA COMPLEJA
  describe("Casos de Integración y Lógica Compleja", () => {
    // Casos 44 al 50 pendientes de implementación
  });
});
