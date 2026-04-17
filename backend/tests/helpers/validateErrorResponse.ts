/**
 * VALIDACIÓN: Respuesta de Error
 * -----------------------------
 * Valida cualquier respuesta de error (400, 401, 404, 409, etc).
 */

export const validateErrorResponse = (response: any, expectedStatus: number, expectedMessage?: string) => {
  expect(response.status).toBe(expectedStatus); // Verifica el código de error
  expect(response.body.success).toBe(false);    // El éxito debe ser siempre falso en errores
  expect(response.body).toHaveProperty("message");
  
  if (expectedMessage) {
    expect(response.body.message).toBe(expectedMessage); // Verifica que el texto sea el correcto
  }
};
