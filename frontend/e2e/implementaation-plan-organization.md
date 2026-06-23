Actúa como un QA Automation Senior especializado en Playwright, TypeScript y diseño de frameworks de automatización mantenibles.

Estoy desarrollando un proyecto de portfolio QA Junior llamado Booker (mini e-commerce de libros).

IMPORTANTE:
No quiero agregar nuevas funcionalidades, nuevos módulos ni nuevas capas arquitectónicas innecesarias.

Quiero trabajar EXCLUSIVAMENTE con lo que ya existe en el proyecto.

Actualmente las únicas automatizaciones implementadas son:

- Registro de usuario
- Login de usuario
- Creación de libros por administrador

Mi objetivo es reorganizar y refactorizar la estructura actual para que se parezca a un framework profesional utilizado en equipos reales, manteniendo una complejidad adecuada para un QA Automation Junior.

Estructura actual:

e2e/
├── fixtures/
│   ├── admin-fixtures.ts
│   ├── user-login-fixtures.ts
│   └── user-registration-fixtures.ts
│
├── pages/
│   ├── login-page.ts
│   └── register-page.ts
│
├── test-data/
│
├── tests/
│   ├── debug/
│   ├── regression/
│   └── smoke/
│
└── utilities/

Requisitos obligatorios:

1. Eliminar la duplicación de pruebas entre smoke y regression.

Actualmente existen pruebas separadas para smoke y regression.

Quiero migrar a una estrategia basada en tags.

Utilizar únicamente:

- @smoke
- @regression

NO utilizar:

- @critical
- @sanity
- otras clasificaciones adicionales

2. Reorganizar las pruebas por funcionalidad.

Busco una estructura similar a:

tests/
├── auth/
│   ├── login.spec.ts
│   └── registration.spec.ts
│
└── admin/
    └── book-creation.spec.ts

Explica por qué esta organización es más mantenible que separar por smoke y regression.

3. Analizar mis fixtures actuales.

Determinar:

- cuáles deberían mantenerse
- cuáles deberían fusionarse
- cuáles deberían eliminarse

Evitar sobreingeniería.

4. Analizar mis Page Objects actuales.

Determinar:

- si login-page.ts y register-page.ts están correctamente separados
- si deberían mantenerse separados
- si hace falta BasePage
- si NO hace falta BasePage

No crear abstracciones innecesarias.

5. Mantener helpers.

Quiero conservar:

helpers/
├── db-helper.ts
├── unique-data-generator.ts

db-helper.ts es obligatorio.

Lo utilizo para limpiar la base de datos antes o después de ejecutar pruebas.

No recomendar eliminarlo.

Quiero que evalúes cómo organizarlo profesionalmente.

6. Analizar test-data.

Determinar:

- cómo organizar los datos de usuarios
- cómo organizar los datos de administrador
- cómo organizar los datos utilizados para crear libros

Sin agregar estructuras complejas.

7. Configuración Playwright.

Mi objetivo es utilizar únicamente Chromium.

NO quiero:

- Firefox
- WebKit
- ejecución cross-browser

Analiza únicamente una configuración profesional para Chromium.

8. Scripts npm.

Generar scripts profesionales utilizando tags:

- test:e2e
- test:smoke
- test:regression
- test:headed
- test:debug
- test:report

9. Evitar flaky tests.

Analizar:

- posibles problemas de sincronización
- waits innecesarios
- dependencias entre pruebas
- contaminación de datos

Proponer mejoras específicas.

10. Restricciones importantes.

NO agregar:

- checkout
- carrito
- órdenes
- pagos
- perfiles
- gestión de usuarios
- arquitectura enterprise
- patrones avanzados innecesarios
- factories
- builders
- managers
- services complejos
- múltiples capas de abstracción

Quiero una arquitectura que pueda explicar fácilmente en una entrevista para QA Automation Junior.

Resultado esperado:

- Auditoría técnica de la estructura actual.
- Problemas detectados.
- Estructura final propuesta.
- Árbol completo de carpetas.
- Convenciones de nombres.
- Estrategia de tags.
- Organización de fixtures.
- Organización de Page Objects.
- Organización de helpers.
- Organización de test-data.
- Scripts npm.
- Justificación de cada decisión.

Priorizar siempre:

- legibilidad
- mantenibilidad
- simplicidad profesional
- buenas prácticas reales
- facilidad para explicar el framework durante entrevistas técnicas

Las pruebas deben priorizar la validación de flujos de negocio y comportamientos críticos del usuario.

Evitar pruebas excesivamente acopladas a detalles visuales, animaciones, temporizadores, estilos o implementaciones internas que puedan cambiar sin afectar la funcionalidad principal.

El objetivo es que los tests sigan siendo estables y valiosos incluso cuando el frontend evolucione o cambie su implementación visual.

Antes de proponer cualquier cambio, justificar si realmente aporta valor a un portfolio QA Automation Junior.