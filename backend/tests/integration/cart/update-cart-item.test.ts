import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart, getCart, updateCart } from "../../helpers/cartActions";
import {
  validateCartItemContract,
  validateFullCartContract,
} from "../../helpers/cartValidationHelpers";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Cart Module - Update Quantity", () => {
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
      email: `cart_user_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`,
      name: "Cart",
      surname: "User",
    });

    const loginResponse = await loginUser(app, { email: testUser.email });
    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Cart",
      author: "Test Author",
      price: 29.99,
      stock: 10,
    });
  });

  describe("PUT /carts/:cartId", () => {
    it("should increment quantity successfully", async () => {
      // 1. Agregamos un libro y CAPTURAMOS el ID que nos devuelva el backend
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const cartId = addResponse.body.data.id;

      // 2. Usamos el nuevo helper mandando ese ID real
      const updateResponse = await updateCart(app, authToken, cartId, 3);

      // 3. Validamos contrato y lógica
      expect(updateResponse.status).toBe(200);
      validateCartItemContract(updateResponse.body.data);
      expect(updateResponse.body.data.quantity).toBe(3);
    });

    it("should decrement quantity successfully", async () => {
      // 1. Agregamos un libro y CAPTURAMOS el ID que nos devuelva el backend
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 5,
      });
      const cartId = addResponse.body.data.id;

      // 2. Bajamos la cantidad a 3 el nuevo helper mandando ese ID real
      const updateResponse = await updateCart(app, authToken, cartId, 3);

      // 3. Validamos contrato y lógica
      expect(updateResponse.status).toBe(200);
      validateCartItemContract(updateResponse.body.data);
      expect(updateResponse.body.data.quantity).toBe(3);
    });

    it("should reject if cartId is invalid", async () => {
      const invalidCartId = "esto-no-es-un-uuid";

      const updateResponse = await updateCart(app, authToken, invalidCartId, 5);

      validateErrorResponse(updateResponse, 400, "Error de validación");

      expect(updateResponse.body.errors).toContain(
        "cartId debe ser un UUID válido",
      );
    });

    it("should reject if item does not exist or not owned by user", async () => {
      //No es necesario crear dos users ya que al principio del archivo ejecuto functiones que crea un usuario, añade un libro, etc.

      // ESCENARIO A: El item tiene formato válido pero no existe en la BD
      const nonExistentId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const responseNotFound = await updateCart(
        app,
        authToken,
        nonExistentId,
        5,
      );

      // Usamos tu helper de contrato de error
      validateErrorResponse(
        responseNotFound,
        404,
        "Item del carrito no encontrado",
      );

      // ESCENARIO B: El item existe pero le pertenece a otro usuario (Prueba de Seguridad)
      // 1. Creamos otro usuario rápido con tu helper
      const otherUser = await createTestUser({
        email: `other${Date.now()}@test.com`,
      });

      // 2. Necesitamos el token de ese otro usuario para que pueda agregar algo a su carrito
      // (Aquí usamos el login para obtener su authToken)
      const loginRes = await request(app).post("/users/login").send({
        email: otherUser.email,
        password: "Password123!",
      });
      const otherToken = loginRes.body.data.accessToken;

      // 3. Ese otro usuario agrega un libro y obtenemos SU cartId
      const addResponse = await addToCart(app, otherToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const otherCartId = addResponse.body.data.id;

      // 4. EL TEST CLAVE: Intentamos actualizar con el TOKEN del usuario principal (authToken)
      // el item que le pertenece al otro (otherCartId)
      const hackResponse = await updateCart(app, authToken, otherCartId, 10);

      // 5. Según tu contrato, debe dar 404 "no encontrado" para proteger la privacidad
      validateErrorResponse(
        hackResponse,
        404,
        "Item del carrito no encontrado",
      );
    });

    it("28. debe rechazar si la nueva cantidad supera el stock", async () => {
      // 1. Agregamos un libro y CAPTURAMOS el ID que nos devuelva el backend
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const cartId = addResponse.body.data.id;

      // 2. Intentamos subir a una cantidad mayor al stock (testBook.stock es 10)
      const updateResponse = await updateCart(app, authToken, cartId, 11);

      // 3. Validamos que rechace con 409 según el contrato
      validateErrorResponse(
        updateResponse,
        409,
        "Stock insuficiente para el libro solicitado",
      );
    });

    it("29. debe rechazar si la cantidad es 0 o negativa", async () => {
      // 1. Usamos el 'testBook' que ya existe y lo añadimos al carrito
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 5,
      });
      const cartId = addResponse.body.data.id;

      // 2. Intentamos actualizar a 0 y a un número negativo
      const responseZero = await updateCart(app, authToken, cartId, 0);
      const responseNegative = await updateCart(app, authToken, cartId, -5);

      // 3. Validamos rechazo de cantidad 0
      validateErrorResponse(responseZero, 400, "Error de validación");
      expect(responseZero.body.errors).toContain(
        "La cantidad debe ser un número entero positivo",
      );

      // 4. Validamos rechazo de cantidad negativa
      validateErrorResponse(responseNegative, 400, "Error de validación");
      expect(responseNegative.body.errors).toContain(
        "La cantidad debe ser un número entero positivo",
      );
    });

    it("30. debe rechazar si hay una orden pendiente", async () => {
      // 1. Primero agregamos el libro (mientras el carrito está libre, osea hay que llenar el cart de algo para poder rechazar otra orden)
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const cartId = addResponse.body.data.id;

      // 2. Ahora creamos la orden pendiente para BLOQUEAR el carrito
      const orderRepository = AppDataSource.getRepository(Order);
      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 100.0,
      });
      await orderRepository.save(pendingOrder); // la guardamos en la base de datos del user.

      // 3. INTENTO DE ACTUALIZACIÓN (PUT): Aquí es donde el test se vuelve diferente al 12
      const updateResponse = await updateCart(app, authToken, cartId, 5);

      // 4. Validamos que el bloqueo funcione para el PUT también
      validateErrorResponse(
        updateResponse,
        409,
        "Ya tienes una orden pendiente en proceso",
      );
    });

    it("31. debe confirmar la actualización con un mensaje de éxito", async () => {
      const addRes = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const cartId = addRes.body.data.id;

      const updateRes = await updateCart(app, authToken, cartId, 3);

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.message).toBe(
        "Item del carrito actualizado exitosamente",
      );
    });

    it("32. debe actualizar el precio total del carrito tras el cambio", async () => {
      // 1. Agregamos el libro (1 unidad = 29.99)
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const cartId = addResponse.body.data.id; // ID del Item del Carrito.

      // 2. Actualizamos a 3 unidades (Total debería ser 29.99 * 3 = 89.97)
      const updateResponse = await updateCart(app, authToken, cartId, 3);

      // 3. Validamos el contrato del ITEM (lo que devuelve el PUT)
      // Usamos validateCartItemContract porque el PUT devuelve UN item, no el carrito.
      validateCartItemContract(updateResponse.body.data);

      // 4. LLAVE DEL TEST: Obtenemos el carrito completo para ver el total calculado
      const cartRes = await getCart(app, authToken);
      validateFullCartContract(cartRes.body.data);

      // 5. Verificamos la matemática
      const expectedTotal = Number((testBook.price * 3).toFixed(2));
      expect(cartRes.body.data.totalPrice).toBe(expectedTotal);
    });

    it("33. debe retornar 401 si no hay autenticación", async () => {
      const addResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1,
      });
      const cartId = addResponse.body.data.id; // ID del Item del Carrito.

      const updateResponse = await updateCart(app, null, cartId, 3);

      validateErrorResponse(
        updateResponse,
        401,
        "No autorizado: se requiere un token de autenticación",
      );
    });
  });
});
