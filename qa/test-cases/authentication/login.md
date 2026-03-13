# Test Cases - Módulo: Authentication (Login)

## Área: Acceso al Sistema (Login)

### TC-AUTH-004: Iniciar sesión con cuenta de Cliente
- **ID**: TC-AUTH-004
- **Título**: Iniciar sesión con cuenta de Cliente
- **Modulo**: Authentication
- **Precondiciones**: Tener una cuenta de usuario normal.
- **Pasos**:
    1. Hacer clic en Acceder en la parte superior.
    2. Ingresar el Email y la Contraseña correctos.
    3. Hacer clic en el botón Iniciar Sesión.
- **Resultado esperado**: El sistema permite el ingreso. El botón Acceder cambia por un icono de usuario. El sitio nos lleva automáticamente a la sección de Mi Perfil.
- **Resultado Actual**: Sucedio lo esperado.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ Passed.
- **Observaciones**: 

---

### TC-AUTH-005: Iniciar sesión con cuenta de Administrador
- **ID**: TC-AUTH-005
- **Título**: Iniciar sesión con cuenta de Administrador
- **Modulo**: Authentication
- **Precondiciones**: Contar con una cuenta con permisos de administrador.
- **Pasos**:
    1. Entrar a la pantalla de inicio de sesión.
    2. Ingresar el email y contraseña del administrador.
    3. Hacer clic en el botón Iniciar Sesión.
- **Resultado esperado**: El administrador ingresa correctamente y el sitio lo redirige directamente al Panel de Control de administración.
- **Resultado Actual**: Sucedio lo esperado.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ Passed.
- **Observaciones**: 

---

### TC-AUTH-006: Ver y ocultar la contraseña al escribir
- **ID**: TC-AUTH-006
- **Título**: Ver y ocultar la contraseña al escribir
- **Modulo**: Authentication
- **Precondiciones**: Estar en la pantalla de inicio de sesión.
- **Pasos**:
    1. Escribir algo en el campo Contraseña.
    2. Hacer clic en el botón Mostrar que aparece dentro del campo.
    3. Hacer clic en el botón Ocultar.
- **Resultado esperado**: Al pulsar Mostrar, el texto se vuelve legible. Al pulsar Ocultar, se vuelve a cubrir la contraseña.
- **Resultado Actual**: Sucedio lo esperado.
- **Automatización relacionada**: N/A
- **Status**: ✅ Passed.
- **Observaciones**: 

---

### TC-AUTH-007: Salir de la cuenta (Cerrar Sesión)
- **ID**: TC-AUTH-007
- **Título**: Salir de la cuenta (Cerrar Sesión)
- **Modulo**: Authentication
- **Precondiciones**: Tener una sesión iniciada.
- **Pasos**:
    1. Ubicar el botón Cerrar Sesión (puede estar en el menú o al lado del perfil).
    2. Hacer clic en él.
- **Resultado esperado**: El usuario sale de su cuenta de forma segura. El sitio vuelve a mostrar el botón Acceder y nos redirige a la página de inicio.
- **Resultado Actual**: Sucedio lo esperado.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ Passed.
- **Observaciones**: 

---

### TC-AUTH-008: Verificar bloqueo de acceso a Login si ya estoy dentro
- **ID**: TC-AUTH-008
- **Título**: Verificar bloqueo de acceso a Login si ya estoy dentro
- **Modulo**: Authentication
- **Precondiciones**: Haber iniciado sesión recientemente.
- **Pasos**:
    1. Intentar entrar a la pantalla de login escribiendo la dirección en la barra de búsqueda del navegador.
- **Resultado esperado**: El sitio detecta que ya hay una sesión activa y nos devuelve automáticamente a nuestro perfil o a la página principal, sin dejarnos ver el formulario de login.
- **Resultado Actual**: Sucedio lo esperado.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ Passed.
- **Observaciones**: 

---

### TC-AUTH-009: Iniciar sesión con contraseña incorrecta
- **ID**: TC-AUTH-009
- **Título**: Iniciar sesión con contraseña incorrecta
- **Modulo**: Authentication
- **Precondiciones**: Tener una cuenta creada con un email válido y contraseña conocida.
- **Pasos**:
    1. Entrar a la página de Iniciar Sesión.
    2. Ingresar el email registrado.
    3. Ingresar una contraseña incorrecta.
    4. Hacer clic en el botón Iniciar Sesión.
- **Resultado esperado**: El sistema no permite el ingreso y muestra un mensaje de aviso que dice: Credenciales inválidas debajo del campo de contraseña.
- **Resultado Actual**: Sucedio lo esperado.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ Passed.
- **Observaciones**:

---

### TC-AUTH-010: Iniciar sesión con un email que no existe
- **ID**: TC-AUTH-010
- **Título**: Iniciar sesión con un email que no existe
- **Modulo**: Authentication
- **Precondiciones**: No estar registrado con el email usado para la prueba.
- **Pasos**:
    1. Entrar a la página de Iniciar Sesión.
    2. Ingresar un email inexistente y cualquier contraseña.
    3. Hacer clic en el botón Iniciar Sesión.
- **Resultado esperado**: El sistema no permite el ingreso y muestra el mensaje: Credenciales inválidas debajo del campo de contraseña.
- **Resultado Actual**: Sucedio lo esperado.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ Passed.
- **Observaciones**:
