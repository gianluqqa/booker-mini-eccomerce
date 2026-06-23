import path from 'path';
import { spawn } from 'child_process';
import { ADMIN_DATA } from '../data/admin-data';

const BACKEND_DIR = path.resolve(__dirname, '../../../backend');

let ensureAdminPromise: Promise<void> | null = null;

/**
 * Ejecuta el seed de admin del backend con las credenciales de E2E.
 * Si el usuario ya existe en la base de datos, el seed lo omite.
 */
function runAdminSeed(): Promise<void> {
  return new Promise((resolve, reject) => {
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    const child = spawn(npmCmd, ['run', 'seed:admin'], {
      cwd: BACKEND_DIR,
      env: {
        ...process.env,
        ADMIN_EMAIL: ADMIN_DATA.credentials.email,
        ADMIN_PASSWORD: ADMIN_DATA.credentials.password,
      },
      stdio: 'pipe',
      shell: process.platform === 'win32',
    });

    let stderr = '';

    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `No se pudo asegurar el usuario admin (seed:admin salió con código ${code}). ${stderr}`.trim()
        )
      );
    });
  });
}

/**
 * Garantiza que exista un usuario administrador en la base de datos antes de
 * ejecutar pruebas que requieran acceso al panel /admin.
 *
 * Reutiliza `backend/src/seeds/admin.seed.ts` para no duplicar lógica de negocio.
 * La ejecución se cachea por worker para evitar lanzar el seed en cada test.
 */
export async function ensureAdminHelper(): Promise<void> {
  if (!ensureAdminPromise) {
    ensureAdminPromise = runAdminSeed();
  }

  await ensureAdminPromise;
}
