import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  plugins: [
    svelte()
  ],
  resolve: {
    alias: {
      'pocket-mocker': resolve(__dirname, './src/index.ts')
    }
  },
  build: {
    outDir: 'demo-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});
