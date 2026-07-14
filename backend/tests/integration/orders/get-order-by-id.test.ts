import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { getOrderById } from "../../helpers/orderActions";
import { validateOrderContract } from "../../helpers/orderValidationHelpers";
import { Order } from "../../../src/entities/Order";
import { OrderItem } from "../../../src/entities/OrderItem";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Orders Module - Get Order Details", () => {
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
      email: `order_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Order",
      surname: "User",
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Orders",
      author: "Test Author",
      price: 29.99,
      stock: 10,
    });
  });

  describe("GET /orders/:id", () => {
    it("should get details of specific order by ID", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const orderItemRepository = AppDataSource.getRepository(OrderItem);

      const newOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PAID,
        total: 29.99,
      });
      const savedOrder = await orderRepository.save(newOrder);

      const newItem = orderItemRepository.create({
        order: { id: savedOrder.id },
        book: { id: testBook.id },
        quantity: 1,
        price: 29.99,
      });
      await orderItemRepository.save(newItem);

      const orderDetailsResponse = await getOrderById(
        app,
        authToken,
        savedOrder.id,
      );

      expect(orderDetailsResponse.status).toBe(200);
      expect(orderDetailsResponse.body.success).toBe(true);

      validateOrderContract(orderDetailsResponse.body.data);
      expect(orderDetailsResponse.body.data.id).toBe(savedOrder.id);
      expect(orderDetailsResponse.body.data.items.length).toBe(1);
      expect(orderDetailsResponse.body.data.items[0].book.id).toBe(testBook.id);
    });

    it("should return 404 when trying to get non-existent order", async () => {
      const nonExistentId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const notFoundOrderResponse = await getOrderById(
        app,
        authToken,
        nonExistentId,
      );

      validateErrorResponse(notFoundOrderResponse, 404, "Orden no encontrada");
    });

    it("(Security): should return 403 if user tries to view another user's order", async () => {
      const orderRepository = AppDataSource.getRepository(Order);

      const anotherUser = await createTestUser({
        email: `intruder_user_${Date.now()}@test.com`,
        name: "Intruder",
        surname: "User",
      });

      const othersOrder = orderRepository.create({
        user: { id: anotherUser.id },
        status: OrderStatus.PAID,
        total: 100.0,
      });
      const savedOthersOrder = await orderRepository.save(othersOrder);

      const unauthorizedOrderResponse = await getOrderById(
        app,
        authToken,
        savedOthersOrder.id,
      );

      validateErrorResponse(
        unauthorizedOrderResponse,
        403,
        "No tienes permiso para ver esta orden",
      );
    });

    it("should return error if provided ID is not a valid UUID", async () => {
      const invalidUuidResponse = await getOrderById(
        app,
        authToken,
        "id-invalido-123",
      );

      expect(invalidUuidResponse.status).toBe(500);
      expect(invalidUuidResponse.body.success).toBe(false);
      expect(invalidUuidResponse.body.message).toBe(
        "Error al obtener la orden",
      );
    });
  });
});
