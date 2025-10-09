# BUG-002: Registration with duplicate email returns 500 instead of 409 ✅ FIXED

**Module:** Users  
**Related Test Case:** TC-002  
**Severity:** Medium  
**Priority:** High  
**Date:** 2025-01-08  
**Tester:** Gian Luca Caravone  
**Status:** Closed - Fixed  
**Fix Date:** 2025-01-08

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
- **File:** `BUG002-duplicate-email.png`
- **Location:** `backend/test/users/manual/bugs/BUG002-duplicate-email.png`
- **Description:** Screenshot showing 500 response instead of expected 409
- **Type:** HTTP response error screenshot

### Fix Evidence
- **File:** `TC002-duplicate-email-fixed.png`
- **Location:** `backend/test/users/manual/evidences/TC002-duplicate-email-fixed.png`
- **Description:** Screenshot showing correct 409 Conflict response
- **Type:** Fixed HTTP response screenshot

## Observations
- ✅ Bug successfully fixed
- ✅ TC-002 validated after the fix
- ✅ Endpoint now correctly follows HTTP standards
- ✅ Significant improvement in developer experience

## History
- **2025-01-08:** Bug identified during manual testing by Gian Luca Caravone
- **2025-01-08:** Report created and evidence attached
- **2025-01-08:** Bug fixed and validated with TC-002
- **2025-01-08:** Status changed to "Closed - Fixed"