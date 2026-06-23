import path from 'path';
import { spawn } from 'child_process';

// Ruta al directorio del backend (3 carpetas hacia arriba desde e2e/helpers)
const BACKEND_DIR = path.resolve(__dirname, '../../../backend');

/**
 * HELPER: Limpiar Base de Datos
 * 
 * ¿Por qué necesitamos limpiar la base de datos?
 * - Los tests crean usuarios, libros, etc. en la base de datos
 * - Si no limpiamos, los datos de un test pueden afectar al siguiente
 * - Esto causa tests "flaky" (que a veces pasan, a veces fallan)
 * 
 * ¿Cuándo se usa?
 * - Antes de ejecutar un test (beforeEach): para empezar con base de datos limpia
 * - Después de ejecutar un test (afterEach): para dejar todo limpio para el siguiente
 * 
 * ¿Qué hace?
 * - Ejecuta un comando del backend: npm run db:clean
 * - Este comando borra todos los datos de prueba de la base de datos
 * - Deja la base de datos en estado inicial (vacía o con datos seed)
 */

/**
 * Función que limpia la base de datos ejecutando un comando del backend
 * 
 * PASO 1: Determina si es Windows o Mac/Linux
 * PASO 2: Ejecuta el comando 'npm run db:clean' en la carpeta del backend
 * PASO 3: Espera a que termine y reporta si fue exitoso o falló
 * 
 * @returns Promise<void> - Promesa que se resuelve cuando la limpieza termina
 * 
 * Uso en tests:
 * test.beforeEach(async () => {
 *   await cleanDatabase(); // Limpiar antes de cada test
 * });
 */
export async function cleanDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    // PASO 1: Determinamos el comando correcto según el sistema operativo
    // Windows usa 'npm.cmd', Mac/Linux usan 'npm'
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    // PASO 2: Ejecutamos el comando de limpieza del backend
    // spawn es como ejecutar un comando en la terminal
    const child = spawn(npmCmd, ['run', 'db:clean'], {
      cwd: BACKEND_DIR, // Ejecutar en la carpeta del backend
      stdio: 'pipe', // Capturar la salida del comando
      shell: process.platform === 'win32', // Necesario en Windows
    });

    // Variable para guardar mensajes de error
    let stderr = '';

    // Si hay errores en la ejecución, los guardamos
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    // Si hay un error al iniciar el comando, rechazamos la promesa
    child.on('error', reject);

    // PASO 3: Cuando el comando termina, verificamos el resultado
    child.on('close', (code) => {
      // código 0 = éxito, cualquier otro número = error
      if (code === 0) {
        resolve(); // Éxito: la base de datos fue limpiada
        return;
      }

      // Error: el comando falló
      reject(
        new Error(
          `No se pudo limpiar la base de datos (código ${code}). ${stderr}`.trim()
        )
      );
    });
  });
}
