import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/server.ts"],

  format: ["esm"],

  target: "node18",

  splitting: false,

  sourcemap: true,

  clean: true,

  dts: false,

  minify: false,

  treeshake: true,

  outDir: "dist",

  skipNodeModulesBundle: true,

  esbuildOptions(options) {
    options.alias = {
      "@": "./src",
    }
  },
})
