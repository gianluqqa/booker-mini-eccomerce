import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart, getCart, updateCart, deleteCartItem, clearCart } from "../../helpers/cartActions";
import { validateCartItemContract, validateFullCartContract } from "../../helpers/cartValidationHelpers";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import { User } from "../../../src/entities/User";
import { Book } from "../../../src/entities/Book";
import { initializeTestDb, closeTestDb, clearDatabase } from "../../helpers/dbHelpers";

/**
 * ================================================================================================
 * 🚀 GUÍA DE ARQUITECTURA DE PRUEBAS - "ESTADO GLOBAL AUTOMÁTICO"
 * ================================================================================================
 * IMPORTANTE: No necesitas repetir el flujo de creación de usuario o libro en cada test.
 * Gracias al bloque 'beforeEach' (línea 46), cada vez que comienza un test ("it"), 
 * el sistema ejecuta automáticamente lo siguiente por ti:
 *
 * 1️⃣  USUARIO FRESCO (testUser): Se crea un usuario único en la base de datos.
 * 2️⃣  LOGIN EXITOSO (authToken): Se obtiene el token de acceso para ese usuario. 
 *     Usa 'authToken' como segundo argumento en tus helpers (addToCart, getCart, etc).
 * 3️⃣  LIBRO DISPONIBLE (testBook): Se crea un libro con Title: "Test Book...", Price: 29.99 
 *     y STOCK: 10. ¡Ideal para pruebas de stock!
 * 4️⃣  AISLAMIENTO TOTAL: La base de datos es independiente para cada test. Lo que hagas 
 *     en un "it" no afecta al siguiente.
 *
 * 💡 REGLA DE ORO: 
 * Solo crea un nuevo usuario o libro manualmente SI tu prueba requiere comparar 
 * dos entidades distintas (ej. el Test 27 de seguridad).
 * ================================================================================================
 */

describe("Cart - Carrito de Compras", () => {

  let testUser: any;
  let authToken: string;
  let testBook: any;
  let extraUsers: any[] = [];
  let extraBooks: any[] = [];

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
    // Escenario inicial: Usuario y Libro listos
    testUser = await createTestUser({
      email: `cart_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Cart",
      surname: "User"
    });

    const loginResponse = await loginUser(app, { email: testUser.email });

    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Cart",
      author: "Test Author",
      price: 29.99,
      stock: 10
    });

    // Resetear colectores
    extraUsers = [];
    extraBooks = [];
  });

  // 🔄 F. INTEGRACIÓN Y LÓGICA COMPLEJA
  describe("Casos de Integración y Lógica Compleja", () => {
    it("44. debe mantener el carrito separado entre distintos usuarios (Aislamiento)", async () => {
      // 1. Creamos un segundo usuario (acabará siendo borrado por el afterEach gracias al @test.com)
      const userB = await createTestUser({ email: `userB_${Date.now()}@test.com` });

      const loginB = await loginUser(app, { email: userB.email });
      const tokenB = loginB.body.data.accessToken;

      // 2. Usuario A (el del beforeEach) agrega un libro
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });

      // 3. Usuario B consulta su carrito. Debería estar vacío.
      const cartB = await getCart(app, tokenB);
      expect(cartB.body.data.items).toHaveLength(0);
      expect(cartB.body.data.totalPrice).toBe(0);
    });

    it("45. debe validar stock dinámicamente si el stock del libro cambia externamente", async () => {
      const addRes = await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });
      const cartId = addRes.body.data.id;

      // Simulamos que el stock baja en la DB por otra compra
      await AppDataSource.getRepository(Book).update(testBook.id, { stock: 2 });

      // Intentar actualizar la cantidad por encima del nuevo stock real
      const updateRes = await updateCart(app, authToken, cartId, 3);
      validateErrorResponse(updateRes, 409, "Stock insuficiente para el libro solicitado");
    });

    it("46. debe manejar correctamente cambios de precio en el catálogo", async () => {
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });

      // Cambiamos el precio en el catálogo
      await AppDataSource.getRepository(Book).update(testBook.id, { price: 99.99 });

      const cartRes = await getCart(app, authToken);
      expect(Number(cartRes.body.data.items[0].book.price)).toBe(99.99);
      expect(cartRes.body.data.totalPrice).toBe(99.99);
    });

    it("47. debe persistir el carrito tras un cierre de sesión y nuevo login", async () => {
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });

      // Nuevo login del mismo usuario
      const reLogin = await loginUser(app, { email: testUser.email });
      const newToken = reLogin.body.data.accessToken;

      const cartRes = await getCart(app, newToken);
      expect(cartRes.body.data.items).toHaveLength(1);
      expect(cartRes.body.data.items[0].quantity).toBe(2);
    });

    it("48. debe rechazar cualquier modificación (ADD, PUT, DELETE) si hay orden pendiente", async () => {
      // 1. Preparar un item y una orden
      const addRes = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const cartId = addRes.body.data.id;

      await AppDataSource.getRepository(Order).save({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 10
      });

      // Intentar las 3 operaciones principales
      const resPost = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const resPut = await updateCart(app, authToken, cartId, 2);
      const resDel = await deleteCartItem(app, authToken, cartId);

      validateErrorResponse(resPost, 409, "Ya tienes una orden pendiente en proceso");
      validateErrorResponse(resPut, 409, "Ya tienes una orden pendiente en proceso");
      validateErrorResponse(resDel, 409, "Ya tienes una orden pendiente en proceso");
    });

    it("49. debe permitir re-agregar un libro después de haber vaciado el carrito", async () => {
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 3 });
      await clearCart(app, authToken);

      const addAgain = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      expect([200, 201]).toContain(addAgain.status);
      expect(addAgain.body.data.quantity).toBe(1);
    });

    it("50. debe garantizar que el total del carrito sea la suma de subtotales válida", async () => {
      const book2 = await createTestBook({ title: "Math Book", price: 10.50, stock: 100 });
      // testBook vale 29.99

      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 }); // 59.98
      await addToCart(app, authToken, { bookId: book2.id, quantity: 3 });    // 31.50

      const cartRes = await getCart(app, authToken);
      // 59.98 + 31.50 = 91.48
      expect(cartRes.body.data.totalPrice).toBe(91.48);
    });
  });
});
