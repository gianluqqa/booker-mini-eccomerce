# BUG-002: Registration with duplicate email returns 500 instead of 409 ✅ FIXED

**Module:** Users  
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
- **Location:** `backend/test/users/manual/bugs/BUG-002-duplicate-email.png`
- **Description:** Screenshot showing 500 response instead of expected 409
- **Type:** HTTP response error screenshot

### Fix Evidence
- **File:** `TC-002-duplicate-email-fixed.png`
- **Location:** `backend/test/users/manual/evidences/TC-002-duplicate-email-fixed.png`
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

**Module:** Users  
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
- **Location:** `backend/test/users/manual/bugs/BUG-005-missing-required-field.png`
- **Description:** Screenshot showing technical error message instead of validation message
- **Type:** HTTP response error screenshot

### Fix Evidence
- **File:** `TC-005-missing-required-field.png`
- **Location:** `backend/test/users/manual/evidences/TC-005-missing-required-field.png`
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