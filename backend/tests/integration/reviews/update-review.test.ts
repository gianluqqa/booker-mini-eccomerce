import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { createReview, updateReview } from "../../helpers/reviewActions";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("PUT /api/reviews/:reviewId - Actualizar Reseña", () => {
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
      surname: "User"
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Reviews",
      author: "Test Author",
      price: 25.00,
      stock: 10
    });
  });

  it("8. debe actualizar una reseña propia exitosamente", async () => {
    const createRes = await createReview(app, authToken, { bookId: testBook.id, rating: 3, comment: "Original" });
    const reviewId = createRes.body.data.id;

    const response = await updateReview(app, authToken, reviewId, {
      rating: 5,
      comment: "Actualizado"
    });

    expect(response.status).toBe(200);
    expect(response.body.data.rating).toBe(5);
    expect(response.body.data.comment).toBe("Actualizado");
  });

  it("9. debe retornar 404/403 si intenta actualizar una reseña que no le pertenece", async () => {
    const createRes = await createReview(app, authToken, { bookId: testBook.id, rating: 3, comment: "Original" });
    const reviewId = createRes.body.data.id;

    // Otro usuario
    const otherUser = await createTestUser({ email: "other_reviewer@test.com" });
    const otherLogin = await loginUser(app, { email: otherUser.email });
    const otherToken = otherLogin.body.data.accessToken;

    const response = await updateReview(app, otherToken, reviewId, { rating: 1 });
    validateErrorResponse(response, 404, "Reseña no encontrada o no tienes permiso para editarla");
  });
});
