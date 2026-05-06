/**
 * HOJA DE AYUDA: Validadores de Contrato para Órdenes
 */

export const validateOrderItemContract = (item: any) => {
  expect(item).toHaveProperty("id");
  expect(typeof item.id).toBe("string");
  
  expect(item).toHaveProperty("book");
  expect(item.book).toHaveProperty("id");
  expect(item.book).toHaveProperty("title");
  expect(item.book).toHaveProperty("author");
  expect(item.book).toHaveProperty("price");
  expect(typeof item.book.price).toBe("number");

  expect(item).toHaveProperty("quantity");
  expect(typeof item.quantity).toBe("number");
  
  expect(item).toHaveProperty("price");
  expect(item).toHaveProperty("unitPrice");
  expect(item).toHaveProperty("totalPrice");
  expect(typeof item.totalPrice).toBe("number");
};

export const validateOrderContract = (order: any) => {
  expect(order).toHaveProperty("id");
  expect(typeof order.id).toBe("string");
  
  expect(order).toHaveProperty("status");
  expect(order).toHaveProperty("total");
  expect(order).toHaveProperty("createdAt");
  
  expect(order).toHaveProperty("items");
  expect(Array.isArray(order.items)).toBe(true);

  if (order.items.length > 0) {
    order.items.forEach((item: any) => validateOrderItemContract(item));
  }
};
