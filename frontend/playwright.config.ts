import path from 'path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Ver la documentación de Playwright para más detalles:
 * https://playwright.dev/docs/test-configuration
 * 
 * Configuración optimizada para Chromium con estrategia de tags:
 * - @smoke: Tests críticos que validan el flujo principal (happy path)
 * - @regression: Tests detallados de validaciones y edge cases
 */
export default defineConfig({
  testDir: './e2e',
  /* Tiempo límite por test */
  timeout: 30 * 1000,
  expect: {
    /* Tiempo límite para aserciones individuales */
    timeout: 5000,
  },
  /* Un worker evita problemas de concurrencia en la base de datos */
  fullyParallel: true,
  /* Cancelar ejecución si hay fallos en CI */
  forbidOnly: !!process.env.CI,
  /* Reintentos ante fallos */
  retries: process.env.CI ? 2 : 1,
  /* Un test a la vez para evitar contaminación de datos */
  workers: 1,
  /* Reportería */
  reporter: [
    ['html', { 
      open: 'never',
      outputFolder: 'e2e/reports/html'
    }],
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
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /* Con la UI de Playwright, el navegador visible se controla con "Show browser" */
    headless: true,
  },

  /* Navegadores a utilizar - Solo Chromium según requisitos */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
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
