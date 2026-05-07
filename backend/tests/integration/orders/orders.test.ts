import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { getUserOrders, getOrderById, getUserPendingOrders } from "../../helpers/orderActions";
import { validateOrderContract } from "../../helpers/orderValidationHelpers";
import { Order } from "../../../src/entities/Order";
import { OrderItem } from "../../../src/entities/OrderItem";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { User } from "../../../src/entities/User";
import { Book } from "../../../src/entities/Book";
import { StockReservation } from "../../../src/entities/StockReservation";

describe("Orders - Módulo de Órdenes", () => {
  let testUser: any;
  let authToken: string;
  let testBook: any;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  afterEach(async () => {
    const orderRepository = AppDataSource.getRepository(Order);
    const orderItemRepository = AppDataSource.getRepository(OrderItem);
    const bookRepository = AppDataSource.getRepository(Book);
    const userRepository = AppDataSource.getRepository(User);
    const stockReservationRepository = AppDataSource.getRepository(StockReservation);
    const { ILike } = require("typeorm");

    try {
      // Limpieza profunda usando query builder para evitar errores de restricción
      await orderItemRepository.createQueryBuilder().delete().execute();
      await orderRepository.createQueryBuilder().delete().execute();
      await stockReservationRepository.createQueryBuilder().delete().execute();
      await userRepository.delete({ email: ILike("%@test.com") });
      await bookRepository.delete({ title: ILike("%Book%") });
    } catch (error) {
      // Silenciamos errores de limpieza
    }
  });

  beforeEach(async () => {
    testUser = await createTestUser({
      email: `order_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Order",
      surname: "User"
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Orders",
      author: "Test Author",
      price: 29.99,
      stock: 10
    });
  });

  describe("GET /orders/ - Obtener Órdenes", () => {
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

  describe("GET /orders/pending - Obtener Órdenes Pendientes", () => {
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

  describe("GET /orders/:id - Obtener Detalles de una Orden", () => {
    it("13. debe obtener los detalles de una orden específica por ID", async () => {
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

      const orderDetailsResponse = await getOrderById(app, authToken, savedOrder.id);
      
      expect(orderDetailsResponse.status).toBe(200);
      expect(orderDetailsResponse.body.success).toBe(true);
      
      validateOrderContract(orderDetailsResponse.body.data);
      expect(orderDetailsResponse.body.data.id).toBe(savedOrder.id);
      expect(orderDetailsResponse.body.data.items.length).toBe(1);
      expect(orderDetailsResponse.body.data.items[0].book.id).toBe(testBook.id);
    });
    it("14. debe retornar 404 al intentar obtener una orden que no existe", async () => {
      const nonExistentId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const notFoundOrderResponse = await getOrderById(app, authToken, nonExistentId);
      
      validateErrorResponse(notFoundOrderResponse, 404, "Orden no encontrada");
    });

    it("15. (Seguridad): debe retornar 403 si un usuario intenta ver una orden de otro usuario", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      
      const anotherUser = await createTestUser({
        email: `intruder_user_${Date.now()}@test.com`,
        name: "Intruder",
        surname: "User"
      });
      
      const othersOrder = orderRepository.create({
        user: { id: anotherUser.id },
        status: OrderStatus.PAID,
        total: 100.00,
      });
      const savedOthersOrder = await orderRepository.save(othersOrder);

      const unauthorizedOrderResponse = await getOrderById(app, authToken, savedOthersOrder.id);
      
      validateErrorResponse(unauthorizedOrderResponse, 403, "No tienes permiso para ver esta orden");
    });

    it("16. debe retornar un error si el ID proporcionado no es un UUID válido", async () => {
      const invalidUuidResponse = await getOrderById(app, authToken, "id-invalido-123");
      
      expect(invalidUuidResponse.status).toBe(500);
      expect(invalidUuidResponse.body.success).toBe(false);
      expect(invalidUuidResponse.body.message).toBe("Error al obtener la orden");
    });
  });
});
