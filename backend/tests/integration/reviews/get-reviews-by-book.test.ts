import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { createReview, getReviewsByBook } from "../../helpers/reviewActions";
import { validateReviewListContract } from "../../helpers/reviewValidationHelpers";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("GET /api/reviews/book/:bookId - Listar Reseñas de Libro", () => {
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
