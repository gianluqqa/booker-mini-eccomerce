# Simple Testing Guide

## What are these tests?
These tests automatically check if your user registration feature works correctly. They're like having a robot that tests your code for you!

## How to run the tests

### Run all tests
```bash
npm test
```

### Run tests and see how much code is covered
```bash
npm run test:coverage
```

### Run tests in watch mode (reruns when you change code)
```bash
npm run test:watch
```

## What the tests do

### Test 1: "should create a new user successfully"
- ✅ Tests if a new user can register
- ✅ Checks if the response is correct
- ✅ Makes sure the user data is saved

### Test 2: "should reject duplicate email"
- ✅ Tests if the system prevents duplicate emails
- ✅ Makes sure it returns the right error code (409)

### Test 3: "should reject incomplete data"
- ✅ Tests if the system rejects bad data
- ✅ Makes sure it returns the right error code (400)

## How to read the tests

Each test has 3 simple steps:

```typescript
it('should do something', async () => {
  // 1. ARRANGE: Set up test data
  const userData = { /* your test data */ };
  
  // 2. ACT: Do the thing you want to test
  const response = await request(app)
    .post('/users/register')
    .send(userData);
  
  // 3. ASSERT: Check if it worked
  expect(response.status).toBe(201);
});
```

## Common problems and solutions

### Problem: "Cannot find module"
**Solution:** Make sure you're in the backend folder and run `npm install`

### Problem: "Database connection failed"
**Solution:** Make sure your database is running

### Problem: "Test timeout"
**Solution:** Check if your server is running on the right port

## Adding new tests

Want to add a new test? Just copy this pattern:

```typescript
it('should do something new', async () => {
  // 1. Set up your test data
  const testData = { /* your data */ };
  
  // 2. Make the API call
  const response = await request(app)
    .post('/users/register')
    .send(testData);
  
  // 3. Check the result
  expect(response.status).toBe(201);
});
```

## Tips for beginners

1. **Start simple**: Don't try to test everything at once
2. **Read the error messages**: They usually tell you what's wrong
3. **One test, one thing**: Each test should check one specific behavior
4. **Use descriptive names**: "should create user" is better than "test1"
5. **Don't worry about being perfect**: Tests can always be improved later

## Need help?

- Check the console output for error messages
- Make sure your server is running
- Verify your database connection
- Ask for help if you get stuck!