import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { createReview } from "../../helpers/reviewActions";
import { validateReviewContract } from "../../helpers/reviewValidationHelpers";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Reviews Module - Create Review", () => {
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
      email: `review_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Review",
      surname: "User",
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Reviews",
      author: "Test Author",
      price: 25.0,
      stock: 10,
    });
  });

  describe("POST /api/reviews", () => {
    it("should create review successfully (201)", async () => {
      const reviewData = {
        bookId: testBook.id,
        comment: "Excelente lectura, muy recomendado.",
        rating: 5,
        title: "Increíble",
      };

      const response = await createReview(app, authToken, reviewData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      validateReviewContract(response.body.data);
      expect(response.body.data.bookId).toBe(testBook.id);
      expect(response.body.data.rating).toBe(5);
    });

    it("should return 401 if no token is sent", async () => {
      const response = await createReview(app, null, {
        bookId: testBook.id,
        rating: 5,
        comment: "test",
      });
      validateErrorResponse(
        response,
        401,
        "No autorizado: se requiere un token de autenticación",
      );
    });

    it("should return 400 if rating is not between 1 and 5", async () => {
      const response = await createReview(app, authToken, {
        bookId: testBook.id,
        rating: 6,
        comment: "test",
      });
      validateErrorResponse(
        response,
        400,
        "La calificación debe estar entre 1 y 5",
      );
    });

    it("should return 400 if user already reviewed this book", async () => {
      await createReview(app, authToken, {
        bookId: testBook.id,
        rating: 5,
        comment: "Primera",
      });

      const response = await createReview(app, authToken, {
        bookId: testBook.id,
        rating: 4,
        comment: "Segunda",
      });
      validateErrorResponse(
        response,
        400,
        "Ya has reseñado este libro. Puedes editar tu reseña existente si deseas actualizarla.",
      );
    });

    it("should return 404 if book does not exist", async () => {
      const response = await createReview(app, authToken, {
        bookId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        rating: 5,
        comment: "test",
      });
      validateErrorResponse(response, 404, "Libro no encontrado");
    });
  });
});
