import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { User } from "../../../src/entities/User";
import { Book } from "../../../src/entities/Book";
import { Genre } from "../../../src/entities/Genre";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import {
  createBookAdmin,
  updateBookAdmin,
  deleteBookAdmin,
} from "../../helpers/adminActions";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Books Module - Administration", () => {
  let testUser: User;

  let authToken: string;

  let adminToken: string;

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
      surname: "User",
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    const adminUser = await createTestUser({
      email: `admin_books_${Date.now()}@test.com`,
      role: "admin",
    });
    const adminRes = await loginUser(app, { email: adminUser.email });
    adminToken = adminRes.body.data.accessToken;
  });

  describe("POST /books/", () => {
    it("should reject with 403 if normal user tries to create", async () => {
      const res = await createBookAdmin(app, authToken, {});
      validateErrorResponse(
        res,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should create a book for an administrator", async () => {
      const genreRepository = AppDataSource.getRepository(Genre);
      const genreName = `TestGenre_${Date.now()}`;
      await genreRepository.save(genreRepository.create({ name: genreName }));

      const bookData = {
        title: "Admin Created Book",
        author: "Admin Author",
        price: 15.99,
        stock: 50,
        genre: genreName,
        description: "A test book created by admin",
      };
      const res = await createBookAdmin(app, adminToken, bookData);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(bookData.title);
    });

    it("should reject with 403 if normal user tries to update", async () => {
      const book = await createTestBook({
        title: "To Update Book",
        price: 10,
        stock: 10,
      });
      const res = await updateBookAdmin(app, authToken, book.id, { price: 20 });
      validateErrorResponse(
        res,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should update a book for an administrator", async () => {
      const book = await createTestBook({
        title: "To Update Book",
        price: 10,
        stock: 10,
      });
      const res = await updateBookAdmin(app, adminToken, book.id, {
        price: 20.99,
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Number(res.body.data.price)).toBe(20.99);
    });

    it("should reject with 403 if normal user tries to delete", async () => {
      const book = await createTestBook({
        title: "To Delete Book",
        price: 10,
        stock: 10,
      });
      const res = await deleteBookAdmin(app, authToken, book.id);
      validateErrorResponse(
        res,
        403,
        "Prohibido: se requiere rol de administrador",
      );
    });

    it("should delete the book for an administrator", async () => {
      const book = await createTestBook({
        title: "To Delete Book Admin",
        price: 10,
        stock: 10,
      });
      const res = await deleteBookAdmin(app, adminToken, book.id);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(book.id);
    });
  });
});
