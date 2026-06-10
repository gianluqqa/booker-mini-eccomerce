# FILOSOFÍA DE AUTOMATIZACIÓN PLAYWRIGHT DEL PROYECTO

A partir de este momento, todas las pruebas Playwright deben construirse siguiendo una estrategia orientada a negocio y a comportamiento del usuario.

El objetivo de este proyecto no es verificar cada detalle implementado en el frontend.

El objetivo es demostrar capacidad profesional para identificar, diseñar y automatizar los flujos críticos de una aplicación utilizando Playwright.

---

## PRINCIPIO FUNDAMENTAL

Playwright debe validar funcionalidades.

No debe validar implementaciones.

La automatización debe enfocarse en aquello que genera valor para el usuario final y para el negocio.

No debe enfocarse en detalles técnicos internos del frontend.

---

## QUÉ DEBE PROBAR PLAYWRIGHT

Playwright debe verificar que las funcionalidades críticas del producto continúan funcionando correctamente.

Ejemplos:

* Registro de usuario.
* Inicio de sesión.
* Cierre de sesión.
* Navegación entre páginas.
* Búsqueda de productos.
* Agregar productos al carrito.
* Modificar el carrito.
* Checkout.
* Confirmación de compra.
* Visualización de órdenes.
* Acceso a funcionalidades protegidas.

La pregunta principal siempre debe ser:

"¿El usuario puede completar exitosamente la tarea que vino a realizar?"

---

## QUÉ NO DEBE PROBAR PLAYWRIGHT

No generar pruebas enfocadas en detalles técnicos o visuales que no representen una funcionalidad crítica.

Ejemplos:

* Duración exacta de animaciones.
* Valores específicos de CSS.
* Márgenes.
* Padding.
* Tamaños de fuentes.
* Colores.
* Transiciones.
* Implementaciones internas de componentes.
* Estructura interna del DOM que no afecte al usuario.
* Detalles de implementación de librerías frontend.

---

## REGLA DE ESTABILIDAD

Una prueba debe seguir pasando si se modifica la implementación interna pero la funcionalidad continúa funcionando para el usuario.

Ejemplo:

Implementación actual:

animation-duration: 3000ms;

Implementación futura:

animation-duration: 1500ms;

Si el usuario sigue viendo correctamente la transición y puede completar su flujo sin problemas, el test debe seguir pasando.

Por lo tanto, los tests no deben depender de detalles internos de implementación.

---

## CRITERIO DE DISEÑO DE TESTS

Antes de crear cualquier caso automatizado, responder:

1. ¿Esta funcionalidad es importante para el usuario?
2. ¿Esta funcionalidad es importante para el negocio?
3. ¿Si falla, el usuario pierde capacidad de utilizar el producto?
4. ¿Si falla, el negocio pierde una capacidad importante?

Si la respuesta es sí, la funcionalidad merece cobertura automatizada.

Si la respuesta es no, probablemente no sea un buen candidato para un Smoke Test.

---

## OBJETIVO DEL PORTFOLIO

Este proyecto fue creado para demostrar habilidades de QA Automation utilizando Playwright.

Por lo tanto, las pruebas deben reflejar cómo trabaja un QA Automation profesional:

* Priorizando funcionalidades críticas.
* Priorizando flujos de negocio.
* Priorizando experiencia de usuario.
* Evitando pruebas frágiles.
* Evitando validaciones innecesarias.
* Evitando dependencia de detalles de implementación.

La calidad de una suite de Playwright no se mide por la cantidad de elementos del frontend que prueba.

La calidad de una suite de Playwright se mide por su capacidad para detectar fallos reales en funcionalidades importantes del producto.

---

# DIRECTIVA PERMANENTE — PLAYWRIGHT

Esta directiva es la fuente de verdad del proyecto y debe aplicarse en toda tarea relacionada con Playwright.

- No reinterpretar, modificar, flexibilizar ni extender estas reglas.
- Asumir que fueron definidas y aprobadas a nivel arquitectónico.
- Verificar su cumplimiento antes de generar, corregir, optimizar o refactorizar código.
- No proponer enfoques que contradigan esta directiva.

---

## Arquitectura del Proyecto

### Backend (Jest + Supertest)

Responsabilidades:

- API Testing
- Contract Testing
- Endpoint Testing
- Status Codes
- Reglas de negocio
- Validaciones de datos
- Payloads
- Estructura de respuestas
- Integraciones backend
- Seguridad de APIs

Toda esta cobertura ya existe y no debe replicarse en Playwright.

---

### Frontend (Playwright + POM)

Responsabilidades:

- Smoke Testing
- Regression Testing
- End-to-End Testing
- User Journeys
- Business Flows
- Navegación
- Interacciones de usuario
- Validaciones visuales
- Persistencia visual de datos
- Integración observable entre frontend y backend

---

## Principio Fundamental

Playwright debe comportarse únicamente como un usuario real utilizando la aplicación desde el navegador.

Playwright NO es:

- API Tester
- Contract Tester
- Backend Tester
- Reemplazo de Jest
- Reemplazo de Supertest
- Validador de contratos API
- Validador de payloads internos

Toda validación debe estar basada exclusivamente en comportamiento observable desde la interfaz.

---

## Prohibiciones Absolutas

No generar pruebas Playwright que validen:

- Status codes HTTP
- Contratos API
- Payloads
- JSON responses
- Propiedades internas del backend
- Reglas de negocio ya cubiertas por Supertest
- Requests o responses técnicas
- Detalles de implementación interna

Ejemplos prohibidos:

```ts
expect(response.status()).toBe(201);
expect(response.status()).toBe(400);

const body = await response.json();

expect(body.success).toBe(true);
expect(body.message).toContain('...');
expect(body.data).toBeDefined();
expect(body.data.email).toBe(...);

--------------------------------------------------
VALIDACIONES PERMITIDAS
--------------------------------------------------

Playwright debe validar únicamente comportamiento observable por el usuario.

Validaciones permitidas:

- Navegación.
- Formularios.
- Inputs.
- Botones.
- Enlaces.
- Mensajes de éxito.
- Mensajes de error.
- Toast notifications.
- Modales.
- Redirecciones.
- Estados de carga.
- Persistencia visual de información.
- Renderizado correcto de elementos.
- Flujos completos de usuario.
- User Journeys.
- Business Flows.
- Smoke Testing.
- Regression Testing.

Ejemplos válidos:

- El usuario completa un formulario.
- El usuario envía un formulario.
- El usuario inicia sesión.
- Se muestra una alerta de éxito.
- Se muestra un mensaje de error.
- El usuario es redirigido correctamente.
- Un producto aparece en el carrito.
- Una orden aparece en el dashboard.
- El carrito actualiza su contenido.
- El usuario puede completar una compra.

--------------------------------------------------
USO DE INTERCEPTACIONES
--------------------------------------------------

waitForResponse, route, interceptaciones y herramientas similares solo pueden utilizarse para sincronización de la prueba.

Uso permitido:

- Esperar que una acción finalice antes de continuar.
- Evitar condiciones de carrera.
- Sincronizar la ejecución del test.

Uso prohibido:

- Validar status codes.
- Validar contratos API.
- Validar payloads.
- Validar JSON responses.
- Validar reglas de negocio.
- Validar contenido interno de respuestas.

Si una interceptación está siendo utilizada para inspeccionar datos internos del backend, debe eliminarse.

Las interceptaciones nunca deben utilizarse para reemplazar pruebas de API ni para verificar contratos de backend.

--------------------------------------------------
CRITERIO DE DECISIÓN OBLIGATORIO
--------------------------------------------------

Antes de agregar cualquier assert en Playwright, debes aplicar la siguiente regla:

Pregunta obligatoria:

"¿Un usuario final puede observar esta validación directamente desde la interfaz?"

Si la respuesta es:

- Sí → la validación puede implementarse.
- No → la validación pertenece a otra capa y debe rechazarse.

Regla adicional:

Si el assert necesita acceder a:

- response.status()
- response.json()
- response.body
- payloads internos
- contratos API
- propiedades técnicas del backend

entonces la validación es incorrecta y no debe implementarse en Playwright.

--------------------------------------------------
OBJETIVO DEL PROYECTO
--------------------------------------------------

Todas las pruebas Playwright deben centrarse exclusivamente en:

- Experiencia de usuario.
- Comportamiento observable.
- Navegación.
- Interacciones reales.
- User Journeys.
- Business Flows.
- Smoke Testing.
- Regression Testing.
- Validaciones visuales.

Playwright debe validar lo que el usuario ve, hace y experimenta.

No debe validar cómo funciona internamente el backend.

Si detectas validaciones de API, contratos, payloads, estructuras JSON o lógica interna de backend dentro de Playwright, debes eliminarlas y reemplazarlas por validaciones funcionales visibles para el usuario.

Esta directiva tiene prioridad sobre cualquier sugerencia, generación, corrección, optimización o refactorización futura relacionada con Playwright.

A partir de este momento, todas las decisiones relacionadas con Playwright deben seguir esta directiva como fuente de verdad del proyecto.