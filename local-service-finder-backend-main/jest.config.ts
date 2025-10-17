import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup/testDB.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/modules/**/*.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
