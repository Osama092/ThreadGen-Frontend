const {defaults} = require('jest-config');

/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts', 'cts'],
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^variables/(.*)$': '<rootDir>/src/variables/$1',
    '^views/(.*)$': '<rootDir>/src/views/$1',

  },
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios/)',
  ],
  testEnvironment: 'jsdom', // Add this line to use jsdom environment
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],

};

module.exports = config;
