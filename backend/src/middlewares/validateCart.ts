import { AddToCartDto, UpdateCartDto } from "../dto/CartDto";

/**
 * Valida los datos para agregar un libro al carrito.
 */
export const validateAddToCart = (data: AddToCartDto) => {
  const errors: string[] = [];
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // Validar bookId
  if (!data.bookId) {
    errors.push("bookId es requerido");
  } else if (!uuidRegex.test(data.bookId)) {
    errors.push("bookId debe ser un UUID válido");
  }

  // Validar quantity (opcional en el body, pero si viene debe ser válida)
  if (data.quantity !== undefined && (data.quantity <= 0 || !Number.isInteger(data.quantity))) {
    errors.push("La cantidad debe ser un número entero positivo");
  }

  return errors;
};

/**
 * Valida los datos para actualizar la cantidad de un item.
 */
export const validateUpdateCart = (cartId: string, data: UpdateCartDto) => {
  const errors: string[] = [];
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // Validar cartId (params)
  if (!cartId) {
    errors.push("cartId es requerido");
  } else if (!uuidRegex.test(cartId)) {
    errors.push("cartId debe ser un UUID válido");
  }

  // Validar quantity (requerido en el body para actualización)
  if (data.quantity === undefined || data.quantity <= 0 || !Number.isInteger(data.quantity)) {
    errors.push("La cantidad debe ser un número entero positivo");
  }

  return errors;
};

/**
 * Valida el cartId para operaciones de eliminación.
 */
export const validateCartId = (cartId: string) => {
  const errors: string[] = [];
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!cartId) {
    errors.push("cartId es requerido");
  } else if (!uuidRegex.test(cartId)) {
    errors.push("cartId debe ser un UUID válido");
  }

  return errors;
};
