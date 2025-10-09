/**
 * ========================================
 * SIMPLE TEST SETUP
 * ========================================
 * 
 * This file sets up the test environment.
 * It runs before each test to make sure everything is clean.
 */

import { AppDataSource } from '../src/config/data-source';
import { User } from '../src/entities/User';

// Before all tests start
beforeAll(async () => {
  console.log('🚀 Starting tests...');
  
  // Connect to database
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('✅ Database connected');
  }
});

// Before each individual test
beforeEach(async () => {
  // Clear the users table so each test starts fresh
  try {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete({}); // Use delete instead of clear
  } catch (error) {
    console.log('Note: Could not clear database (this is normal for first run)');
  }
});

// After all tests finish
afterAll(async () => {
  console.log('🧹 Cleaning up...');
  
  // Close database connection
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ Database disconnected');
  }
});

/**
 * ========================================
 * HELPER FUNCTIONS
 * ========================================
 * 
 * These functions can be used in your tests to make them easier to write.
 */

// Create a test user in the database
export const createTestUser = async (userData: any = {}) => {
  const userRepository = AppDataSource.getRepository(User);
  
  const defaultUser = {
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test',
    surname: 'User',
    role: 'customer',
    ...userData
  };

  const user = userRepository.create(defaultUser);
  return await userRepository.save(user);
};

// Count how many users are in the database
export const getUserCount = async (): Promise<number> => {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.count();
};

// Find a user by email
export const findUserByEmail = async (email: string) => {
  const userRepository = AppDataSource.getRepository(User);
  return await userRepository.findOne({ where: { email } });
};

/**
 * ========================================
 * TEST DATA EXAMPLES
 * ========================================
 * 
 * Use these in your tests instead of writing the same data over and over.
 */

export const validUserData = {
  email: 'valid@example.com',
  password: 'Password123',
  confirmPassword: 'Password123',
  name: 'John',
  surname: 'Doe'
};

export const invalidUserData = {
  email: 'invalid-email',
  password: '123',
  confirmPassword: '456',
  name: '',
  surname: ''
};