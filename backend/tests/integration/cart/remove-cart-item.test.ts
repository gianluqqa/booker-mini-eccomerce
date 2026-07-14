import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart, deleteCartItem } from "../../helpers/cartActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Cart Module - Remove Item", () => {
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

  describe("DELETE /carts/:cartId", () => {
    it("should remove specific item successfully", async () => {
      // 1. Agregamos
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const cartId = addResponse.body.data.id;

      // 2. Ejecutamos usando el nuevo helper
      const deleteResponse = await deleteCartItem(app, authToken, cartId);

      // 3. Validamos
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe(
        "Libro eliminado del carrito exitosamente",
      );
    });

    it("should return ID of deleted item in data", async () => {
      // 1. Agregamos
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const cartId = addResponse.body.data.id;

      // 2. Ejecutamos
      const deleteResponse = await deleteCartItem(app, authToken, cartId);

      // 3. Validamos
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe(
        "Libro eliminado del carrito exitosamente",
      );

      // 4.Verificar que el ID devuelto es el que borramos
      expect(deleteResponse.body.data.id).toBe(cartId);
    });

    it("should reject if item does not exist", async () => {
      const nonExistentId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const deleteResponse = await deleteCartItem(
        app,
        authToken,
        nonExistentId,
      );

      validateErrorResponse(
        deleteResponse,
        404,
        "Item del carrito no encontrado",
      );
    });

    it("should reject if not owned by authenticated user", async () => {
      // 1. Creamos y logueamos al otro usuario con los nuevos helpers
      const wrongUser = await createTestUser({
        email: `other${Date.now()}@test.com`,
      });
      const loginRes = await loginUser(app, { email: wrongUser.email });
      const wrongToken = loginRes.body.data.accessToken;

      // 2. Agregamos el libro a SU carrito
      const addResponse = await addToCart(app, wrongToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const wrongCartId = addResponse.body.data.id;

      // 3. INTENTO DE BORRADO: Usamos el helper deleteCart con el token del usuario principal
      const wrongDeleteResponse = await deleteCartItem(
        app,
        authToken,
        wrongCartId,
      );

      validateErrorResponse(
        wrongDeleteResponse,
        404,
        "Item del carrito no encontrado",
      );
    });

    it("38. debe rechazar si hay una orden pendiente", async () => {
      // 1. Agregar libro al carrito PRIMERO (antes de bloquearlo con la orden)
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const cartId = addResponse.body.data.id;

      // 2. Crear una orden pendiente para simular un checkout iniciado
      const orderRepository = AppDataSource.getRepository(Order);
      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 100.0,
      });
      await orderRepository.save(pendingOrder);

      const deleteResponse = await deleteCartItem(app, authToken, cartId);

      validateErrorResponse(
        deleteResponse,
        409,
        "Ya tienes una orden pendiente en proceso",
      );
    });
  });
});
