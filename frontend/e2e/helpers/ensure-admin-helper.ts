import path from 'path';
import { spawn } from 'child_process';
import { ADMIN_DATA } from '../data/admin-data';

// Ruta al directorio del backend (3 carpetas hacia arriba desde e2e/helpers)
const BACKEND_DIR = path.resolve(__dirname, '../../../backend');

// Variable para guardar la promesa de creación del admin
// Esto evita que creemos el admin múltiples veces en la misma ejecución
let ensureAdminPromise: Promise<void> | null = null;

/**
 * HELPER: Asegurar que existe el usuario Admin
 * 
 * ¿Por qué necesitamos esto?
 * - Los tests de admin requieren que exista un usuario administrador en la base de datos
 * - Si el admin no existe, los tests fallarán al intentar hacer login
 * - Este helper crea el admin automáticamente antes de ejecutar los tests
 * 
 * ¿Cómo funciona?
 * - Ejecuta un comando del backend: npm run seed:admin
 * - Este comando crea el usuario admin si no existe
 * - Si ya existe, no hace nada (no falla)
 * - Solo se ejecuta una vez por sesión de tests (optimización)
 */

/**
 * Función interna que ejecuta el comando para crear el admin
 * 
 * PASO 1: Determina si es Windows o Mac/Linux (para usar npm.cmd o npm)
 * PASO 2: Ejecuta el comando 'npm run seed:admin' en la carpeta del backend
 * PASO 3: Pasa las credenciales del admin como variables de entorno
 * PASO 4: Espera a que termine y reporta si fue exitoso o falló
 */
function runAdminSeed(): Promise<void> {
  return new Promise((resolve, reject) => {
    // PASO 1: Determinamos el comando correcto según el sistema operativo
    // Windows usa 'npm.cmd', Mac/Linux usan 'npm'
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    // PASO 2: Ejecutamos el comando del backend
    // spawn es como ejecutar un comando en la terminal
    const child = spawn(npmCmd, ['run', 'seed:admin'], {
      cwd: BACKEND_DIR, // Ejecutar en la carpeta del backend
      env: {
        // PASO 3: Pasamos las credenciales como variables de entorno
        ...process.env,
        ADMIN_EMAIL: ADMIN_DATA.credentials.email,
        ADMIN_PASSWORD: ADMIN_DATA.credentials.password,
      },
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

    // PASO 4: Cuando el comando termina, verificamos el resultado
    child.on('close', (code) => {
      // código 0 = éxito, cualquier otro número = error
      if (code === 0) {
        resolve(); // Éxito: el admin fue creado o ya existía
        return;
      }

      // Error: el comando falló
      reject(
        new Error(
          `No se pudo crear el usuario admin (código ${code}). ${stderr}`.trim()
        )
      );
    });
  });
}

/**
 * Función pública que usamos en los tests
 * 
 * ¿Qué hace?
 * - Verifica si ya ejecutamos la creación del admin en esta sesión
 * - Si no se ejecutó, la ejecuta ahora
 * - Si ya se ejecutó, reutiliza el resultado (no se ejecuta de nuevo)
 * 
 * ¿Por qué esta optimización?
 * - Evitamos ejecutar el mismo comando múltiples veces
 * - Ahorramos tiempo en la ejecución de tests
 * 
 * Uso en tests:
 * await ensureAdminHelper(); // Se ejecuta antes de tests de admin
 */
export async function ensureAdminHelper(): Promise<void> {
  // Si nunca hemos ejecutado la creación del admin
  if (!ensureAdminPromise) {
    // La ejecutamos ahora y guardamos la promesa
    ensureAdminPromise = runAdminSeed();
  }

  // Esperamos a que termine (si ya terminó, retorna inmediatamente)
  await ensureAdminPromise;
}
