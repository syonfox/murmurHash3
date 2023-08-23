module.exports = {
  printWidth: 100,
  tabWidth: 2,
  jsxBracketSameLine: true,
  useTabs: false,
  bracketSpacing: false,
  plugins: [
    require("@trivago/prettier-plugin-sort-imports"),
  ],
  importOrder: [
    "^[a-zA-Z0-9]",
    "^@(.*)$",
    "^(?!\\.)(?!src\\?)(?!@)(.*)$",
    "^(?!@).*$",
    "^[./]",
    "<THIRD_PARTY_MODULES>",
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
