/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  cacheDir: "../../node_modules/.vite/client-custody",
  server: {
    port: 4200,
    host: "localhost",
  },
  preview: {
    port: 4300,
    host: "localhost",
  },
  plugins: [
    react(),
    svgr(),
    viteTsConfigPaths({
      root: "../../",
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },
  build: {
    rollupOptions: {
      external: ["@mui/styles", "@material-ui/pickers"],
    },
  },
  test: {
    globals: true,
    cache: {
      dir: "../../node_modules/.vitest",
    },
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
