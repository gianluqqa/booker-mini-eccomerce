# Test Case: Login (Admin Module)

## Objective

This document contains the manual test cases for the admin module, specifically focused on the login process for existing admin users. The objective is to validate that the system correctly handles different authentication scenarios, including successful cases, invalid credentials, and data validations.

## TC-014: Successful admin user login (Admin Role)

**Date:** 28-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Login - (Admin Module)

### Description

Verifies the successful login of an existing admin user with valid credentials.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning
- At least one admin user registered in the system
- Admin user credentials available for testing

### Execution Steps

1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with valid admin user credentials
3. Verify server response and authentication token
4. Validate role information in response

### Test Data

```json
{
  "email": "admin@example.com",
  "password": "StrongPass123"
}
```

### Expected Result

- Status Code: 200 OK
- User role confirmed as "admin"
- User information returned (excluding password)
- All user fields populated correctly

### Actual Result

- **Status Code:** 200 OK ✅
- **Response Body:**

```json
{
  "id": 394,
  "email": "admin@example.com",
  "name": "Admin User",
  "surname": "Test",
  "address": "123 Main Street",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "541112345678",
  "role": "admin",
  "createdAt": "2025-10-29T00:21:25.752Z",
  "updatedAt": "2025-10-29T00:21:25.752Z"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Admin authentication working correctly
- Role verification successful
- User data properly returned
- Password excluded from response (security compliance)
- All user fields populated correctly

### Evidence

- **File:** `TC-014-admin-login-success.png`
- **Location:** `evidences/TC-014-admin-login-success.png`

---

## TC-015: Admin login with invalid credentials

**Date:** 28-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** Medium
**Module:** Login - (Admin Module)

### Description

Verifies that the system properly handles login attempts with invalid credentials for admin users.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning
- Admin user registered in the system

### Execution Steps

1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with invalid admin credentials
3. Verify server response and error handling

### Test Data

```json
{
  "email": "admin@example.com",
  "password": "WrongPassword123"
}
```

### Expected Result

- Status Code: 401 Unauthorized
- Error message indicating invalid credentials
- No user information returned

### Actual Result

- **Status Code:** 401 Unauthorized ✅
- **Response Body:**

```json
{
  "message": "Invalid credentials"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Error handling working correctly
- Security measures properly implemented
- No sensitive information leaked
- Appropriate HTTP status code returned

### Evidence

- **File:** `TC-015-admin-invalid-credentials.png`
- **Location:** `evidences/TC-015-admin-invalid-credentials.png`

---

## TC-016: Admin login with non-existent email

**Date:** 28-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** Medium
**Module:** Login - (Admin Module)

### Description

Verifies that the system properly handles login attempts with non-existent admin email addresses.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with non-existent admin email
3. Verify server response and error handling

### Test Data

```json
{
  "email": "nonexistent-admin@example.com",
  "password": "SomePassword123"
}
```

### Expected Result

- Status Code: 401 Unauthorized
- Error message indicating invalid credentials
- No user information returned

### Actual Result

- **Status Code:** 401 Unauthorized ✅
- **Response Body:**

```json
{
  "message": "Invalid credentials"
}
```

### Result

**✅ PASS** - Test executed successfully

### Observations

- Consistent error handling for non-existent users
- Security best practices followed (no user enumeration)
- Appropriate error message without revealing user existence
- Proper HTTP status code returned

### Evidence

- **File:** `TC-016-admin-non-existent-user.png`
- **Location:** `evidences/TC-016-admin-non-existent-user.png`

---

## Test Summary

### Overall Results

- **Total Test Cases:** 3
- **Passed:** 3 (100%)
- **Failed:** 0 (0%)
- **Blocked:** 0 (0%)

### Key Findings

1. ✅ Admin login functionality working correctly
2. ✅ Role-based authentication properly implemented
3. ✅ Security measures adequate
4. ✅ Error handling comprehensive
5. ✅ User data returned correctly

### Recommendations

1. All admin login scenarios tested and working
2. Security implementation meets requirements
3. No additional test cases required at this time
4. Consider adding rate limiting tests in future iterations

### Last Updated

October 28, 2025 - Gian Luca Caravone
