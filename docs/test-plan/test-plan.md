# Test Plan — Booker Backend (v1.0)

## 1. Document Information

| Field | Value |
|-------|-------|
| **Project** | Booker Mini E-commerce |
| **Version** | 1.0 — Backend Only |
| **Author** | Gian Luca Caravone |
| **Last Update** | July 2026 |

---

## 2. Introduction

Booker is a mini e-commerce REST API built with Node.js, Express, TypeORM, and PostgreSQL. This document describes the backend testing strategy applied to the project.

This version covers the backend API exclusively. A separate Test Plan for the Frontend will be produced in a future revision.

---

## 3. Testing Scope

| In Scope | Out of Scope |
|----------|--------------|
| REST API endpoints | Frontend UI |
| Business rule validation | Browser-based E2E testing |
| Authentication and authorization | Performance testing |
| Database integrity | Security testing |
| Error handling and edge cases | |

---

## 4. Testing Stack

| Tool | Role |
|------|------|
| **Jest** | Test runner, assertions, suite lifecycle hooks |
| **Supertest** | HTTP request simulation against the live Express app |
| **TypeORM** | Database access for test data setup and teardown |
| **PostgreSQL** | Real relational database used during test execution |

> Tests run against a real PostgreSQL instance configured via environment variables. No mocking layer is used.

---

## 5. Test Strategy

### 5.1 Testing Approach

All backend tests are **integration tests**: each test starts the Express application, performs real HTTP requests via Supertest, and validates the response against the live database. This validates the full request lifecycle — middleware, controller, service, and database — in a single test run.

### 5.2 Test Structure Convention

Tests follow the **AAA pattern** (Arrange, Act, Assert) and are organized using a two-level `describe` hierarchy:

```
describe("Module - Feature")         ← top-level: module and feature under test
  describe("HTTP_METHOD /endpoint")  ← inner: the specific endpoint being tested
    it("should ...")                  ← individual test case
```

### 5.3 Data Isolation

Each test file manages its own lifecycle through Jest hooks:

- `beforeAll` — initializes the database connection.
- `beforeEach` — creates fresh test data (users, books, etc.) for each test.
- `afterEach` — cleans the database to eliminate cross-test contamination.
- `afterAll` — closes the database connection.

### 5.4 Reusable Helpers

All test files share a common set of helpers located in `backend/tests/helpers/`:

- **Action helpers** (`authActions`, `cartActions`, `orderActions`, etc.) — encapsulate HTTP calls so tests stay readable.
- **Validation helpers** (`cartValidationHelpers`, `orderValidationHelpers`, etc.) — enforce JSON contract assertions reused across multiple tests.
- **`dbHelpers`** — provides `initializeTestDb`, `clearDatabase`, and `closeTestDb` utilities.
- **`validateErrorResponse`** — standardized assertion for API error responses.

---

## 6. Modules Covered

The following backend modules currently have active integration test coverage:

| Module | Tests Cover |
|--------|------------|
| **Auth** | Registration and login flows, validation rules, token issuance |
| **Cart** | Add, update, remove, get, and clear cart items |
| **Checkout** | Stock reservation, payment processing, cancellation |
| **Orders** | Listing pending orders, order history, order detail by ID |
| **Favorites** | Toggle and retrieve user favorites |
| **Reviews** | Create, update, delete, and retrieve book reviews |
| **Admin** | Admin-only access to users, orders, books, and reviews |

---

## 7. Test Execution

Tests are executed sequentially using `--runInBand` to avoid parallel database conflicts. The primary commands from the `backend/` directory are:

| Command | Description |
|---------|-------------|
| `npm run test` | Runs the full test suite |
| `npm run test:watch` | Watch mode for development |
| `npm run test:coverage` | Generates a coverage report |
| `npm run test:verbose` | Prints individual test results |

---

## 8. QA Deliverables

| Artifact | Location | Status |
|----------|----------|--------|
| Test Plan (this document) | `docs/test-plan/` | ✅ Available |
| Test Cases | `docs/test-cases/` | Pending |
| Bug Reports | `docs/bug-reports/` | Pending |
| E2E Report (Playwright) | `docs/e2e-testing/playwright-report.pdf` | ✅ Available |
| Test Evidence | `docs/evidence/` | Pending |
| API Testing Docs | `docs/api-testing/` | Pending |

---

## 9. Future Scope

The following areas are **out of scope for this version** and will be documented in separate Test Plans:

- Frontend component testing
- Playwright End-to-End UI automation
