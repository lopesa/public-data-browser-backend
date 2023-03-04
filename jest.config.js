// import type { JestConfigWithTsJest } from "ts-jest";

// const jestConfig: JestConfigWithTsJest = {
//   // [...]
//   preset: "ts-jest",
//   testEnvironment: "node",
//   extensionsToTreatAsEsm: [".ts"],
//   moduleNameMapper: {
//     "^(\\.{1,2}/.*)\\.js$": "$1",
//   },
//   rootDir: "./",
//   transform: {
//     // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
//     // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
//     "^.+\\.tsx?$": [
//       "ts-jest",
//       {
//         useESM: true,
//       },
//     ],
//   },
//   modulePaths: ["<rootDir>"],
// };

// export default jestConfig;

// https://bobbyhadz.com/blog/typescript-jest-cannot-use-import-statement-outside-module

// https://stackoverflow.com/questions/50145078/jest-typescript-tests-runs-twice-one-for-ts-files-and-one-for-js-files

module.exports = {
  // CAN this be converted to an ES6 module?
  preset: "ts-jest",
  // testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  // rootDir: "./",
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  // roots: ["<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/**/*.{js,jsx,ts,tsx}"],
  // modulePaths: ["<rootDir>"],
  // moduleDirectories: ["node_modules", "src"],
  roots: ["<rootDir>/src"],
  modulePaths: ["<rootDir>"],
  // moduleDirectories: ["node_modules"],
  // coverageReporters: ["cobertura", "lcov", "text"],
};
