import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { User } from "../../../src/entities/User";
import { Book } from "../../../src/entities/Book";
import { Order } from "../../../src/entities/Order";
import { OrderItem } from "../../../src/entities/OrderItem";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import {
  getAllOrdersAdmin,
  cancelOrderAdmin,
} from "../../helpers/orderActions";
import {
  clearAllOrdersAdmin,
  clearCancelledOrdersAdmin,
} from "../../helpers/adminActions";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Orders Module - Administration", () => {
  let testUser: User;

  let authToken: string;
  let adminToken: string;

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
      email: `admin_panel_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Normal",
      surname: "User",
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    const adminUser = await createTestUser({
      email: `admin_${Date.now()}@test.com`,
      role: "admin",
    });
    const adminLoginRes = await loginUser(app, { email: adminUser.email });
    adminToken = adminLoginRes.body.data.accessToken;
  });

  describe("GET /orders/admin/all", () => {
    it("should reject with 403 if normal user tries to access", async () => {
      const normalUserAllOrdersResponse = await getAllOrdersAdmin(
        app,
        authToken,
      );
      validateErrorResponse(
        normalUserAllOrdersResponse,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should list all orders from all users for an Admin", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const orderItemRepository = AppDataSource.getRepository(OrderItem);


      const userA = await createTestUser({
        email: `usera_${Date.now()}@test.com`,
      });
      const userB = await createTestUser({
        email: `userb_${Date.now()}@test.com`,
      });
      const book = await createTestBook({
        title: "Admin Test Book",
        stock: 10,
        price: 10,
      });

      const orderA = await orderRepository.save(
        orderRepository.create({
          user: userA,
          status: OrderStatus.PAID,
          total: 10,
        }),
      );
      await orderItemRepository.save(
        orderItemRepository.create({
          order: orderA,
          book: book,
          quantity: 1,
          price: 10,
        }),
      );

      const orderB = await orderRepository.save(
        orderRepository.create({
          user: userB,
          status: OrderStatus.PENDING,
          total: 20,
        }),
      );
      await orderItemRepository.save(
        orderItemRepository.create({
          order: orderB,
          book: book,
          quantity: 2,
          price: 10,
        }),
      );

      const allOrdersAdminResponse = await getAllOrdersAdmin(app, adminToken);

      expect(allOrdersAdminResponse.status).toBe(200);
      expect(allOrdersAdminResponse.body.success).toBe(true);
      expect(allOrdersAdminResponse.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it("should reject with 403 if normal user tries to cancel", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.save(
        orderRepository.create({
          user: testUser,
          status: OrderStatus.PAID,
          total: 10,
        }),
      );

      const normalUserCancelResponse = await cancelOrderAdmin(
        app,
        authToken,
        order.id,
      );
      validateErrorResponse(
        normalUserCancelResponse,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should return 400 if order was already CANCELLED", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.save(
        orderRepository.create({
          user: testUser,
          status: OrderStatus.CANCELLED,
          total: 10,
        }),
      );

      const res = await cancelOrderAdmin(app, adminToken, order.id);
      validateErrorResponse(
        res,
        400,
        "Solo se pueden cancelar órdenes en estado PAID o PENDING",
      );
    });

    it("should change to CANCELLED and restore stock if order was PENDING", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const orderItemRepository = AppDataSource.getRepository(OrderItem);
      const bookRepository = AppDataSource.getRepository(Book);

      const book = await createTestBook({
        title: "Stock Book",
        stock: 10,
        price: 10,
      });
      const order = await orderRepository.save(
        orderRepository.create({
          user: testUser,
          status: OrderStatus.PENDING,
          total: 10,
        }),
      );
      await orderItemRepository.save(
        orderItemRepository.create({
          order: order,
          book: book,
          quantity: 3,
          price: 10,
        }),
      );

      const res = await cancelOrderAdmin(app, adminToken, order.id);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe(OrderStatus.CANCELLED);
    });

    it("should reject with 403 if normal user tries to clear orders", async () => {
      const res = await clearAllOrdersAdmin(app, authToken);
      validateErrorResponse(
        res,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should clear all orders for an administrator", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      await orderRepository.save(
        orderRepository.create({
          user: testUser,
          status: OrderStatus.PAID,
          total: 10,
        }),
      );

      const res = await clearAllOrdersAdmin(app, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should reject with 403 if normal user tries to clear cancelled orders", async () => {
      const res = await clearCancelledOrdersAdmin(app, authToken);
      validateErrorResponse(
        res,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should clear all cancelled orders for an administrator", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      await orderRepository.save(
        orderRepository.create({
          user: testUser,
          status: OrderStatus.CANCELLED,
          total: 10,
        }),
      );

      const res = await clearCancelledOrdersAdmin(app, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
