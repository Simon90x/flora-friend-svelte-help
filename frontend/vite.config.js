import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});