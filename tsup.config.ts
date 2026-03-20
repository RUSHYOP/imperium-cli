import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { bin: 'src/bin.ts' },
    format: ['esm'],
    target: 'node20',
    clean: true,
    minify: true,
    sourcemap: false,
    splitting: false,
    banner: { js: '#!/usr/bin/env node' },
  },
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    target: 'node20',
    dts: true,
    minify: true,
    sourcemap: false,
    splitting: false,
  },
]);
