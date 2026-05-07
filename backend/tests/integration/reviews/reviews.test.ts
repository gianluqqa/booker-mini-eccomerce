import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { 
  getAllReviews, 
  createReview, 
  getReviewsByBook, 
  getUserReviews, 
  updateReview, 
  deleteReview
} from "../../helpers/reviewActions";
import { validateReviewContract, validateReviewListContract } from "../../helpers/reviewValidationHelpers";
import { Review } from "../../../src/entities/Review";
import { User } from "../../../src/entities/User";
import { Book } from "../../../src/entities/Book";

describe("Reviews - Módulo de Reseñas", () => {
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
    const reviewRepository = AppDataSource.getRepository(Review);
    const bookRepository = AppDataSource.getRepository(Book);
    const userRepository = AppDataSource.getRepository(User);
    const { ILike } = require("typeorm");

    try {
      // Limpieza profunda usando query builder
      await reviewRepository.createQueryBuilder().delete().execute();
      await userRepository.delete({ email: ILike("%@test.com") });
      await bookRepository.delete({ title: ILike("%Book%") });
    } catch (error) {
      // Silenciamos errores de limpieza
    }
  });

  beforeEach(async () => {
    // Setup: Crear usuario de prueba
    testUser = await createTestUser({
      email: `review_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Review",
      surname: "User"
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;


    // Setup: Crear libro de prueba
    testBook = await createTestBook({
      title: "Test Book for Reviews",
      author: "Test Author",
      price: 25.00,
      stock: 10
    });
  });

  describe("POST /api/reviews - Crear Reseña", () => {
    it("1. debe crear una reseña exitosamente (201)", async () => {
      const reviewData = {
        bookId: testBook.id,
        comment: "Excelente lectura, muy recomendado.",
        rating: 5,
        title: "Increíble"
      };

      const response = await createReview(app, authToken, reviewData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      validateReviewContract(response.body.data);
      expect(response.body.data.bookId).toBe(testBook.id);
      expect(response.body.data.rating).toBe(5);
    });

    it("2. debe retornar 401 si no se envía token", async () => {
      const response = await createReview(app, null, { bookId: testBook.id, rating: 5, comment: "test" });
      validateErrorResponse(response, 401, "No autorizado: se requiere un token de autenticación");
    });

    it("3. debe retornar 400 si la calificación no está entre 1 y 5", async () => {
      const response = await createReview(app, authToken, {
        bookId: testBook.id,
        rating: 6,
        comment: "test"
      });
      validateErrorResponse(response, 400, "La calificación debe estar entre 1 y 5");
    });

    it("4. debe retornar 400 si el usuario ya reseñó este libro", async () => {
      await createReview(app, authToken, { bookId: testBook.id, rating: 5, comment: "Primera" });
      
      const response = await createReview(app, authToken, { bookId: testBook.id, rating: 4, comment: "Segunda" });
      validateErrorResponse(response, 400, "Ya has reseñado este libro. Puedes editar tu reseña existente si deseas actualizarla.");
    });

    it("5. debe retornar 404 si el libro no existe", async () => {
      const response = await createReview(app, authToken, {
        bookId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        rating: 5,
        comment: "test"
      });
      validateErrorResponse(response, 404, "Libro no encontrado");
    });
  });

  describe("GET /api/reviews/book/:bookId - Listar Reseñas de Libro", () => {
    it("6. debe listar las reseñas de un libro con estructura de contrato completa", async () => {
      await createReview(app, authToken, { bookId: testBook.id, rating: 4, comment: "Muy bueno" });

      const response = await getReviewsByBook(app, testBook.id);
      
      expect(response.status).toBe(200);
      validateReviewListContract(response.body);
      expect(response.body.data.length).toBe(1);
      expect(response.body.summary.averageRating).toBe(4);
    });

    it("7. debe devolver una lista vacía si el libro no tiene reseñas", async () => {
      const response = await getReviewsByBook(app, testBook.id);
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.summary.averageRating).toBe(0);
    });
  });

  describe("PUT /api/reviews/:reviewId - Actualizar Reseña", () => {
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

  describe("DELETE /api/reviews/:reviewId - Eliminar Reseña", () => {
    it("10. debe eliminar una reseña propia exitosamente", async () => {
      const createRes = await createReview(app, authToken, { bookId: testBook.id, rating: 3, comment: "Bye" });
      const reviewId = createRes.body.data.id;

      const response = await deleteReview(app, authToken, reviewId);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const check = await getReviewsByBook(app, testBook.id);
      expect(check.body.data.length).toBe(0);
    });
  });

  describe("Security & Robustness", () => {
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
});
