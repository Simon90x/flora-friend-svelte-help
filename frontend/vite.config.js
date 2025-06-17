// vite.config.js

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte'; // o sveltekit se usi SvelteKit

// 1. Importa i plugin di PostCSS qui
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte() // o sveltekit()
  ],
  
  // 2. Aggiungi questo blocco di configurazione per il CSS
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
});