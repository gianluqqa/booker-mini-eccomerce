# Test Cases - Módulo: Authentication (Registro)

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
- **Resultado Actual**: El sistema muestra un mensaje claro: "Ya existe un usuario con ese email".
- **Automatización relacionada**: Playwright (Pendiente)
- **Status**: ✅ **PASSED**
- **Observaciones**: Bug BUG-AUTH-002 solucionado.

---

### TC-AUTH-011: Intentar registro con números o símbolos en el campo Nombre o Apellido
- **ID**: TC-AUTH-011
- **Título**: Intentar registro con números o símbolos en el campo Nombre
- **Modulo**: Authentication
- **Precondiciones**: Estar en la pantalla de Crear Cuenta.
- **Pasos**:
    1. En el campo de Nombre, ingresar un valor con símbolos o números (ej: Juan123! o $$$).
    2. Completar el resto de los campos correctamente.
    3. Hacer clic en el botón Registrarse.
- **Resultado esperado**: El sistema debería detectar que no es un nombre o apellido válido y deberia mostrar una alerta o impedir el registro. 
- **Resultado Actual**: El sistema detecta el nombre o apellido inválido e impide el registro con un mensaje específico bajo el campo.
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
