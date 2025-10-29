# 🧪 Booker E-Commerce Testing Suite

## 🎯 Welcome to the Testing System

This is the **Complete Testing System** for the Booker E-Commerce application. A professional testing framework that demonstrates QA best practices and serves as a full-stack development portfolio.

**Project:** Booker - Mini E-Commerce Book Store  
**Architecture:** React/Next.js (Frontend) + Node.js/Express/TypeScript (Backend) + PostgreSQL (Database)  
**Approach:** Comprehensive Manual + Automated Testing  
**Scope:** Manual, automated, and integration for key modules  

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Backend server running on port 5000

### Installation & Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure database (ensure PostgreSQL is running)
# Configure connection in .env file

# Start backend server
npm run dev
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run only integration tests
npm run test:integration

# Generate comprehensive HTML reports
npm run test:report:all
```

---

## ℹ️ About this Guide

This README is the first stop to orient yourself in the testing area. It explains environment setup, how to run tests, and where to find key artefacts (code, reports, and documentation). For metrics and summaries, refer to each module’s documents linked below.

---

## 📁 Project Structure

```
backend/test/
├── README.md                      # This main guide
├── all-tests-backend-summary.md   # Executive summary
├── setup.ts                       # Test configuration
├── types.d.ts                     # TypeScript definitions
│
├── modules/                       # Functional testing modules
│   ├── users/                     # Users module tests and docs
│   │   ├── users-backend-summary.md
│   │   ├── manual/                # Manual testing
│   │   │   ├── unit-tests/        # Test documentation
│   │   │   ├── evidences/         # Visual evidence
│   │   │   └── bugs/              # Bug reports
│   │   └── automated/             # Automated testing
│   │       ├── unit-tests/        # Test files
│   │       ├── test-reports/      # HTML reports
│   │       └── documentation/     # Technical documentation
│   │
│   ├── admin/                     # Admin module tests and docs
│   │   ├── admin-backend-summary.md
│   │   ├── manual/                # Manual testing
│   │   │   ├── unit-tests/       # Test documentation
│   │   │   ├── evidences/        # Visual evidence
│   │   │   └── bugs/             # Bug reports
│   │   └── automated/            # Automated testing
│   │       ├── unit-tests/       # Test files
│   │       ├── test-reports/     # HTML reports
│   │       └── documentation/    # Technical documentation
│   │
│   ├── books/
│   ├── cart/
│   └── checkout/
│
└── integration-tests/             # End-to-end testing
    ├── user-register-login.test.ts
    ├── documentation/             # Integration test documentation
    ├── tests-reports/             # Integration test reports
    └── README.md                  # Integration testing guide
```

---

## 🧪 Testing Methodology

### Manual Testing
- **Comprehensive UI/UX validation** with visual evidence
- **Real-world scenario simulation** for user flows
- **Detailed documentation** with screenshots and step-by-step procedures
- **Bug tracking** with complete reproduction steps

### Automated Testing
- **API endpoint testing** with Jest + Supertest
- **Data validation** and business logic verification
- **Regression prevention** with continuous integration
- **Performance monitoring** and response time validation

### Integration Testing
- **End-to-end workflows** across all modules
- **Cross-module functionality** validation
- **Database integrity** and data consistency checks
- **Security testing** and vulnerability assessment

---

## 📋 Available Test Commands

### Core Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run only integration tests
npm run test:integration

# Run specific test file
npm test -- test/modules/users/automated/unit-tests/register-user-auto.test.ts
```

### Report Generation
```bash
# Generate all HTML reports
npm run test:report:all

# Generate specific module reports
npm run test:report:register
npm run test:report:login

# Admin reports
npm run test:report:admin:register
npm run test:report:admin:login
npm run test:report:admin:complete
```

---

## 📖 Testing Conventions

### Naming Convention
- **Manual Tests:** `TC-XXX: [Description]` (e.g., TC-001: Successful User Registration)
- **Automated Tests:** `AUTO-XXX: [Description]` (e.g., AUTO-001: Create User Successfully)
- **Bug Reports:** `BUG-XXX: [Description]` (e.g., BUG-002: Duplicate Email Error)

### Test Categories
- **Registration Tests:** User account creation and validation
- **Authentication Tests:** Login, logout, and session management
- **CRUD Tests:** Create, Read, Update, Delete operations
- **Validation Tests:** Input validation and error handling
- **Security Tests:** Authentication, authorization, and data protection
- **Integration Tests:** Cross-module functionality and workflows

---

## 📌 Test Status

Detailed cases, evidence, and reports per module are available in the module-specific documents in the Documentation section. This README does not include metrics or statistics; its purpose is to guide execution and navigation of the testing area.

Note: Current module test suites are considered complete for now based on existing requirements. They may require new or updated tests in the future as features evolve or new requirements arise.

---

## 🔧 Troubleshooting

### Common Issues

**"Cannot find module"**
```bash
# Solution: Ensure you're in backend directory and dependencies are installed
cd backend
npm install
```

**"Database connection failed"**
```bash
# Solution: Verify PostgreSQL is running and connection string is correct
# Check your .env file for DATABASE_URL
```

**"Test timeout"**
```bash
# Solution: Ensure backend server is running on port 5000
npm run dev
```

### Getting Help
1. Check console output for error messages
2. Verify server and database are running
3. Review test configuration in `setup.ts`
4. Generate HTML reports for detailed analysis
5. Consult module-specific documentation

---

## 📚 Documentation Links

### Master Documents
- **[All Tests Backend Summary](all-tests-backend-summary.md)** - Executive overview and metrics

### Module Documentation
- **[Users Module](modules/users/users-backend-summary.md)** - Complete user testing documentation
- **[Admin Module](modules/admin/admin-backend-summary.md)** - Administrative testing documentation
- **[Books Module](modules/books/books-backend-summary.md)** - Book management testing (planned)
- **[Cart Module](modules/cart/cart-backend-summary.md)** - Shopping cart testing (planned)
- **[Checkout Module](modules/checkout/checkout-backend-summary.md)** - Order processing testing (planned)

### Technical Documentation
- **[Manual Tests](modules/users/manual/unit-tests/)** - Detailed manual test procedures
- **[Automated Tests](modules/users/automated/unit-tests/)** - Automated test implementations
- **[Test Reports](modules/users/automated/test-reports/)** - HTML test execution reports
- **[Bug Reports](modules/users/manual/bugs/)** - Detailed bug documentation

---

## 🏆 Quality Standards

### Testing Excellence
- **Comprehensive Coverage:** All critical user flows tested
- **Security First:** Proactive security testing and vulnerability fixes
- **Professional Documentation:** Industry-standard test documentation
- **Evidence-Based:** Visual evidence for all manual test cases
- **Automation:** Robust automated testing framework

### Portfolio Value
- **Real-World Application:** E-commerce testing experience
- **Full-Stack Knowledge:** Frontend and backend testing expertise
- **Professional Methodology:** Industry-standard QA practices
- **Quality Focus:** Zero tolerance for production bugs
- **Continuous Improvement:** Iterative testing approach

---

## 🚀 Getting Started as a Tester

### For New Testers
1. **Read this README** completely
2. **Review the Test Plan** for overall strategy
3. **Check the Tests Summary** for current status
4. **Start with Users Module** (complete documentation)
5. **Follow the Quick Start Guide** to run tests
6. **Generate HTML reports** for visual analysis

### For Developers
1. **Understand the testing structure** before making changes
2. **Run tests before committing** code changes
3. **Add tests for new features** following established patterns
4. **Update documentation** when adding new test cases
5. **Review bug reports** before fixing issues

---

## 📞 Project Information

**Developer:** Gian Luca Caravone  
**Project Type:** Portfolio Demonstration  
**Last Updated:** October 29, 2025  
**Version:** 2.2  
**Status:** Active Development  

---