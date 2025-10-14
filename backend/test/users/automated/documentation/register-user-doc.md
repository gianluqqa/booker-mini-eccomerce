# Automated Test: User Registration

## Objective

The objective of this automated test suite is to validate the user registration functionality of the Booker e-commerce system. This test ensures that:

- New users can successfully register with valid data
- The system properly validates input data and rejects invalid information
- Database operations are performed correctly
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
npm test -- --testNamePattern="1. should create a new user successfully"
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

- **File:** `test-reports/users-test-report.html`
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
npm test -- --testNamePattern="2. should reject duplicate email"
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

- **File:** `test-reports/users-test-report.html`
- **Content:** Complete test execution details, HTTP responses, and timing
- **Access:** Open in browser for full interactive experience

