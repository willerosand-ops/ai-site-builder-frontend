import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 🧠 Importera Next.js standardregler
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 🚫 Ignorera tunga mappar
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // 🎯 Anpassade regler
  {
    rules: {
      // 🔇 Stänger av varningarna om oanvända variabler
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // 🔒 Gör att ESLint inte gnäller på console.log under utveckling
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",

      // 💅 Förbättrar kodstil
      "react/react-in-jsx-scope": "off", // inte nödvändigt i Next.js
      "react/jsx-key": "warn",
      "no-undef": "off",
    },
  },
];

export default eslintConfig;
