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