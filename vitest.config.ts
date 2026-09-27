import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/tests/**",
        "src/server.ts",
        "**/*.config.ts",
        "node_modules/",
      ],
    },
  },
});
