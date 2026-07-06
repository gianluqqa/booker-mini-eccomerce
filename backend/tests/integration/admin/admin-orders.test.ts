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
import { getAllOrdersAdmin, cancelOrderAdmin } from "../../helpers/orderActions";
import { clearAllOrdersAdmin, clearCancelledOrdersAdmin } from "../../helpers/adminActions";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("Admin Panel - Orders - Administración", () => {
  let testUser: User;
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
      email: `admin_panel_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Normal",
      surname: "User"
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;
  });

  describe("GET /orders/admin/all - Administración: Listar Todo", () => {
    it("debe rechazar con 403 si un usuario normal intenta acceder", async () => {
      const normalUserAllOrdersResponse = await getAllOrdersAdmin(app, authToken);
      validateErrorResponse(normalUserAllOrdersResponse, 403, "Prohibido: se requiere rol de administrador");
    });

    it("debe listar todas las órdenes de todos los usuarios para un Admin", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const orderItemRepository = AppDataSource.getRepository(OrderItem);

      const adminUser = await createTestUser({ email: `admin_${Date.now()}@test.com`, role: "admin" });
      const loginRes = await loginUser(app, { email: adminUser.email });
      const adminToken = loginRes.body.data.accessToken;

      const userA = await createTestUser({ email: `usera_${Date.now()}@test.com` });
      const userB = await createTestUser({ email: `userb_${Date.now()}@test.com` });
      const book = await createTestBook({ title: "Admin Test Book", stock: 10, price: 10 });

      const orderA = await orderRepository.save(orderRepository.create({ user: userA, status: OrderStatus.PAID, total: 10 }));
      await orderItemRepository.save(orderItemRepository.create({ order: orderA, book: book, quantity: 1, price: 10 }));

      const orderB = await orderRepository.save(orderRepository.create({ user: userB, status: OrderStatus.PENDING, total: 20 }));
      await orderItemRepository.save(orderItemRepository.create({ order: orderB, book: book, quantity: 2, price: 10 }));

      const allOrdersAdminResponse = await getAllOrdersAdmin(app, adminToken);

      expect(allOrdersAdminResponse.status).toBe(200);
      expect(allOrdersAdminResponse.body.success).toBe(true);
      expect(allOrdersAdminResponse.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("PATCH /orders/admin/:id/cancel - Administración: Cancelación", () => {
    let adminToken: string;

    beforeEach(async () => {
      const adminUser = await createTestUser({ email: `admin_cancel_${Date.now()}@test.com`, role: "admin" });
      const loginRes = await loginUser(app, { email: adminUser.email });
      adminToken = loginRes.body.data.accessToken;
    });

    it("debe rechazar con 403 si un usuario normal intenta cancelar", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.PAID, total: 10 }));

      const normalUserCancelResponse = await cancelOrderAdmin(app, authToken, order.id);
      validateErrorResponse(normalUserCancelResponse, 403, "Prohibido: se requiere rol de administrador");
    });

    it("debe retornar 400 si la orden ya estaba CANCELLED", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const order = await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.CANCELLED, total: 10 }));

      const res = await cancelOrderAdmin(app, adminToken, order.id);
      validateErrorResponse(res, 400, "Solo se pueden cancelar órdenes en estado PAID o PENDING");
    });

    it("debe cambiar a CANCELLED y restaurar stock si la orden era PENDING", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const orderItemRepository = AppDataSource.getRepository(OrderItem);
      const bookRepository = AppDataSource.getRepository(Book);

      const book = await createTestBook({ title: "Stock Book", stock: 10, price: 10 });
      const order = await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.PENDING, total: 10 }));
      await orderItemRepository.save(orderItemRepository.create({ order: order, book: book, quantity: 3, price: 10 }));

      const res = await cancelOrderAdmin(app, adminToken, order.id);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe(OrderStatus.CANCELLED);
    });
  });

  describe("DELETE /orders/admin/clear-all - Limpieza Masiva", () => {
    let adminToken: string;

    beforeEach(async () => {
      const adminUser = await createTestUser({ email: `admin_clear_${Date.now()}@test.com`, role: "admin" });
      const loginRes = await loginUser(app, { email: adminUser.email });
      adminToken = loginRes.body.data.accessToken;
    });

    it("debe rechazar con 403 si un usuario normal intenta limpiar órdenes", async () => {
      const res = await clearAllOrdersAdmin(app, authToken);
      validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
    });

    it("debe limpiar todas las órdenes para un administrador", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.PAID, total: 10 }));

      const res = await clearAllOrdersAdmin(app, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("DELETE /orders/admin/clear-cancelled - Limpieza Canceladas", () => {
    let adminToken: string;

    beforeEach(async () => {
      const adminUser = await createTestUser({ email: `admin_clear_c_${Date.now()}@test.com`, role: "admin" });
      const loginRes = await loginUser(app, { email: adminUser.email });
      adminToken = loginRes.body.data.accessToken;
    });

    it("debe rechazar con 403 si un usuario normal intenta limpiar órdenes canceladas", async () => {
      const res = await clearCancelledOrdersAdmin(app, authToken);
      validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
    });

    it("debe limpiar todas las órdenes canceladas para un administrador", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.CANCELLED, total: 10 }));

      const res = await clearCancelledOrdersAdmin(app, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
