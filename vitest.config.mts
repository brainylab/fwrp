/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
    coverage: {
      all: true,
      include: ['**/src/**/*.{tsx,ts}'],
    },
  },
});
