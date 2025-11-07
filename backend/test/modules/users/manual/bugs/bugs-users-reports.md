# BUG-002: Registration with duplicate email returns 500 instead of 409 ✅ FIXED

**Module:** Users - Registration
**Related Test Case:** TC-002  
**Severity:** Medium  
**Priority:** High  
**Date:** 08-10-2025  
**Tester:** Gian Luca Caravone  
**Status:** Closed - Fixed  
**Fix Date:** 08-10-2025

## Bug Description
The user registration endpoint returns HTTP status code 500 (Internal Server Error) when attempting to register a user with an email that already exists in the database, instead of the standard 409 (Conflict) code for this type of situation.

## Test Data
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

## Steps to Reproduce
1. Create user with the above data (if it doesn't exist)
2. Repeat the creation of the same user with the same email
3. Verify the API response

## Expected Result
- **Status Code:** 409 Conflict
- **Error message:** "User with that email already exists"
- **Behavior:** No new user created in the database

## Actual Result (BEFORE fix)
- **Status Code:** 500 Internal Server Error ❌
- **Message:** "Error registering user"
- **Behavior:** Internal server error

## Result After Fix
- **Status Code:** 409 Conflict ✅
- **Message:** "User with that email already exists"
- **Behavior:** Correct response following HTTP standards

## Impact
- **Functional:** The endpoint works but doesn't follow HTTP standards
- **Usability:** API clients receive a generic error instead of a specific message
- **Maintenance:** Makes it difficult to identify specific problems

## Implemented Solution ✅
The code was modified to:
1. ✅ Detect when the email already exists in the database
2. ✅ Return status code 409 (Conflict)
3. ✅ Include specific error message: "User with that email already exists"

## Fix Validation
- **TC-002:** Executed successfully after the fix
- **Result:** PASS - Endpoint now responds correctly
- **Evidence:** TC002-duplicate-email-fixed.png

## Evidence

### Bug Evidence (Original)
- **File:** `BUG-002-duplicate-email.png`
- **Location:** `backend/test/modules/users/manual/bugs/BUG-002-duplicate-email.png`
- **Description:** Screenshot showing 500 response instead of expected 409
- **Type:** HTTP response error screenshot

### Fix Evidence
- **File:** `TC-002-duplicate-email-fixed.png`
- **Location:** `backend/test/modules/users/manual/evidences/TC-002-duplicate-email-fixed.png`
- **Description:** Screenshot showing correct 409 Conflict response
- **Type:** Fixed HTTP response screenshot

## Observations
- ✅ Bug successfully fixed
- ✅ TC-002 validated after the fix
- ✅ Endpoint now correctly follows HTTP standards
- ✅ Significant improvement in developer experience

## History
- **08-10-2025:** Bug identified during manual testing by Gian Luca Caravone
- **08-10-2025:** Report created and evidence attached
- **08-10-2025:** Bug fixed and validated with TC-002
- **08-10-2025:** Status changed to "Closed - Fixed"

---

# BUG-005: Missing required fields validation returns technical error instead of user-friendly message ✅ FIXED

**Module:** Users - Registration  
**Related Test Case:** TC-005  
**Severity:** Medium  
**Priority:** High  
**Date:** 14-10-2025  
**Tester:** Gian Luca Caravone  
**Status:** Closed - Fixed  
**Fix Date:** 14-10-2025

## Bug Description
The user registration endpoint returns a technical error message when required fields (email, password, confirmPassword) are empty, instead of a clear validation message indicating which fields are missing.

## Test Data
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

## Steps to Reproduce
1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with empty required fields (email, password, confirmPassword)
3. Verify the API response

## Expected Result
- **Status Code:** 400 Bad Request
- **Error message:** "Email, password, confirmPassword, name and surname are required"
- **Behavior:** Clear validation message for missing fields

## Actual Result (BEFORE fix)
- **Status Code:** 400 Bad Request
- **Message:** "Cannot destructure property 'email' of 'user' as it is undefined."
- **Behavior:** Technical error message that doesn't help the user

## Result After Fix
- **Status Code:** 400 Bad Request ✅
- **Message:** "Email, password, confirmPassword, name and surname are required" ✅
- **Behavior:** Clear validation message indicating missing required fields

## Impact
- **Functional:** Validation works but provides poor user experience
- **Usability:** Users receive confusing technical error instead of clear guidance
- **Developer Experience:** Makes debugging difficult for API consumers
- **User Experience:** Poor error messaging reduces application usability

## Root Cause Analysis
The error suggests that the validation middleware is trying to destructure properties from an undefined `user` object, indicating that the validation logic is not properly handling empty or missing required fields before attempting to process the request.

## Implemented Solution ✅
The code was modified to:
1. ✅ Implement proper validation middleware that checks for required fields before processing
2. ✅ Return clear, user-friendly error messages indicating which specific fields are missing
3. ✅ Ensure validation happens before any destructuring operations
4. ✅ Follow consistent error message format across all validation scenarios

### Technical Changes Made:
- **Controller:** Updated to handle validation errors properly
- **Service:** Modified to validate required fields before processing
- **Validation Middleware:** Enhanced to provide clear error messages for missing fields

## Fix Validation
- **TC-005:** Executed successfully after the fix
- **Result:** PASS - Endpoint now responds correctly with proper validation message
- **Evidence:** BUG-005-missing-required-field.png

## Evidence

### Bug Evidence (Original)
- **File:** `BUG-005-missing-required-field.png`
- **Location:** `backend/test/modules/users/manual/bugs/BUG-005-missing-required-field.png`
- **Description:** Screenshot showing technical error message instead of validation message
- **Type:** HTTP response error screenshot

### Fix Evidence
- **File:** `TC-005-missing-required-field-fixed.png`
- **Location:** `backend/test/modules/users/manual/evidences/TC-005-missing-required-field-fixed.png`
- **Description:** Screenshot showing correct validation message for missing required fields
- **Type:** Fixed HTTP response screenshot

## Observations
- ✅ Bug successfully fixed
- ✅ TC-005 validated after the fix
- ✅ Endpoint now returns user-friendly validation messages
- ✅ Significant improvement in user experience and developer experience

## History
- **14-10-2025:** Bug identified during manual testing by Gian Luca Caravone
- **14-10-2025:** Report created and evidence attached
- **14-10-2025:** Status set to "Open - Not Fixed"
- **14-10-2025:** Bug fixed by updating controller, service, and validation middleware
- **14-10-2025:** Status changed to "Closed - Fixed"

---

# BUG-009: Login with non-existent user reveals user existence information (Security Issue) ✅ FIXED

**Module:** Users - Login  
**Related Test Case:** TC-009  
**Severity:** High  
**Priority:** High  
**Date:** 16-10-2025  
**Tester:** Gian Luca Caravone  
**Status:** Closed - Fixed  
**Fix Date:** 16-10-2025

## Bug Description
The user login endpoint returns HTTP status code 404 (Not Found) with the message "User with that email does not exist" when attempting to login with a non-existent email. This behavior reveals information about user existence in the system, which is a security vulnerability that can be exploited for user enumeration attacks.

## Test Data
```json
{
  "email": "nonexistent@example.com",
  "password": "AnyPassword123"
}
```

## Steps to Reproduce
1. Send POST request to `http://localhost:5000/users/login`
2. Include JSON body with non-existent email
3. Verify the API response

## Expected Result
- **Status Code:** 401 Unauthorized
- **Error message:** "Invalid credentials"
- **Behavior:** Generic error message that doesn't reveal user existence

## Actual Result (BEFORE fix)
- **Status Code:** 404 Not Found ❌
- **Message:** "User with that email does not exist" ❌
- **Behavior:** Reveals that the user doesn't exist in the system

## Result After Fix
- **Status Code:** 401 Unauthorized ✅
- **Message:** "Invalid credentials" ✅
- **Behavior:** Generic error message that prevents user enumeration

## Impact
- **Security:** High - Allows attackers to enumerate valid user emails
- **Privacy:** Users' email addresses can be discovered through brute force
- **Compliance:** Violates security best practices for authentication systems
- **User Experience:** Poor security posture reduces trust in the application

## Root Cause Analysis
The login service was checking for user existence first and throwing a specific error message, which was then mapped to a 404 status code in the controller. This approach prioritizes clarity over security, revealing system information that should remain hidden.

## Implemented Solution ✅
The code was modified to:
1. ✅ Return generic "Invalid credentials" message for both non-existent users and wrong passwords
2. ✅ Use HTTP status code 401 (Unauthorized) for all authentication failures
3. ✅ Prevent user enumeration attacks by not revealing user existence
4. ✅ Follow security best practices for authentication systems

### Technical Changes Made:
- **Service (`users-services.ts`):** Changed error messages to generic "Invalid credentials" for both user not found and invalid password scenarios
- **Controller (`users-controllers.ts`):** Updated error mapping to return 401 for all "Invalid credentials" errors
- **Test Case (TC-009):** Updated expected results to reflect new security behavior

## Fix Validation
- **TC-009:** Updated and validated with new security requirements
- **AUTO-008:** Updated automated test to expect 401 instead of 404
- **Result:** PASS - Endpoint now follows security best practices

## Evidence

### Bug Evidence (Original)
- **File:** `BUG-009-login-non-existent-user.png`
- **Location:** `backend/test/modules/users/manual/evidences/BUG-009-login-non-existent-user.png`
- **Description:** Screenshot showing 404 response revealing user non-existence
- **Type:** HTTP response security vulnerability screenshot

### Fix Evidence
- **File:** `TC-009-login-non-existent-user.png` (Updated)
- **Location:** `backend/test/modules/users/manual/evidences/TC-009-login-non-existent-user.png`
- **Description:** Screenshot showing correct 401 response with generic error message
- **Type:** Fixed HTTP response security screenshot

## Observations
- ✅ Security vulnerability successfully fixed
- ✅ TC-009 updated to reflect new security requirements
- ✅ Automated test AUTO-008 updated accordingly
- ✅ System now follows authentication security best practices
- ✅ User enumeration attacks are now prevented

## Security Improvements
- **Before:** System revealed user existence through specific error messages
- **After:** System provides generic error messages for all authentication failures
- **Impact:** Significantly improved security posture against enumeration attacks
- **Compliance:** Now follows OWASP guidelines for secure authentication

## History
- **16-10-2025:** Security issue identified during code review by Gian Luca Caravone
- **16-10-2025:** Bug report created and classified as high severity security issue
- **16-10-2025:** Backend code updated to implement security best practices
- **16-10-2025:** Test cases updated to reflect new security behavior
- **16-10-2025:** Status changed to "Closed - Fixed"

---

# BUG-008: Login with incorrect password reveals specific failure reason (Security Issue) ✅ FIXED

**Module:** Users - Login  
**Related Test Case:** TC-008  
**Severity:** Medium  
**Priority:** High  
**Date:** 16-10-2025  
**Tester:** Gian Luca Caravone  
**Status:** Closed - Fixed  
**Fix Date:** 16-10-2025

## Bug Description
The user login endpoint returns HTTP status code 401 (Unauthorized) with the specific message "Invalid password" when attempting to login with an incorrect password. While this doesn't reveal user existence like the non-existent user case, it still provides specific information about the authentication failure reason, which can be used by attackers to gather information about the system's authentication logic.

## Test Data
```json
{
  "email": "login1@example.com",
  "password": "WrongPassword123"
}
```

## Steps to Reproduce
1. Create a user with valid credentials
2. Send POST request to `http://localhost:5000/users/login`
3. Include JSON body with correct email but incorrect password
4. Verify the API response

## Expected Result
- **Status Code:** 401 Unauthorized
- **Error message:** "Invalid credentials"
- **Behavior:** Generic error message that doesn't reveal specific failure reason

## Actual Result (BEFORE fix)
- **Status Code:** 401 Unauthorized
- **Message:** "Invalid password" ❌
- **Behavior:** Reveals that the password is incorrect (specific failure reason)

## Result After Fix
- **Status Code:** 401 Unauthorized ✅
- **Message:** "Invalid credentials" ✅
- **Behavior:** Generic error message that prevents information leakage about specific failure reasons

## Impact
- **Security:** Medium - Provides specific information about authentication failure reasons
- **Information Disclosure:** Attackers can distinguish between different types of authentication failures
- **Consistency:** Inconsistent error messaging compared to other authentication failure scenarios
- **Best Practices:** Violates security best practices for generic error messaging

## Root Cause Analysis
The login service was providing specific error messages for different authentication failure scenarios (user not found vs. incorrect password), which creates an inconsistent security posture and provides more information than necessary to potential attackers.

## Implemented Solution ✅
The code was modified to:
1. ✅ Return generic "Invalid credentials" message for all authentication failures
2. ✅ Maintain HTTP status code 401 (Unauthorized) for authentication failures
3. ✅ Ensure consistent error messaging across all authentication failure scenarios
4. ✅ Follow security best practices for generic error messaging

### Technical Changes Made:
- **Service (`users-services.ts`):** Changed specific "Invalid password" error to generic "Invalid credentials"
- **Controller (`users-controllers.ts`):** Updated error mapping to handle all "Invalid credentials" errors consistently
- **Test Case (TC-008):** Updated expected results to reflect new generic error messaging

## Fix Validation
- **TC-008:** Updated and validated with new security requirements
- **AUTO-007:** Updated automated test to expect generic "Invalid credentials" message
- **Result:** PASS - Endpoint now provides consistent generic error messaging

## Evidence

### Bug Evidence (Original)
- **File:** `BUG-008-login-incorrect-password.png`
- **Location:** `backend/test/modules/users/manual/bugs/BUG-008-login-incorrect-password.png`
- **Description:** Screenshot showing specific "Invalid password" error message
- **Type:** HTTP response information disclosure screenshot

### Fix Evidence
- **File:** `TC-008-login-incorrect-password.png` (Updated)
- **Location:** `backend/test/modules/users/manual/evidences/TC-008-login-incorrect-password.png`
- **Description:** Screenshot showing correct generic "Invalid credentials" error message
- **Type:** Fixed HTTP response security screenshot

## Observations
- ✅ Information disclosure issue successfully fixed
- ✅ TC-008 updated to reflect new security requirements
- ✅ Automated test AUTO-007 updated accordingly
- ✅ System now provides consistent generic error messaging
- ✅ Authentication failure reasons are no longer revealed

## Security Improvements
- **Before:** System revealed specific authentication failure reasons
- **After:** System provides generic error messages for all authentication failures
- **Impact:** Improved security posture through consistent generic error messaging
- **Consistency:** All authentication failures now return the same generic message

## History
- **16-10-2025:** Information disclosure issue identified during security review by Gian Luca Caravone
- **16-10-2025:** Bug report created and classified as medium severity security issue
- **16-10-2025:** Backend code updated to implement consistent generic error messaging
- **16-10-2025:** Test cases updated to reflect new security behavior
- **16-10-2025:** Status changed to "Closed - Fixed"

---
