import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import {
  toggleFavorite,
  getUserFavorites
} from "../../helpers/favoriteActions";
import {
  validateBookContract,
  validateFavoriteListContract,
  validateToggleFavoriteResponse
} from "../../helpers/favoriteValidationHelpers";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("Favorites - Módulo de Favoritos", () => {
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
    // Setup: Crear usuario de prueba
    testUser = await createTestUser({
      email: `favorite_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Favorite",
      surname: "User"
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    // Setup: Crear libros de prueba
    testBook = await createTestBook({
      title: "Test Book for Favorites",
      author: "Test Author",
      price: 25.00,
      stock: 10
    });

    testBook2 = await createTestBook({
      title: "Another Test Book",
      author: "Another Author",
      price: 30.00,
      stock: 5
    });
  });

  describe("POST /users/:userId/favorites/:bookId - Toggle Favorito", () => {
    it("1. debe agregar un libro a favoritos exitosamente (200)", async () => {
      const response = await toggleFavorite(app, authToken, testUser.id, testBook.id);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      validateToggleFavoriteResponse(response.body);
      expect(response.body.data.isFavorite).toBe(true);
      expect(response.body.message).toBe("Libro agregado a favoritos");
    });

    it("2. debe quitar un libro de favoritos exitosamente (200)", async () => {
      // Primero agregar a favoritos
      await toggleFavorite(app, authToken, testUser.id, testBook.id);

      // Luego quitar
      const response = await toggleFavorite(app, authToken, testUser.id, testBook.id);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      validateToggleFavoriteResponse(response.body);
      expect(response.body.data.isFavorite).toBe(false);
      expect(response.body.message).toBe("Libro eliminado de favoritos");
    });

    it("3. debe retornar 401 si no se envía token", async () => {
      const response = await toggleFavorite(app, null, testUser.id, testBook.id);
      validateErrorResponse(response, 401, "No autorizado: se requiere un token de autenticación");
    });

    it("4. debe retornar 403 si un usuario intenta modificar favoritos de otro usuario", async () => {
      const anotherUser = await createTestUser({
        email: `another_${Date.now()}@test.com`,
        name: "Another",
        surname: "User"
      });

      const response = await toggleFavorite(app, authToken, anotherUser.id, testBook.id);
      validateErrorResponse(response, 403, "Prohibido: Solo puedes modificar tus propios favoritos");
    });

    it("5. debe retornar 403 si el userId no coincide con el usuario autenticado (antes de verificar existencia)", async () => {
      const response = await toggleFavorite(app, authToken, "non-existent-id", testBook.id);
      validateErrorResponse(response, 403, "Prohibido: Solo puedes modificar tus propios favoritos");
    });
  });

  describe("GET /users/:userId/favorites - Obtener Favoritos", () => {
    it("1. debe obtener la lista de favoritos vacía (200)", async () => {
      const response = await getUserFavorites(app, authToken, testUser.id);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      validateFavoriteListContract(response.body);
      expect(response.body.data).toEqual([]);
    });

    it("2. debe obtener la lista de favoritos con libros (200)", async () => {
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

    it("3. debe retornar 401 si no se envía token", async () => {
      const response = await getUserFavorites(app, null, testUser.id);
      validateErrorResponse(response, 401, "No autorizado: se requiere un token de autenticación");
    });

    it("4. debe retornar 403 si un usuario intenta ver favoritos de otro usuario", async () => {
      const anotherUser = await createTestUser({
        email: `another_${Date.now()}@test.com`,
        name: "Another",
        surname: "User"
      });

      const response = await getUserFavorites(app, authToken, anotherUser.id);
      validateErrorResponse(response, 403, "Prohibido: Solo puedes ver tus propios favoritos");
    });

    it("5. debe retornar 403 si el userId no coincide con el usuario autenticado (antes de verificar existencia)", async () => {
      const response = await getUserFavorites(app, authToken, "non-existent-id");
      validateErrorResponse(response, 403, "Prohibido: Solo puedes ver tus propios favoritos");
    });

    it("6. debe reflejar correctamente los favoritos después de agregar y quitar", async () => {
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
