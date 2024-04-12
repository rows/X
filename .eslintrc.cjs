module.exports = {
    parser: "@typescript-eslint/parser",
  plugins: ["lodash", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:no-lookahead-lookbehind-regexp/recommended",
  ],
  settings: {
    "@typescript-eslint/parser": [".ts", ".tsx"],
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  parserOptions: {
    project: ["tsconfig.json"],
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    "quotes": ["error", "double"],
    "no-console": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
          object: false,
          Function: false,
        },
      },
    ],
    "import/default": "warn",
    "import/no-named-as-default-member": "warn",
    "import/no-named-as-default": "off",
    "import/no-extraneous-dependencies": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "never",
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "@rows/**",
            group: "internal",
            patternOptions: { partial: true, nocomment: true },
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react", "@rows/**"],
        distinctGroup: false,
        alphabetize: {
          orderImportKind: "asc",
        },
      },
    ],
    "no-case-declarations": "off",
    "no-empty": "off",
    "no-extra-boolean-cast": "warn",
    "no-prototype-builtins": "off",
    "no-unused-vars": "off",
    "no-useless-escape": "warn",
    "no-throw-literal": "warn",
    "lodash/import-scope": ["error", "member"], // @TODO there is some code still using lodash/debounce and others
    "no-lookahead-lookbehind-regexp/no-lookahead-lookbehind-regexp": "warn",
    "jest/no-focused-tests": "error",
  },
  overrides: [
    {
      files: [
        "*.{test}.{tsx,ts,jsx,js}",
        "**/__tests__/*.{tsx,ts,jsx,js}",
        "**/__mocks__/*.{tsx,ts,jsx,js}",
      ],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "lodash/import-scope": "off",
        "@typescript-eslint/consistent-type-imports": [
          "warn",
          {
            /* Allow type import annotations in tests to add type-checking to jest mock */
            disallowTypeAnnotations: false,
          },
        ],
      },
    },
  ],

};
