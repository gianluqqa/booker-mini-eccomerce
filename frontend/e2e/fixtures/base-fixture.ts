import { test as baseTest } from '@playwright/test';

/**
 * Fixture base que extiende el test de Playwright.
 * Todos los fixtures específicos deben extender de este.
 * Proporciona un punto centralizado para agregar fixtures globales si es necesario.
 */
export const test = baseTest.extend({});
export { expect } from '@playwright/test';
