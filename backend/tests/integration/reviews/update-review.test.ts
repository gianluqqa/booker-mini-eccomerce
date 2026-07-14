import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { createReview, updateReview } from "../../helpers/reviewActions";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Reviews Module - Update Review", () => {
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

  describe("PUT /api/reviews/:reviewId", () => {
    it("should update own review successfully", async () => {
      const createRes = await createReview(app, authToken, {
        bookId: testBook.id,
        rating: 3,
        comment: "Original",
      });
      const reviewId = createRes.body.data.id;

      const response = await updateReview(app, authToken, reviewId, {
        rating: 5,
        comment: "Actualizado",
      });

      expect(response.status).toBe(200);
      expect(response.body.data.rating).toBe(5);
      expect(response.body.data.comment).toBe("Actualizado");
    });

    it("should return 404/403 if trying to update review that does not belong to user", async () => {
      const createRes = await createReview(app, authToken, {
        bookId: testBook.id,
        rating: 3,
        comment: "Original",
      });
      const reviewId = createRes.body.data.id;

      // Otro usuario
      const otherUser = await createTestUser({
        email: "other_reviewer@test.com",
      });
      const otherLogin = await loginUser(app, { email: otherUser.email });
      const otherToken = otherLogin.body.data.accessToken;

      const response = await updateReview(app, otherToken, reviewId, {
        rating: 1,
      });
      validateErrorResponse(
        response,
        404,
        "Reseña no encontrada o no tienes permiso para editarla",
      );
    });
  });
});
