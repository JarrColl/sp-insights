/// <reference types="vitest" />
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { superProductivityPlugin } from '@super-productivity/vite-plugin';

export default defineConfig({
  root: './src',
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
  },
});
