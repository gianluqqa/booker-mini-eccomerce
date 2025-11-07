# Integration Test: Register + Login Flow

## Objective
Validate the integration between registration (`/users/register`) and login (`/users/login`) endpoints, ensuring that the user creation and authentication flow works correctly as a continuous process. The login response now includes a JWT `accessToken` and keeps user fields at the root level for compatibility.

## Scope
This test covers:
- Successful registration of a new user
- Login with the newly created credentials
- Presence of `accessToken` (JWT) in login response
- HTTP response validation, response body, and database persistence
- Error handling and security validations
- Isolation between multiple users

## Test Data
| Field | Value | Description |
|--------|--------|-------------|
| email | integration-test-{timestamp}@example.com | Unique email with timestamp |
| password | IntegrationPass123 | Valid password |
| confirmPassword | IntegrationPass123 | Password confirmation |
| name | Integration | User name |
| surname | Test | User surname |
| address | 456 Integration Street | Test address |
| country | Argentina | Country |
| city | Córdoba | City |
| phone | 543512345678 | Phone number |

## Test Cases Executed

### INT-001: Complete Successful Flow
**Duration:** 190ms  
**Result:** ✅ PASSED

**Steps:**
1. Register new user with valid data
2. Immediate login with registered user credentials
3. Data consistency verification between endpoints

**Evidence:** See detailed logs in [test-reports/user-register.login-report.html](../tests-reports/user-register.login-report.html)

### INT-002: Failed Flow
**Duration:** 12ms  
**Result:** ✅ PASSED

**Steps:**
1. Attempt registration with invalid data
2. Attempt login with non-existent user

**Evidence:** See detailed logs in [test-reports/user-register.login-report.html](../tests-reports/user-register.login-report.html)

### INT-003: Multiple Users
**Duration:** 319ms  
**Result:** ✅ PASSED

**Steps:**
1. Register 2 different users
2. Successful login with each user
3. User isolation verification

**Evidence:** See detailed logs in [test-reports/user-register.login-report.html](../tests-reports/user-register.login-report.html)

### INT-004: Duplicate Email
**Duration:** 197ms  
**Result:** ✅ PASSED

**Steps:**
1. Register first user
2. Attempt registration with duplicate email
3. Verify only first user can login

**Evidence:** See detailed logs in [test-reports/user-register.login-report.html](../tests-reports/user-register.login-report.html)

## Expected vs Actual Results

| Expectation | Result | Status |
|-------------|--------|--------|
| Successful registration (201) | ✅ 201 Created | ✅ PASSED |
| Successful login (200) | ✅ 200 OK | ✅ PASSED |
| Login returns accessToken | ✅ Present | ✅ PASSED |
| Data consistency | ✅ ID and data match | ✅ PASSED |
| Error validation | ✅ 400/409 appropriate | ✅ PASSED |
| User isolation | ✅ No interference | ✅ PASSED |
| Duplicate prevention | ✅ 409 Conflict | ✅ PASSED |

## Performance Metrics
- **Total time:** 3.466 seconds
- **Tests executed:** 4
- **Tests successful:** 4 (100%)
- **Tests failed:** 0
- **Code coverage:** 92.27%

*Detailed performance metrics and execution logs available in [test-reports/user-register.login-report.html](../tests-reports/user-register.login-report.html)*

## Security Validations
- ✅ Passwords not exposed in responses
- ✅ JWT `accessToken` returned and required for protected endpoints
- ✅ Generic error messages for invalid credentials
- ✅ Email format validation
- ✅ Required fields validation
- ✅ Duplicate email prevention

## Technical Evidence
- **Complete logs:** Available in console during execution
- **HTTP codes:** All status codes verified
- **Response structure:** Consistent JSON between endpoints
- **Database:** Persistence and consistency verified

*Full technical evidence and detailed logs available in [test-reports/user-register.login-report.html](../tests-reports/user-register.login-report.html)*

## Final Status
**Result:** ✅ Passed successfully  
**Date:** 17/10/2025  
**Tester:** Gian Luca Caravone  

## Generated Files
- `user-register-login.test.ts` - Integration tests
- `user-register-login-report.md` - This report
- `test-reports/user-register.login-report.html` - Detailed test evidence and visual report

## Execution Commands
```bash
# Run integration tests
npm run test:integration

# View detailed HTML report
# Open: test/integration-tests/tests-reports/user-register.login-report.html
```