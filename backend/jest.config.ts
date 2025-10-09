import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',           // Usa ts-jest para TypeScript
  testEnvironment: 'node',     // Entorno Node.js para backend
  roots: ['<rootDir>/test'],   // Carpeta donde están los tests
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};

export default config;
