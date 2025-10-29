# BUG-013: User registration ignores role field and always assigns "customer" role ✅ FIXED

**Module:** Users - Registration  
**Related Test Case:** TC-013  
**Severity:** High  
**Priority:** High  
**Date:** 23-10-2025  
**Tester:** Gian Luca Caravone  
**Status:** Closed - Fixed  
**Fix Date:** 23-10-2025

## Bug Description
The user registration endpoint ignores the `role` field in the request body and always assigns the "customer" role to new users, regardless of the role specified in the registration request. This prevents the creation of admin users and limits the system's role-based access control functionality.

## Test Data
```json
{
  "email": "userrsoutes@example.com",
  "password": "StrongPass123",
  "confirmPassword": "StrongPass123",
  "name": "User Routes 1",
  "surname": "Test",
  "address": "123 Main Street",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "541112345678",
  "role": "admin"
}
```

## Steps to Reproduce
1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with `"role": "admin"`
3. Verify the API response and check the assigned role

## Expected Result
- **Status Code:** 201 Created
- **Response Body:** User created with `"role": "admin"`
- **Behavior:** Role field from request should be respected and assigned to the user

## Actual Result (BEFORE fix)
- **Status Code:** 201 Created
- **Response Body:** User created with `"role": "customer"` ❌
- **Response Time:** 158 ms
- **Response Size:** 549 B
- **User ID:** 337
- **Behavior:** Role field from request was ignored, always defaulting to "customer"

## Result After Fix
- **Status Code:** 201 Created ✅
- **Response Body:** User created with `"role": "admin"` ✅
- **Response Time:** 147 ms
- **Response Size:** 544 B
- **User ID:** 338
- **Behavior:** Role field from request is now properly respected and assigned

## Impact
- **Functional:** High - Prevents creation of admin users, breaking role-based access control
- **Security:** Admin functionality cannot be properly tested or implemented
- **Business Logic:** System cannot differentiate between customer and admin users
- **User Experience:** Admin users cannot be created through the API

## Root Cause Analysis
The issue was caused by two main problems:
1. **Missing DTO field:** The `RegisterUserDTO` interface did not include the `role` field
2. **Service logic:** The `registerUserService` was not using the role from the request, only using the default value from the entity

## Implemented Solution ✅
The code was modified to:
1. ✅ Add `role?: string` field to `RegisterUserDTO` interface
2. ✅ Add role validation in `validateUser.ts` middleware to ensure only valid roles ("customer" or "admin")
3. ✅ Update `registerUserService` to use the role from the request: `role: (user.role as UserRole) ?? UserRole.CUSTOMER`
4. ✅ Import `UserRole` enum in the service for proper type checking

### Technical Changes Made:
- **DTO (`UserDto.ts`):** Added `role?: string` field to `RegisterUserDTO`
- **Validation (`validateUser.ts`):** Added role validation to ensure only valid enum values
- **Service (`userServices.ts`):** Updated to use role from request instead of always defaulting to CUSTOMER
- **Type Safety:** Added proper TypeScript typing with `UserRole` enum

## Fix Validation
- **TC-013:** New test case created for admin user registration
- **Result:** PASS - Endpoint now properly handles role assignment

## Evidence

### Bug Evidence (Original)
- **File:** `BUG-013-registration-ignores-role-admin.png`
- **Location:** `backend/test/modules/admin/manual/bugs/BUG-013-registration-ignores-role-admin.png`
- **Description:** Screenshot showing user created with "customer" role despite requesting "admin" in the request body
- **Details:** 
  - Request: `"role": "admin"` specified in JSON body
  - Response: User created with `"role": "customer"` (ID: 337)
  - Status: 201 Created (158 ms, 549 B)
- **Type:** HTTP response functional bug screenshot

### Fix Evidence
- **File:** `TC-013-admin-registration-succes.png`
- **Location:** `backend/test/modules/admin/manual/evidences/TC-013-admin-registration-succes.png`
- **Description:** Screenshot showing user created with "admin" role as requested after bug fix
- **Details:**
  - Request: `"role": "admin"` specified in JSON body
  - Response: User created with `"role": "admin"` (ID: 338)
  - Status: 201 Created (147 ms, 544 B)
- **Type:** Fixed HTTP response functional screenshot

## Observations
- ✅ Role assignment functionality successfully implemented
- ✅ DTO updated to include role field
- ✅ Validation added for role field
- ✅ Service logic updated to respect role from request
- ✅ Type safety improved with proper enum usage
- ✅ System now supports proper role-based access control

## Functional Improvements
- **Before:** All users were created as "customer" regardless of role request
- **After:** Users are created with the role specified in the request
- **Impact:** Enables proper role-based access control and admin user creation
- **Security:** Allows proper implementation of role-based permissions

## History
- **23-10-2025:** Role assignment bug identified during API testing by Gian Luca Caravone
- **23-10-2025:** Bug report created and classified as high severity functional issue
- **23-10-2025:** Backend code updated to implement proper role assignment
- **23-10-2025:** DTO, validation, and service layers updated
- **23-10-2025:** Status changed to "Closed - Fixed"