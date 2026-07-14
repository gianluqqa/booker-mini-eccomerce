import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { getUserPendingOrders } from "../../helpers/orderActions";
import { validateOrderContract } from "../../helpers/orderValidationHelpers";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Orders Module - Get Pending Orders", () => {
  let testUser: any;

  let authToken: string;

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
  });

  describe("GET /orders/pending", () => {
    it("should return 401 if no authentication token is sent", async () => {
      const pendingNoTokenResponse = await getUserPendingOrders(app, null);
      validateErrorResponse(
        pendingNoTokenResponse,
        401,
        "No autorizado: se requiere un token de autenticación",
      );
    });

    it("should reject if invalid token is sent (401)", async () => {
      const pendingInvalidTokenResponse = await getUserPendingOrders(
        app,
        "token-super-invalido",
      );
      validateErrorResponse(
        pendingInvalidTokenResponse,
        401,
        "No autorizado: token inválido o expirado",
      );
    });

    it("should return empty list if user has no pending orders", async () => {
      const emptyPendingOrdersResponse = await getUserPendingOrders(
        app,
        authToken,
      );
      expect(emptyPendingOrdersResponse.status).toBe(200);
      expect(emptyPendingOrdersResponse.body.success).toBe(true);
      expect(emptyPendingOrdersResponse.body.data).toEqual([]);
    });

    it("should return only user's PENDING order", async () => {
      const orderRepository = AppDataSource.getRepository(Order);

      const newOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 15.5,
      });
      const savedOrder = await orderRepository.save(newOrder);

      const pendingOrderResponse = await getUserPendingOrders(app, authToken);
      expect(pendingOrderResponse.status).toBe(200);
      expect(pendingOrderResponse.body.success).toBe(true);

      // El controlador devuelve [pendingOrder] o []
      expect(pendingOrderResponse.body.data.length).toBe(1);

      const orderData = pendingOrderResponse.body.data[0];
      validateOrderContract(orderData);
      expect(orderData.id).toBe(savedOrder.id);
      expect(orderData.status).toBe(OrderStatus.PENDING);
    });

    it("should strictly exclude orders in PAID or CANCELLED status", async () => {
      const orderRepository = AppDataSource.getRepository(Order);

      const paidOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PAID,
        total: 10.0,
      });

      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 20.0,
      });

      const cancelledOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.CANCELLED,
        total: 30.0,
      });

      await orderRepository.save([paidOrder, pendingOrder, cancelledOrder]);

      const filteredPendingOrdersResponse = await getUserPendingOrders(
        app,
        authToken,
      );
      expect(filteredPendingOrdersResponse.status).toBe(200);
      expect(filteredPendingOrdersResponse.body.success).toBe(true);

      expect(filteredPendingOrdersResponse.body.data.length).toBe(1);
      expect(filteredPendingOrdersResponse.body.data[0].id).toBe(
        pendingOrder.id,
      );
      expect(filteredPendingOrdersResponse.body.data[0].status).toBe(
        OrderStatus.PENDING,
      );
    });

    it("should ensure privacy: not return pending orders belonging to other users", async () => {
      const orderRepository = AppDataSource.getRepository(Order);

      const otherUser = await createTestUser({
        email: `other_pending_user_${Date.now()}@test.com`,
        name: "Other",
        surname: "User",
      });

      const mainUserOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 50.0,
      });

      const otherUserOrder = orderRepository.create({
        user: { id: otherUser.id },
        status: OrderStatus.PENDING,
        total: 99.99,
      });

      await orderRepository.save([mainUserOrder, otherUserOrder]);

      const privatePendingOrdersResponse = await getUserPendingOrders(
        app,
        authToken,
      );

      expect(privatePendingOrdersResponse.status).toBe(200);
      expect(privatePendingOrdersResponse.body.success).toBe(true);

      expect(privatePendingOrdersResponse.body.data.length).toBe(1);
      expect(privatePendingOrdersResponse.body.data[0].id).toBe(
        mainUserOrder.id,
      );
    });
  });
});
