# Test Cases - Módulo: Authentication & User Management

## Área: Crear Cuenta (Registro)

### TC-AUTH-001: Registro exitoso de nuevo usuario de forma manual
- **ID**: TC-AUTH-001
- **Título**: Registro exitoso de nuevo usuario de forma manual
- **Modulo**: Authentication
- **Precondiciones**: No haber ingresado a ninguna cuenta previamente.
- **Pasos**:
    1. Entrar al sitio web.
    2. Hacer clic en el botón Acceder de la barra superior.
    3. Hacer clic en el enlace Regístrate aquí.
    4. Completar los campos obligatorios: Nombre, Apellido, Email, Contraseña y Confirmar Contraseña.
    5. Hacer clic en el botón Registrarse.
- **Resultado esperado**: El sitio web nos lleva a la pantalla de Iniciar Sesión. Los datos de la cuenta se guardan correctamente para poder ingresar.
- **Resultado Actual**: El sistema muestra una alerta de confirmación con barra de progreso antes de redirigir al Login.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ **PASSED**
- **Observaciones**: Bug BUG-AUTH-001 solucionado con el nuevo componente SuccessAlert.

---

### TC-AUTH-002: Impedir registro si las contraseñas no son iguales
- **ID**: TC-AUTH-002
- **Título**: Impedir registro si las contraseñas no son iguales
- **Modulo**: Authentication
- **Precondiciones**: Estar dentro de la pantalla Crear Cuenta.
- **Pasos**:
    1. Completar nombre, apellido y un email que no esté usado.
    2. En el campo Contraseña escribir una clave.
    3. En el campo Confirmar Contraseña escribir una clave diferente.
    4. Intentar hacer clic en el botón Registrarse.
- **Resultado esperado**: El sitio web no permite avanzar y muestra un mensaje de error en color rojo que dice: "Las contraseñas no coinciden".
- **Resultado Actual**: Sucedio lo esperado pero la alerta no aparece debajo de cada campo en caso de estar mal.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ **PASSED**
- **Observaciones**: Esta bien pero las alertas deberian aparecer debajo de cada campo en caso de estar mal.

---

### TC-AUTH-003: Intentar registrar un email que ya tiene cuenta
- **ID**: TC-AUTH-003
- **Título**: Intentar registrar un email que ya tiene cuenta
- **Modulo**: Authentication
- **Precondiciones**: Tener una cuenta ya creada con un email específico (ej: test@test.com).
- **Pasos**:
    1. Entrar al formulario para crear cuenta.
    2. Ingresar el email que ya existe (test@test.com).
    3. Completar el resto de los datos y hacer clic en Registrarse.
- **Resultado esperado**: Aparece un aviso indicando que el usuario o el email ya se encuentran registrados.
- **Resultado Actual**: El sistema muestra un mensaje claro: "Este email ya se encuentra registrado, por favor intenta con otro o inicia sesión" debajo del campo de email.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ **PASSED**
- **Observaciones**: Bug BUG-AUTH-002 solucionado.

---

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
- **Status**: ✅ **PASSED**
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
- **Status**: ✅ **PASSED**
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
- **Status**: ✅ **PASSED**
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
- **Status**: ✅ **PASSED**
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
- **Status**: ✅ **PASSED**
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
- **Resultado esperado**: El sistema no permite el ingreso y muestra un mensaje de aviso que dice: Credenciales inválidas.
- **Resultado Actual**: El sistema muestra el mensaje "Credenciales inválidas" debajo del campo de contraseña.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ **PASSED**
- **Observaciones**: Bug BUG-AUTH-003 solucionado. Mejora en la consistencia de errores.

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
- **Resultado esperado**: El sistema no permite el ingreso y muestra el mensaje: Credenciales inválidas.
- **Resultado Actual**: El sistema muestra el mensaje "Usuario no encontrado o inexistente" debajo del campo de email.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ **PASSED**
- **Observaciones**: Bug BUG-AUTH-004 solucionado.

---

### TC-AUTH-011: Intentar registro con números o símbolos en el campo Nombre
- **ID**: TC-AUTH-011
- **Título**: Intentar registro con números o símbolos en el campo Nombre
- **Modulo**: Authentication
- **Precondiciones**: Estar en la pantalla de Crear Cuenta.
- **Pasos**:
    1. En el campo de Nombre, ingresar un valor con símbolos o números (ej: Juan123! o $$$).
    2. Completar el resto de los campos correctamente.
    3. Hacer clic en el botón Registrarse.
- **Resultado esperado**: El sistema debería detectar que no es un nombre válido y mostrar una alerta o impedir el registro. 
- **Resultado Actual**: El sistema detecta el nombre inválido e impide el registro con un mensaje específico bajo el campo.
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ **PASSED**
- **Observaciones**: Bug BUG-AUTH-005 solucionado mediante validación por regex en backend y frontend.

---

### TC-AUTH-012: Intentar registro con un formato de email inválido
- **ID**: TC-AUTH-012
- **Título**: Intentar registro con un formato de email inválido
- **Modulo**: Authentication
- **Precondiciones**: Estar en la pantalla de Crear Cuenta.
- **Pasos**:
    1. En el campo Email, ingresar texto sin formato de correo (ej: correo_sin_arroba).
    2. Intentar hacer clic en el botón Registrarse.
- **Resultado esperado**: El sitio web resalta el campo del email indicando que le falta el símbolo @ o que el formato no es correcto, impidiendo el envío.
- **Resultado Actual**: Sucedio lo esperado.
- **Automatización relacionada**: N/A
- **Status**: ✅ **PASSED**
- **Observaciones**: 
