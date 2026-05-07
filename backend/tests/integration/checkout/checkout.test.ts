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
import { ErrorCodes } from "../../../src/enums/ErrorCodes";
import { User } from "../../../src/entities/User";
import { Book } from "../../../src/entities/Book";
import { Order } from "../../../src/entities/Order";
import { StockReservation } from "../../../src/entities/StockReservation";

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
      await cartRepository.createQueryBuilder().delete().execute();
      await orderRepository.createQueryBuilder().delete().execute();
      await stockReservationRepository.createQueryBuilder().delete().execute();
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

  describe("POST /checkout/reserve - Reserva de Stock", () => {
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

      validateErrorResponse(
        reserveStockResponse, 
        409, 
        "Ya tienes una orden pendiente en proceso",
        ErrorCodes.PENDING_ORDER_EXISTS
      );
      expect(reserveStockResponse.body.data).toHaveProperty("id", pendingOrder.id);
    });

    it("4. debe fallar si carrito está vacío", async () => {
      const reserveStockResponse = await reserveStock(app, authToken);
      validateErrorResponse(
        reserveStockResponse, 
        400, 
        "Tu carrito está vacío. Agrega libros antes de iniciar el checkout.",
        ErrorCodes.CART_EMPTY
      );
    });


    it("5. debe fallar si no hay stock suficiente", async () => {
      // 1. Agregar libro al carrito con cantidad válida
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });

      // 2. Simular que el stock bajó en la BD por otra compra/administración
      const bookRepository = AppDataSource.getRepository(Book);
      await bookRepository.update(testBook.id, { stock: 2 });

      // 3. Intentar reservar stock
      const reserveStockResponse = await reserveStock(app, authToken);

      validateErrorResponse(
        reserveStockResponse, 
        409, 
        "Stock insuficiente para el libro solicitado"
      );
    });
  });

  describe("POST /checkout - Procesamiento de Checkout", () => {
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
        expiryDate: "12/30",
        cvc: "123"
      };

      // 2. Acción: Procesar checkout en dos pasos
      // Paso 1: Crear la orden pendiente
      await processCheckout(app, authToken);

      // Paso 2: Procesar pago sobre la orden existente usando el endpoint /pay
      const checkoutPayResponse = await payOrder(app, authToken, paymentData);

      // 3. Validaciones
      expect(checkoutPayResponse.status).toBe(200);
      expect(checkoutPayResponse.body.success).toBe(true);
      expect(checkoutPayResponse.body.message).toBe("Pago procesado exitosamente");
      expect(checkoutPayResponse.body.data.status).toBe(OrderStatus.PAID);
      validateOrderContract(checkoutPayResponse.body.data);
    });

    it("8. debe fallar con datos de pago inválidos", async () => {
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });
      await reserveStock(app, authToken);

      const paymentData = {
        cardNumber: "123-456-789-235-", // Formato inválido
        cardName: "Valid Name",
        expiryDate: "12/30",
        cvc: "123"
      };

      await processCheckout(app, authToken);

      const checkoutPayResponse = await payOrder(app, authToken, paymentData);

      validateErrorResponse(
        checkoutPayResponse, 
        400, 
        "Datos de pago inválidos",
        ErrorCodes.PAYMENT_DATA_INVALID
      );
    });

    it("9. debe fallar si no hay reserva activa", async () => {
      // 1. Setup: Agregar al carrito pero NO llamar a reserveStock
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });

      // 2. Acción: Intentar procesar checkout directamente
      const checkoutResponse = await processCheckout(app, authToken);

      // 3. Validación
      validateErrorResponse(
        checkoutResponse, 
        400, 
        "No tienes una reserva de stock activa. Por favor, inicia el proceso de nuevo.",
        ErrorCodes.NO_ACTIVE_RESERVATION
      );
    });
  });

  describe("POST /checkout/pay - Procesamiento de Pago", () => {
    it("10. debe procesar pago de orden pendiente existente", async () => {
      // 1. Setup: Agregar al carrito + Reservar + Crear Orden PENDING
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await reserveStock(app, authToken);
      await processCheckout(app, authToken);

      const paymentData = {
        cardNumber: "1234567812345678",
        cardName: "Test User",
        expiryDate: "12/30",
        cvc: "123"
      };

      // 2. Acción: Pagar la orden usando /pay
      const payResponse = await payOrder(app, authToken, paymentData);

      // 3. Validación
      expect(payResponse.status).toBe(200);
      expect(payResponse.body.success).toBe(true);
      expect(payResponse.body.message).toBe("Pago procesado exitosamente");
      expect(payResponse.body.data.status).toBe(OrderStatus.PAID);
      validateOrderContract(payResponse.body.data);
    });

    it("11. debe fallar si no hay orden pendiente", async () => {
      // 1. Setup: Sin crear orden previa (y opcionalmente sin reserva)
      const paymentData = {
        cardNumber: "1234567812345678",
        cardName: "Test User",
        expiryDate: "12/30",
        cvc: "123"
      };

      // 2. Acción: Intentar pagar por /pay
      const payResponse = await payOrder(app, authToken, paymentData);

      // 3. Validación: El contrato exige 404
      validateErrorResponse(
        payResponse, 
        404, 
        "No se encontró ninguna orden pendiente para procesar el pago.",
        ErrorCodes.ORDER_NOT_FOUND
      );
    });
  });

  describe("DELETE /checkout/cancel - Cancelación de Checkout", () => {
    it("12. debe cancelar checkout exitosamente (reserva y orden)", async () => {
      // 1. Setup: Crear carrito + reserva + orden PENDING
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await reserveStock(app, authToken);
      await processCheckout(app, authToken);

      // Verificar que existen en BD
      const orderRepo = AppDataSource.getRepository(Order);
      const reservationRepo = AppDataSource.getRepository(StockReservation);
      
      const orderBefore = await orderRepo.findOne({ where: { user: { id: testUser.id }, status: OrderStatus.PENDING } });
      const reservationBefore = await reservationRepo.findOne({ where: { userId: testUser.id } });
      
      expect(orderBefore).toBeDefined();
      expect(reservationBefore).toBeDefined();

      // 2. Acción: Cancelar
      const cancelResponse = await cancelCheckout(app, authToken);

      // 3. Validación
      expect(cancelResponse.status).toBe(200);
      expect(cancelResponse.body.success).toBe(true);
      expect(cancelResponse.body.message).toContain("cancelada");
      
      // Verificar limpieza en BD
      const orderAfter = await orderRepo.findOne({ where: { id: orderBefore?.id } });
      const reservationAfter = await reservationRepo.findOne({ where: { userId: testUser.id } });
      
      expect(orderAfter).toBeNull();
      expect(reservationAfter).toBeNull();
    });

    it("13. debe fallar si no hay nada que cancelar", async () => {
      const cancelResponse = await cancelCheckout(app, authToken);

      validateErrorResponse(
        cancelResponse, 
        404, 
        "No tienes ninguna reserva o pedido pendiente para cancelar.",
        ErrorCodes.NOTHING_TO_CANCEL
      );
    });
  });

  describe("Integración y Edge Cases", () => {
    it("15. debe manejar reserva expirada", async () => {
      // 1. Setup: Crear reserva
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await reserveStock(app, authToken);

      // 2. Simular expiración en BD
      const reservationRepo = AppDataSource.getRepository(StockReservation);
      const reservation = await reservationRepo.findOne({ where: { userId: testUser.id } });
      if (reservation) {
        reservation.expiresAt = new Date(Date.now() - 10000); // 10 segundos en el pasado
        await reservationRepo.save(reservation);
      }

      // 3. Acción: Intentar procesar checkout
      const checkoutResponse = await processCheckout(app, authToken);

      // 4. Validación
      validateErrorResponse(
        checkoutResponse, 
        410, 
        "Tu reserva de stock ha expirado. Por favor, inicia el proceso de nuevo.",
        ErrorCodes.RESERVATION_EXPIRED
      );
    });

    it("16. debe manejar concurrencia de reservas (stock insuficiente final)", async () => {
      // 1. Setup: Usuario A reserva stock
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 8 }); // Quedan 2 en stock (total 10)
      await reserveStock(app, authToken);
      await processCheckout(app, authToken); // Orden PENDING creada

      // 2. Simular que otro proceso/admin agota el stock antes del pago
      const bookRepo = AppDataSource.getRepository(Book);
      await bookRepo.update(testBook.id, { stock: 0 });

      // 3. Acción: Usuario A intenta pagar
      const paymentData = {
        cardNumber: "1234567890123456",
        cardName: "Test User",
        expiryDate: "12/30",
        cvc: "123"
      };
      const payResponse = await payOrder(app, authToken, paymentData);

      // 4. Validación: El sistema debe detectar que ya no hay stock real
      validateErrorResponse(
        payResponse,
        409,
        "No hay stock suficiente para completar el pago de esta orden.",
        ErrorCodes.INSUFFICIENT_STOCK_FINAL
      );
    });

    it("17. debe calcular total correctamente con múltiples items", async () => {
      // 1. Setup: Agregar dos tipos de libros
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 }); // 29.99 * 2 = 59.98
      await addToCart(app, authToken, { bookId: anotherBook.id, quantity: 1 }); // 19.99 * 1 = 19.99
      // Total esperado: 79.97

      // 2. Acción: Reservar stock
      const reserveResponse = await reserveStock(app, authToken);

      // 3. Validación
      expect(reserveResponse.status).toBe(201);
      expect(Number(reserveResponse.body.data.totalAmount)).toBeCloseTo(79.97, 2);
    });

    it("18. debe actualizar stock después de pago exitoso", async () => {
      // 1. Setup: Proceso completo hasta pago
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 3 });
      await reserveStock(app, authToken);
      await processCheckout(app, authToken);

      const paymentData = {
        cardNumber: "1234567890123456",
        cardName: "Test User",
        expiryDate: "12/30",
        cvc: "123"
      };

      // 2. Acción: Pagar
      const payResponse = await payOrder(app, authToken, paymentData);
      expect(payResponse.status).toBe(200);

      // 3. Validación: Stock debe haber bajado de 10 a 7
      const bookRepo = AppDataSource.getRepository(Book);
      const updatedBook = await bookRepo.findOne({ where: { id: testBook.id } });
      expect(updatedBook?.stock).toBe(7);
    });

    it("19. debe mantener la reserva original aunque el carrito cambie (Idempotencia)", async () => {
      // 1. Setup: Agregar un libro y reservar
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const firstReserve = await reserveStock(app, authToken);
      expect(firstReserve.body.data.items).toHaveLength(1);

      // 2. Acción: Agregar otro libro diferente al carrito
      await addToCart(app, authToken, { bookId: anotherBook.id, quantity: 1 });

      // 3. Re-intentar reservar sin cancelar la anterior
      const secondReserve = await reserveStock(app, authToken);

      // 4. Validación: El sistema devuelve la misma reserva (idéntica a la primera)
      // ignorando los cambios recientes en el carrito hasta que se cancele la actual.
      expect(secondReserve.status).toBe(201);
      expect(secondReserve.body.data.id).toBe(firstReserve.body.data.id);
      expect(secondReserve.body.data.items).toHaveLength(1); 
      expect(secondReserve.body.data.items[0].bookId).toBe(testBook.id);
    });
  });
});