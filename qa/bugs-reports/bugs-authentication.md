# Reporte de Bugs - Módulo: Authentication & User Management

### BUG-AUTH-001: Ausencia de confirmación tras registro exitoso
- **ID**: BUG-AUTH-001
- **Título**: No se muestra ninguna alerta ni mensaje de confirmación después de un registro exitoso.
- **Módulo**: Authentication
- **Precondiciones**: No tener una sesión iniciada y usar un email nuevo.
- **Pasos para reproducir**:
    1. Ir al formulario de registro.
    2. Completar todos los datos correctamente y pulsar Registrarse.
- **Resultado esperado**: El sistema debería mostrar una alerta o banner indicando "Cuenta creada con éxito" antes o durante la redirección al inicio de sesión.
- **Resultado actual**: El sistema redirige al usuario a la pantalla de inicio de sesión sin dar ningún tipo de feedback o aviso de que la operación fue exitosa.
- **Estado**: 🔴 **OPEN**
- **Evidencia**: 
- **Test Case relacionado**: TC-AUTH-001

### BUG-AUTH-002: Mensaje de error técnico al registrar email duplicado
- **ID**: BUG-AUTH-002
- **Título**: El sistema muestra un mensaje de error técnico (status code 400) al intentar registrar un email ya existente.
- **Módulo**: Authentication
- **Precondiciones**: Debe existir previamente un usuario registrado con el email utilizado para la prueba.
- **Pasos para reproducir**:
    1. Abrir el sitio web y dirigirse a la pantalla de crear cuenta.
    2. Ingresar el email que ya se encuentra registrado en el sistema.
    3. Completar el resto de los campos requeridos con cualquier dato válido.
    4. Hacer clic en el botón Registrarse.
- **Resultado esperado**: El sistema debe mostrar un mensaje claro y amigable para el usuario, por ejemplo: "Este email ya se encuentra registrado, por favor intenta con otro o inicia sesión".
- **Resultado actual**: El sistema muestra un mensaje de error técnico: "Request failed with status code 400".
- **Estado**: 🔴 **OPEN**
- **Evidencia**: bug-auth-002.png
- **Test Case relacionado**: TC-AUTH-003

### BUG-AUTH-003: Mensaje de error técnico al iniciar sesión con contraseña incorrecta
- **ID**: BUG-AUTH-003
- **Título**: El sistema muestra un mensaje de error técnico (status code 400) al intentar iniciar sesión con una contraseña incorrecta.
- **Módulo**: Authentication
- **Precondiciones**: Debe existir previamente un usuario registrado con el email utilizado para la prueba.
- **Pasos para reproducir**:
    1. Abrir el sitio web y dirigirse a la pantalla de Iniciar Sesión.
    2. Ingresar el email registrado.
    3. Ingresar una contraseña incorrecta.
    4. Hacer clic en el botón Iniciar Sesión.
- **Resultado esperado**: El sistema debe mostrar un mensaje claro y amigable para el usuario, por ejemplo: "Credenciales inválidas".
- **Resultado actual**: El sistema muestra un mensaje de error técnico: "Request failed with status code 400".
- **Estado**: 🔴 **OPEN**
- **Evidencia**: bug-auth-003.png
- **Test Case relacionado**: TC-AUTH-009

### BUG-AUTH-004: Mensaje de error técnico al iniciar sesión con email inexistente
- **ID**: BUG-AUTH-004
- **Título**: El sistema muestra un mensaje de error técnico (status code 400) al intentar iniciar sesión con un email inexistente.
- **Módulo**: Authentication
- **Precondiciones**: Debe existir previamente un usuario registrado con el email utilizado para la prueba.
- **Pasos para reproducir**:
    1. Abrir el sitio web y dirigirse a la pantalla de Iniciar Sesión.
    2. Ingresar el email registrado.
    3. Ingresar una contraseña incorrecta.
    4. Hacer clic en el botón Iniciar Sesión.
- **Resultado esperado**: El sistema debe mostrar un mensaje claro y amigable para el usuario, por ejemplo: "Credenciales inválidas".
- **Resultado actual**: El sistema muestra un mensaje de error técnico: "Request failed with status code 400".
- **Estado**: 🔴 **OPEN**
- **Evidencia**: bug-auth-004.png
- **Test Case relacionado**: TC-AUTH-010

### BUG-AUTH-005: El sistema permite crear una cuenta con simbolos y numeros en el nombre
- **ID**: BUG-AUTH-005
- **Título**: El sistema permite crear una cuenta con simbolos y numeros en el nombre.
- **Módulo**: Authentication
- **Precondiciones**: No tener una sesión iniciada y usar un email nuevo.
- **Pasos para reproducir**:
    1. Ir al formulario de registro.
    2. Completar todos los datos correctamente y pulsar Registrarse.
- **Resultado esperado**: El sistema debería detectar que no es un nombre válido y mostrar una alerta o impedir el registro. 
- **Resultado actual**: Me permite crear la cuenta con simbolos y numeros en el nombre.
- **Estado**: 🔴 **OPEN**
- **Evidencia**: bug-auth-005.png
- **Test Case relacionado**: TC-AUTH-011

