/**
 * HOJA DE AYUDA: Validadores de Contrato
 * -------------------------------------
 * Estas funciones aseguran que el backend siempre envíe la información 
 * tal cual la definimos en nuestro "Contrato de API". Si falta algo, el test falla.
 */

/**
 * Valida un único item del carrito (ej. al agregar un libro).
 * @param item El objeto 'data' que devuelve la API.
 */
export const validateCartItemContract = (item: any) => {
  // Verificamos que tenga ID y sea texto
  expect(item).toHaveProperty("id");
  expect(typeof item.id).toBe("string");
  
  // Verificamos que el libro dentro del item tenga sus datos completos
  expect(item).toHaveProperty("book");
  expect(item.book).toHaveProperty("id");
  expect(item.book).toHaveProperty("title");
  expect(item.book).toHaveProperty("author");
  expect(item.book).toHaveProperty("price");
  expect(typeof item.book.price).toBe("number"); // El precio debe ser un número operativo
  expect(item.book).toHaveProperty("stock");

  // Verificamos la cantidad y fechas
  expect(item).toHaveProperty("quantity");
  expect(typeof item.quantity).toBe("number");
  expect(item).toHaveProperty("createdAt");
  expect(item).toHaveProperty("updatedAt");
};

/**
 * Valida el carrito completo (cuando usas el GET).
 * Revisa los totales y recorre cada item para validarlo también.
 * @param data El objeto 'data' de la respuesta (/carts)
 */
export const validateFullCartContract = (data: any) => {
  // 1. Debe tener una lista de items (aunque sea vacía [])
  expect(data).toHaveProperty("items");
  expect(Array.isArray(data.items)).toBe(true);
  
  // 2. Debe tener un contador de items y un precio total numérico
  expect(data).toHaveProperty("totalItems");
  expect(typeof data.totalItems).toBe("number");
  expect(data).toHaveProperty("totalPrice");
  expect(typeof data.totalPrice).toBe("number");

  // 3. Si hay items, cada uno debe cumplir el contrato individual
  if (data.items.length > 0) {
    data.items.forEach((item: any) => validateCartItemContract(item));
  }

  // 4. Si hay una orden pendiente iniciada, validamos su estructura
  if (data.pendingOrder) {
    expect(data.pendingOrder).toHaveProperty("id");
    expect(data.pendingOrder).toHaveProperty("total");
    expect(data.pendingOrder).toHaveProperty("createdAt");
    expect(data.pendingOrder).toHaveProperty("itemsCount");
  }
};

/**
 * Valida cualquier respuesta de error (400, 401, 404, 409, etc).
 * @param response La respuesta completa de supertest.
 * @param expectedStatus El código HTTP que esperamos (ej: 401).
 * @param expectedMessage El mensaje que el usuario debe ver.
 */
export const validateErrorResponse = (response: any, expectedStatus: number, expectedMessage?: string) => {
  expect(response.status).toBe(expectedStatus); // Verifica el código de error
  expect(response.body.success).toBe(false);    // El éxito debe ser siempre falso en errores
  expect(response.body).toHaveProperty("message");
  
  if (expectedMessage) {
    expect(response.body.message).toBe(expectedMessage); // Verifica que el texto sea el correcto
  }
};
