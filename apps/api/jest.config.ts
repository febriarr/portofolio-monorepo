import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.spec.ts", "**/tests/**/*.e2e.spec.ts"],
  coverageDirectory: "../coverage",
  collectCoverageFrom: ["**/*.ts", "!**/node_modules/**", "!**/dist/**"],
}

export default config
