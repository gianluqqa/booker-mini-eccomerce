import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { getUserOrders } from "../../helpers/orderActions";
import { validateOrderContract } from "../../helpers/orderValidationHelpers";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("GET /orders/ - Obtener Órdenes", () => {
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

  it("1. debe retornar 401 si no se envía token de autenticación", async () => {
    const getOrdersNoTokenResponse = await getUserOrders(app, null);
    validateErrorResponse(getOrdersNoTokenResponse, 401, "No autorizado: se requiere un token de autenticación");
  });

  it("2. debe retornar una lista vacía si el usuario no tiene órdenes confirmadas", async () => {
    const emptyOrdersResponse = await getUserOrders(app, authToken);
    expect(emptyOrdersResponse.status).toBe(200);
    expect(emptyOrdersResponse.body.success).toBe(true);
    expect(emptyOrdersResponse.body.data).toEqual([]);
  });

  it("3. debe listar las órdenes confirmadas del usuario", async () => {
    const orderRepository = AppDataSource.getRepository(Order);

    const newOrder = orderRepository.create({
      user: { id: testUser.id },
      status: OrderStatus.PAID,
      total: 29.99,
    });
    const savedOrder = await orderRepository.save(newOrder);

    const confirmedOrdersResponse = await getUserOrders(app, authToken);
    expect(confirmedOrdersResponse.status).toBe(200);
    expect(confirmedOrdersResponse.body.success).toBe(true);
    expect(confirmedOrdersResponse.body.data.length).toBe(1);

    const orderData = confirmedOrdersResponse.body.data[0];
    validateOrderContract(orderData);
    expect(orderData.id).toBe(savedOrder.id);
    expect(orderData.status).toBe(OrderStatus.PAID);
  });

  it("4. debe rechazar si se envía un token inválido (401)", async () => {
    const invalidTokenResponse = await getUserOrders(app, "token-super-invalido");
    validateErrorResponse(invalidTokenResponse, 401, "No autorizado: token inválido o expirado");
  });

  it("5. debe excluir estrictamente órdenes en estado PENDING o CANCELLED", async () => {
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

    const filteredOrdersResponse = await getUserOrders(app, authToken);
    expect(filteredOrdersResponse.status).toBe(200);
    expect(filteredOrdersResponse.body.success).toBe(true);

    expect(filteredOrdersResponse.body.data.length).toBe(1);
    expect(filteredOrdersResponse.body.data[0].id).toBe(paidOrder.id);
    expect(filteredOrdersResponse.body.data[0].status).toBe(OrderStatus.PAID);
  });

  it("6. debe garantizar privacidad: no devolver órdenes pagadas que pertenezcan a otros usuarios", async () => {
    const orderRepository = AppDataSource.getRepository(Order);

    const otherUser = await createTestUser({
      email: `other_order_user_${Date.now()}@test.com`,
      name: "Other",
      surname: "User"
    });

    const mainUserOrder = orderRepository.create({
      user: { id: testUser.id },
      status: OrderStatus.PAID,
      total: 50.00,
    });

    const otherUserOrder = orderRepository.create({
      user: { id: otherUser.id },
      status: OrderStatus.PAID,
      total: 99.99,
    });

    await orderRepository.save([mainUserOrder, otherUserOrder]);

    const privateOrdersResponse = await getUserOrders(app, authToken);

    expect(privateOrdersResponse.status).toBe(200);
    expect(privateOrdersResponse.body.success).toBe(true);

    expect(privateOrdersResponse.body.data.length).toBe(1);
    expect(privateOrdersResponse.body.data[0].id).toBe(mainUserOrder.id);
  });
});
