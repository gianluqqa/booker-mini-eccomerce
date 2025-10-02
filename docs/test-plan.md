# Test Plan – Project “Booker”

---

## 1️⃣ Project Overview

- **Project Name:** Booker
- **Type:** Mini eCommerce / MVP
- **Technologies:** React, Next.js (Frontend), Node.js, Express (Backend), PostgreSQL/MongoDB (DB)
- **Purpose:** Document and validate the functionality of a simplified book e-commerce system, including user flow, data integrity, and performance. Intended for portfolio demonstration in both development and QA.

---

## 2️⃣ Scope

This Test Plan covers the MVP features of Booker:

**Frontend:**
- Homepage with book listing
- Basic search (by title or author)
- Shopping cart (add/remove books)
- User registration/login
- Order confirmation page (simulated order creation)

**Backend:**
- Main endpoints: `/register`, `/login`, `/books`, `/cart`, `/order`
- User and book data validation
- Order creation simulation and persistence

**Database:**
- Data integrity validation for `users`, `books`, and `orders`

**Test Types:**
- Functional (UI + API)
- Non-functional (performance, usability, basic security)
- Integration (frontend + backend + database)

---

## 3️⃣ Test Strategy

1. **Functional Testing:**
   - Validate primary user flows: registration, login, search, cart, checkout
   - Test API endpoints with valid and invalid data
   - Verify error messages, alerts, and redirects

2. **Non-Functional Testing:**
   - Performance: page load times, API response times
   - Usability: intuitive navigation and purchase flow
   - Basic security: input validation, unauthorized access prevention

3. **Integration Testing:**
   - Verify consistency between frontend, backend, and database
   - Complete purchase flow from selection to order creation

4. **Documentation of Results:**
   - Visual evidence (screenshots, video recordings)
   - Backend logs and database query results
   - Record any deviations from expected results

---

## 4️⃣ Test Environment

- **Platform:** Desktop environment (Windows 11 Pro)
- **Tools:**
  - Cursor for development and testing
  - Browsers: Chrome, Edge (latest versions)
  - Postman or similar for API testing
  - Screenshot and screen recording tools for evidence
- **Database:** PostgreSQL or MongoDB (mock or real)

**Note:** Personal device identifiers are not included; the environment focuses solely on relevant technical details.

---

## 5️⃣ Roles and Responsibilities

- **QA / Developer:** Gian
  - Execute functional and integration tests
  - Record test evidence
  - Document deviations and propose fixes

**Test Plan Responsibility:**
- Keep the plan updated as the project evolves
- Ensure full MVP functionality coverage

---

## 6️⃣ Entry and Exit Criteria

**Entry Criteria:**
- Fully functional development environment (frontend + backend)
- Initial database populated with test data
- Test tools configured (Cursor, browsers, API tools)

**Exit Criteria:**
- All MVP functionalities verified
- Evidence documented and stored
- Deviations identified and corrected (if applicable)
- Test Plan finalized and ready for portfolio

---

## 7️⃣ Assumptions and Constraints

- Payment process is simulated; no real transactions
- Tests are performed in local development environment only
- Database may be mock or real
- All testing executed on Windows 11 Pro desktop environment
