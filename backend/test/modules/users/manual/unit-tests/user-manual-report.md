# 📋 Manual Testing Summary - Users Module

## 📊 General Information

**Project:** Booker - Backend  
**Module:** Users (Registration and Login)  
**Type:** Manual Testing  
**Period:** October 2025  
**Tester:** Gian Luca Caravone  

## 🎯 Objective

Document and validate the complete functionality of the users module, including registration and login processes, through comprehensive manual testing that covers successful cases and error scenarios.

## 📈 General Statistics

### Tests Executed
- **Total Tests:** 12
- **Registration Tests:** 6 (TC-001 to TC-006)
- **Login Tests:** 6 (TC-007 to TC-012)
- **Successful Tests:** 12 ✅
- **Failed Tests:** 0 ❌
- **Success Rate:** 100%

### Functionality Coverage
- ✅ **New User Registration**
- ✅ **Duplicate Email Validation**
- ✅ **Email Format Validation**
- ✅ **Password Validation**
- ✅ **Required Fields Validation**
- ✅ **Successful Login**
- ✅ **Login with Incorrect Password**
- ✅ **Login with Non-existent User**
- ✅ **Login with Missing Email**
- ✅ **Login with Missing Password**
- ✅ **Login with Invalid Email Format**

## 📋 Test Summary Table

| Test ID | Test Name | Type | Status | Description | Expected Result | Evidence File |
|---------|-----------|------|--------|-------------|-----------------|---------------|
| **TC-001** | Successful New User Registration | Registration | ✅ PASS | Verify successful registration of new user | 201 Created, User created with unique ID | `TC-001-register-succesfully.png` |
| **TC-002** | Registration with Duplicate Email | Registration | ✅ PASS | Verify system rejects duplicate emails | 409 Conflict, "User with that email already exists" | `TC-002-duplicate-email-fixed.png` |
| **TC-003** | Registration with Invalid Email Format | Registration | ✅ PASS | Verify email format validation | 400 Bad Request, "Email format is invalid" | `TC-003-invalid-email.png` |
| **TC-004** | Password and ConfirmPassword Do Not Match | Registration | ✅ PASS | Verify password confirmation validation | 400 Bad Request, "Passwords do not match" | `TC-004-passwords-no-match.png` |
| **TC-005** | Registration with Missing Required Fields | Registration | ✅ PASS | Verify required fields validation | 400 Bad Request, "Email, password, confirmPassword, name and surname are required" | `TC-005-missing-required-field-fixed.png` |
| **TC-006** | Registration with Weak Password Validation | Registration | ✅ PASS | Verify password strength validation | 400 Bad Request, "Password must contain at least 8 characters, uppercase, lowercase and number" | `TC-006-weak-password-validation.png` |
| **TC-007** | Successful User Login | Login | ✅ PASS | Verify successful login of existing user | 200 OK, User data returned without password | `TC-007-login-successfully.png` |
| **TC-008** | Login with Incorrect Password | Login | ✅ PASS | Verify rejection of incorrect password | 401 Unauthorized, "Invalid credentials" | `TC-008-login-incorrect-password.png` |
| **TC-009** | Login with Non-existent User | Login | ✅ PASS | Verify rejection of non-existent user | 401 Unauthorized, "Invalid credentials" | `TC-009-login-non-existent-user.png` |
| **TC-010** | Login with Missing Email | Login | ✅ PASS | Verify rejection when email field is missing | 400 Bad Request, "Email is required" | `TC-010-login-missing-email.png` |
| **TC-011** | Login with Missing Password | Login | ✅ PASS | Verify rejection when password field is missing | 400 Bad Request, "Password is required" | `TC-011-login-missing-password.png` |
| **TC-012** | Login with Invalid Email Format | Login | ✅ PASS | Verify rejection of invalid email format | 400 Bad Request, "Email format is invalid" | `TC-012-login-invalid-email-format.png` |

## 🔧 Test Environment Configuration

### Prerequisites
- ✅ Backend server running on port 5000
- ✅ Database connected and functioning
- ✅ Test users created for login tests
- ✅ Testing tools (Postman/Thunder Client)

### Test Data Used
- **Test emails:** test001@example.com, test002@example.com, etc.
- **Passwords:** StrongPass123 (meets validation requirements)
- **Complete users:** With all optional fields
- **Minimal users:** Only required fields

## 📊 Results Analysis

### Correctly Implemented Validations
1. **Email Validation:**
   - ✅ Correct format required
   - ✅ Duplicate emails rejected
   - ✅ Clear error messages

2. **Password Validation:**
   - ✅ Minimum 8 characters
   - ✅ Must contain uppercase, lowercase and numbers
   - ✅ Confirmation must match
   - ✅ Specific error messages

3. **Field Validation:**
   - ✅ Required fields validated
   - ✅ Optional fields accepted
   - ✅ Descriptive error messages

4. **Authentication:**
   - ✅ Successful login with valid credentials
   - ✅ Rejection of invalid credentials
   - ✅ Proper handling of non-existent users
   - ✅ Responses without sensitive information

### Correct HTTP Status Codes
- ✅ **201 Created:** Successful registration
- ✅ **200 OK:** Successful login
- ✅ **400 Bad Request:** Validation errors
- ✅ **401 Unauthorized:** Authentication failures
- ✅ **409 Conflict:** Duplicate email

## 🎯 Conclusions

### Validated Functionalities
- ✅ **Robust registration system** with complete validations
- ✅ **Secure login system** with proper error handling
- ✅ **Security validations** correctly implemented
- ✅ **Error handling** appropriate and consistent
- ✅ **API responses** well structured

### Code Quality
- ✅ **Clear error messages** and specific
- ✅ **Appropriate HTTP status codes**
- ✅ **Comprehensive validations** in frontend and backend
- ✅ **Security implemented** (hashed passwords, sensitive data hidden)

### Recommendations
1. **Maintain current coverage** - Tests cover critical cases
2. **Document changes** - Update tests when functionality is modified
3. **Expand testing** - Add tests for other modules following the same pattern
4. **Automation** - Consider automating critical tests for CI/CD

## 📁 Evidence Files

### Registration Tests
- `TC-001-register-succesfully.png`
- `TC-002-duplicate-email-fixed.png`
- `TC-003-invalid-email.png`
- `TC-004-passwords-no-match.png`
- `TC-005-missing-required-field-fixed.png`
- `TC-006-weak-password-validation.png`

### Login Tests
- `TC-007-login-successfully.png`
- `TC-008-login-incorrect-password.png`
- `TC-009-login-non-existent-user.png`
- `TC-010-login-missing-email.png`
- `TC-011-login-missing-password.png`
- `TC-012-login-invalid-email-format.png`

## 📚 Related Documentation

- **Manual Registration Tests:** [register-user-manual.md](./register-user-manual.md)
- **Manual Login Tests:** [login-user-manual.md](./login-user-manual.md)
- **General Summary:** [../../users-summary.md](../../users-summary.md)
- **Bug Reports:** [../bugs/bugs-users-reports.md](../bugs/bugs-users-reports.md)
- **Test Evidence:** [../evidences/](../evidences/)

---

**Generation Date:** October 16, 2025  
**Last Update:** October 16, 2025  
**Status:** Completed ✅
