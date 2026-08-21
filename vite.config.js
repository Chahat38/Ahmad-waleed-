import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  assetsInclude: ['**/*.glb'],
  server: { port: 5173, open: false },
  build: {
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap']
        }
      }
    }
  }
});
