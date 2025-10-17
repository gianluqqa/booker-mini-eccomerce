# Automated Test: Login (Users Module)

## Objective

The objective of this automated test suite is to validate the user login functionality of the Booker e-commerce system. This test ensures that:

- Users can successfully authenticate with valid credentials
- The system properly validates input data and rejects invalid information
- Authentication security measures work correctly
- API responses follow HTTP standards
- Error handling works as expected for various edge cases
- Security best practices are implemented (generic error messages, proper status codes)

## Environment

- **Test Framework:** Jest with TypeScript
- **API Testing:** Supertest for HTTP assertions
- **Database:** PostgreSQL with TypeORM
- **Node.js Version:** v22.16.0
- **Test Environment:** Isolated test database
- **Coverage Tool:** Jest built-in coverage reporting
- **Execution Time:** ~4-5 seconds per test suite

## API Endpoints

- **Base URL:** `http://localhost:5000`
- **Login Endpoint:** `POST /users/login`
- **Full URL:** `http://localhost:5000/users/login`
- **Content-Type:** `application/json`

## AUTO-006: Successful user login

**Date:** 16-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `login-user-auto.test.ts`
**Endpoint:** `POST /users/login`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies successful user authentication through API endpoint with complete validation flow and secure user data return.

### Test Data

```json
{
  "email": "login-success-[timestamp]@example.com",
  "password": "StrongPass123"
}
```

### Expected Result

- **Status Code:** 200 OK
- **Response:** User object (password excluded)
- **Security:** Password not included in response

### Execution

```bash
npm test -- --testNamePattern="AUTO-006: should login user successfully with valid credentials"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/login`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with user login credentials

### Test Results

**✅ PASS** - Test executed successfully

- **Execution Time:** ~200 ms
- **Status Code:** 200 OK
- **Response:** Complete user object returned
- **Security:** Password excluded from response

### Test Status

**✅ PASS** - User login successful

- **Response:** User object returned (password excluded)
- **Database:** User authentication verified
- **Role:** User role correctly returned
- **Security:** Sensitive data properly excluded

### Evidence

**📊 AUTO-006 Test Evidence:**

- **File:** `test-reports/users-test-report.html`
- **Content:** Complete test execution details, response data, and timing
- **Access:** Open in browser for full interactive experience

## AUTO-007: Reject login with incorrect password

**Date:** 16-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `login-user-auto.test.ts`
**Endpoint:** `POST /users/login`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies that the system properly rejects login attempts with incorrect passwords and returns appropriate security-focused error messages.

### Test Data

```json
{
  "email": "incorrect-password-[timestamp]@example.com",
  "password": "WrongPassword123"
}
```

### Expected Result

- **Status Code:** 401 Unauthorized
- **Error Message:** "Invalid credentials"
- **Security:** Generic error message to prevent information disclosure

### Execution

```bash
npm test -- --testNamePattern="AUTO-007: should reject login with incorrect password"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/login`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with incorrect password

### Test Results

**✅ PASS** - Incorrect password rejection working correctly

- **Execution Time:** ~130 ms
- **Status Code:** 401 Unauthorized
- **Error Message:** "Invalid credentials"

### Test Status

**✅ PASS** - Incorrect password rejection working correctly

- **Security:** Generic error message prevents information disclosure
- **Status Code:** Proper 401 Unauthorized response
- **Authentication:** Password validation working correctly
- **Best Practices:** Follows OWASP security guidelines

### Evidence

**📊 AUTO-007 Test Evidence:**

- **File:** `test-reports/users-test-report.html`
- **Content:** Complete test execution details, HTTP responses, and timing
- **Access:** Open in browser for full interactive experience

## AUTO-008: Reject login with non-existent user

**Date:** 16-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `login-user-auto.test.ts`
**Endpoint:** `POST /users/login`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies that the system properly handles login attempts with non-existent users and returns generic error messages to prevent user enumeration attacks.

### Test Data

```json
{
  "email": "nonexistent@example.com",
  "password": "AnyPassword123"
}
```

### Expected Result

- **Status Code:** 401 Unauthorized
- **Error Message:** "Invalid credentials"
- **Security:** Generic error message to prevent user enumeration

### Execution

```bash
npm test -- --testNamePattern="AUTO-008: should reject login with non-existent user"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/login`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with non-existent user email

### Test Results

**✅ PASS** - Non-existent user handling working correctly

- **Execution Time:** ~8 ms
- **Status Code:** 401 Unauthorized
- **Error Message:** "Invalid credentials"

### Test Status

**✅ PASS** - Non-existent user handling working correctly

- **Security:** Generic error message prevents user enumeration attacks
- **Status Code:** Proper 401 Unauthorized response
- **Best Practices:** Follows security guidelines for authentication
- **Privacy:** No information leakage about user existence

### Evidence

**📊 AUTO-008 Test Evidence:**

- **File:** `test-reports/users-test-report.html`
- **Content:** Complete test execution details, HTTP responses, and timing
- **Access:** Open in browser for full interactive experience

## AUTO-009: Reject login with missing email

**Date:** 16-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `login-user-auto.test.ts`
**Endpoint:** `POST /users/login`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies that the system properly validates required fields and rejects login attempts when the email field is missing.

### Test Data

```json
{
  "password": "StrongPass123"
  // Missing: email field
}
```

### Expected Result

- **Status Code:** 400 Bad Request
- **Error Message:** "Email is required"
- **Validation:** Required field validation working

### Execution

```bash
npm test -- --testNamePattern="AUTO-009: should reject login with missing email"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/login`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with missing email field

### Test Results

**✅ PASS** - Missing email validation working correctly

- **Execution Time:** ~6 ms
- **Status Code:** 400 Bad Request
- **Error Message:** "Email is required"

### Test Status

**✅ PASS** - Missing email validation working correctly

- **Validation:** Required field validation working properly
- **Error Handling:** Clear error message for missing email
- **HTTP Standards:** Proper 400 status code for bad requests
- **Security:** Prevents incomplete authentication attempts

### Evidence

**📊 AUTO-009 Test Evidence:**

- **File:** `test-reports/users-test-report.html`
- **Content:** Complete test execution details, validation errors, and timing
- **Access:** Open in browser for full interactive experience

## AUTO-010: Reject login with missing password

**Date:** 16-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `login-user-auto.test.ts`
**Endpoint:** `POST /users/login`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies that the system properly validates required fields and rejects login attempts when the password field is missing.

### Test Data

```json
{
  "email": "test@example.com"
  // Missing: password field
}
```

### Expected Result

- **Status Code:** 400 Bad Request
- **Error Message:** "Password is required"
- **Validation:** Required field validation working

### Execution

```bash
npm test -- --testNamePattern="AUTO-010: should reject login with missing password"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/login`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with missing password field

### Test Results

**✅ PASS** - Missing password validation working correctly

- **Execution Time:** ~6 ms
- **Status Code:** 400 Bad Request
- **Error Message:** "Password is required"

### Test Status

**✅ PASS** - Missing password validation working correctly

- **Validation:** Required field validation working properly
- **Error Handling:** Clear error message for missing password
- **HTTP Standards:** Proper 400 status code for bad requests
- **Security:** Prevents incomplete authentication attempts

### Evidence

**📊 AUTO-010 Test Evidence:**

- **File:** `test-reports/users-test-report.html`
- **Content:** Complete test execution details, validation errors, and timing
- **Access:** Open in browser for full interactive experience

## AUTO-011: Reject login with invalid email format

**Date:** 16-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `login-user-auto.test.ts`
**Endpoint:** `POST /users/login`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies that the system properly validates email format and rejects login attempts with invalid email addresses.

### Test Data

```json
{
  "email": "invalid-email-format",
  "password": "StrongPass123"
}
```

### Expected Result

- **Status Code:** 400 Bad Request
- **Error Message:** "Email format is invalid"
- **Validation:** Email format validation working

### Execution

```bash
npm test -- --testNamePattern="AUTO-011: should reject login with invalid email format"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/login`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with invalid email format

### Test Results

**✅ PASS** - Invalid email format validation working correctly

- **Execution Time:** ~5 ms
- **Status Code:** 400 Bad Request
- **Error Message:** "Email format is invalid"

### Test Status

**✅ PASS** - Invalid email format validation working correctly

- **Validation:** Email format validation working properly
- **Error Handling:** Clear error message for invalid format
- **HTTP Standards:** Proper 400 status code for bad requests
- **Security:** Prevents malformed email addresses

### Evidence

**📊 AUTO-011 Test Evidence:**

- **File:** `test-reports/users-test-report.html`
- **Content:** Complete test execution details, validation errors, and timing
- **Access:** Open in browser for full interactive experience

## Test Suite Summary

### Coverage Analysis

The login test suite provides comprehensive coverage of:

- ✅ **Successful Authentication:** Valid user login with complete data
- ✅ **Password Security:** Incorrect password handling with generic error messages
- ✅ **User Enumeration Prevention:** Non-existent user handling with generic error messages
- ✅ **Input Validation:** Required fields validation (email and password)
- ✅ **Format Validation:** Email format validation
- ✅ **Security Best Practices:** Generic error messages and proper HTTP status codes

### Performance Metrics

- **Total Tests:** 6 automated tests
- **Execution Time:** ~4-5 seconds per test suite
- **Success Rate:** 100% (all tests passing)
- **Coverage:** Complete login flow validation

### Security Features Tested

- **Authentication Security:** Generic error messages for failed logins
- **User Enumeration Prevention:** No information leakage about user existence
- **Input Validation:** All required fields and formats
- **Error Handling:** Proper HTTP status codes and security-focused error messages
- **Data Protection:** Password exclusion from responses
- **OWASP Compliance:** Follows security best practices for authentication

### Security Improvements Implemented

- **Before:** Specific error messages revealed authentication failure reasons
- **After:** Generic "Invalid credentials" message for all authentication failures
- **Impact:** Significantly improved security posture against enumeration attacks
- **Compliance:** Now follows OWASP guidelines for secure authentication

### Related Bug Fixes

- **BUG-008:** Fixed specific "Invalid password" error message → Generic "Invalid credentials"
- **BUG-009:** Fixed 404 "User with that email does not exist" → 401 "Invalid credentials"
- **Security Impact:** Prevents user enumeration and information disclosure attacks
