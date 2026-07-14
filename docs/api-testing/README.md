# API Testing Documentation

## Purpose

This document describes the backend API testing automation implementation using Jest and Supertest. It covers the test organization, tools, execution methods, and helper functions used to validate REST endpoints.

## Testing Stack

- **Jest**: Test framework and runner
- **Supertest**: HTTP assertion library for endpoint testing
- **TypeScript**: Type-safe test implementation
- **ts-jest**: TypeScript preprocessor for Jest
- **jest-html-reporter**: HTML test report generation

## Test Directory Structure

```
backend/tests/
├── e2e/
│   └── complete-system-flow.e2e.test.ts
├── integration/
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── favorites/
│   ├── orders/
│   └── reviews/
├── helpers/
│   ├── adminActions.ts
│   ├── authActions.ts
│   ├── bookActions.ts
│   ├── cartActions.ts
│   ├── cartValidationHelpers.ts
│   ├── checkoutActions.ts
│   ├── checkoutValidationHelpers.ts
│   ├── dbHelpers.ts
│   ├── favoriteActions.ts
│   ├── favoriteValidationHelpers.ts
│   ├── orderActions.ts
│   ├── orderValidationHelpers.ts
│   ├── reviewActions.ts
│   ├── reviewValidationHelpers.ts
│   ├── userActions.ts
│   └── validateErrorResponse.ts
└── setup.ts
```

## Test Organization

- **Integration Tests**: Module-specific endpoint validation organized by feature (admin, auth, cart, checkout, favorites, orders, reviews)
- **E2E Tests**: Complete system flow validation
- **Test Structure**: Each test file is dedicated to a single API endpoint
- **Module Organization**: Each module groups all endpoint files related to that feature
- **Test Scenarios**: Each endpoint contains positive, negative, and edge-case scenarios
- **Test Pattern**: Tests follow Arrange – Act – Assert pattern

## Running Tests

```bash
npm test                    # Run all tests sequentially
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
npm run test:verbose        # Run tests with verbose output
npm run test:debug          # Run tests with debug mode (detects open handles)
```

## Reports

HTML reports are generated using custom scripts located in `backend/scripts/`:

```bash
npm run test:report:register              # User registration report
npm run test:report:login                 # User login report
npm run test:report:admin:register        # Admin registration report
npm run test:report:admin:login           # Admin login report
npm run test:report:admin:complete        # Complete admin module report
npm run test:report:all                   # Complete test report (all modules)
```

Report scripts generate HTML files with test execution details, success rates, and coverage information.

## Code Coverage

```bash
npm run test:coverage
```

Coverage reports are generated in the `backend/coverage/` directory. The coverage includes statement, branch, function, and line coverage metrics for the tested code.

## Database Management

Database helpers in `dbHelpers.ts`:

- **initializeTestDb()**: Initializes database connection before test suite execution
- **clearDatabase()**: Cleans test data after each test to ensure test isolation
- **closeTestDb()**: Closes database connection after test suite completion

## Authentication Helpers

Authentication helpers in `authActions.ts` and `userActions.ts`:

- **loginUser(app, credentials)**: Authenticates test users and returns auth tokens
- **createTestUser(data)**: Creates test users for authentication scenarios

## Test Data

Test data helpers create entities dynamically:

- **createTestUser()**: Creates user entities for authentication and authorization tests
- **createTestBook()**: Creates book entities for catalog and cart operations
- Additional helpers exist for cart, checkout, favorites, orders, and reviews operations

Test data is generated dynamically to ensure isolated and repeatable executions.

## Validation Helpers

Validation helpers ensure API responses match expected contracts. Examples include:

- **validateErrorResponse()**: Validates error response structure (status code, success flag, message)
- **validateCartItemContract()**: Validates cart item response structure
- **validateOrderContract()**: Validates order response structure
- **validateReviewContract()**: Validates review response structure

Other modules follow the same naming convention with dedicated validation helpers for their respective entities.

## Naming Convention

Test files follow a consistent naming pattern:

- One test file per API endpoint
- Descriptive names using kebab-case (e.g., `add-to-cart.test.ts`, `get-order-by-id.test.ts`)
- Module-based organization with descriptive folder names
- Helper files use descriptive suffixes (`Actions.ts` for operations, `ValidationHelpers.ts` for contract validation)

## Test Lifecycle

Each test suite follows a standard lifecycle:

```
beforeAll()
  Database initialization

beforeEach()
  Create isolated test data

afterEach()
  Database cleanup

afterAll()
  Close database connection
```

## Important Notes

- This document describes exclusively the backend API testing implementation
- Frontend testing documentation will be added separately
- All information corresponds to the current state of the project
