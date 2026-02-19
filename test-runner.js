import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Запускаем vitest с явным указанием окружения
const testProcess = spawn('bun', ['x', 'vitest', '--environment', 'jsdom'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'test',
    VITEST_ENVIRONMENT: 'jsdom',
  },
});

testProcess.on('close', (code) => {
  process.exit(code);
});