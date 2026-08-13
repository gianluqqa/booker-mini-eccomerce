# E2E Frontend Testing Documentation 🎭

## Purpose
This document describes the End-to-End (E2E) UI testing automation implementation for the **Booker Mini E-commerce** frontend application using **Playwright** and **TypeScript**. It covers the test design architecture, Page Object Model (POM) implementation, execution strategies, and report generation.

---

## Testing Stack

- **Playwright (v1.49+)**: Node.js library for browser automation.
- **TypeScript**: Typed, robust test script implementation.
- **Chromium**: Target browser engine for cross-feature validation.
- **Page Object Model (POM)**: Design pattern separating UI interactions from test assertions.
- **Playwright HTML Reporter**: Interactive HTML reporting server with traces and execution metrics.

---

## Directory Structure

```
frontend/
├── e2e/
│   ├── data/                 # Dynamic test data generators & payloads
│   ├── fixtures/             # Custom Playwright fixtures (authenticated states, page objects)
│   ├── helpers/              # Utility helpers for assertions, cookies, and local storage
│   ├── pages/                # Page Object Model classes
│   │   ├── AdminPage.ts
│   │   ├── AuthPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── Navigation.ts
│   │   └── ProfilePage.ts
│   └── tests/                # Automated test specifications
│       ├── admin/            # Book creation & access restriction tests (@smoke, @regression)
│       ├── auth/             # Login & Registration workflows (@smoke, @regression)
│       ├── cart/             # Shopping cart add/remove/counter tests (@smoke, @regression)
│       ├── checkout/         # Complete purchase flow & card validation (@smoke, @regression)
│       └── profile/          # Order history verification (@smoke)
├── playwright.config.ts      # Global Playwright configuration & webServer setup
└── package.json              # E2E test scripts & dependencies
```

---

## Test Organization & Strategy

- **Suite Tagging Strategy**:
  - `@smoke`: Critical happy-path journeys (e.g., login, book creation, checkout flow).
  - `@regression`: Detailed validation checks, error messages, and edge cases.
- **Page Object Model (POM)**: All DOM locators and page interactions are encapsulated inside class objects located under `frontend/e2e/pages/`.
- **Integrated Full-Stack Environment**: `playwright.config.ts` automatically boots the Node.js/Express backend API (port 5000) and Next.js frontend (port 3000) using `webServer` orchestration.

---

## Running Tests

Execute commands from the `frontend/` directory:

```bash
# Run all 32 E2E tests headlessly
npx playwright test

# Run only critical smoke tests
npm run test:smoke

# Run full regression suite
npm run test:regression

# Run tests in headed browser mode (visible UI)
npm run test:headed

# Debug tests using Playwright Inspector
npm run test:debug
```

---

## Test Reports & Evidence Location

The E2E test execution outputs artifacts directly into the central documentation directory:

- **HTML Report**: `docs/e2e-testing/report/index.html`
  - To open the interactive report server:
    ```bash
    npm run test:report
    ```
- **Screenshots & Visual Evidence**: `docs/e2e-testing/screenshots/`
  - Execution summary screenshots and visual flow assertions are preserved here.

---

## Summary of Automated Test Coverage (32 Tests)

| Module | Feature / Scenario | Tag | Total Tests |
| --- | --- | --- | :---: |
| **Admin** | Book creation & role restriction | `@smoke`, `@regression` | 5 |
| **Auth** | Login, logout, validations & visibility toggle | `@smoke`, `@regression` | 10 |
| **Auth** | Registration, passwords & duplicate checks | `@smoke`, `@regression` | 8 |
| **Cart** | Add items, counter state & unauthenticated redirect | `@smoke`, `@regression` | 5 |
| **Checkout** | Full purchase flow, card error & cancel flow | `@smoke`, `@regression` | 3 |
| **Profile** | Order history reflection after purchase | `@smoke` | 1 |
