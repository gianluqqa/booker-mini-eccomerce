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

  // 🗑️ D. ENDPOINT: DELETE /carts/:cartId
  describe("DELETE /carts/:cartId - Eliminar Item", () => {

    it("34. debe eliminar un item específico exitosamente", async () => {
      // 1. Agregamos 
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const cartId = addResponse.body.data.id;

      // 2. Ejecutamos usando el nuevo helper
      const deleteResponse = await deleteCartItem(app, authToken, cartId);

      // 3. Validamos 
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe("Libro eliminado del carrito exitosamente");
    });


    it("35. debe retornar el ID del item eliminado en el data", async () => {
      // 1. Agregamos 
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const cartId = addResponse.body.data.id;

      // 2. Ejecutamos 
      const deleteResponse = await deleteCartItem(app, authToken, cartId);

      // 3. Validamos 
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe("Libro eliminado del carrito exitosamente");

      // 4.Verificar que el ID devuelto es el que borramos
      expect(deleteResponse.body.data.id).toBe(cartId);

    });

    it("36. debe rechazar si el item no existe", async () => {
      const nonExistentId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const deleteResponse = await deleteCartItem(app, authToken, nonExistentId);

      validateErrorResponse(deleteResponse, 404, "Item del carrito no encontrado");
    });

    it("37. debe rechazar si no pertenece al usuario autenticado", async () => {
      // 1. Creamos y logueamos al otro usuario con los nuevos helpers
      const wrongUser = await createTestUser({ email: `other${Date.now()}@test.com` });
      extraUsers.push(wrongUser);
      const loginRes = await loginUser(app, { email: wrongUser.email });
      const wrongToken = loginRes.body.data.accessToken;

      // 2. Agregamos el libro a SU carrito
      const addResponse = await addToCart(app, wrongToken, { bookId: testBook.id, quantity: 1 });
      const wrongCartId = addResponse.body.data.id;

      // 3. INTENTO DE BORRADO: Usamos el helper deleteCart con el token del usuario principal
      const wrongDeleteResponse = await deleteCartItem(app, authToken, wrongCartId);

      validateErrorResponse(wrongDeleteResponse, 404, "Item del carrito no encontrado");
    });

    it("38. debe rechazar si hay una orden pendiente", async () => {
      // 1. Agregar libro al carrito PRIMERO (antes de bloquearlo con la orden)
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const cartId = addResponse.body.data.id;

      // 2. Crear una orden pendiente para simular un checkout iniciado
      const orderRepository = AppDataSource.getRepository(Order);
      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 100.0,
      });
      await orderRepository.save(pendingOrder);

      const deleteResponse = await deleteCartItem(app, authToken, cartId)

      validateErrorResponse(deleteResponse, 409, "Ya tienes una orden pendiente en proceso");
    });

  });

  // 🧹 E. ENDPOINT: DELETE /carts/
  describe("DELETE /carts/ - Vaciar Carrito", () => {
    it("39. debe eliminar todos los items del carrito satisfactoriamente", async () => {

      const bookForClear2 = await createTestBook({ title: "Second Book", price: 15.00, stock: 5 });
      const bookForClear3 = await createTestBook({ title: "Third Book", price: 50.00, stock: 20 });
      extraBooks.push(bookForClear2, bookForClear3);

      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, { bookId: bookForClear2.id, quantity: 1 });
      await addToCart(app, authToken, { bookId: bookForClear3.id, quantity: 5 });

      const fullCartResponse = await getCart(app, authToken)

      validateFullCartContract(fullCartResponse.body.data)
      expect(fullCartResponse.body.data.items).toHaveLength(3)

      const clearCartResponse = await clearCart(app, authToken)

      expect(clearCartResponse.status).toBe(200)
      expect(clearCartResponse.body.success).toBe(true)
      expect(clearCartResponse.body.message).toBe("Carrito vaciado exitosamente")
    });

    it("40. debe informar la cantidad de items eliminados", async () => {


      const itemsDeleted2 = await createTestBook({ title: "Second Book", price: 15.00, stock: 5 });
      const itemsDeleted3 = await createTestBook({ title: "Third Book", price: 50.00, stock: 20 });
      extraBooks.push(itemsDeleted2, itemsDeleted3);

      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, { bookId: itemsDeleted2.id, quantity: 1 });
      await addToCart(app, authToken, { bookId: itemsDeleted3.id, quantity: 5 });

      const fullCartResponse = await getCart(app, authToken)

      validateFullCartContract(fullCartResponse.body.data)
      expect(fullCartResponse.body.data.items).toHaveLength(3)

      const clearCartResponse = await clearCart(app, authToken)

      expect(clearCartResponse.status).toBe(200)
      expect(clearCartResponse.body.success).toBe(true)
      expect(clearCartResponse.body.message).toBe("Carrito vaciado exitosamente")
      expect(clearCartResponse.body.data.count).toBe(3)

    });

    it("41. debe funcionar correctamente incluso si el carrito ya está vacío", async () => {
      // 1. El carrito ya está vacío por el beforeEach, así que disparamos el clear directamente
      const response = await clearCart(app, authToken);

      // 2. Validamos que la respuesta sea exitosa
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Carrito vaciado exitosamente");

      // 3. LA CLAVE: El conteo de items borrados debe ser 0
      expect(response.body.data.count).toBe(0);
    });

    it("42. debe rechazar el vaciado si hay una orden pendiente", async () => {
      // 1. Agregamos algo para que el carrito no esté vacío
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });

      // 2. Bloqueamos el carrito con una orden pendiente
      const orderRepository = AppDataSource.getRepository(Order);
      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 50.0,
      });
      await orderRepository.save(pendingOrder);

      // 3. Intentamos vaciar el carrito completo
      const response = await clearCart(app, authToken);

      validateErrorResponse(response, 409, "Ya tienes una orden pendiente en proceso");
    });

    it("43. debe dejar el carrito vacío al consultar con GET tras el vaciado", async () => {
      // 1. Llenamos el carrito
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });

      // 2. Vaciamos
      await clearCart(app, authToken);

      // 3. Verificamos con GET
      const getResponse = await getCart(app, authToken);

      expect(getResponse.status).toBe(200);
      validateFullCartContract(getResponse.body.data);
      expect(getResponse.body.data.items).toHaveLength(0);
      expect(getResponse.body.data.totalPrice).toBe(0);
    });

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
