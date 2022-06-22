/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/mocks/prismaClient.ts','<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    'tests/(.*)': '<rootDir>/tests/$1',
    '^csv-parse/sync': '<rootDir>/node_modules/csv-parse/dist/cjs/sync.cjs',
  },
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,ts}'],
};
