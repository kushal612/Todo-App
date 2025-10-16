import { resolve } from "path";

export default {
  root: resolve(__dirname, "src"),
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        signUp: resolve(__dirname, "src/pages/signUp.html"),
        index: resolve(__dirname, "src/index.html"),
      },
    },
  },
  server: {
    port: 8080,
    open: "/pages/signUp.html",
  },
  // Optional: Silence Sass deprecation warnings. See note below.
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "mixed-decls",
          "color-functions",
          "global-builtin",
        ],
      },
    },
  },
};
