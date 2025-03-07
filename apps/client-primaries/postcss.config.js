// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");

module.exports = {
  plugins: {
    tailwindcss: {
      config: join(__dirname, "tailwind.config.js"),
    },
    autoprefixer: {},
  },
};
