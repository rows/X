// IMPORTANT!
// Always import this preset as the last one in `extends` array
// (e.g. after react, typescript and other presets)
module.exports = {
  plugins: ["prettier"],
  extends: [
    "prettier", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
