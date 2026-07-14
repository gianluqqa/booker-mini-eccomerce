import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart, clearCart, getCart } from "../../helpers/cartActions";
import { validateFullCartContract } from "../../helpers/cartValidationHelpers";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Cart Module - Clear Cart", () => {
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

  describe("DELETE /carts/", () => {
    it("should remove all cart items successfully", async () => {
      const bookForClear2 = await createTestBook({
        title: "Second Book",
        price: 15.0,
        stock: 5,
      });
      const bookForClear3 = await createTestBook({
        title: "Third Book",
        price: 50.0,
        stock: 20,
      });

      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, {
        bookId: bookForClear2.id,
        quantity: 1,
      });
      await addToCart(app, authToken, {
        bookId: bookForClear3.id,
        quantity: 5,
      });

      const fullCartResponse = await getCart(app, authToken);

      validateFullCartContract(fullCartResponse.body.data);
      expect(fullCartResponse.body.data.items).toHaveLength(3);

      const clearCartResponse = await clearCart(app, authToken);

      expect(clearCartResponse.status).toBe(200);
      expect(clearCartResponse.body.success).toBe(true);
      expect(clearCartResponse.body.message).toBe(
        "Carrito vaciado exitosamente",
      );
    });

    it("should inform number of items deleted", async () => {
      const itemsDeleted2 = await createTestBook({
        title: "Second Book",
        price: 15.0,
        stock: 5,
      });
      const itemsDeleted3 = await createTestBook({
        title: "Third Book",
        price: 50.0,
        stock: 20,
      });

      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, {
        bookId: itemsDeleted2.id,
        quantity: 1,
      });
      await addToCart(app, authToken, {
        bookId: itemsDeleted3.id,
        quantity: 5,
      });

      const fullCartResponse = await getCart(app, authToken);

      validateFullCartContract(fullCartResponse.body.data);
      expect(fullCartResponse.body.data.items).toHaveLength(3);

      const clearCartResponse = await clearCart(app, authToken);

      expect(clearCartResponse.status).toBe(200);
      expect(clearCartResponse.body.success).toBe(true);
      expect(clearCartResponse.body.message).toBe(
        "Carrito vaciado exitosamente",
      );
      expect(clearCartResponse.body.data.count).toBe(3);
    });

    it("should work correctly even if cart is already empty", async () => {
      // 1. El carrito ya está vacío por el beforeEach, así que disparamos el clear directamente
      const response = await clearCart(app, authToken);

      // 2. Validamos que la respuesta sea exitosa
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Carrito vaciado exitosamente");

      // 3. LA CLAVE: El conteo de items borrados debe ser 0
      expect(response.body.data.count).toBe(0);
    });

    it("should reject clearing if there is pending order", async () => {
      // 1. Agregamos algo para que el carrito no esté vacío
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });

      // 2. Bloqueamos el carrito con una orden pendiente
      const orderRepository = AppDataSource.getRepository(Order);
      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 50.0,
      });
      await orderRepository.save(pendingOrder);

      // 3. Intentamos vaciar el carrito completo
      const response = await clearCart(app, authToken);

      validateErrorResponse(
        response,
        409,
        "Ya tienes una orden pendiente en proceso",
      );
    });

    it("should leave cart empty when querying with GET after clearing", async () => {
      // 1. Llenamos el carrito
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });

      // 2. Vaciamos
      await clearCart(app, authToken);

      // 3. Verificamos con GET
      const getResponse = await getCart(app, authToken);

      expect(getResponse.status).toBe(200);
      validateFullCartContract(getResponse.body.data);
      expect(getResponse.body.data.items).toHaveLength(0);
      expect(getResponse.body.data.totalPrice).toBe(0);
    });
  });
});
