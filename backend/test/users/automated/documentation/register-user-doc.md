# Automated Test: User Registration

## TC-001: Successful new user registration

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

- **File:** `TC001-register-user-auto-PASS.png`
- **Location:** `evidences/TC001-register-user-auto-PASS.png`
