/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'node:path';
import solidPlugin from 'vite-plugin-solid';
import { superProductivityPlugin } from '@super-productivity/vite-plugin';

export default defineConfig({
  plugins: [solidPlugin(), superProductivityPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
  },
  resolve: {
    conditions: ['development', 'browser'],
    alias: {
      '@super-productivity/plugin-api': path.resolve(__dirname, 'src/types/sp-plugin-api/index.ts'),
    },
  },
});
