/* eslint-disable @typescript-eslint/no-var-requires */
const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("path");

module.exports = {
  content: [
    join(__dirname, "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html,js,jsx}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
