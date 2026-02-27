/**
 * Configuración para el sistema de reseñas de Booker
 */
export const REVIEW_CONFIG = {
  MAX_CHARACTERS: 2500,
  MIN_CHARACTERS: 10,
  DEFAULT_RATING: 5,
};

/**
 * Función para validar si un comentario cumple con la longitud permitida
 * @param comment El texto de la reseña
 * @returns boolean
 */
export const isValidReviewLength = (comment: string): boolean => {
  const length = comment.trim().length;
  return length >= REVIEW_CONFIG.MIN_CHARACTERS && length <= REVIEW_CONFIG.MAX_CHARACTERS;
};
