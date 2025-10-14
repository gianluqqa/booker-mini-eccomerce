# Test Case: Registration (Users Module)

## Objective

Este documento contiene los casos de prueba manuales para el módulo de usuarios, específicamente enfocado en el proceso de registro de nuevos usuarios. El objetivo es validar que el sistema maneje correctamente diferentes escenarios de registro, incluyendo casos exitosos, validaciones de datos duplicados y formatos de email inválidos.

## TC-001: Successful new user registration

**Date:** 08-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users

### Description

Verifica el registro exitoso de un nuevo usuario con datos válidos.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with valid user data
3. Verify server response

### Test Data

```json
{
  "email": "pruebatest1@example.com",
  "password": "StrongPass123",
  "confirmPassword": "StrongPass123",
  "name": "Test User 001",
  "surname": "Perez",
  "address": "123 Main Street",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "541112345678"
}
```

### Expected Result

- Status Code: 201 Created
- User created with unique ID
- Role assigned as "customer"
- Password not included in response

### Actual Result

- **Status Code:** 201 Created ✅
- **Response Body:**

```json
{
  "email": "pruebatest1@example.com",
  "name": "Test User 001",
  "surname": "Perez",
  "address": "123 Main Street",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "541112345678",
  "id": 7,
  "role": "customer",
  "createdAt": "2025-10-08T21:52:34.025Z",
  "updatedAt": "2025-10-08T21:52:34.025Z"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Field validations work correctly
- Security implemented (hashed password)
- Optional fields handled appropriately

### Evidence

- **File:** `TC-001-register-succesfully.png`
- **Location:** `evidences/TC-001-register-succesfully.png`

## TC-002: Registration with duplicate email

**Date:** 08-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users

### Description

Valida el manejo de emails duplicados durante el registro.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning
- User with email "pruebatest1@example.com" already exists in the database

### Execution Steps

1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with the same email as existing user
3. Verify server response

### Test Data

```json
{
  "email": "pruebatest1@example.com",
  "password": "StrongPass123",
  "confirmPassword": "StrongPass123",
  "name": "Test User 001",
  "surname": "Perez",
  "address": "123 Main Street",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "541112345678"
}
```

### Expected Result

- Status Code: 409 Conflict
- Error message: "User with that email already exists"
- No new user created

### Actual Result

- **Status Code:** 409 Conflict
- **Response Body:**

```json
{
  "message": "User with that email already exists"
}
```

### Result

**✅ PASS** - Test executed successfully after bug fix

### Correction History

- **08-10-2025 (Initial):** Endpoint returned 500 Internal Server Error ❌
- **08-10-2025 (Fixed):** Endpoint now returns 409 Conflict ✅
- **Bug reported in:** BUG-002-duplicate-email.md

### Observations

- Endpoint now correctly returns 409 Conflict for duplicate email
- Maintaining duplicate validation ensures HTTP best practices
- Original bug successfully fixed
- Reference to original bug: BUG-002-duplicate-email.md

### Evidence

- **File:** `TC-002-duplicate-email-fixed.png`
- **Location:** `evidences/TC-002-duplicate-email-fixed.png`

## TC-003: Registration with invalid email format

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** Medium
**Module:** Users

### Description

Verifica la validación de formato de email inválido.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with invalid email format
3. Verify server response

### Test Data

```json
{
  "email": "invalidemail.com",
  "password": "StrongPass123",
  "confirmPassword": "StrongPass123",
  "name": "Invalid Email",
  "surname": "Test",
  "address": "Av. Siempre Viva 742",
  "country": "Argentina",
  "city": "Rosario",
  "phone": "541112345678"
}
```

### Expected Result

- Status Code: 400 Bad Request
- Error message: "Email format is invalid"
- User is not created in the database

### Actual Result

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "message": "Email format is invalid"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Email validation works as expected
- Error messages are clear and user-friendly
- No user data persisted in the database

### Evidence

- **File:** `TC-003-invalid-email.png`
- **Location:** `evidences/TC-003-invalid-email.png`

## TC-004: Password and confirmPassword do not match

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** Medium
**Module:** Users

### Description

Valida la integridad de contraseñas ingresadas por el usuario cuando no coinciden.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with different password and confirmPassword values
3. Verify server response

### Test Data

```json
{
  "email": "password&confirmpassword@donotmatch.com",
  "password": "StrongPass123",
  "confirmPassword": "StrongPass124",
  "name": "Password and C-Password NO",
  "surname": "Test",
  "address": "Av. Siempre Viva 742",
  "country": "Argentina",
  "city": "Rosario",
  "phone": "541112345678"
}
```

### Expected Result

- Status Code: 400 Bad Request
- Error message: "Passwords do not match"
- User is not created in the database

### Actual Result

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "message": "Passwords do not match"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- El endpoint devuelve 400 Bad Request ante errores de validación (por ejemplo, contraseñas que no coinciden)
- En un entorno de producción más formal, podría refinarse a 422 Unprocessable Entity, pero para esta demo se prioriza la simplicidad y la claridad del flujo de pruebas
- Evita registros defectuosos y reduce tickets de soporte

### Evidence

- **File:** `TC-004-passwords-no-match.png`
- **Location:** `evidences/TC-004-passwords-no-match.png`

## TC-005: Registration with missing required fields

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users

### Description

Valida el manejo de campos requeridos faltantes durante el registro.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with empty required fields (email, password, confirmPassword)
3. Verify server response

### Test Data

```json
{
  "email": "",
  "password": "",
  "confirmPassword": "",
  "name": "Password and C-Password NO",
  "surname": "Test",
  "address": "Av. Siempre Viva 742",
  "country": "Argentina",
  "city": "Rosario",
  "phone": "541112345678"
}
```

### Expected Result

- Status Code: 400 Bad Request
- Error message: "Email, password, confirmPassword, name and surname are required"
- User is not created in the database

### Actual Result

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "message": "Email, password, confirmPassword, name and surname are required"
}
```

### Result

**✅ PASS** - Test executed successfully after bug fix

### Correction History

- **14-10-2025 (Initial):** Endpoint returned technical error message ❌
- **14-10-2025 (Fixed):** Endpoint now returns proper validation message ✅
- **Bug reported in:** BUG-005-missing-required-fields.md

### Observations

- El endpoint ahora devuelve 400 Bad Request con un mensaje de validación claro y user-friendly
- El mensaje indica específicamente qué campos son requeridos
- La validación se ejecuta correctamente antes del procesamiento de la solicitud
- Bug original exitosamente corregido

### Evidence

- **File:** `BUG-005-missing-required-field.png`
- **Location:** `bugs/BUG-005-missing-required-field.png`
