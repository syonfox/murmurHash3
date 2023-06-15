module.exports = {
  printWidth: 100,
  tabWidth: 2,
  jsxBracketSameLine: true,
  useTabs: false,
  bracketSpacing: false,
  plugins: [
    require("prettier-plugin-tailwindcss"),
    require("@trivago/prettier-plugin-sort-imports"),
  ],
  // https://github.com/trivago/prettier-plugin-sort-imports
  importOrder: [
    "(.*).css$",
    "^react",
    "^react/(.*)$",
    "^next",
    "^next/(.*)$",
    "^next/(.*)$",
    "^[a-zA-Z0-9]",
    "^@(.*)$",
    "^(?!\\.)(?!src\\?)(?!@)(.*)$",
    "^(?!@).*$",
    "^[./]",
    "<THIRD_PARTY_MODULES>",
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  // importOrderGroupNamespaceSpecifiers: true,
};
