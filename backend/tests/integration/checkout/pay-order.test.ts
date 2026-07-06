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
import { ErrorCodes } from "../../../src/enums/ErrorCodes";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("POST /checkout/pay - Procesamiento de Pago", () => {
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

  it("10. debe procesar pago de orden pendiente existente", async () => {
    // 1. Setup: Agregar al carrito + Reservar + Crear Orden PENDING
    await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
    await reserveStock(app, authToken);
    await processCheckout(app, authToken);

    const paymentData = {
      cardNumber: "1234567812345678",
      cardName: "Test User",
      expiryDate: "12/30",
      cvc: "123"
    };

    // 2. Acción: Pagar la orden usando /pay
    const payResponse = await payOrder(app, authToken, paymentData);

    // 3. Validación
    expect(payResponse.status).toBe(200);
    expect(payResponse.body.success).toBe(true);
    expect(payResponse.body.message).toBe("Pago procesado exitosamente");
    expect(payResponse.body.data.status).toBe("paid");
    validateOrderContract(payResponse.body.data);
  });

  it("11. debe fallar si no hay orden pendiente", async () => {
    // 1. Setup: Sin crear orden previa (y opcionalmente sin reserva)
    const paymentData = {
      cardNumber: "1234567812345678",
      cardName: "Test User",
      expiryDate: "12/30",
      cvc: "123"
    };

    // 2. Acción: Intentar pagar por /pay
    const payResponse = await payOrder(app, authToken, paymentData);

    // 3. Validación: El contrato exige 404
    validateErrorResponse(
      payResponse,
      404,
      "No se encontró ninguna orden pendiente para procesar el pago.",
      ErrorCodes.ORDER_NOT_FOUND
    );
  });
});
