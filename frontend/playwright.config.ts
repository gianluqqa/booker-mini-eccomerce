import path from 'path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Ver la documentación de Playwright para más detalles:
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Tiempo límite por test */
  timeout: 30 * 1000,
  expect: {
    /* Tiempo límite para aserciones individuales */
    timeout: 5000,
  },
  /* Un worker evita que Chromium, Firefox y WebKit golpeen el backend a la vez (menos flaky) */
  fullyParallel: true,
  /* Cancelar ejecución si hay fallos en CI */
  forbidOnly: !!process.env.CI,
  /* Reintentos ante fallos */
  retries: process.env.CI ? 2 : 1,
  /* Un test a la vez: registro comparte backend y WebKit en Windows suele ir más lento */
  workers: 1,
  /* Reportería */
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  /* Configuración del navegador */
  use: {
    /* URL base para navegación relativa en goto() */
    baseURL: 'http://localhost:3000',
    /*
     * En local: trace/screenshot/video "on" para que la UI de Playwright
     * muestre la línea de tiempo, acciones y la página (no queda en about:blank).
     * En CI: solo se guardan artefactos cuando falla un test.
     */
    trace: process.env.CI ? 'retain-on-failure' : 'on',
    screenshot: process.env.CI ? 'only-on-failure' : 'on',
    video: process.env.CI ? 'retain-on-failure' : 'on',
    /* Con la UI de Playwright, el navegador visible se controla con "Show browser" */
    headless: !!process.env.CI,
  },

  /* Navegadores a utilizar */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /*
   * E2E de registro (y flujos similares) requieren frontend + backend.
   * El frontend llama a NEXT_PUBLIC_API_URL (por defecto http://localhost:5000).
   * PostgreSQL debe estar disponible con la configuración del backend (.env).
   */
  webServer: [
    {
      command: 'npm run server',
      cwd: path.resolve(__dirname, '../backend'),
      url: 'http://localhost:5000',
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 120 * 1000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 120 * 1000,
    },
  ],
});
