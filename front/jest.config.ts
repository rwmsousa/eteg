import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [ '.next' ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};

export default config;
