# Test Case: Login (Users Module)

## Objective

Este documento contiene los casos de prueba manuales para el módulo de usuarios, específicamente enfocado en el proceso de login de usuarios existentes. El objetivo es validar que el sistema maneje correctamente diferentes escenarios de autenticación, incluyendo casos exitosos, credenciales inválidas y validaciones de datos.

## TC-007: Successful user login

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users (Login)

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
**Module:** Users (Login)

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
- Error message: "Invalid credentials"
- No user data returned

### Actual Result

- **Status Code:** 401 Unauthorized
- **Response Body:**

```json
{
  "message": "Invalid credentials"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Security validation works correctly
- System properly rejects incorrect passwords with generic error message
- Status code 401 follows HTTP standards for authentication failures
- Generic error message prevents information leakage about authentication failures
- Password comparison using bcrypt works as expected
- Security best practice implemented to avoid revealing specific failure reasons

### Evidence

- **File:** `TC-008-login-incorrect-password.png`
- **Location:** `evidences/TC-008-login-incorrect-password.png`

### History of Corrections

- **16-10-2025:** Security improvement implemented - Changed specific "Invalid password" error message to generic "Invalid credentials" to prevent information disclosure about authentication failure reasons
- **16-10-2025:** Test case updated to reflect new security requirements
- **16-10-2025:** Related bug BUG-008 documented and fixed

## TC-009: Login with non-existent user

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users (Login)

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

- Status Code: 401 Unauthorized
- Error message: "Invalid credentials"
- No user data returned

### Actual Result

- **Status Code:** 401 Unauthorized
- **Response Body:**

```json
{
  "message": "Invalid credentials"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- User authentication validation works correctly
- System properly handles non-existent users with generic error message
- Status code 401 follows HTTP standards for authentication failures
- Generic error message prevents information leakage about user existence
- Security best practice implemented to avoid user enumeration attacks

### Evidence

- **File:** `TC-009-login-non-existent-user.png`
- **Location:** `evidences/TC-009-login-non-existent-user.png`

### History of Corrections

- **16-10-2025:** Critical security vulnerability fixed - Changed from 404 "User with that email does not exist" to 401 "Invalid credentials" to prevent user enumeration attacks
- **16-10-2025:** Test case updated to reflect new security requirements and best practices
- **16-10-2025:** Related bug BUG-009 documented and fixed
- **16-10-2025:** System now follows OWASP guidelines for secure authentication

## TC-010: Login with missing email

**Date:** 16-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Login

### Description

Verifica que el sistema rechace correctamente intentos de login cuando falta el campo email en la petición.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with password only (missing email)
3. Verify server response

### Test Data

```json
{
  "password": "StrongPass123"
}
```

### Expected Result

- Status Code: 400 Bad Request
- Error message: "Email is required"
- No user data returned

### Actual Result

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "message": "Email is required"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Email field validation works correctly
- System properly handles missing required fields
- Status code 400 follows HTTP standards for bad requests
- Clear error message helps identify the missing field
- Validation occurs before attempting user lookup

### Evidence

- **File:** `TC-010-login-missing-email.png`
- **Location:** `evidences/TC-010-login-missing-email.png`

## TC-011: Login with missing password

**Date:** 16-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Login

### Description

Verifica que el sistema rechace correctamente intentos de login cuando falta el campo password en la petición.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with email only (missing password)
3. Verify server response

### Test Data

```json
{
  "email": "test@example.com"
}
```

### Expected Result

- Status Code: 400 Bad Request
- Error message: "Password is required"
- No user data returned

### Actual Result

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "message": "Password is required"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Password field validation works correctly
- System properly handles missing required fields
- Status code 400 follows HTTP standards for bad requests
- Clear error message helps identify the missing field
- Validation occurs before attempting authentication

### Evidence

- **File:** `TC-011-login-missing-password.png`
- **Location:** `evidences/TC-011-login-missing-password.png`

## TC-012: Login with invalid email format

**Date:** 16-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Login

### Description

Verifica que el sistema rechace correctamente intentos de login con formato de email inválido.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with invalid email format
3. Verify server response

### Test Data

```json
{
  "email": "invalid-email-format",
  "password": "StrongPass123"
}
```

### Expected Result

- Status Code: 400 Bad Request
- Error message: "Email format is invalid"
- No user data returned

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

- Email format validation works correctly
- System properly validates email format before processing
- Status code 400 follows HTTP standards for bad requests
- Clear error message helps identify the format issue
- Validation prevents unnecessary database queries

### Evidence

- **File:** `TC-012-login-invalid-email-format.png`
- **Location:** `evidences/TC-012-login-invalid-email-format.png`
