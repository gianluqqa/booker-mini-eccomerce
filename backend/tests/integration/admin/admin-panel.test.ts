import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { User } from "../../../src/entities/User";
import { Book } from "../../../src/entities/Book";
import { Review } from "../../../src/entities/Review";
import { Genre } from "../../../src/entities/Genre";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { getAllOrdersAdmin, cancelOrderAdmin } from "../../helpers/orderActions";
import {
  getAllUsersAdmin,
  getUserByIdAdmin,
  deleteUserAdmin,
  deleteAllUsersAdmin,
  getAllReviewsAdmin,
  deleteReviewAdmin,
  clearAllOrdersAdmin,
  clearCancelledOrdersAdmin,
  createBookAdmin,
  updateBookAdmin,
  deleteBookAdmin
} from "../../helpers/adminActions";
import { Order } from "../../../src/entities/Order";
import { OrderItem } from "../../../src/entities/OrderItem";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

describe("Admin Panel - Módulo de Administración", () => {
  let testUser: User;
  let authToken: string;

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
  });

  describe("Orders - Administración", () => {
    describe("GET /orders/admin/all - Administración: Listar Todo", () => {
      it("debe rechazar con 403 si un usuario normal intenta acceder", async () => {
        const normalUserAllOrdersResponse = await getAllOrdersAdmin(app, authToken);
        validateErrorResponse(normalUserAllOrdersResponse, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe listar todas las órdenes de todos los usuarios para un Admin", async () => {
        const orderRepository = AppDataSource.getRepository(Order);
        const orderItemRepository = AppDataSource.getRepository(OrderItem);

        const adminUser = await createTestUser({ email: `admin_${Date.now()}@test.com`, role: "admin" });
        const loginRes = await loginUser(app, { email: adminUser.email });
        const adminToken = loginRes.body.data.accessToken;

        const userA = await createTestUser({ email: `usera_${Date.now()}@test.com` });
        const userB = await createTestUser({ email: `userb_${Date.now()}@test.com` });
        const book = await createTestBook({ title: "Admin Test Book", stock: 10, price: 10 });

        const orderA = await orderRepository.save(orderRepository.create({ user: userA, status: OrderStatus.PAID, total: 10 }));
        await orderItemRepository.save(orderItemRepository.create({ order: orderA, book: book, quantity: 1, price: 10 }));

        const orderB = await orderRepository.save(orderRepository.create({ user: userB, status: OrderStatus.PENDING, total: 20 }));
        await orderItemRepository.save(orderItemRepository.create({ order: orderB, book: book, quantity: 2, price: 10 }));

        const allOrdersAdminResponse = await getAllOrdersAdmin(app, adminToken);

        expect(allOrdersAdminResponse.status).toBe(200);
        expect(allOrdersAdminResponse.body.success).toBe(true);
        expect(allOrdersAdminResponse.body.data.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe("PATCH /orders/admin/:id/cancel - Administración: Cancelación", () => {
      let adminToken: string;

      beforeEach(async () => {
        const adminUser = await createTestUser({ email: `admin_cancel_${Date.now()}@test.com`, role: "admin" });
        const loginRes = await loginUser(app, { email: adminUser.email });
        adminToken = loginRes.body.data.accessToken;
      });

      it("debe rechazar con 403 si un usuario normal intenta cancelar", async () => {
        const orderRepository = AppDataSource.getRepository(Order);
        const order = await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.PAID, total: 10 }));

        const normalUserCancelResponse = await cancelOrderAdmin(app, authToken, order.id);
        validateErrorResponse(normalUserCancelResponse, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe retornar 400 si la orden ya estaba CANCELLED", async () => {
        const orderRepository = AppDataSource.getRepository(Order);
        const order = await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.CANCELLED, total: 10 }));

        const res = await cancelOrderAdmin(app, adminToken, order.id);
        validateErrorResponse(res, 400, "Solo se pueden cancelar órdenes en estado PAID o PENDING");
      });

      it("debe cambiar a CANCELLED y restaurar stock si la orden era PENDING", async () => {
        const orderRepository = AppDataSource.getRepository(Order);
        const orderItemRepository = AppDataSource.getRepository(OrderItem);
        const bookRepository = AppDataSource.getRepository(Book);

        const book = await createTestBook({ title: "Stock Book", stock: 10, price: 10 });
        const order = await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.PENDING, total: 10 }));
        await orderItemRepository.save(orderItemRepository.create({ order: order, book: book, quantity: 3, price: 10 }));

        const res = await cancelOrderAdmin(app, adminToken, order.id);

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe(OrderStatus.CANCELLED);
      });
    });

    describe("DELETE /orders/admin/clear-all - Limpieza Masiva", () => {
      let adminToken: string;

      beforeEach(async () => {
        const adminUser = await createTestUser({ email: `admin_clear_${Date.now()}@test.com`, role: "admin" });
        const loginRes = await loginUser(app, { email: adminUser.email });
        adminToken = loginRes.body.data.accessToken;
      });

      it("debe rechazar con 403 si un usuario normal intenta limpiar órdenes", async () => {
        const res = await clearAllOrdersAdmin(app, authToken);
        validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe limpiar todas las órdenes para un administrador", async () => {
        const orderRepository = AppDataSource.getRepository(Order);
        await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.PAID, total: 10 }));

        const res = await clearAllOrdersAdmin(app, adminToken);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe("DELETE /orders/admin/clear-cancelled - Limpieza Canceladas", () => {
      let adminToken: string;

      beforeEach(async () => {
        const adminUser = await createTestUser({ email: `admin_clear_c_${Date.now()}@test.com`, role: "admin" });
        const loginRes = await loginUser(app, { email: adminUser.email });
        adminToken = loginRes.body.data.accessToken;
      });

      it("debe rechazar con 403 si un usuario normal intenta limpiar órdenes canceladas", async () => {
        const res = await clearCancelledOrdersAdmin(app, authToken);
        validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe limpiar todas las órdenes canceladas para un administrador", async () => {
        const orderRepository = AppDataSource.getRepository(Order);
        await orderRepository.save(orderRepository.create({ user: testUser, status: OrderStatus.CANCELLED, total: 10 }));

        const res = await clearCancelledOrdersAdmin(app, adminToken);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });
  });

  describe("Users - Administración", () => {
    let adminToken: string;

    beforeEach(async () => {
      const adminUser = await createTestUser({ email: `admin_users_${Date.now()}@test.com`, role: "admin" });
      const adminRes = await loginUser(app, { email: adminUser.email });
      adminToken = adminRes.body.data.accessToken;
    });

    describe("GET /users/ - Listar Usuarios", () => {
      it("debe rechazar con 403 si un usuario normal intenta acceder", async () => {
        const res = await getAllUsersAdmin(app, authToken);
        validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe retornar la lista de usuarios para un administrador", async () => {
        const res = await getAllUsersAdmin(app, adminToken);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
    });

    describe("GET /users/:id - Obtener Usuario por ID", () => {
      it("debe rechazar con 403 si un usuario normal intenta acceder", async () => {
        const res = await getUserByIdAdmin(app, authToken, testUser.id);
        validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe retornar el usuario solicitado para un administrador", async () => {
        const res = await getUserByIdAdmin(app, adminToken, testUser.id);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(testUser.id);
      });
    });

    describe("DELETE /users/:id - Eliminar Usuario", () => {
      it("debe rechazar con 403 si un usuario normal intenta eliminar", async () => {
        const res = await deleteUserAdmin(app, authToken, testUser.id);
        validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe eliminar el usuario y retornar 200", async () => {
        const userToDelete = await createTestUser({ email: `to_delete_${Date.now()}@test.com` });
        const res = await deleteUserAdmin(app, adminToken, userToDelete.id);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(userToDelete.id);
      });
    });

    describe("DELETE /users/ - Limpieza Masiva de Usuarios", () => {
      it("debe rechazar con 403 si un usuario normal intenta limpiar usuarios", async () => {
        const res = await deleteAllUsersAdmin(app, authToken);
        validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe eliminar todos los usuarios no administradores", async () => {
        await createTestUser({ email: `extra_user_${Date.now()}@test.com` });
        const res = await deleteAllUsersAdmin(app, adminToken);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.count).toBeDefined();
      });
    });
  });

  describe("Reviews - Administración", () => {
    let adminToken: string;
    let review: Review;
    let testBook: Book;

    beforeEach(async () => {
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

  describe("Books - Administración", () => {
    let adminToken: string;

    beforeEach(async () => {
      const adminUser = await createTestUser({ email: `admin_books_${Date.now()}@test.com`, role: "admin" });
      const adminRes = await loginUser(app, { email: adminUser.email });
      adminToken = adminRes.body.data.accessToken;
    });

    describe("POST /books/ - Crear Libro", () => {
      it("debe rechazar con 403 si un usuario normal intenta crear", async () => {
        const res = await createBookAdmin(app, authToken, {});
        validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe crear un libro para un administrador", async () => {
        const genreRepository = AppDataSource.getRepository(Genre);
        const genreName = `TestGenre_${Date.now()}`;
        await genreRepository.save(genreRepository.create({ name: genreName }));

        const bookData = {
          title: "Admin Created Book",
          author: "Admin Author",
          price: 15.99,
          stock: 50,
          genre: genreName,
          description: "A test book created by admin"
        };
        const res = await createBookAdmin(app, adminToken, bookData);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe(bookData.title);
      });
    });

    describe("PUT /books/:id - Actualizar Libro", () => {
      it("debe rechazar con 403 si un usuario normal intenta actualizar", async () => {
        const book = await createTestBook({ title: "To Update Book", price: 10, stock: 10 });
        const res = await updateBookAdmin(app, authToken, book.id, { price: 20 });
        validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe actualizar un libro para un administrador", async () => {
        const book = await createTestBook({ title: "To Update Book", price: 10, stock: 10 });
        const res = await updateBookAdmin(app, adminToken, book.id, { price: 20.99 });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Number(res.body.data.price)).toBe(20.99);
      });
    });

    describe("DELETE /books/:id - Eliminar Libro", () => {
      it("debe rechazar con 403 si un usuario normal intenta eliminar", async () => {
        const book = await createTestBook({ title: "To Delete Book", price: 10, stock: 10 });
        const res = await deleteBookAdmin(app, authToken, book.id);
        validateErrorResponse(res, 403, "Prohibido: se requiere rol de administrador");
      });

      it("debe eliminar el libro para un administrador", async () => {
        const book = await createTestBook({ title: "To Delete Book Admin", price: 10, stock: 10 });
        const res = await deleteBookAdmin(app, adminToken, book.id);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(book.id);
      });
    });
  });
});
