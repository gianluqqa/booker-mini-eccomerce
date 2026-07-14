import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart } from "../../helpers/cartActions";
import { validateCartItemContract } from "../../helpers/cartValidationHelpers";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Cart Module - Add to Cart", () => {
  let testUser: any;

  let authToken: string;

  let testBook: any;

  beforeAll(async () => {
    await initializeTestDb();
  });

  afterAll(async () => {
    await closeTestDb();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  beforeEach(async () => {
    testUser = await createTestUser({
      email: `cart_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Cart",
      surname: "User",
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Cart",
      author: "Test Author",
      price: 29.99,
      stock: 10,
    });
  });

  describe("POST /carts/add", () => {
    it("should add book to cart successfully", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 2,
      });

      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      validateCartItemContract(addToCartResponse.body.data);
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
      expect(addToCartResponse.body.data.quantity).toBe(2);
    });

    it("should add book without quantity (uses default = 1)", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
      });

      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      validateCartItemContract(addToCartResponse.body.data);
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
      expect(addToCartResponse.body.data.quantity).toBe(1);
    });

    it("should accumulate quantity if book already exists in cart", async () => {
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });

      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 2,
      });

      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      validateCartItemContract(addToCartResponse.body.data);
      expect(addToCartResponse.body.data.quantity).toBe(3);
    });

    it("should reject adding without authentication (401)", async () => {
      const addToCartResponse = await addToCart(app, null, {
        bookId: testBook.id,
        quantity: 1,
      });

      validateErrorResponse(
        addToCartResponse,
        401,
        "No autorizado: se requiere un token de autenticación",
      );
    });

    it("should reject adding book with invalid token", async () => {
      const addToCartResponse = await addToCart(app, "invalid-token", {
        bookId: testBook.id,
        quantity: 1,
      });

      validateErrorResponse(
        addToCartResponse,
        401,
        "No autorizado: token inválido o expirado",
      );
    });

    it("should reject if bookId is missing", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        quantity: 1,
      });

      validateErrorResponse(addToCartResponse, 400, "Error de validación");
      expect(addToCartResponse.body.errors).toContain("bookId es requerido");
    });

    it("should reject if bookId is not a valid UUID", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: "invalid-uuid",
        quantity: 1,
      });

      validateErrorResponse(addToCartResponse, 400, "Error de validación");
      expect(addToCartResponse.body.errors).toContain(
        "bookId debe ser un UUID válido",
      );
    });

    it("should reject if book does not exist in database", async () => {
      const nonExistentId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: nonExistentId,
        quantity: 1,
      });

      validateErrorResponse(addToCartResponse, 404, "Libro no encontrado");
    });

    it("should reject if book quantity is less than 1", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 0,
      });

      validateErrorResponse(addToCartResponse, 400, "Error de validación");
      expect(addToCartResponse.body.errors).toContain(
        "La cantidad debe ser un número entero positivo",
      );
    });

    it("should reject if quantity is not an integer", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1.5,
      });

      validateErrorResponse(addToCartResponse, 400, "Error de validación");
      expect(addToCartResponse.body.errors).toContain(
        "La cantidad debe ser un número entero positivo",
      );
    });

    it("should reject if quantity exceeds available stock", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 65,
      });

      validateErrorResponse(
        addToCartResponse,
        409,
        "Stock insuficiente para el libro solicitado",
      );
    });

    it("should reject if user has pending order", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 100.0,
      });
      await orderRepository.save(pendingOrder);

      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });

      validateErrorResponse(
        addToCartResponse,
        409,
        "Ya tienes una orden pendiente en proceso",
      );
      expect(addToCartResponse.body.data).toHaveProperty("id", pendingOrder.id);
    });

    it("should allow adding book with exact available stock", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 10,
      });

      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
      expect(addToCartResponse.body.data.quantity).toBe(10);
    });

    it("should return complete book structure in data", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });

      expect(addToCartResponse.body.data.book).toHaveProperty(
        "id",
        testBook.id,
      );
      expect(addToCartResponse.body.data.book).toHaveProperty(
        "title",
        testBook.title,
      );
      expect(addToCartResponse.body.data.book).toHaveProperty(
        "price",
        testBook.price,
      );
    });

    it("should generate unique ID for cart item", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });

      expect(addToCartResponse.body.data.id).toBeDefined();
      expect(addToCartResponse.body.data.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });
});
