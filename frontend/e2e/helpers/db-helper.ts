import path from 'path';
import { spawn } from 'child_process';

const BACKEND_DIR = path.resolve(__dirname, '../../../backend');

/**
 * Ejecuta un comando para limpiar la base de datos de prueba.
 * Este helper se usa en hooks beforeEach/afterEach para asegurar aislamiento.
 */
export async function cleanDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    const child = spawn(npmCmd, ['run', 'db:clean'], {
      cwd: BACKEND_DIR,
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
          `No se pudo limpiar la base de datos (código ${code}). ${stderr}`.trim()
        )
      );
    });
  });
}
