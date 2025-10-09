/**
 * ========================================
 * JEST TYPE DEFINITIONS
 * ========================================
 * 
 * This file helps TypeScript understand Jest functions
 * like describe, it, expect, beforeEach, etc.
 */

// Import Jest types
import '@types/jest';

// Make sure Jest globals are available
declare global {
  const describe: jest.Describe;
  const it: jest.It;
  const expect: jest.Expect;
  const beforeEach: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
  const beforeAll: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
}

export {};
