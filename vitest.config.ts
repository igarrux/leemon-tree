import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/index.test.js'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: [
        '**/__mocks__/**',
        '**/__mock__/**',
        '**/_type/**',
        '**/*.type.ts',
        '**/*.types.ts',
        '**/configs/**',
        '**/_messages/**',
        '**/index.ts',
        '**/index.js',
        'dist/**',
      ],
    },
    exclude: [
      '**/__mocks__/**',
      '**/__mock__/**',
      '**/_type/**',
      '**/*.type.ts',
      '**/*.types.ts',
      '**/configs/**',
      '**/_messages/**',
      '**/index.ts',
      '**/index.js',
      'dist/**',
    ],
    setupFiles: ['vitest.setup.ts'],
  },
});
