/**
 * VALIDACIONES: Checkout
 * ----------------------
 * Aseguran que las respuestas de checkout cumplan con el contrato real del backend.
 */

export const validateStockReservationContract = (data: any) => {
  expect(data).toHaveProperty("id");
  expect(typeof data.id).toBe("string");
  expect(data).toHaveProperty("expiresAt");
  expect(data).toHaveProperty("totalAmount");
  expect(typeof data.totalAmount).toBe("number");
  expect(data).toHaveProperty("items");
  expect(Array.isArray(data.items)).toBe(true);
};

export const validateOrderContract = (data: any) => {
  expect(data).toHaveProperty("id");
  expect(data).toHaveProperty("total");
  expect(data).toHaveProperty("status");
  expect(data).toHaveProperty("createdAt");
  expect(data).toHaveProperty("items");
  expect(Array.isArray(data.items)).toBe(true);
};
