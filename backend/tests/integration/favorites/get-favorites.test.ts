import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import {
  toggleFavorite,
  getUserFavorites,
} from "../../helpers/favoriteActions";
import {
  validateBookContract,
  validateFavoriteListContract,
} from "../../helpers/favoriteValidationHelpers";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Favorites Module - Get Favorites", () => {
  let testUser: any;

  let authToken: string;

  let testBook: any;

  let testBook2: any;

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

    testBook2 = await createTestBook({
      title: "Another Test Book",
      author: "Another Author",
      price: 30.0,
      stock: 5,
    });
  });

  describe("GET /users/:userId/favorites", () => {
    it("should get empty favorites list (200)", async () => {
      const response = await getUserFavorites(app, authToken, testUser.id);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      validateFavoriteListContract(response.body);
      expect(response.body.data).toEqual([]);
    });

    it("should get favorites list with books (200)", async () => {
      // Agregar libros a favoritos
      await toggleFavorite(app, authToken, testUser.id, testBook.id);
      await toggleFavorite(app, authToken, testUser.id, testBook2.id);

      const response = await getUserFavorites(app, authToken, testUser.id);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      validateFavoriteListContract(response.body);
      expect(response.body.data.length).toBe(2);

      // Validar que cada libro tenga el contrato correcto
      response.body.data.forEach((book: any) => {
        validateBookContract(book);
      });
    });

    it("should return 401 if no token is sent", async () => {
      const response = await getUserFavorites(app, null, testUser.id);
      validateErrorResponse(
        response,
        401,
        "No autorizado: se requiere un token de autenticación",
      );
    });

    it("should return 403 if user tries to view another user's favorites", async () => {
      const anotherUser = await createTestUser({
        email: `another_${Date.now()}@test.com`,
        name: "Another",
        surname: "User",
      });

      const response = await getUserFavorites(app, authToken, anotherUser.id);
      validateErrorResponse(
        response,
        403,
        "Prohibido: Solo puedes ver tus propios favoritos",
      );
    });

    it("should return 403 if userId does not match authenticated user (before checking existence)", async () => {
      const response = await getUserFavorites(
        app,
        authToken,
        "non-existent-id",
      );
      validateErrorResponse(
        response,
        403,
        "Prohibido: Solo puedes ver tus propios favoritos",
      );
    });

    it("should correctly reflect favorites after adding and removing", async () => {
      // Verificar lista vacía
      let response = await getUserFavorites(app, authToken, testUser.id);
      expect(response.body.data.length).toBe(0);

      // Agregar primer libro
      await toggleFavorite(app, authToken, testUser.id, testBook.id);
      response = await getUserFavorites(app, authToken, testUser.id);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(testBook.id);

      // Agregar segundo libro
      await toggleFavorite(app, authToken, testUser.id, testBook2.id);
      response = await getUserFavorites(app, authToken, testUser.id);
      expect(response.body.data.length).toBe(2);

      // Quitar primer libro
      await toggleFavorite(app, authToken, testUser.id, testBook.id);
      response = await getUserFavorites(app, authToken, testUser.id);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(testBook2.id);

      // Quitar segundo libro
      await toggleFavorite(app, authToken, testUser.id, testBook2.id);
      response = await getUserFavorites(app, authToken, testUser.id);
      expect(response.body.data.length).toBe(0);
    });
  });
});
