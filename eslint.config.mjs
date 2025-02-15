import { dirname } from "path"; 
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // `any` 型の使用を許可
      "@typescript-eslint/no-unused-vars": "off",  // 未使用変数の警告を無効化
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];

export default eslintConfig;
