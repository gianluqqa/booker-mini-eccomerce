import { app } from "../../../src/server";
import { AppDataSource } from "../../../src/config/data-source";
import { createTestUser } from "../../helpers/userActions";
import { createTestBook } from "../../helpers/bookActions";
import { loginUser } from "../../helpers/authActions";
import { addToCart, getCart } from "../../helpers/cartActions";
import { validateFullCartContract } from "../../helpers/cartValidationHelpers";
import { validateErrorResponse } from "../../helpers/validateErrorResponse";
import { Order } from "../../../src/entities/Order";
import { OrderStatus } from "../../../src/enums/OrderStatus";
import {
  initializeTestDb,
  closeTestDb,
  clearDatabase,
} from "../../helpers/dbHelpers";

describe("Cart Module - Get Cart", () => {
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

  describe("GET /carts/", () => {
    it("should return empty cart for users without items", async () => {
      const getCartResponse = await getCart(app, authToken);

      expect(getCartResponse.status).toBe(200);
      expect(getCartResponse.body.success).toBe(true);
      validateFullCartContract(getCartResponse.body.data); // Validación de Contrato
      expect(getCartResponse.body.data).toHaveProperty("items");
      expect(getCartResponse.body.data.items).toEqual([]);
    });

    it("should list all previously added items", async () => {
      // 1. Crear otros 2 libros más (ya tenemos testBook de beforeEach)
      const book2 = await createTestBook({
        title: "Second Book",
        price: 15.0,
        stock: 5,
      });
      const book3 = await createTestBook({
        title: "Third Book",
        price: 50.0,
        stock: 20,
      });

      // 2. Agregar los 3 libros distintos al carrito
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, { bookId: book2.id, quantity: 1 });
      await addToCart(app, authToken, { bookId: book3.id, quantity: 5 });

      // 3. Obtener el carrito
      const getCartResponse = await getCart(app, authToken);

      // 4. Validar
      expect(getCartResponse.status).toBe(200);
      expect(getCartResponse.body.success).toBe(true);
      validateFullCartContract(getCartResponse.body.data); // Validación de Contrato
      expect(getCartResponse.body.data.items).toHaveLength(3); // 3 libros distintos en el array.
    });

    it("should calculate total items in cart correctly", async () => {
      // 1. Preparar libros con precios conocidos
      const book2 = await createTestBook({
        title: "Quantity2 Book",
        price: 15.0,
        stock: 5,
      });
      const book3 = await createTestBook({
        title: "Quantity3 Book",
        price: 50.0,
        stock: 20,
      });

      // 2. Agregar cantidades variadas
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, { bookId: book2.id, quantity: 1 });
      await addToCart(app, authToken, { bookId: book3.id, quantity: 5 });

      const getCartResponse = await getCart(app, authToken);

      // Assert
      expect(getCartResponse.status).toBe(200);
      expect(getCartResponse.body.success).toBe(true);
      validateFullCartContract(getCartResponse.body.data); // Validación de Contrato

      // Assert: Validaciones de Lógica Matemática
      expect(getCartResponse.body.data.items).toHaveLength(3);
      expect(getCartResponse.body.data.totalItems).toBe(8);
      expect(getCartResponse.body.data.totalPrice).toBe(324.98); // Validación crucial del contrato
    });

    it("should include pendingOrder section if active order exists", async () => {
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

      // Assert
      expect(getCartResponse.status).toBe(200);
      validateFullCartContract(getCartResponse.body.data); // Valida que la estructura básica esté bien

      // Verificamos que la sección 'pendingOrder' exista y tenga los datos correctos
      expect(getCartResponse.body.data).toHaveProperty("pendingOrder");
      expect(getCartResponse.body.data.pendingOrder.id).toBe(pendingOrder.id);
      expect(getCartResponse.body.data.pendingOrder.total).toBe("100.00"); // Nota: TypeORM suele devolver decimales como string
    });

    it("should return 401 if no token is sent", async () => {
      const getCartResponse = await getCart(app, null); // Solo pasamos 'null' como segundo argumento, sin el nombre de la variable

      // Usamos tu helper para validar todo el contrato de error de una vez (comprobamos:expect(status).toBe(401),expect(success).toBe(false), expect(message).toBe("..."))
      validateErrorResponse(
        getCartResponse,
        401,
        "No autorizado: se requiere un token de autenticación",
      );
    });

    it("should persist items across multiple GET calls", async () => {
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

    it("should reflect immediate changes after successful ADD", async () => {
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

    it("should order items by creation date (optional based on implementation)", async () => {
      // 1. Preparar libros con precios conocidos
      const book2 = await createTestBook({
        title: "Fech2 Book",
        price: 15.0,
        stock: 5,
      });
      const book3 = await createTestBook({
        title: "Fecha3 Book",
        price: 50.0,
        stock: 20,
      });

      // 2. Agregar cantidades variadas
      await addToCart(app, authToken, { bookId: testBook.id, quantity: 2 });
      await addToCart(app, authToken, { bookId: book2.id, quantity: 1 });
      await addToCart(app, authToken, { bookId: book3.id, quantity: 5 });

      const getCartResponse = await getCart(app, authToken);

      // Assert
      expect(getCartResponse.status).toBe(200);
      expect(getCartResponse.body.success).toBe(true);
      validateFullCartContract(getCartResponse.body.data); // Validación de Contrato

      // 4. Validar el orden específico (El más nuevo primero - DESC)
      const items = getCartResponse.body.data.items;

      expect(items[0].book.id).toBe(book3.id); // El último que agregaste
      expect(items[1].book.id).toBe(book2.id); // El del medio
      expect(items[2].book.id).toBe(testBook.id); // El primero que agregaste
    });
  });
});
