# Test Case: Registration (Users Module)

## Objective

This document contains the manual test cases for the users module, specifically focused on the new user registration process. The objective is to validate that the system correctly handles different registration scenarios, including successful cases, duplicate data validations, and invalid email formats.

## TC-001: Successful new user registration (Customer Role)

**Date:** 08-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Registration

### Description

Verifies the successful registration of a new user with valid data and customer role (default).

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with valid user data (without role field)
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
- Role assigned as "customer" (default)
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
- Default role assignment works correctly

### Evidence

- **File:** `TC-001-register-succesfully.png`
- **Location:** `evidences/TC-001-register-succesfully.png`

## TC-002: Registration with duplicate email

**Date:** 08-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Registration

### Description

Validates the handling of duplicate emails during registration.

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
**Module:** Users - Registration

### Description

Verifies the validation of invalid email format.

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
**Module:** Users - Registration

### Description

Validates the integrity of passwords entered by the user when they do not match.

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

- The endpoint returns 400 Bad Request for validation errors (e.g., passwords that do not match)
- In a more formal production environment, it could be refined to 422 Unprocessable Entity, but for this demo simplicity and clarity of the test flow is prioritized
- Prevents faulty registrations and reduces support tickets

### Evidence

- **File:** `TC-004-passwords-no-match.png`
- **Location:** `evidences/TC-004-passwords-no-match.png`

## TC-005: Registration with missing required fields

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Registration

### Description

Validates the handling of missing required fields during registration.

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

- The endpoint now returns 400 Bad Request with a clear and user-friendly validation message
- The message specifically indicates which fields are required
- Validation executes correctly before processing the request
- Original bug successfully fixed

### Evidence

- **File:** `TC-005-missing-required-field-fixed.png`
- **Location:** `evidences/TC-005-missing-required-field-fixed.png`



## TC-006: Registration with weak password validation

**Date:** 14-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Registration

### Description

Validates minimum security policies for passwords (length, uppercase, numbers).

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with weak password (short, no uppercase, no numbers)
3. Verify server response

### Test Data

```json
{
  "email": "shortpassword@gmail.com",
  "password": "1234",
  "confirmPassword": "1234",
  "name": "short",
  "surname": "password",
  "address": "Av. Siempre Viva 742",
  "country": "Argentina",
  "city": "Rosario",
  "phone": "541112345678"
}
```

### Expected Result

- Status Code: 400 Bad Request
- Error message: "Password must contain at least 8 characters, uppercase, lowercase and number"
- User is not created in the database

### Actual Result

- **Status Code:** 400 Bad Request
- **Response Body:**

```json
{
  "message": "Password must contain at least 8 characters, uppercase, lowercase and number"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Password validation works correctly
- The endpoint returns 400 Bad Request with specific validation message for weak passwords
- Password security policies are being applied correctly
- The error message is clear and specific about password requirements

### Evidence

- **File:** `TC-006-weak-password-validation.png`
- **Location:** `evidences/TC-006-weak-password-validation.png`




