import { setupWorker } from 'msw/browser'; // Убедись, что именно /browser
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);