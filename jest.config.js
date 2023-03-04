// https://bobbyhadz.com/blog/typescript-jest-cannot-use-import-statement-outside-module

// https://stackoverflow.com/questions/50145078/jest-typescript-tests-runs-twice-one-for-ts-files-and-one-for-js-files

module.exports = {
  // CAN this be converted to an ES6 module?
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  roots: ["<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/**/*.{js,jsx,ts,tsx}"],
  // coverageReporters: ["cobertura", "lcov", "text"],
};
