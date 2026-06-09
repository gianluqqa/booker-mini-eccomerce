import request from "supertest";
import { app } from "../../src/server";
import { createTestBook } from "../helpers/bookActions";
import { loginUser } from "../helpers/authActions";
import { addToCart } from "../helpers/cartActions";
import { reserveStock, processCheckout, payOrder } from "../helpers/checkoutActions";
import { OrderStatus } from "../../src/enums/OrderStatus";
import { initializeTestDb, closeTestDb, clearDatabase } from "../helpers/dbHelpers";

describe("E2E - Flujo Completo de Compra", () => {
  let authToken: string;
  let testBook: any;
  const testEmail = `e2e_user_${Date.now()}@test.com`;
  const testPassword = "Password123!";

  beforeAll(async () => {
    await initializeTestDb();
  });

  afterAll(async () => {
    await clearDatabase();
    await closeTestDb();
  });

  it("Debe completar el flujo completo desde registro hasta el pago de la orden", async () => {
    // 1. Registro de usuario (Simulando a un cliente nuevo que entra a la app)
    const registerResponse = await request(app)
      .post("/users/register")
      .send({
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword,
        name: "Comprador",
        surname: "User"
      });
      
    if (registerResponse.status !== 201) {
      console.log("REGISTER ERROR:", registerResponse.body);
    }
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.success).toBe(true);

    // 2. Login (El cliente se loguea para obtener su token)
    const loginResponse = await loginUser(app, { email: testEmail, password: testPassword });
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    
    authToken = loginResponse.body.data.accessToken;
    expect(authToken).toBeDefined();

    // 3. Crear un libro en BD (Normalmente lo haría un admin, pero lo forzamos con helpers para la prueba)
    testBook = await createTestBook({
      title: "Libro E2E Test Flow",
      author: "E2E Author",
      price: 25.50,
      stock: 10
    });

    // 4. Agregar libro al carrito (El usuario selecciona un libro)
    const addToCartResponse = await addToCart(app, authToken, {
      bookId: testBook.id,
      quantity: 2
    });
    
    expect(addToCartResponse.status).toBe(200);
    expect(addToCartResponse.body.success).toBe(true);
    expect(addToCartResponse.body.data.quantity).toBe(2);

    // 5. Reservar Stock (El usuario presiona "Checkout", se congela el stock)
    const reserveStockResponse = await reserveStock(app, authToken);
    expect(reserveStockResponse.status).toBe(201);
    expect(reserveStockResponse.body.success).toBe(true);
    
    // 6. Procesar Checkout (Se crea la orden en estado PENDING)
    const checkoutResponse = await processCheckout(app, authToken);
    expect(checkoutResponse.status).toBe(201);
    expect(checkoutResponse.body.success).toBe(true);
    expect(checkoutResponse.body.data.status).toBe(OrderStatus.PENDING);
    
    // 7. Procesar Pago (El usuario completa los datos de su tarjeta y se cobra)
    const paymentData = {
      cardNumber: "1234567890123456",
      cardName: "E2E User",
      expiryDate: "12/30",
      cvc: "123"
    };
    
    const payResponse = await payOrder(app, authToken, paymentData);
    expect(payResponse.status).toBe(200);
    expect(payResponse.body.success).toBe(true);
    expect(payResponse.body.data.status).toBe(OrderStatus.PAID);
  });
});
