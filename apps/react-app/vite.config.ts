/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/react-app',

  server: {
    port: 4200,
    host: '0.0.0.0',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    svgr({
      svgrOptions: {
        runtimeConfig: true,
        icon: true,
        exportType: 'default',
        ref: true,
        dimensions: true,
        expandProps: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    deps: {
      inline: ['vitest-canvas-mock'],
      // >= 0.34
      //optimizer: {
      //  web: {
      //    include: ['vitest-canvas-mock']
      //  }
      //}
    },
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['test-setup.ts'],
  },
});
