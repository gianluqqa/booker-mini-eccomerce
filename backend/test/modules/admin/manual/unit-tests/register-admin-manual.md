## TC-013: Successful new user registration (Admin Role)

**Date:** 28-10-2025
**Tester:** Gian Luca Caravone  
**Priority:** High
**Module:** Users - Registration

### Description

Verifies the successful registration of a new user with valid data and admin role.

### Prerequisites

- Backend server running on port 5000
- Database connected and functioning

### Execution Steps

1. Send POST request to `http://localhost:5000/users/register`
2. Include JSON body with valid user data including `"role": "admin"`
3. Verify server response

### Test Data

```json
{
  "email": "admin@example.com",
  "password": "StrongPass123",
  "confirmPassword": "StrongPass123",
  "name": "Admin User",
  "surname": "Test",
  "address": "123 Main Street",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "541112345678",
  "role": "admin"
}
```

### Expected Result

- Status Code: 201 Created
- User created with unique ID
- Role assigned as "admin" (from request)
- Password not included in response

### Actual Result

- **Status Code:** 201 Created ✅
- **Response Body:**

```json
{
  "email": "admin@example.com",
  "name": "Admin User",
  "surname": "Test",
  "address": "123 Main Street",
  "country": "Argentina",
  "city": "Buenos Aires",
  "phone": "541112345678",
  "id": 338,
  "role": "admin",
  "createdAt": "2025-10-23T03:07:44.054Z",
  "updatedAt": "2025-10-23T03:07:44.054Z"
}
```

### Result

**✅ PASS** - Test executed successfully after bug fix

### Correction History

- **23-10-2025 (Initial):** User created with "customer" role despite requesting "admin" ❌
- **23-10-2025 (Fixed):** User created with "admin" role as requested ✅
- **Bug reported in:** BUG-013-registration-ignores-role-admin.png

### Observations

- Role assignment now works correctly
- Admin users can be created through the API
- Role-based access control is now functional
- Bug BUG-013 successfully fixed

### Evidence

- **File:** `TC-013-admin-registration-succes.png`
- **Location:** `evidences/TC-013-admin-registration-succes.png`
