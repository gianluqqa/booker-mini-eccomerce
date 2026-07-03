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
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("POST /carts/add - Agregar al Carrito", () => {
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
      surname: "User"
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Cart",
      author: "Test Author",
      price: 29.99,
      stock: 10
    });
  });

  it("1. debe agregar libro al carrito exitosamente", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id,
      quantity: 2
    });

    expect(addToCartResponse.status).toBe(200);
    expect(addToCartResponse.body.success).toBe(true);
    validateCartItemContract(addToCartResponse.body.data);
    expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
    expect(addToCartResponse.body.data.quantity).toBe(2);
  });

  it("2. debe agregar libro sin cantidad (usa defecto = 1)", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id
    });

    expect(addToCartResponse.status).toBe(200);
    expect(addToCartResponse.body.success).toBe(true);
    validateCartItemContract(addToCartResponse.body.data);
    expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
    expect(addToCartResponse.body.data.quantity).toBe(1);
  });

  it("3. debe acumular cantidad si libro ya existe en carrito", async () => {
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });

    const addToCartResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });

    expect(addToCartResponse.status).toBe(200);
    expect(addToCartResponse.body.success).toBe(true);
    validateCartItemContract(addToCartResponse.body.data);
    expect(addToCartResponse.body.data.quantity).toBe(3);
  });

  it("4. debe rechazar agregar sin autenticación (401)", async () => {
    const addToCartResponse = await addToCart(app, null, {
      bookId: testBook.id,
      quantity: 1
    });

    validateErrorResponse(addToCartResponse, 401, "No autorizado: se requiere un token de autenticación");
  });

  it("5. debe rechazar agregar libro con token invalido", async () => {
    const addToCartResponse = await addToCart(app, "invalid-token", {
      bookId: testBook.id,
      quantity: 1
    });

    validateErrorResponse(addToCartResponse, 401, "No autorizado: token inválido o expirado");
  });

  it("6. debe rechazar si falta el bookId", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      quantity: 1
    });

    validateErrorResponse(addToCartResponse, 400, "Error de validación");
    expect(addToCartResponse.body.errors).toContain("bookId es requerido");
  });

  it("7. debe rechazar si el bookId no es un UUID válido", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: "invalid-uuid",
      quantity: 1
    });

    validateErrorResponse(addToCartResponse, 400, "Error de validación");
    expect(addToCartResponse.body.errors).toContain("bookId debe ser un UUID válido");
  });

  it("8. debe rechazar si el libro no existe en la base de datos", async () => {
    const nonExistentId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: nonExistentId,
      quantity: 1
    });

    validateErrorResponse(addToCartResponse, 404, "Libro no encontrado");
  });

  it("9. debe rechazar si la cantidad de un libro es menor a 1", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id,
      quantity: 0
    });

    validateErrorResponse(addToCartResponse, 400, "Error de validación");
    expect(addToCartResponse.body.errors).toContain("La cantidad debe ser un número entero positivo");
  });

  it("10. debe rechazar si la cantidad no es un número entero", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id,
      quantity: 1.5
    });

    validateErrorResponse(addToCartResponse, 400, "Error de validación");
    expect(addToCartResponse.body.errors).toContain("La cantidad debe ser un número entero positivo");
  });

  it("11. debe rechazar si la cantidad supera el stock disponible", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id,
      quantity: 65
    });

    validateErrorResponse(addToCartResponse, 409, "Stock insuficiente para el libro solicitado");
  });

  it("12. debe rechazar si el usuario tiene una orden pendiente", async () => {
    const orderRepository = AppDataSource.getRepository(Order);
    const pendingOrder = orderRepository.create({
      user: { id: testUser.id },
      status: OrderStatus.PENDING,
      total: 100.0,
    });
    await orderRepository.save(pendingOrder);

    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id,
      quantity: 1
    });

    validateErrorResponse(addToCartResponse, 409, "Ya tienes una orden pendiente en proceso");
    expect(addToCartResponse.body.data).toHaveProperty("id", pendingOrder.id);
  });

  it("13. debe permitir agregar un libro que tiene stock exacto disponible", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id,
      quantity: 10
    });

    expect(addToCartResponse.status).toBe(200);
    expect(addToCartResponse.body.success).toBe(true);
    expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
    expect(addToCartResponse.body.data.quantity).toBe(10);
  });

  it("14. debe devolver la estructura del libro completa dentro del data", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id,
      quantity: 1
    });

    expect(addToCartResponse.body.data.book).toHaveProperty("id", testBook.id);
    expect(addToCartResponse.body.data.book).toHaveProperty("title", testBook.title);
    expect(addToCartResponse.body.data.book).toHaveProperty("price", testBook.price);
  });

  it("15. debe generar un ID único para el item del carrito", async () => {
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id,
      quantity: 1
    });

    expect(addToCartResponse.body.data.id).toBeDefined();
    expect(addToCartResponse.body.data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
