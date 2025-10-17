# 📋 Resumen de Testing Manual - Módulo Users

## 📊 Información General

**Proyecto:** Booker - Backend  
**Módulo:** Users (Registro y Login)  
**Tipo:** Testing Manual  
**Período:** Octubre 2025  
**Tester:** Gian Luca Caravone  

## 🎯 Objetivo

Documentar y validar el funcionamiento completo del módulo de usuarios, incluyendo procesos de registro y login, mediante pruebas manuales exhaustivas que cubran casos exitosos y de error.

## 📈 Estadísticas Generales

### Tests Ejecutados
- **Total de Tests:** 9
- **Tests de Registro:** 6 (TC-001 a TC-006)
- **Tests de Login:** 3 (TC-007 a TC-009)
- **Tests Exitosos:** 9 ✅
- **Tests Fallidos:** 0 ❌
- **Tasa de Éxito:** 100%

### Cobertura de Funcionalidades
- ✅ **Registro de Usuarios Nuevos**
- ✅ **Validación de Emails Duplicados**
- ✅ **Validación de Formato de Email**
- ✅ **Validación de Contraseñas**
- ✅ **Validación de Campos Requeridos**
- ✅ **Login Exitoso**
- ✅ **Login con Contraseña Incorrecta**
- ✅ **Login con Usuario Inexistente**

## 📋 Detalle de Tests de Registro (TC-001 a TC-006)

### TC-001: Successful New User Registration
- **Estado:** ✅ PASS
- **Descripción:** Verifica el registro exitoso de un nuevo usuario
- **Datos de Prueba:** Usuario completo con todos los campos
- **Resultado:** Usuario creado correctamente con ID único y rol "customer"
- **Evidencia:** `TC-001-successful-registration.png`

### TC-002: Registration with Duplicate Email
- **Estado:** ✅ PASS
- **Descripción:** Verifica que el sistema rechace emails duplicados
- **Datos de Prueba:** Email ya existente en la base de datos
- **Resultado:** Error 409 "User with that email already exists"
- **Evidencia:** `TC-002-duplicate-email.png`

### TC-003: Registration with Invalid Email Format
- **Estado:** ✅ PASS
- **Descripción:** Verifica validación de formato de email
- **Datos de Prueba:** Email sin formato válido
- **Resultado:** Error 400 "Email format is invalid"
- **Evidencia:** `TC-003-invalid-email-format.png`

### TC-004: Password and ConfirmPassword Do Not Match
- **Estado:** ✅ PASS
- **Descripción:** Verifica validación de coincidencia de contraseñas
- **Datos de Prueba:** Contraseña y confirmación diferentes
- **Resultado:** Error 400 "Passwords do not match"
- **Evidencia:** `TC-004-passwords-do-not-match.png`

### TC-005: Registration with Missing Required Fields
- **Estado:** ✅ PASS
- **Descripción:** Verifica validación de campos requeridos
- **Datos de Prueba:** Campos obligatorios vacíos
- **Resultado:** Error 400 "Email, password, confirmPassword, name and surname are required"
- **Evidencia:** `TC-005-missing-required-fields.png`

### TC-006: Registration with Weak Password Validation
- **Estado:** ✅ PASS
- **Descripción:** Verifica validación de fortaleza de contraseña
- **Datos de Prueba:** Contraseña débil (menos de 8 caracteres)
- **Resultado:** Error 400 "Password must contain at least 8 characters, uppercase, lowercase and number"
- **Evidencia:** `TC-006-weak-password-validation.png`

## 📋 Detalle de Tests de Login (TC-007 a TC-009)

### TC-007: Successful User Login
- **Estado:** ✅ PASS
- **Descripción:** Verifica el login exitoso de un usuario existente
- **Datos de Prueba:** Credenciales válidas de usuario existente
- **Resultado:** Login exitoso con datos del usuario (sin contraseña)
- **Evidencia:** `TC-007-login-successfully.png`

### TC-008: Login with Incorrect Password
- **Estado:** ✅ PASS
- **Descripción:** Verifica rechazo de contraseña incorrecta
- **Datos de Prueba:** Email válido con contraseña incorrecta
- **Resultado:** Error 401 "Invalid password"
- **Evidencia:** `TC-008-login-incorrect-password.png`

### TC-009: Login with Non-existent User
- **Estado:** ✅ PASS
- **Descripción:** Verifica rechazo de usuario inexistente
- **Datos de Prueba:** Email que no existe en la base de datos
- **Resultado:** Error 404 "User with that email does not exist"
- **Evidencia:** `TC-009-login-non-existent-user.png`

## 🔧 Configuración del Entorno de Pruebas

### Prerequisites
- ✅ Backend server ejecutándose en puerto 5000
- ✅ Base de datos conectada y funcionando
- ✅ Usuarios de prueba creados para tests de login
- ✅ Herramientas de testing (Postman/Thunder Client)

### Datos de Prueba Utilizados
- **Emails de prueba:** test001@example.com, test002@example.com, etc.
- **Contraseñas:** StrongPass123 (cumple validaciones)
- **Usuarios completos:** Con todos los campos opcionales
- **Usuarios mínimos:** Solo campos requeridos

## 📊 Análisis de Resultados

### Validaciones Implementadas Correctamente
1. **Validación de Email:**
   - ✅ Formato correcto requerido
   - ✅ Emails duplicados rechazados
   - ✅ Mensajes de error claros

2. **Validación de Contraseñas:**
   - ✅ Mínimo 8 caracteres
   - ✅ Debe contener mayúsculas, minúsculas y números
   - ✅ Confirmación debe coincidir
   - ✅ Mensajes de error específicos

3. **Validación de Campos:**
   - ✅ Campos requeridos validados
   - ✅ Campos opcionales aceptados
   - ✅ Mensajes de error descriptivos

4. **Autenticación:**
   - ✅ Login exitoso con credenciales válidas
   - ✅ Rechazo de credenciales inválidas
   - ✅ Manejo correcto de usuarios inexistentes
   - ✅ Respuestas sin información sensible

### Códigos de Estado HTTP Correctos
- ✅ **201 Created:** Registro exitoso
- ✅ **200 OK:** Login exitoso
- ✅ **400 Bad Request:** Errores de validación
- ✅ **401 Unauthorized:** Contraseña incorrecta
- ✅ **404 Not Found:** Usuario inexistente
- ✅ **409 Conflict:** Email duplicado

## 🎯 Conclusiones

### Funcionalidades Validadas
- ✅ **Sistema de registro robusto** con validaciones completas
- ✅ **Sistema de login seguro** con manejo correcto de errores
- ✅ **Validaciones de seguridad** implementadas correctamente
- ✅ **Manejo de errores** apropiado y consistente
- ✅ **Respuestas de API** bien estructuradas

### Calidad del Código
- ✅ **Mensajes de error claros** y específicos
- ✅ **Códigos de estado HTTP** apropiados
- ✅ **Validaciones exhaustivas** en frontend y backend
- ✅ **Seguridad implementada** (contraseñas hasheadas, datos sensibles ocultos)

### Recomendaciones
1. **Mantener cobertura actual** - Los tests cubren casos críticos
2. **Documentar cambios** - Actualizar tests cuando se modifique funcionalidad
3. **Expandir testing** - Agregar tests para otros módulos siguiendo el mismo patrón
4. **Automatización** - Considerar automatizar tests críticos para CI/CD

## 📁 Archivos de Evidencia

### Tests de Registro
- `TC-001-successful-registration.png`
- `TC-002-duplicate-email.png`
- `TC-003-invalid-email-format.png`
- `TC-004-passwords-do-not-match.png`
- `TC-005-missing-required-fields.png`
- `TC-006-weak-password-validation.png`

### Tests de Login
- `TC-007-login-successfully.png`
- `TC-008-login-incorrect-password.png`
- `TC-009-login-non-existent-user.png`

## 📚 Documentación Relacionada

- **Tests Manuales de Registro:** [register-user-manual.md](./register-user-manual.md)
- **Tests Manuales de Login:** [login-user-manual.md](./login-user-manual.md)
- **Resumen General:** [../../users-summary.md](../../users-summary.md)
- **Reportes de Bugs:** [../bugs/bugs-users-reports.md](../bugs/bugs-users-reports.md)
- **Evidencias de Pruebas:** [../evidences/](../evidences/)

---

**Fecha de Generación:** 15 de Octubre, 2025  
**Última Actualización:** 15 de Octubre, 2025  
**Estado:** Completado ✅
