import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { createReview, deleteReview, getReviewsByBook } from "../../helpers/reviewActions";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("DELETE /api/reviews/:reviewId - Eliminar Reseña", () => {
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

  it("10. debe eliminar una reseña propia exitosamente", async () => {
    const createRes = await createReview(app, authToken, { bookId: testBook.id, rating: 3, comment: "Bye" });
    const reviewId = createRes.body.data.id;

    const response = await deleteReview(app, authToken, reviewId);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const check = await getReviewsByBook(app, testBook.id);
    expect(check.body.data.length).toBe(0);
  });

  it("11. (IDOR): debe retornar 404/403 al intentar eliminar una reseña de otro usuario", async () => {
    // Usuario A crea reseña
    const createRes = await createReview(app, authToken, { bookId: testBook.id, rating: 5, comment: "Original" });
    const reviewId = createRes.body.data.id;

    // Usuario B intenta eliminarla
    const otherUser = await createTestUser({ email: `other_hacker_${Date.now()}@test.com` });
    const otherLogin = await loginUser(app, { email: otherUser.email });
    const otherToken = otherLogin.body.data.accessToken;

    const response = await deleteReview(app, otherToken, reviewId);
    validateErrorResponse(response, 404, "Reseña no encontrada o no tienes permiso para eliminarla");
  });

  it("12. (XSS): debe persistir y devolver comentarios con scripts sin ejecutarlos (Sanitización básica)", async () => {
    const maliciousComment = "<script>alert('xss')</script> Muy buen libro!";
    const response = await createReview(app, authToken, {
      bookId: testBook.id,
      rating: 5,
      comment: maliciousComment
    });

    expect(response.status).toBe(201);
    expect(response.body.data.comment).toBe(maliciousComment);
  });

  it("13. (Robustness): debe retornar error controlado al enviar un UUID inválido en la URL", async () => {
    const response = await deleteReview(app, authToken, "not-a-valid-uuid");
    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.body.success).toBe(false);
  });

  it("14. (Data Integrity): debe manejar correctamente comentarios con caracteres especiales (SQLi test)", async () => {
    const sqliComment = "'; DROP TABLE reviews; --";
    const response = await createReview(app, authToken, {
      bookId: testBook.id,
      rating: 1,
      comment: sqliComment
    });

    expect(response.status).toBe(201);
    expect(response.body.data.comment).toBe(sqliComment);
  });
});
