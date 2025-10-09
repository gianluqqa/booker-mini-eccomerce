# Test Case: User Module

## TC-001: Successful new user registration

**Date:** 2025-01-08  
**Tester:** Gian Luca Caravone  
**Priority:** High

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

- **File:** `TC001-register-succesfully.png`
- **Location:** `evidences/TC001-register-succesfully.png`

## TC-002: Registration with duplicate email

**Date:** 2025-01-08  
**Tester:** Gian Luca Caravone  
**Priority:** High

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

- **2025-01-08 (Initial):** Endpoint returned 500 Internal Server Error ❌
- **2025-01-08 (Fixed):** Endpoint now returns 409 Conflict ✅
- **Bug reported in:** BUG-002-duplicate-email.md

### Observations

- Endpoint now correctly returns 409 Conflict for duplicate email
- Maintaining duplicate validation ensures HTTP best practices
- Original bug successfully fixed
- Reference to original bug: BUG-002-duplicate-email.md

### Evidence

- **File:** `TC002-duplicate-email-fixed.png`
- **Location:** `evidences/TC002-duplicate-email-fixed.png`
