// eslint-disable-next-line @typescript-eslint/no-require-imports
const { pathsToModuleNameMapper } = require("ts-jest");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["/**/*.spec.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/types/**/*",
  ],
};
