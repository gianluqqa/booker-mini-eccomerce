import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { cleanUserPendingOrders } from "../../helpers/orderActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart } from "../../helpers/cartActions";
import { reserveStock, processCheckout, payOrder } from "../../helpers/checkoutActions";
import { validateOrderContract } from "../../helpers/checkoutValidationHelpers";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { ErrorCodes } from "../../../src/enums/ErrorCodes";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("POST /checkout - Procesamiento de Checkout", () => {
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

  it("6. debe crear orden pendiente sin pago", async () => {
    // 1. Preparación: Carrito con productos y stock reservado
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });
    await reserveStock(app, authToken);

    // 2. Acción: Procesar checkout sin datos de pago
    const checkoutNoPayResponse = await processCheckout(app, authToken);

    // 3. Validaciones
    expect(checkoutNoPayResponse.status).toBe(201);
    expect(checkoutNoPayResponse.body.success).toBe(true);
    expect(checkoutNoPayResponse.body.message).toBe("Orden pendiente creada exitosamente");

    // Según el servicio, la orden queda en PENDING si no hay paymentData
    expect(checkoutNoPayResponse.body.data.status).toBe(OrderStatus.PENDING);

    validateOrderContract(checkoutNoPayResponse.body.data);
  });

  it("7. debe procesar pago exitosamente", async () => {
    // 1. Setup
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });
    await reserveStock(app, authToken);

    const paymentData = {
      cardNumber: "1234567890123456",
      cardName: "Test User",
      expiryDate: "12/30",
      cvc: "123"
    };

    // 2. Acción: Procesar checkout en dos pasos
    // Paso 1: Crear la orden pendiente
    await processCheckout(app, authToken);

    // Paso 2: Procesar pago sobre la orden existente usando el endpoint /pay
    const checkoutPayResponse = await payOrder(app, authToken, paymentData);

    // 3. Validaciones
    expect(checkoutPayResponse.status).toBe(200);
    expect(checkoutPayResponse.body.success).toBe(true);
    expect(checkoutPayResponse.body.message).toBe("Pago procesado exitosamente");
    expect(checkoutPayResponse.body.data.status).toBe(OrderStatus.PAID);
    validateOrderContract(checkoutPayResponse.body.data);
  });

  it("8. debe fallar con datos de pago inválidos", async () => {
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });
    await reserveStock(app, authToken);

    const paymentData = {
      cardNumber: "123-456-789-235-", // Formato inválido
      cardName: "Valid Name",
      expiryDate: "12/30",
      cvc: "123"
    };

    await processCheckout(app, authToken);

    const checkoutPayResponse = await payOrder(app, authToken, paymentData);

    validateErrorResponse(
      checkoutPayResponse,
      400,
      "Datos de pago inválidos",
      ErrorCodes.PAYMENT_DATA_INVALID
    );
  });

  it("9. debe fallar si no hay reserva activa", async () => {
    // 1. Setup: Agregar al carrito pero NO llamar a reserveStock
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });

    // 2. Acción: Intentar procesar checkout directamente
    const checkoutResponse = await processCheckout(app, authToken);

    // 3. Validación
    validateErrorResponse(
      checkoutResponse,
      400,
      "No tienes una reserva de stock activa. Por favor, inicia el proceso de nuevo.",
      ErrorCodes.NO_ACTIVE_RESERVATION
    );
  });
});
