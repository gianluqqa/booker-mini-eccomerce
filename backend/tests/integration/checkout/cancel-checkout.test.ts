import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { cleanUserPendingOrders } from "../../helpers/orderActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart } from "../../helpers/cartActions";
import {
  reserveStock,
  processCheckout,
  cancelCheckout,
} from "../../helpers/checkoutActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { StockReservation } from "../../../src/entities/StockReservation";
import { ErrorCodes } from "../../../src/enums/ErrorCodes";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Checkout Module - Checkout Cancellation", () => {
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
      email: `checkout_user_${Date.now()}@test.com`,
      name: "Checkout",
      surname: "User",
    });

    await cleanUserPendingOrders(testUser.id);

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Checkout",
      author: "Test Author",
      price: 29.99,
      stock: 10,
    });
  });

  describe("DELETE /checkout/cancel", () => {
    it("should cancel checkout successfully (reservation and order)", async () => {
      // Arrange
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await reserveStock(app, authToken);
      await processCheckout(app, authToken);

      // Verificar que existen en BD
      const orderRepo = AppDataSource.getRepository(Order);
      const reservationRepo = AppDataSource.getRepository(StockReservation);

      const orderBefore = await orderRepo.findOne({
        where: { user: { id: testUser.id }, status: OrderStatus.PENDING },
      });
      const reservationBefore = await reservationRepo.findOne({
        where: { userId: testUser.id },
      });

      expect(orderBefore).toBeDefined();
      expect(reservationBefore).toBeDefined();

      // Act
      const cancelResponse = await cancelCheckout(app, authToken);

      // Assert
      expect(cancelResponse.status).toBe(200);
      expect(cancelResponse.body.success).toBe(true);
      expect(cancelResponse.body.message).toContain("cancelada");

      // Verificar limpieza en BD
      const orderAfter = await orderRepo.findOne({
        where: { id: orderBefore?.id },
      });
      const reservationAfter = await reservationRepo.findOne({
        where: { userId: testUser.id },
      });

      expect(orderAfter).toBeNull();
      expect(reservationAfter).toBeNull();
    });

    it("should fail if there is nothing to cancel", async () => {
      const cancelResponse = await cancelCheckout(app, authToken);

      validateErrorResponse(
        cancelResponse,
        404,
        "No tienes ninguna reserva o pedido pendiente para cancelar.",
        ErrorCodes.NOTHING_TO_CANCEL,
      );
    });
  });
});
