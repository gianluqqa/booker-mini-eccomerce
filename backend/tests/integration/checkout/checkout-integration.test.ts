import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { cleanUserPendingOrders } from "../../helpers/orderActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart } from "../../helpers/cartActions";
import { reserveStock, processCheckout, payOrder } from "../../helpers/checkoutActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { ErrorCodes } from "../../../src/enums/ErrorCodes";
import { Book } from "../../../src/entities/Book";
import { StockReservation } from "../../../src/entities/StockReservation";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("Checkout - Integración y Edge Cases", () => {
  let testUser: any;
  let authToken: string;
  let testBook: any;
  let anotherBook: any;

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

    anotherBook = await createTestBook({
      title: "Another Test Book",
      author: "Another Author",
      price: 19.99,
      stock: 5
    });
  });

  it("15. debe manejar reserva expirada", async () => {
    // 1. Setup: Crear reserva
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
    await reserveStock(app, authToken);

    // 2. Simular expiración en BD
    const reservationRepo = AppDataSource.getRepository(StockReservation);
    const reservation = await reservationRepo.findOne({ where: { userId: testUser.id } });
    if (reservation) {
      reservation.expiresAt = new Date(Date.now() - 10000); // 10 segundos en el pasado
      await reservationRepo.save(reservation);
    }

    // 3. Acción: Intentar procesar checkout
    const checkoutResponse = await processCheckout(app, authToken);

    // 4. Validación
    validateErrorResponse(
      checkoutResponse,
      410,
      "Tu reserva de stock ha expirado. Por favor, inicia el proceso de nuevo.",
      ErrorCodes.RESERVATION_EXPIRED
    );
  });

  it("16. debe manejar concurrencia de reservas (stock insuficiente final)", async () => {
    // 1. Setup: Usuario A reserva stock
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 8 }); // Quedan 2 en stock (total 10)
    await reserveStock(app, authToken);
    await processCheckout(app, authToken); // Orden PENDING creada

    // 2. Simular que otro proceso/admin agota el stock antes del pago
    const bookRepo = AppDataSource.getRepository(Book);
    await bookRepo.update(testBook.id, { stock: 0 });

    // 3. Acción: Usuario A intenta pagar
    const paymentData = {
      cardNumber: "1234567890123456",
      cardName: "Test User",
      expiryDate: "12/30",
      cvc: "123"
    };
    const payResponse = await payOrder(app, authToken, paymentData);

    // 4. Validación: El sistema debe detectar que ya no hay stock real
    validateErrorResponse(
      payResponse,
      409,
      "No hay stock suficiente para completar el pago de esta orden.",
      ErrorCodes.INSUFFICIENT_STOCK_FINAL
    );
  });

  it("17. debe calcular total correctamente con múltiples items", async () => {
    // 1. Setup: Agregar dos tipos de libros
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 }); // 29.99 * 2 = 59.98
    await addToCart(app, authToken, { bookId: anotherBook.id, quantity: 1 }); // 19.99 * 1 = 19.99
    // Total esperado: 79.97

    // 2. Acción: Reservar stock
    const reserveResponse = await reserveStock(app, authToken);

    // 3. Validación
    expect(reserveResponse.status).toBe(201);
    expect(Number(reserveResponse.body.data.totalAmount)).toBeCloseTo(79.97, 2);
  });

  it("18. debe actualizar stock después de pago exitoso", async () => {
    // 1. Setup: Proceso completo hasta pago
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 3 });
    await reserveStock(app, authToken);
    await processCheckout(app, authToken);

    const paymentData = {
      cardNumber: "1234567890123456",
      cardName: "Test User",
      expiryDate: "12/30",
      cvc: "123"
    };

    // 2. Acción: Pagar
    const payResponse = await payOrder(app, authToken, paymentData);
    expect(payResponse.status).toBe(200);

    // 3. Validación: Stock debe haber bajado de 10 a 7
    const bookRepo = AppDataSource.getRepository(Book);
    const updatedBook = await bookRepo.findOne({ where: { id: testBook.id } });
    expect(updatedBook?.stock).toBe(7);
  });

  it("19. debe mantener la reserva original aunque el carrito cambie (Idempotencia)", async () => {
    // 1. Setup: Agregar un libro y reservar
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
    const firstReserve = await reserveStock(app, authToken);
    expect(firstReserve.body.data.items).toHaveLength(1);

    // 2. Acción: Agregar otro libro diferente al carrito
    await addToCart(app, authToken, { bookId: anotherBook.id, quantity: 1 });

    // 3. Re-intentar reservar sin cancelar la anterior
    const secondReserve = await reserveStock(app, authToken);

    // 4. Validación: El sistema devuelve la misma reserva (idéntica a la primera)
    // ignorando los cambios recientes en el carrito hasta que se cancele la actual.
    expect(secondReserve.status).toBe(201);
    expect(secondReserve.body.data.id).toBe(firstReserve.body.data.id);
    expect(secondReserve.body.data.items).toHaveLength(1);
    expect(secondReserve.body.data.items[0].bookId).toBe(testBook.id);
  });
});
