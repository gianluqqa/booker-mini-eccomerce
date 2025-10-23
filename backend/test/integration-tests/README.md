# Integration Tests - Booker Project

## 🚀 How to Run Integration Tests

### Run only integration tests
```bash
npm run test:integration
```

### Run all tests
```bash
npm test
```

### Run with coverage
```bash
npm run test:coverage
```

### Run in watch mode (development)
```bash
npm run test:watch
```

## 📋 Current Integration Tests

### User Management Tests
- **User Registration & Login Flow**: Complete user journey from registration to authentication
- **User Validation**: Data validation and error handling for user operations
- **Multi-user Scenarios**: System behavior with multiple concurrent users
- **Edge Cases**: Duplicate emails, invalid data, and boundary conditions

### Future Integration Test Areas
This directory is designed to accommodate additional integration tests as they are developed:
- Book management integration tests
- Cart and order flow tests
- API endpoint integration tests
- Performance and load tests

## 📊 Expected Results

When you run the integration tests, you should see output similar to this:

```
Integration Tests Suite
  🚀 Starting integration tests...

  User Management Tests
  ✓ User registration and login flow (245ms)
  ✓ User validation and error handling (89ms)
  ✓ Multi-user scenarios (156ms)
  ✓ Edge cases handling (78ms)

  🎉 All integration tests completed successfully!
```

## 🔧 Technical Configuration

### Test Files Structure
```
integration-tests/
├── user-register-login.test.ts    # User management tests
├── documentation/                 # Test reports and documentation
│   └── user-register-login-report.md
├── tests-reports/                 # HTML test reports
│   └── user-register.login-report.html
├── README.md                      # This documentation
└── [future test files]            # Additional tests as they are developed
```

### Database Configuration
- Tests use the same database as development
- Automatically cleaned before each test
- Each test uses unique data with timestamps
- Database state is reset between test suites

### Dependencies
- **Jest**: Testing framework
- **Supertest**: For making HTTP requests to the API
- **TypeORM**: For database interaction
- **Faker**: For generating test data

## 🚨 Troubleshooting

### Error: "Database connection failed"
```bash
# Make sure the database is running
npm run dev
```

### Error: "Port already in use"
```bash
# Check if another process is using the port
netstat -ano | findstr :3000
```

### Error: "Test timeout"
```bash
# Run with more time
npm run test:debug
```

## 📈 Next Steps

1. **Expand test coverage**: Add more integration scenarios as needed
2. **Additional test modules**: Create new test files for different areas
3. **Documentation**: Update this README as new tests are added
4. **Test organization**: Maintain clear structure as the test suite grows

---

**Created by**: Gian Luca Caravone  
**Date**: 17-10-2025  
**Version**: 1.0
