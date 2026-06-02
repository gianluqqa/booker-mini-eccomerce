import { test as baseTest } from '@playwright/test';
import { RegisterPage } from '../pages/register-page';

/**
 * Interfaz que define los fixtures personalizados que estarán disponibles en las pruebas.
 */
interface CustomFixtures {
  registrationPage: RegisterPage;
}

/**
 * Extendemos el objeto de test original de Playwright para incluir
 * nuestras fixtures personalizadas de forma modular.
 */
export const test = baseTest.extend<CustomFixtures>({
  registrationPage: async ({ page }, use) => {
    // Inicialización del Page Object
    const registrationPage = new RegisterPage(page);
    
    // Inyectamos la instancia en la ejecución del test
    await use(registrationPage);
  },
});

// Re-exportamos 'expect' para comodidad de importación en los archivos de pruebas
export { expect } from '@playwright/test';
