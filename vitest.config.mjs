import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, "src"),
    },
  },
  bail: 1,
  test: {
    globals: true,
    include: [
      "./src/**/*.test.js",
    ],
    exclude: [
      "./packages/**",
    ],
    coverage: {
      reporter: ["text"],
    },
  },
})
