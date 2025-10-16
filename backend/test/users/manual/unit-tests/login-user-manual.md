# Test Case: Login (Users Module)

## Objective

Este documento contiene los casos de prueba manuales para el módulo de usuarios, específicamente enfocado en el proceso de login de usuarios existentes. El objetivo es validar que el sistema maneje correctamente diferentes escenarios de autenticación, incluyendo casos exitosos, credenciales inválidas y validaciones de datos.

## TC-007: Successful user login

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Login

### Description

Verifica el login exitoso de un usuario existente con credenciales válidas.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning
- User with email "login1@example.com" already exists in the database (created in TC-001)
- User password is ""StrongPass123"

### Execution Steps

1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with valid user credentials
3. Verify server response

### Test Data

```json
{
  "email": "login1@example.com",
  "password": "StrongPass123"
}
```

### Expected Result

- Status Code: 200 OK
- User data returned without password field
- User information includes: id, email, name, surname, address, country, city, phone, role, createdAt, updatedAt

### Actual Result

- **Status Code:** 200 OK
- **Response Body:**

```json
{
  "id": 140,
  "email": "login1@example.com",
  "name": "Login 1",
  "surname": "Test",
  "address": "123 Main Street",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "541112345678",
  "role": "customer",
  "createdAt": "2025-10-15T01:29:45.550Z",
  "updatedAt": "2025-10-15T01:29:45.550Z"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Login authentication works correctly
- Password is properly excluded from response for security
- User data is returned with all relevant information
- Status code 200 indicates successful authentication
- No sensitive information is exposed in the response

### Evidence

- **File:** `TC-007-login-successfully.png`
- **Location:** `evidences/TC-007-login-successfully.png`

## TC-008: Login with incorrect password

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Login

### Description

Verifica que el sistema rechace correctamente intentos de login con contraseña incorrecta para un usuario existente.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning
- User with email "login1@example.com" already exists in the database
- User password is "WrongPassword123"

### Execution Steps

1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with correct email but incorrect password
3. Verify server response

### Test Data

```json
{
  "email": "login1@example.com",
  "password": "WrongPassword123"
}
```

### Expected Result

- Status Code: 401 Unauthorized
- Error message: "Invalid password"
- No user data returned

### Actual Result

- **Status Code:** 401 Unauthorized
- **Response Body:**

```json
{
  "message": "Invalid password"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Security validation works correctly
- System properly rejects incorrect passwords
- Status code 401 follows HTTP standards for authentication failures
- No sensitive information is leaked in error messages
- Password comparison using bcrypt works as expected

### Evidence

- **File:** `TC-008-login-incorrect-password.png`
- **Location:** `evidences/TC-008-login-incorrect-password.png`

## TC-009: Login with non-existent user

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Login

### Description

Verifica que el sistema rechace correctamente intentos de login con un email que no existe en la base de datos.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning
- User with email "nonexistent@example.com" does NOT exist in the database

### Execution Steps

1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with non-existent email
3. Verify server response

### Test Data

```json
{
  "email": "nonexistent@example.com",
  "password": "AnyPassword123"
}
```

### Expected Result

- Status Code: 404 Not Found
- Error message: "User with that email does not exist"
- No user data returned

### Actual Result

- **Status Code:** 404 Not Found
- **Response Body:**

```json
{
  "message": "User with that email does not exist"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- User existence validation works correctly
- System properly handles non-existent users
- Status code 404 follows HTTP standards for resource not found
- Clear error message helps identify the issue
- No information leakage about user existence patterns

### Evidence

- **File:** `TC-009-login-non-existent-user.png`
- **Location:** `evidences/TC-009-login-non-existent-user.png`
