import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { cleanUserPendingOrders } from "../../helpers/orderActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart } from "../../helpers/cartActions";
import { reserveStock } from "../../helpers/checkoutActions";
import { validateStockReservationContract } from "../../helpers/checkoutValidationHelpers";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { ErrorCodes } from "../../../src/enums/ErrorCodes";
import { Book } from "../../../src/entities/Book";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("POST /checkout/reserve - Reserva de Stock", () => {
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
      email: `checkout_user_${Date.now()}@test.com`,
      name: "Checkout",
      surname: "User"
    });

    await cleanUserPendingOrders(testUser.id);

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Checkout",
      author: "Test Author",
      price: 29.99,
      stock: 10
    });
  });

  it("1. debe crear reserva de stock exitosamente", async () => {
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });

    const reserveStockResponse = await reserveStock(app, authToken);

    expect(reserveStockResponse.status).toBe(201);
    expect(reserveStockResponse.body.success).toBe(true);
    expect(reserveStockResponse.body.message).toBe("Reserva de stock creada exitosamente");
    validateStockReservationContract(reserveStockResponse.body.data);
  });

  it("2. debe fallar si usuario no está autenticado", async () => {
    const reserveStockResponse = await reserveStock(app, null);
    validateErrorResponse(reserveStockResponse, 401, "No autorizado: se requiere un token de autenticación");
  });

  it("3. debe fallar si ya existe orden pendiente", async () => {
    const orderRepository = AppDataSource.getRepository(Order);
    const pendingOrder = orderRepository.create({
      user: { id: testUser.id },
      status: OrderStatus.PENDING,
      total: 100.0,
    });
    await orderRepository.save(pendingOrder);

    const reserveStockResponse = await reserveStock(app, authToken);

    validateErrorResponse(
      reserveStockResponse,
      409,
      "Ya tienes una orden pendiente en proceso",
      ErrorCodes.PENDING_ORDER_EXISTS
    );
    expect(reserveStockResponse.body.data).toHaveProperty("id", pendingOrder.id);
  });

  it("4. debe fallar si carrito está vacío", async () => {
    const reserveStockResponse = await reserveStock(app, authToken);
    validateErrorResponse(
      reserveStockResponse,
      400,
      "Tu carrito está vacío. Agrega libros antes de iniciar el checkout.",
      ErrorCodes.CART_EMPTY
    );
  });

  it("5. debe fallar si no hay stock suficiente", async () => {
    // 1. Agregar libro al carrito con cantidad válida
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });

    // 2. Simular que el stock bajó en la BD por otra compra/administración
    const bookRepository = AppDataSource.getRepository(Book);
    await bookRepository.update(testBook.id, { stock: 2 });

    // 3. Intentar reservar stock
    const reserveStockResponse = await reserveStock(app, authToken);

    validateErrorResponse(
      reserveStockResponse,
      409,
      "Stock insuficiente para el libro solicitado"
    );
  });
});
