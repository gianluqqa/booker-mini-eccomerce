/**
 * Genera un correo electrónico único utilizando la marca de tiempo actual.
 * Esto asegura que cada ejecución de prueba de registro tenga un email nuevo
 * y no falle por restricciones de unicidad en la base de datos.
 * 
 * @param prefix Prefijo que identificará los correos de prueba.
 * @returns Un string con formato de correo electrónico único.
 */
export function generateUniqueEmail(prefix: string = 'qa.test'): string {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${prefix}.${timestamp}.${randomSuffix}@example.com`;
}
