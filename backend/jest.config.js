/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.js', '**/src/tests/*.test.js'],
  verbose: false,
  testTimeout: 30000,
};

