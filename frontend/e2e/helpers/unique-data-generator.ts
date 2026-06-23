/**
 * HELPER: Generador de Datos Únicos
 * 
 * ¿Por qué necesitamos datos únicos?
 * - Si usamos el mismo email en varios tests, el segundo test fallará porque el email ya existe
 * - La base de datos no permite duplicados
 * - Solución: Agregar timestamp (hora actual) para que cada email sea diferente
 * 
 * Ejemplo de uso:
 * const email = generateUniqueEmail('prueba');
 * Resultado: 'prueba.1719123456789.123@example.com'
 */

/**
 * Genera un correo electrónico único para pruebas
 * 
 * PASO 1: Obtiene la hora actual en milisegundos (timestamp)
 * PASO 2: Genera un número aleatorio entre 0 y 999
 * PASO 3: Combina todo para crear un email único
 * 
 * @param prefix - Texto para identificar el tipo de prueba (ej: 'login', 'registro')
 * @returns Email único que nunca se repite
 * 
 * Ejemplo:
 * generateUniqueEmail('login') → 'login.1719123456789.456@example.com'
 */
export function generateUniqueEmail(prefix: string = 'qa.test'): string {
  // PASO 1: Obtenemos la hora actual en milisegundos
  // Esto garantiza que cada ejecución tenga un número diferente
  const timestamp = Date.now();
  
  // PASO 2: Generamos un número aleatorio
  // Esto agrega más aleatoriedad por si ejecutamos varios tests casi al mismo tiempo
  const randomSuffix = Math.floor(Math.random() * 1000);
  
  // PASO 3: Combinamos todo para crear el email único
  // Formato: prefix.timestamp.random@example.com
  return `${prefix}.${timestamp}.${randomSuffix}@example.com`;
}

/**
 * Genera un título único para libros de prueba
 * 
 * MISMA LÓGICA que generateUniqueEmail pero para títulos de libros
 * 
 * @param prefix - Texto para identificar el tipo de prueba
 * @returns Título único que nunca se repite
 * 
 * Ejemplo:
 * generateUniqueTitle('Libro') → 'Libro Test 1719123456789.789'
 */
export function generateUniqueTitle(prefix: string = 'Book'): string {
  // PASO 1: Obtenemos la hora actual
  const timestamp = Date.now();
  
  // PASO 2: Generamos un número aleatorio
  const randomSuffix = Math.floor(Math.random() * 1000);
  
  // PASO 3: Combinamos para crear el título único
  return `${prefix} Test ${timestamp}.${randomSuffix}`;
}
