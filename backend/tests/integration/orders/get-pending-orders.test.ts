import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { getUserPendingOrders } from "../../helpers/orderActions";
import { validateOrderContract } from "../../helpers/orderValidationHelpers";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("GET /orders/pending - Obtener Órdenes Pendientes", () => {
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
      surname: "User"
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;
  });

  it("7. debe retornar 401 si no se envía token de autenticación", async () => {
    const pendingNoTokenResponse = await getUserPendingOrders(app, null);
    validateErrorResponse(pendingNoTokenResponse, 401, "No autorizado: se requiere un token de autenticación");
  });

  it("8. debe rechazar si se envía un token inválido (401)", async () => {
    const pendingInvalidTokenResponse = await getUserPendingOrders(app, "token-super-invalido");
    validateErrorResponse(pendingInvalidTokenResponse, 401, "No autorizado: token inválido o expirado");
  });

  it("9. debe retornar una lista vacía si el usuario no tiene órdenes pendientes", async () => {
    const emptyPendingOrdersResponse = await getUserPendingOrders(app, authToken);
    expect(emptyPendingOrdersResponse.status).toBe(200);
    expect(emptyPendingOrdersResponse.body.success).toBe(true);
    expect(emptyPendingOrdersResponse.body.data).toEqual([]);
  });

  it("10. debe retornar solo la orden PENDING del usuario", async () => {
    const orderRepository = AppDataSource.getRepository(Order);

    const newOrder = orderRepository.create({
      user: { id: testUser.id },
      status: OrderStatus.PENDING,
      total: 15.50,
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

  it("11. debe excluir estrictamente órdenes en estado PAID o CANCELLED", async () => {
    const orderRepository = AppDataSource.getRepository(Order);

    const paidOrder = orderRepository.create({
      user: { id: testUser.id },
      status: OrderStatus.PAID,
      total: 10.00,
    });

    const pendingOrder = orderRepository.create({
      user: { id: testUser.id },
      status: OrderStatus.PENDING,
      total: 20.00,
    });

    const cancelledOrder = orderRepository.create({
      user: { id: testUser.id },
      status: OrderStatus.CANCELLED,
      total: 30.00,
    });

    await orderRepository.save([paidOrder, pendingOrder, cancelledOrder]);

    const filteredPendingOrdersResponse = await getUserPendingOrders(app, authToken);
    expect(filteredPendingOrdersResponse.status).toBe(200);
    expect(filteredPendingOrdersResponse.body.success).toBe(true);

    expect(filteredPendingOrdersResponse.body.data.length).toBe(1);
    expect(filteredPendingOrdersResponse.body.data[0].id).toBe(pendingOrder.id);
    expect(filteredPendingOrdersResponse.body.data[0].status).toBe(OrderStatus.PENDING);
  });

  it("12. debe garantizar privacidad: no devolver órdenes pendientes que pertenezcan a otros usuarios", async () => {
    const orderRepository = AppDataSource.getRepository(Order);

    const otherUser = await createTestUser({
      email: `other_pending_user_${Date.now()}@test.com`,
      name: "Other",
      surname: "User"
    });

    const mainUserOrder = orderRepository.create({
      user: { id: testUser.id },
      status: OrderStatus.PENDING,
      total: 50.00,
    });

    const otherUserOrder = orderRepository.create({
      user: { id: otherUser.id },
      status: OrderStatus.PENDING,
      total: 99.99,
    });

    await orderRepository.save([mainUserOrder, otherUserOrder]);

    const privatePendingOrdersResponse = await getUserPendingOrders(app, authToken);

    expect(privatePendingOrdersResponse.status).toBe(200);
    expect(privatePendingOrdersResponse.body.success).toBe(true);

    expect(privatePendingOrdersResponse.body.data.length).toBe(1);
    expect(privatePendingOrdersResponse.body.data[0].id).toBe(mainUserOrder.id);
  });
});
