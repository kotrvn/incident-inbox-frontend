import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    env: {
      NODE_ENV: 'test',
    },
    deps: {
      inline: ['@chakra-ui/react', '@chakra-ui/icons'],
      optimizer: {
        web: {
          include: ['@chakra-ui/react', '@chakra-ui/icons'],
        },
      },
    },
  },
});