import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { User } from "../../../src/entities/User";
import { Book } from "../../../src/entities/Book";
import { Review } from "../../../src/entities/Review";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { getAllReviewsAdmin, deleteReviewAdmin } from "../../helpers/adminActions";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("Admin Panel - Reviews - Administración", () => {
  let testUser: User;
  let authToken: string;
  let adminToken: string;
  let review: Review;
  let testBook: Book;

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
      email: `admin_panel_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Normal",
      surname: "User"
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    const adminUser = await createTestUser({ email: `admin_reviews_${Date.now()}@test.com`, role: "admin" });
    const adminRes = await loginUser(app, { email: adminUser.email });
    adminToken = adminRes.body.data.accessToken;

    testBook = await createTestBook({ title: "Admin Review Book", price: 10, stock: 10 });
    const reviewRepository = AppDataSource.getRepository(Review);
    review = await reviewRepository.save(reviewRepository.create({
      user: testUser,
      book: testBook,
      comment: "Comentario para borrar",
      rating: 1,
      title: "Mal libro",
      bookId: testBook.id,
      userId: testUser.id
    }));
  });

  describe("GET /reviews/admin/all - Listar todas las Reseñas", () => {
    it("debe rechazar con 403 si un usuario normal intenta acceder", async () => {
      const res = await getAllReviewsAdmin(app, authToken);
      validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
    });

    it("debe retornar la lista de reseñas con metadatos para un administrador", async () => {
      const res = await getAllReviewsAdmin(app, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    });

    it("debe permitir filtrar reseñas por título de libro", async () => {
      const res = await getAllReviewsAdmin(app, adminToken, { book: "Admin Review" });
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].book.title).toContain("Admin Review");
    });
  });

  describe("DELETE /reviews/admin/:reviewId - Eliminar Reseña", () => {
    it("debe rechazar con 403 si un usuario normal intenta eliminar", async () => {
      const res = await deleteReviewAdmin(app, authToken, review.id);
      validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
    });

    it("debe eliminar cualquier reseña y retornar 200", async () => {
      const res = await deleteReviewAdmin(app, adminToken, review.id);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Reseña eliminada exitosamente");

      // Verificar que ya no existe
      const reviewRepository = AppDataSource.getRepository(Review);
      const deletedReview = await reviewRepository.findOne({ where: { id: review.id } });
      expect(deletedReview).toBeNull();
    });
  });
});
