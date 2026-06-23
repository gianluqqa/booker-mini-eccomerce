import { test as baseTest } from '@playwright/test';
import { cleanDatabase } from '../helpers/db-helper';

/**
 * FIXTURE BASE
 * 
 * ¿Qué es un fixture?
 * - Un fixture es una herramienta que nos da objetos preparados para usar en tests
 * - Es como tener "ayudantes" que ya tienen todo listo para nosotros
 * 
 * ¿Por qué necesitamos un fixture base?
 * - Todos nuestros fixtures específicos (auth, admin) extienden de este
 * - Si queremos agregar algo global a todos los fixtures, lo hacemos aquí
 * - Es el punto de partida para todos los demás fixtures
 * 
 * ¿Qué hace este fixture base?
 * - Extiende el test original de Playwright
 * - No agrega nada extra por ahora (es un punto de extensión)
 * - Permite que otros fixtures agreguen sus propias herramientas
 * 
 * Ejemplo de uso:
 * - auth-fixture.ts extiende de este para agregar loginPage y registerPage
 * - admin-fixture.ts extiende de este para agregar authenticatedAdminPage
 */
export const test = baseTest.extend<{ _autoDbClean: void }>({
  // Fixture automático que se ejecuta en cada test para limpiar la base de datos
  _autoDbClean: [
    async ({}, use) => {
      await use(); // Ejecutar el test
      await cleanDatabase(); // Limpiar al finalizar el test
    },
    { auto: true },
  ],
});
export { expect } from '@playwright/test';
