import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  rootDir: "src",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/tests/**/*.e2e.spec.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  // Jalankan test file secara sequential, bukan parallel
  // agar tidak ada race condition saat insert/delete ke DB yang sama
  maxWorkers: 1,
  globalSetup: "./tests/setup.ts",
}

export default config
