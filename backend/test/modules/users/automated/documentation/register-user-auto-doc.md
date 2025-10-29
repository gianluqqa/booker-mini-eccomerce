# Automated Test: Registration (Users Module)

## Objective

The objective of this automated test suite is to validate the user registration functionality of the Booker e-commerce system. This test ensures that:

- New users can successfully register with valid data
- The system properly validates input data and rejects invalid information
- Database operations are performed correctly
- Users can be registered with specific roles (e.g., admin)
- API responses follow HTTP standards
- Error handling works as expected for various edge cases

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
- **Registration Endpoint:** `POST /users/register`
- **Full URL:** `http://localhost:5000/users/register`
- **Content-Type:** `application/json`

## AUTO-001: Successful new user registration

**Date:** 14-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `register-user-auto.test.ts`
**Endpoint:** `POST /users/register`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies successful user registration through API endpoint with complete validation flow.

### Test Data

```json
{
  "email": "test-[timestamp]@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "name": "John",
  "surname": "Doe"
}
```

### Expected Result

- **Status Code:** 201 Created
- **Response:** User object (password excluded)
- **Database:** New user record created

### Execution

```bash
npm test -- --testNamePattern="AUTO-001: should create a new user successfully"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/register`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with user registration data

### Test Results

**✅ PASS** - Test executed successfully

- **Execution Time:** 109 ms
- **Status Code:** 201 Created
- **Database:** User record created successfully

### Test Status

**✅ PASS** - User registration successful

- **Response:** User object returned (password excluded)
- **Database:** New user record created with unique ID
- **Role:** Default role assigned as "customer"

### Evidence

**📊 AUTO-001 Test Evidence:**

- **File:** `test-reports/register-test-report.html`
- **Content:** Complete test execution details, response data, and timing
- **Access:** Open in browser for full interactive experience

## AUTO-002: Reject duplicate email

**Date:** 14-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `register-user-auto.test.ts`
**Endpoint:** `POST /users/register`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies that the system properly rejects registration attempts with duplicate email addresses and returns appropriate HTTP status codes.

### Test Data

```json
{
  "email": "duplicate-[timestamp]@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "name": "First",
  "surname": "User"
}
```

### Expected Result

- **First Registration:** 201 Created
- **Duplicate Attempt:** 409 Conflict
- **Error Message:** "User with that email already exists"

### Execution

```bash
npm test -- --testNamePattern="AUTO-002: should reject duplicate email"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/register`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with duplicate email data

### Test Results

**✅ PASS** - Duplicate email rejection working correctly

- **Execution Time:** 80 ms
- **First Registration:** 201 Created (66 ms)
- **Duplicate Attempt:** 409 Conflict (3 ms)
- **Error Message:** "User with that email already exists"

### Test Status

**✅ PASS** - Duplicate email rejection working correctly

- **Status Codes:** 201 Created → 409 Conflict
- **Error Handling:** Proper HTTP status codes
- **Database:** No duplicate records created
- **Validation:** Email uniqueness properly enforced

### Evidence

**📊 AUTO-002 Test Evidence:**

- **File:** `test-reports/register-test-report.html`
- **Content:** Complete test execution details, HTTP responses, and timing
- **Access:** Open in browser for full interactive experience

## AUTO-003: Reject incomplete data

**Date:** 14-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `register-user-auto.test.ts`
**Endpoint:** `POST /users/register`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies that the system properly rejects registration attempts with missing required fields and returns appropriate validation error messages.

### Test Data

```json
{
  "email": "test-[timestamp]@example.com"
  // Missing: password, confirmPassword, name, surname
}
```

### Expected Result

- **Status Code:** 400 Bad Request
- **Error Message:** "Email, password, confirmPassword, name and surname are required"
- **Database:** No user record created

### Execution

```bash
npm test -- --testNamePattern="AUTO-003: should reject incomplete data"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/register`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with incomplete user data

### Test Results

**✅ PASS** - Incomplete data validation working correctly

- **Execution Time:** ~8 ms
- **Status Code:** 400 Bad Request
- **Error Message:** "Email, password, confirmPassword, name and surname are required"

### Test Status

**✅ PASS** - Incomplete data validation working correctly

- **Validation:** Required fields properly validated
- **Error Handling:** Clear error message for missing fields
- **Database:** No incomplete records created
- **HTTP Standards:** Proper 400 status code for bad requests

### Evidence

**📊 AUTO-003 Test Evidence:**

- **File:** `test-reports/register-test-report.html`
- **Content:** Complete test execution details, validation errors, and timing
- **Access:** Open in browser for full interactive experience

## AUTO-004: Reject invalid email format

**Date:** 14-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `register-user-auto.test.ts`
**Endpoint:** `POST /users/register`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies that the system properly validates email format and rejects registration attempts with invalid email addresses.

### Test Data

```json
{
  "email": "invalid-email-format",
  "password": "Password123",
  "confirmPassword": "Password123",
  "name": "John",
  "surname": "Doe"
}
```

### Expected Result

- **Status Code:** 400 Bad Request
- **Error Message:** "Email format is invalid"
- **Database:** No user record created

### Execution

```bash
npm test -- --testNamePattern="AUTO-004: should reject invalid email format"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/register`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with invalid email format

### Test Results

**✅ PASS** - Email format validation working correctly

- **Execution Time:** ~7 ms
- **Status Code:** 400 Bad Request
- **Error Message:** "Email format is invalid"

### Test Status

**✅ PASS** - Email format validation working correctly

- **Validation:** Email format properly validated
- **Error Handling:** Clear error message for invalid format
- **Database:** No invalid records created
- **Security:** Prevents malformed email addresses

### Evidence

**📊 AUTO-004 Test Evidence:**

- **File:** `test-reports/register-test-report.html`
- **Content:** Complete test execution details, validation errors, and timing
- **Access:** Open in browser for full interactive experience

## AUTO-005: Reject mismatched passwords

**Date:** 14-10-2025
**Type:** Automated Test  
**Priority:** High  
**File:** `register-user-auto.test.ts`
**Endpoint:** `POST /users/register`
**Base URL:** `http://localhost:5000`

### Test Description

Verifies that the system properly validates password confirmation matching and rejects registration attempts when passwords do not match.

### Test Data

```json
{
  "email": "test-[timestamp]@example.com",
  "password": "Password123",
  "confirmPassword": "DifferentPassword456",
  "name": "John",
  "surname": "Doe"
}
```

### Expected Result

- **Status Code:** 400 Bad Request
- **Error Message:** "Passwords do not match"
- **Database:** No user record created

### Execution

```bash
npm test -- --testNamePattern="AUTO-005: should reject mismatched passwords"
```

**API Call Details:**
- **Method:** POST
- **URL:** `http://localhost:5000/users/register`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON with mismatched passwords

### Test Results

**✅ PASS** - Password matching validation working correctly

- **Execution Time:** ~6 ms
- **Status Code:** 400 Bad Request
- **Error Message:** "Passwords do not match"

### Test Status

**✅ PASS** - Password matching validation working correctly

- **Validation:** Password confirmation properly validated
- **Error Handling:** Clear error message for mismatched passwords
- **Database:** No user records created with mismatched passwords
- **Security:** Ensures password accuracy during registration

### Evidence
**📊 AUTO-005 Test Evidence:**

- **File:** `test-reports/register-test-report.html`
- **Content:** Complete test execution details, validation errors, and timing
- **Access:** Open in browser for full interactive experience

