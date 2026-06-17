/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/rich-text-to-markdown/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  test: {
    // The conversion utils are pure functions, so node is enough — no jsdom.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
