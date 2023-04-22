/// <reference types="vitest" />
import { fileURLToPath, URL } from 'url';
import { defineConfig } from "vite";
import legacy from '@vitejs/plugin-legacy';
import packageJson from "./package.json";


module.exports = defineConfig({
  base: "./",

  test: {

  },
  plugins: [

    legacy({
      targets: {
        firefox: '49'
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

});
