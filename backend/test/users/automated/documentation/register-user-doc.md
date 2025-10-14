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

## AUTO-001: Successful new user registration

**Date:** 2025-01-09  
**Type:** Automated Test  
**Priority:** High  
**File:** `register-user-auto.test.ts`

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
npm test -- --testNamePattern="should create a new user successfully"
```

### Test Results

```
PASS test/users/automated/register-user-auto.test.ts
  User registration tests
    √ should create a new user successfully (127 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

### Test Status

**✅ PASS** - Test executed successfully

- **Status Code:** 201 Created
- **Database:** User record created successfully

### Coverage

- **Controllers:** 100% statements
- **Services:** 100% statements  
- **Middlewares:** 74.41% statements
- **Overall:** 93.36% statements

### Evidence

- **File:** `AUTO-001-register-user-PASS.png`
- **Location:** `evidences/AUTO-001-register-user-PASS.png`
