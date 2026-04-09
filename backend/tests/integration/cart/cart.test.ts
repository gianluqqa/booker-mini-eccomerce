import request from "supertest";
import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/createTestUser";
import { createTestBook } from "../../helpers/createTestBook";
import { addToCart } from "../../helpers/addToCart";
import { getCart } from "../../helpers/getCart";
import { updateCart } from "../../helpers/updateCart";
import { deleteCartItem } from "../../helpers/deleteCartItem";
import { clearCart } from "../../helpers/clearCart";
import { loginUser } from "../../helpers/loginUser";
import { validateCartItemContract, validateFullCartContract, validateErrorResponse } from "../../helpers/cartValidationHelpers";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";

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

  beforeEach(async () => {
    // Escenario inicial: Usuario y Libro listos
    testUser = await createTestUser({
      email: `cart_user_${Date.now()}@test.com`,
      name: "Cart",
      surname: "User"
    });

    const loginResponse = await request(app)
      .post("/users/login")
      .send({
        email: testUser.email,
        password: "Password123!"
      });

    authToken = loginResponse.body.data.accessToken;

    testBook = await createTestBook({
      title: "Test Book for Cart",
      author: "Test Author",
      price: 29.99,
      stock: 10
    });
  });

  // 📦 A. ENDPOINT: POST /carts/add
  describe("POST /carts/add - Agregar al Carrito", () => {
    it("1. debe agregar libro al carrito exitosamente", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 2
      });


      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      validateCartItemContract(addToCartResponse.body.data); // 🛡️ Validación de Contrato
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
      expect(addToCartResponse.body.data.quantity).toBe(2);
    });

    it("2. debe agregar libro sin cantidad (usa defecto = 1)", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id
      });


      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      validateCartItemContract(addToCartResponse.body.data); // 🛡️ Validación de Contrato
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);
      expect(addToCartResponse.body.data.quantity).toBe(1);

    });

    it("3. debe acumular cantidad si libro ya existe en carrito", async () => {
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });

      const addToCartResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });


      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      validateCartItemContract(addToCartResponse.body.data); // 🛡️ Validación de Contrato
      expect(addToCartResponse.body.data.quantity).toBe(3);

    });

    it("4. debe rechazar agregar sin autenticación (401)", async () => {
      const addToCartResponse = await addToCart(app, null, {
        bookId: testBook.id,
        quantity: 1
      });

      validateErrorResponse(addToCartResponse, 401, "No autorizado: se requiere un token de autenticación");
    });


    it("5. debe rechazar agregar libro con token invalido", async () => {
      const addToCartResponse = await addToCart(app, "invalid-token", {
        bookId: testBook.id,
        quantity: 1
      });

      validateErrorResponse(addToCartResponse, 401, "No autorizado: token inválido o expirado");
    });


    it("6. debe rechazar si falta el bookId", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        quantity: 1
      });

      validateErrorResponse(addToCartResponse, 400, "Error de validación");
      expect(addToCartResponse.body.errors).toContain("bookId es requerido");
    });


    it("7. debe rechazar si el bookId no es un UUID válido", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: "invalid-uuid",
        quantity: 1
      });

      validateErrorResponse(addToCartResponse, 400, "Error de validación");
      expect(addToCartResponse.body.errors).toContain("bookId debe ser un UUID válido");
    });


    it("8. debe rechazar si el libro no existe en la base de datos", async () => {
      const nonExistentId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: nonExistentId,
        quantity: 1
      });

      validateErrorResponse(addToCartResponse, 404, "Libro no encontrado");
    });



    it("9. debe rechazar si la cantidad de un libro es menor a 1", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 0
      });

      validateErrorResponse(addToCartResponse, 400, "Error de validación");
      expect(addToCartResponse.body.errors).toContain("La cantidad debe ser un número entero positivo");
    });


    it("10. debe rechazar si la cantidad no es un número entero", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1.5
      });

      validateErrorResponse(addToCartResponse, 400, "Error de validación");
      expect(addToCartResponse.body.errors).toContain("La cantidad debe ser un número entero positivo");
    });


    it("11. debe rechazar si la cantidad supera el stock disponible", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 65
      });

      validateErrorResponse(addToCartResponse, 409, "Stock insuficiente para el libro solicitado");
    });


    it("12. debe rechazar si el usuario tiene una orden pendiente", async () => {
      // 1. Crear una orden pendiente para este usuario en la BD antes de la petición
      const orderRepository = AppDataSource.getRepository(Order);
      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 100.0,
      });
      await orderRepository.save(pendingOrder);

      // 2. Intentar agregar al carrito
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1
      });

      validateErrorResponse(addToCartResponse, 409, "Tienes una orden pendiente en proceso");
      expect(addToCartResponse.body.data).toHaveProperty("id", pendingOrder.id);
    });


    it("13. debe permitir agregar un libro que tiene stock exacto disponible", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 10
      });


      expect(addToCartResponse.status).toBe(200);
      expect(addToCartResponse.body.success).toBe(true);
      expect(addToCartResponse.body.data.book.id).toBe(testBook.id);// ✅ Comprobamos que el ID del libro dentro del data sea el correcto
      expect(addToCartResponse.body.data.quantity).toBe(10);      // ✅ Comprobamos la cantidad

    });


    it("14. debe devolver la estructura del libro completa dentro del data", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1
      });

      expect(addToCartResponse.body.data.book).toHaveProperty("id", testBook.id);
      expect(addToCartResponse.body.data.book).toHaveProperty("title", testBook.title);
      expect(addToCartResponse.body.data.book).toHaveProperty("price", testBook.price);
    });



    it("15. debe generar un ID único para el item del carrito", async () => {
      const addToCartResponse = await addToCart(app, authToken, {
        bookId: testBook.id,
        quantity: 1
      });

      expect(addToCartResponse.body.data.id).toBeDefined();
      expect(addToCartResponse.body.data.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i); // ✅ Comprobamos que el ID del item del carrito sea un UUID válido
    });

  });

  // 📋 B. ENDPOINT: GET /carts/

  describe("GET /carts/ - Obtener Carrito", () => {

    it("16. debe retornar un carrito vacío para usuarios sin items", async () => {
      const getCartResponse = await getCart(app, authToken);


      expect(getCartResponse.status).toBe(200);
      expect(getCartResponse.body.success).toBe(true);
      validateFullCartContract(getCartResponse.body.data); // 🛡️ Validación de Contrato
      expect(getCartResponse.body.data).toHaveProperty("items");
      expect(getCartResponse.body.data.items).toEqual([]);
    });

    it("17. debe listar todos los items agregados previamente", async () => {
      // 1. Crear otros 2 libros más (ya tenemos testBook de beforeEach)
      const book2 = await createTestBook({ title: "Second Book", price: 15.00, stock: 5 });
      const book3 = await createTestBook({ title: "Third Book", price: 50.00, stock: 20 });

      // 2. Agregar los 3 libros distintos al carrito
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, { bookId: book2.id, quantity: 1 });
      await addToCart(app, authToken, { bookId: book3.id, quantity: 5 });

      // 3. Obtener el carrito
      const getCartResponse = await getCart(app, authToken);

      // 4. Validar
      expect(getCartResponse.status).toBe(200);
      expect(getCartResponse.body.success).toBe(true);
      validateFullCartContract(getCartResponse.body.data); // 🛡️ Validación de Contrato
      expect(getCartResponse.body.data.items).toHaveLength(3); // ✅ 3 libros disntintos en el array.

    });


    it("18. debe calcular correctamente el total de items en el carrito", async () => {
      // 1. Preparar libros con precios conocidos
      const book2 = await createTestBook({ title: "Quantity2 Book", price: 15.00, stock: 5 });
      const book3 = await createTestBook({ title: "Quantity3 Book", price: 50.00, stock: 20 });

      // 2. Agregar cantidades variadas
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, { bookId: book2.id, quantity: 1 });
      await addToCart(app, authToken, { bookId: book3.id, quantity: 5 });

      const getCartResponse = await getCart(app, authToken);

      // 3. Validaciones de contrato
      expect(getCartResponse.status).toBe(200);
      expect(getCartResponse.body.success).toBe(true);
      validateFullCartContract(getCartResponse.body.data); // 🛡️ Validación de Contrato

      // 4. Validaciones de Lógica Matemática
      expect(getCartResponse.body.data.items).toHaveLength(3);
      expect(getCartResponse.body.data.totalItems).toBe(8);
      expect(getCartResponse.body.data.totalPrice).toBe(324.98); // ✅ Validación crucial del contrato
    });

    it("19. debe incluir la sección pendingOrder si existe una orden activa", async () => {
      // 1. Agregar libro al carrito PRIMERO (antes de bloquearlo con la orden)
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });

      // 2. Crear una orden pendiente para simular un checkout iniciado
      const orderRepository = AppDataSource.getRepository(Order);
      const pendingOrder = orderRepository.create({
        user: { id: testUser.id },
        status: OrderStatus.PENDING,
        total: 100.0,
      });
      await orderRepository.save(pendingOrder);

      // 3. Obtener el carrito
      const getCartResponse = await getCart(app, authToken);

      // 4. Validaciones
      expect(getCartResponse.status).toBe(200);
      validateFullCartContract(getCartResponse.body.data); // 🛡️ Valida que la estructura básica esté bien

      // ✅ Verificamos que la sección 'pendingOrder' exista y tenga los datos correctos
      expect(getCartResponse.body.data).toHaveProperty("pendingOrder");
      expect(getCartResponse.body.data.pendingOrder.id).toBe(pendingOrder.id);
      expect(getCartResponse.body.data.pendingOrder.total).toBe("100.00"); // Nota: TypeORM suele devolver decimales como string
    });


    it("20. debe retornar 401 si no se envía token", async () => {
      const getCartResponse = await getCart(app, null); // Solo pasamos 'null' como segundo argumento, sin el nombre de la variable

      // Usamos tu helper para validar todo el contrato de error de una vez (comprobamos:expect(status).toBe(401),expect(success).toBe(false), expect(message).toBe("..."))
      validateErrorResponse(getCartResponse, 401, "No autorizado: se requiere un token de autenticación");
    });


    it("21. debe persistir los items tras múltiples llamadas al GET", async () => {
      // 1. Primero agregamos algo para que el carrito no esté vacío
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });

      // 2. Hacemos la primera llamada y guardamos el resultado
      const firstCall = await getCart(app, authToken);
      expect(firstCall.status).toBe(200);
      validateFullCartContract(firstCall.body.data); // Validamos contrato

      // 3. Hacemos la segunda llamada inmediatamente después
      const secondCall = await getCart(app, authToken);
      expect(secondCall.status).toBe(200);

      // 4. EL TRUCO: Comparamos que TODO el contenido sea idéntico al de la primera llamada
      expect(secondCall.body.data).toEqual(firstCall.body.data);
    });


    it("22. debe reflejar cambios inmediatos tras un ADD exitoso", async () => {
      // 1. Nos aseguramos de que el carrito esté vacío al empezar
      const emptyCart = await getCart(app, authToken);
      expect(emptyCart.body.data.totalItems).toBe(0);

      // 2. Agregamos el libro (Petición A)
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });

      // 3. Consultamos INMEDIATAMENTE (Petición B)
      const updatedCart = await getCart(app, authToken);

      // 4. Validamos que el estado anterior DESAPARECIÓ 
      expect(updatedCart.body.data.totalItems).toBe(1);
      expect(updatedCart.body.data.items[0].book.id).toBe(testBook.id);
    });


    it("23. debe ordenar los items por fecha de creación (opcional según implementación)", async () => {
      // 1. Preparar libros con precios conocidos
      const book2 = await createTestBook({ title: "Fech2 Book", price: 15.00, stock: 5 });
      const book3 = await createTestBook({ title: "Fecha3 Book", price: 50.00, stock: 20 });

      // 2. Agregar cantidades variadas
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, { bookId: book2.id, quantity: 1 });
      await addToCart(app, authToken, { bookId: book3.id, quantity: 5 });

      const getCartResponse = await getCart(app, authToken);

      // 3. Validaciones de contrato
      expect(getCartResponse.status).toBe(200);
      expect(getCartResponse.body.success).toBe(true);
      validateFullCartContract(getCartResponse.body.data); // 🛡️ Validación de Contrato

      // 4. Validar el orden específico (El más nuevo primero - DESC)
      const items = getCartResponse.body.data.items;

      expect(items[0].book.id).toBe(book3.id);     // El último que agregaste
      expect(items[1].book.id).toBe(book2.id);     // El del medio
      expect(items[2].book.id).toBe(testBook.id);  // El primero que agregaste

    });

  });

  // ✏️ C. ENDPOINT: PUT /carts/:cartId
  describe("PUT /carts/:cartId - Actualizar Cantidad", () => {

    it("24. debe incrementar la cantidad exitosamente", async () => {
      // 1. Agregamos un libro y CAPTURAMOS el ID que nos devuelva el backend
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const cartId = addResponse.body.data.id;

      // 2. Usamos el nuevo helper mandando ese ID real
      const updateResponse = await updateCart(app, authToken, cartId, 3);

      // 3. Validamos contrato y lógica
      expect(updateResponse.status).toBe(200);
      validateCartItemContract(updateResponse.body.data);
      expect(updateResponse.body.data.quantity).toBe(3);
    });


    it("25. debe decrementar la cantidad exitosamente", async () => {
      // 1. Agregamos un libro y CAPTURAMOS el ID que nos devuelva el backend
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });
      const cartId = addResponse.body.data.id;

      // 2. Bajamos la cantidad a 3 el nuevo helper mandando ese ID real
      const updateResponse = await updateCart(app, authToken, cartId, 3);

      // 3. Validamos contrato y lógica
      expect(updateResponse.status).toBe(200);
      validateCartItemContract(updateResponse.body.data);
      expect(updateResponse.body.data.quantity).toBe(3);
    });

    it("26. debe rechazar si el cartId es inválido", async () => {
      const invalidCartId = "esto-no-es-un-uuid"

      const updateResponse = await updateCart(app, authToken, invalidCartId, 5);

      validateErrorResponse(updateResponse, 400, "Error de validación");

      expect(updateResponse.body.errors).toContain("cartId debe ser un UUID válido");
    });

    it("27. debe rechazar si el item no existe o no pertenece al usuario", async () => {
      //No es necesario crear dos users ya que al principio del archivo ejecuto functiones que crea un usuario, añade un libro, etc.

      // ESCENARIO A: El item tiene formato válido pero no existe en la BD
      const nonExistentId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const responseNotFound = await updateCart(app, authToken, nonExistentId, 5);

      // Usamos tu helper de contrato de error
      validateErrorResponse(responseNotFound, 404, "Item del carrito no encontrado");

      // ESCENARIO B: El item existe pero le pertenece a otro usuario (Prueba de Seguridad)
      // 1. Creamos otro usuario rápido con tu helper
      const otherUser = await createTestUser({ email: `other${Date.now()}@test.com` });

      // 2. Necesitamos el token de ese otro usuario para que pueda agregar algo a su carrito
      // (Aquí usamos el login para obtener su authToken)
      const loginRes = await request(app).post("/users/login").send({
        email: otherUser.email,
        password: "Password123!"
      });
      const otherToken = loginRes.body.data.accessToken;

      // 3. Ese otro usuario agrega un libro y obtenemos SU cartId
      const addResponse = await addToCart(app, otherToken, { bookId: testBook.id, quantity: 1 });
      const otherCartId = addResponse.body.data.id;

      // 4. EL TEST CLAVE: Intentamos actualizar con el TOKEN del usuario principal (authToken)
      // el item que le pertenece al otro (otherCartId)
      const hackResponse = await updateCart(app, authToken, otherCartId, 10);

      // 5. Según tu contrato, debe dar 404 "no encontrado" para proteger la privacidad
      validateErrorResponse(hackResponse, 404, "Item del carrito no encontrado");
    });


    it("28. debe rechazar si la nueva cantidad supera el stock", async () => {
      // 1. Agregamos un libro y CAPTURAMOS el ID que nos devuelva el backend
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const cartId = addResponse.body.data.id;

      // 2. Intentamos subir a una cantidad mayor al stock (testBook.stock es 10)
      const updateResponse = await updateCart(app, authToken, cartId, 11);

      // 3. Validamos que rechace con 409 según el contrato
      validateErrorResponse(updateResponse, 409, "Stock insuficiente para el libro solicitado");
    });

    it("29. debe rechazar si la cantidad es 0 o negativa", async () => {
      // 1. Usamos el 'testBook' que ya existe y lo añadimos al carrito
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 5 });
      const cartId = addResponse.body.data.id;

      // 2. Intentamos actualizar a 0 y a un número negativo
      const responseZero = await updateCart(app, authToken, cartId, 0);
      const responseNegative = await updateCart(app, authToken, cartId, -5);

      // 3. Validamos rechazo de cantidad 0
      validateErrorResponse(responseZero, 400, "Error de validación");
      expect(responseZero.body.errors).toContain("La cantidad debe ser un número entero positivo");

      // 4. Validamos rechazo de cantidad negativa
      validateErrorResponse(responseNegative, 400, "Error de validación");
      expect(responseNegative.body.errors).toContain("La cantidad debe ser un número entero positivo");
    });


    it("30. debe rechazar si hay una orden pendiente", async () => {
      // 1. Primero agregamos el libro (mientras el carrito está libre, osea hay que llenar el cart de algo para poder rechazar otra orden)
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
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
      validateErrorResponse(updateResponse, 409, "Tienes una orden pendiente en proceso");
    });


    it("31. debe confirmar la actualización con un mensaje de éxito", async () => {
      const addRes = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const cartId = addRes.body.data.id;

      const updateRes = await updateCart(app, authToken, cartId, 3);

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.message).toBe("Item del carrito actualizado exitosamente");
    });


    it("32. debe actualizar el precio total del carrito tras el cambio", async () => {
      // 1. Agregamos el libro (1 unidad = 29.99)
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
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
      const addResponse = await addToCart(app, authToken, { bookId: testBook.id, quantity: 1 });
      const cartId = addResponse.body.data.id; // ID del Item del Carrito.

      const updateResponse = await updateCart(app, null, cartId, 3);

      validateErrorResponse(updateResponse, 401, "No autorizado: se requiere un token de autenticación")
    });

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
      const loginRes = await loginUser(app, { email: wrongUser.email });
      const wrongToken = loginRes.body.data.accessToken;

      // 2. Agregamos el libro a SU carrito
      const addResponse = await addToCart(app, wrongToken, { bookId: testBook.id, quantity: 1 });
      const wrongCartId = addResponse.body.data.id;

      // 3. INTENTO DE BORRADO: Usamos el helper deleteCart con el token del usuario principal
      const wrongDeleteResponse = await deleteCartItem(app, authToken, wrongCartId);

      validateErrorResponse(wrongDeleteResponse, 404, "Item del carrito no encontrado");
    });

    // it("38. debe rechazar si hay una orden pendiente", async () => {
    // });

  });

  // 🧹 E. ENDPOINT: DELETE /carts/
  describe("DELETE /carts/ - Vaciar Carrito", () => {
    /*
    it("39. debe eliminar todos los items del carrito satisfactoriamente", async () => {
    });
  
    it("40. debe informar la cantidad de items eliminados", async () => {
    });
  
    it("41. debe funcionar correctamente incluso si el carrito ya está vacío", async () => {
    });
  
    it("42. debe rechazar si hay una orden pendiente", async () => {
    });
  
    it("43. debe dejar el carrito en un estado que el GET devuelva una lista vacía", async () => {
    });
    */
  });

  // 🔄 F. INTEGRACIÓN Y LÓGICA COMPLEJA
  describe("Casos de Integración y Lógica Compleja", () => {
    /*
    it("44. debe mantener el carrito separado entre distintos usuarios (Aislamiento)", async () => {
    });
  
    it("45. debe validar stock dinámicamente si el stock del libro cambia externamente", async () => {
    });
  
    it("46. debe manejar correctamente cambios de precio en el catálogo", async () => {
    });
  
    it("47. debe persistir el carrito tras un cierre de sesión y nuevo login", async () => {
    });
  
    it("48. debe rechazar cualquier modificación (ADD, PUT, DELETE) si hay orden pendiente", async () => {
    });
  
    it("49. debe permitir re-agregar un libro después de haber vaciado el carrito", async () => {
    });
  
    it("50. debe garantizar que el total del carrito sea la suma de subtotales válida", async () => {
    });
    */
  });
});
