import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Email templates are rendered by react-email into HTML for mail clients,
    // not by Next.js. next/image and next/head don't exist in that context.
    files: ["src/emails/**/*.tsx", "src/app/preview-email/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-head-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
