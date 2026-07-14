import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { toggleFavorite } from "../../helpers/favoriteActions";
import { validateToggleFavoriteResponse } from "../../helpers/favoriteValidationHelpers";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Favorites Module - Toggle Favorite", () => {
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
      email: `favorite_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Favorite",
      surname: "User",
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Favorites",
      author: "Test Author",
      price: 25.0,
      stock: 10,
    });
  });

  describe("POST /users/:userId/favorites/:bookId", () => {
    it("should add book to favorites successfully (200)", async () => {
      const response = await toggleFavorite(
        app,
        authToken,
        testUser.id,
        testBook.id,
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      validateToggleFavoriteResponse(response.body);
      expect(response.body.data.isFavorite).toBe(true);
      expect(response.body.message).toBe("Libro agregado a favoritos");
    });

    it("should remove book from favorites successfully (200)", async () => {
      // Primero agregar a favoritos
      await toggleFavorite(app, authToken, testUser.id, testBook.id);

      // Luego quitar
      const response = await toggleFavorite(
        app,
        authToken,
        testUser.id,
        testBook.id,
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      validateToggleFavoriteResponse(response.body);
      expect(response.body.data.isFavorite).toBe(false);
      expect(response.body.message).toBe("Libro eliminado de favoritos");
    });

    it("should return 401 if no token is sent", async () => {
      const response = await toggleFavorite(
        app,
        null,
        testUser.id,
        testBook.id,
      );
      validateErrorResponse(
        response,
        401,
        "No autorizado: se requiere un token de autenticación",
      );
    });

    it("should return 403 if user tries to modify another user's favorites", async () => {
      const anotherUser = await createTestUser({
        email: `another_${Date.now()}@test.com`,
        name: "Another",
        surname: "User",
      });

      const response = await toggleFavorite(
        app,
        authToken,
        anotherUser.id,
        testBook.id,
      );
      validateErrorResponse(
        response,
        403,
        "Prohibido: Solo puedes modificar tus propios favoritos",
      );
    });

    it("should return 403 if userId does not match authenticated user (before checking existence)", async () => {
      const response = await toggleFavorite(
        app,
        authToken,
        "non-existent-id",
        testBook.id,
      );
      validateErrorResponse(
        response,
        403,
        "Prohibido: Solo puedes modificar tus propios favoritos",
      );
    });
  });
});
