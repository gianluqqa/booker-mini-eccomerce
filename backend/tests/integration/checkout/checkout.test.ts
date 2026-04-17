import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { cleanUserPendingOrders } from "../../helpers/orderActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart } from "../../helpers/cartActions";
import { reserveStock, cancelCheckout, processCheckout, payOrder } from "../../helpers/checkoutActions";
import { validateStockReservationContract, validateOrderContract } from "../../helpers/checkoutValidationHelpers";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { User } from "../../../src/entities/User";
import { Book } from "../../../src/entities/Book";
import { Order } from "../../../src/entities/Order";

describe("Checkout - Proceso de Compra", () => {
  let testUser: any;
  let authToken: string;
  let testBook: any;
  let anotherBook: any;

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
    const userRepository = AppDataSource.getRepository(User);
    const bookRepository = AppDataSource.getRepository(Book);
    const cartRepository = AppDataSource.getRepository("Cart");
    const orderRepository = AppDataSource.getRepository("Order");
    const stockReservationRepository = AppDataSource.getRepository("StockReservation");
    const { ILike } = require("typeorm");

    try {
      await userRepository.delete({ email: ILike("%@test.com") });
      await bookRepository.delete({ title: ILike("%Book%") });
      await bookRepository.delete({ title: ILike("Test%") });
      await bookRepository.delete({ title: ILike("Another%") });
      await cartRepository.delete({ user: { email: ILike("%@test.com") } });
      await orderRepository.delete({ user: { email: ILike("%@test.com") } });
      await stockReservationRepository.delete({ userId: ILike("%") });
    } catch (error) { }
  });

  beforeEach(async () => {
    testUser = await createTestUser({
      email: `checkout_user_${Date.now()}@test.com`,
      name: "Checkout",
      surname: "User"
    });

    await cleanUserPendingOrders(testUser.id);

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Checkout",
      author: "Test Author",
      price: 29.99,
      stock: 10
    });

    anotherBook = await createTestBook({
      title: "Another Test Book",
      author: "Another Author",
      price: 19.99,
      stock: 5
    });
  });

  describe("Reserva de Stock (POST /checkout/reserve)", () => {
    it("1. debe crear reserva de stock exitosamente", async () => {
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });

      const reserveStockResponse = await reserveStock(app, authToken);

      expect(reserveStockResponse.status).toBe(201);
      expect(reserveStockResponse.body.success).toBe(true);
      expect(reserveStockResponse.body.message).toBe("Reserva de stock creada exitosamente");
      validateStockReservationContract(reserveStockResponse.body.data);
    });

    it("2. debe fallar si usuario no está autenticado", async () => {
      const reserveStockResponse = await reserveStock(app, null);
      validateErrorResponse(reserveStockResponse, 401, "No autorizado: se requiere un token de autenticación");
    });

    it("3. debe fallar si ya existe orden pendiente", async () => {
      const orderRepository = AppDataSource.getRepository(Order);
      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 100.0,
      });
      await orderRepository.save(pendingOrder);

      const reserveStockResponse = await reserveStock(app, authToken);

      validateErrorResponse(reserveStockResponse, 409, "Tienes una orden pendiente en proceso");
      expect(reserveStockResponse.body.data).toHaveProperty("id", pendingOrder.id);
    });

    it("4. debe fallar si carrito está vacío", async () => {
      const reserveStockResponse = await reserveStock(app, authToken);
      validateErrorResponse(reserveStockResponse, 400, "El carrito está vacío");
    });


    it("5. debe fallar si no hay stock suficiente", async () => {
      // 1. Agregar libro al carrito con cantidad válida
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });

      // 2. Simular que el stock bajó en la BD por otra compra/administración
      const bookRepository = AppDataSource.getRepository(Book);
      await bookRepository.update(testBook.id, { stock: 2 });

      // 3. Intentar reservar stock
      const reserveStockResponse = await reserveStock(app, authToken);

      validateErrorResponse(reserveStockResponse, 409, "Stock insuficiente para el libro solicitado");
    });
  });

  describe("Procesamiento de Checkout (POST /checkout)", () => {
    it("6. debe crear orden pendiente sin pago", async () => {
      // 1. Preparación: Carrito con productos y stock reservado
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });
      await reserveStock(app, authToken);

      // 2. Acción: Procesar checkout sin datos de pago
      const checkoutNoPayResponse = await processCheckout(app, authToken);

      // 3. Validaciones
      expect(checkoutNoPayResponse.status).toBe(201);
      expect(checkoutNoPayResponse.body.success).toBe(true);
      expect(checkoutNoPayResponse.body.message).toBe("Orden pendiente creada exitosamente");
      
      // Según el servicio, la orden queda en PENDING si no hay paymentData
      expect(checkoutNoPayResponse.body.data.status).toBe(OrderStatus.PENDING);
      
      validateOrderContract(checkoutNoPayResponse.body.data);
    });

    it("7. debe procesar pago exitosamente", async () => {
      // 1. Setup
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });
      await reserveStock(app, authToken);
      
      const paymentData = {
        cardNumber: "1234567890123456",
        cardName: "Test User",
        expiryDate: "12/25",
        cvc: "123"
      };

      // 2. Acción: Procesar checkout en dos pasos
      // Paso 1: Crear la orden pendiente
      await processCheckout(app, authToken);
      
      // Paso 2: Procesar pago sobre la orden existente usando el endpoint /pay
      const checkoutPayResponse = await payOrder(app, authToken, paymentData);

      // 3. Validaciones
      expect(checkoutPayResponse.status).toBe(201);
      expect(checkoutPayResponse.body.success).toBe(true);
      expect(checkoutPayResponse.body.message).toBe("Pago procesado exitosamente");
      
      // El sistema marca la orden como PAID tras el pago simulado
      expect(checkoutPayResponse.body.data.status).toBe(OrderStatus.PAID);
      
      validateOrderContract(checkoutPayResponse.body.data);
    });

    // it("8. debe fallar con datos de pago inválidos", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Agregar al carrito + reservar stock
    //   // Action: POST /checkout/ con datos inválidos
    //   // Expected: 400, success false
    //   expect(true).toBe(true); // Placeholder
    // });

    // it("9. debe fallar si no hay reserva activa", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Sin reserva previa
    //   // Action: POST /checkout/ con datos de pago
    //   // Expected: 400, success false
    //   expect(true).toBe(true); // Placeholder
    // });
  });

  describe("Procesamiento de Pago (POST /checkout/pay)", () => {
    // it("10. debe procesar pago de orden pendiente existente", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Crear orden PENDING previamente
    //   // Action: POST /checkout/pay
    //   // Expected: 201, success, status PAID
    //   expect(true).toBe(true); // Placeholder
    // });

    // it("11. debe fallar si no hay orden pendiente", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Sin orden PENDING
    //   // Action: POST /checkout/pay
    //   // Expected: 400, success false
    //   expect(true).toBe(true); // Placeholder
    // });
  });

  describe("Cancelación de Checkout (DELETE /checkout/cancel)", () => {
    // it("12. debe cancelar checkout y liberar stock", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Agregar al carrito + reservar stock
    //   // Action: DELETE /checkout/cancel
    //   // Expected: 200, success, data con orderId y reservationId
    //   expect(true).toBe(true); // Placeholder
    // });

    // it("13. debe fallar si no hay checkout activo", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Sin checkout activo
    //   // Action: DELETE /checkout/cancel
    //   // Expected: 400, success false
    //   expect(true).toBe(true); // Placeholder
    // });

    // it("14. debe fallar si usuario no está autenticado", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Sin JWT
    //   // Action: DELETE /checkout/cancel
    //   // Expected: 401, success false, "No autorizado"
    //   expect(true).toBe(true); // Placeholder
    // });
  });

  describe("Integración y Edge Cases", () => {
    // it("15. debe manejar reserva expirada", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Crear reserva + simular expiración
    //   // Action: POST /checkout/
    //   // Expected: 400, success false, message contiene "expiración"
    //   expect(true).toBe(true); // Placeholder
    // });

    // it("16. debe manejar concurrencia de reservas", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Simular múltiples usuarios reservando mismo stock
    //   // Action: Operaciones concurrentes
    //   // Expected: Manejo correcto de concurrencia
    //   expect(true).toBe(true); // Placeholder
    // });

    // it("17. debe calcular total correctamente con múltiples items", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Agregar múltiples libros con diferentes precios
    //   // Action: POST /checkout/reserve
    //   // Expected: totalAmount calculado correctamente
    //   expect(true).toBe(true); // Placeholder
    // });

    // it("18. debe actualizar stock después de pago exitoso", async () => {
    //   // TODO: Implementar este test
    //   // Setup: Proceso completo de compra
    //   // Action: Verificar stock en BD después del pago
    //   // Expected: Stock actualizado correctamente
    //   expect(true).toBe(true); // Placeholder
    // });
  });
});