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
    // Crear usuario de prueba
    testUser = await createTestUser({
      email: `cart_user_${Date.now()}@test.com`,
      name: "Cart",
      surname: "User"
    });

    // Obtener token de autenticación
    const loginResponse = await request(app)
      .post("/users/login")
      .send({
        email: testUser.email,
        password: "Password123!"
      });

    authToken = loginResponse.body.data.accessToken;

    // Crear libro de prueba
    testBook = await createTestBook({
      title: "Test Book for Cart",
      author: "Test Author",
      price: 29.99,
      stock: 10
    });
  });

  describe("Casos Exitosos (200)", () => {
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
      expect(addToCartResponse.body.data).toHaveProperty("id");
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
      expect(addToCartResponse.body.data.quantity).toBe(1);
    });

    it("3. debe acumular cantidad si libro ya existe en carrito", async () => {
      // 1. Primera petición: Agregar 1 unidad
      await request(app)
        .post("/carts/add")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          bookId: testBook.id,
          quantity: 1
        });

      // 2. Segunda petición: Agregar 2 unidades más del mismo libro
      const addToCartResponse = await request(app)
        .post("/carts/add")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          bookId: testBook.id,
          quantity: 2
        });

      // 3. Verificación: El resultado final debería ser 3 (1 + 2)
      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
      expect(addToCartResponse.body.data.quantity).toBe(3);// El punto clave: comprobamos que la cantidad total es la suma
    });

    describe("Casos de Error (400, 401, 404, 409)", () => {
      it("4. debe rechazar agregar sin autenticación (401)", async () => {
        const addToCartResponse = await request(app)
          .post("/carts/add")
          .send({
            bookId: testBook.id,
            quantity: 2
          });

        expect(addToCartResponse.status).toBe(401);
        expect(addToCartResponse.body.success).toBe(false);
        expect(addToCartResponse.body.message).toBe("No autorizado: se requiere un token de autenticación");
      });
    })
  });
});

