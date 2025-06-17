import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  // La sezione 'css' è stata rimossa.
  // Vite userà automaticamente postcss.config.ts
});