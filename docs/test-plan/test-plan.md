# Master Test Plan — Booker Mini E-commerce (v2.0) 📚🛒

## 1. Document Information

| Field | Value |
|-------|-------|
| **Project** | Booker Mini E-commerce |
| **Version** | 2.0 — Full-Stack (Backend API & Frontend E2E) |
| **Author** | Gian Luca Caravone |
| **Last Update** | August 2026 |

---

## 2. Introduction

Booker is a full-stack mini e-commerce application consisting of a Node.js/Express REST API (backed by TypeORM and PostgreSQL) and a modern Next.js frontend interface.

This Master Test Plan documents the comprehensive quality assurance strategy applied across the entire system, encompassing **Backend API Integration Testing** (Jest + Supertest) and **Frontend End-to-End Automation** (Playwright + TypeScript).

---

## 3. Testing Scope

| In Scope | Out of Scope |
|----------|--------------|
| REST API endpoints & business logic validation | Performance / Load testing (k6/Gatling) |
| JWT Authentication & role-based permissions (Admin vs Customer) | Penetration / Security testing (OWASP ZAP) |
| Database state integrity & relational constraints | Accessibility testing (axe-core) |
| Frontend UI End-to-End user journeys (Browsing, Cart, Checkout, Profile) | Mobile native app testing |
| Cross-layer contract validation & error handling | |
| Smoke (`@smoke`) & Regression (`@regression`) test execution | |

---

## 4. Testing Stack

| Layer | Tool / Technology | Role |
|-------|-------------------|------|
| **API Testing** | **Jest** | Test runner, assertion library, lifecycle hooks |
| | **Supertest** | HTTP assertions against Express endpoints |
| **E2E UI Testing** | **Playwright** | Browser automation engine (Chromium) |
| | **TypeScript** | Type-safe test scripts & Page Object Models |
| **Database** | **PostgreSQL & TypeORM** | Real relational database storage & entity management |
| **Design Pattern** | **Page Object Model (POM)** | UI encapsulation & locators separation |
| **Reporting** | **Jest HTML Reporter & Playwright HTML Server** | Execution logs, metrics, trace viewer & HTML artifacts |

---

## 5. Test Strategy

### 5.1 Backend API Strategy
- **Approach**: All API tests are integration tests running against a live PostgreSQL database instance.
- **Pattern**: Tests follow the **AAA pattern** (Arrange, Act, Assert).
- **Isolation**: `beforeEach` and `afterEach` hooks guarantee test data setup and cleanup, preventing cross-test contamination.
- **Contract Enforcement**: Specialized validation helpers enforce strict JSON schema contracts across API responses.

### 5.2 Frontend E2E Strategy
- **Approach**: Playwright scripts simulate realistic user interactions on the Next.js frontend interface.
- **Page Object Model (POM)**: Component locators and UI actions are encapsulated in dedicated page classes under `frontend/e2e/pages/`.
- **Suite Tagging**:
  - `@smoke`: Critical happy-path execution (e.g. successful login, book creation, order checkout).
  - `@regression`: Extensive boundary checks, form validations, and negative error scenarios.
- **Automated WebServer Orchestration**: `playwright.config.ts` automatically initializes both the Express backend API (port 5000) and Next.js frontend (port 3000) prior to test suite execution.

---

## 6. Modules Covered

The testing strategy provides complete coverage across both backend and frontend layers for the following core business modules:

| Module | API Integration Coverage | Frontend E2E Coverage |
|--------|:------------------------:|:--------------------:|
| **Auth** | Registration, login, JWT validation | Login/Logout flows, registration forms, input validations |
| **Cart** | Item CRUD, item counters, stock check | Add to cart, counter updates, unauthenticated redirects |
| **Checkout** | Payment simulation, stock reservation | Full purchase flow, invalid card handling, cancel flow |
| **Orders** | Order history, order by ID retrieval | Order history reflection in user profile after checkout |
| **Admin** | Role-restricted book CRUD & management | Admin panel access restrictions, book creation form |
| **Reviews** | Book review submission, ratings calculation | Review creation form, character limit validations |
| **Favorites** | Favorite toggle & retrieval | User favorites list interaction |

---

## 7. Test Execution

### 7.1 Backend API Execution
From the `backend/` directory:
```bash
npm test                    # Run all Jest API integration tests
npm run test:coverage       # Generate API code coverage metrics
```

### 7.2 Frontend E2E Execution
From the `frontend/` directory:
```bash
npx playwright test         # Run all 32 E2E UI tests
npm run test:smoke          # Run @smoke tagged tests
npm run test:regression     # Run @regression tagged tests
npm run test:report         # Launch HTML report server (docs/e2e-testing/report)
```

---

## 8. QA Deliverables & Documentation

| Artifact | Location | Status |
|----------|----------|:------:|
| **Master Test Plan** | `docs/test-plan/test-plan.md` | ✅ Complete |
| **Test Cases Suite** | `docs/test-cases/` (Backend & Frontend) | ✅ Complete |
| **Bug Reports Directory** | `docs/bug-reports/` (Backend & Frontend) | ✅ Complete |
| **API Testing Documentation** | `docs/api-testing/README.md` | ✅ Complete |
| **E2E Testing Documentation** | `docs/e2e-testing/README.md` | ✅ Complete |
| **E2E HTML Report** | `docs/e2e-testing/report/index.html` | ✅ Complete |
| **Screenshots & Visual Evidence** | `docs/e2e-testing/screenshots/` | ✅ Complete |

---

## 9. Future Roadmap

Potential future QA enhancements:
- Integrate automated E2E and API test suites into **GitHub Actions CI/CD pipelines**.
- Implement load and performance benchmarking using **k6**.
- Add automated accessibility testing with **axe-core**.
