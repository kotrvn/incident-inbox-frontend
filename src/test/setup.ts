import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from '../mocks/server';

// Принудительно устанавливаем глобальные переменные для jsdom
if (typeof window === 'undefined') {
  // @ts-ignore
  import('jsdom').then(({ JSDOM }) => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
      pretendToBeVisual: true,
    });
    
    global.window = dom.window as any;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    global.HTMLElement = dom.window.HTMLElement;
    global.HTMLInputElement = dom.window.HTMLInputElement;
    global.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
    global.HTMLSelectElement = dom.window.HTMLSelectElement;
  });
}

// Полифиллы для DOM API
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  root = null;
  rootMargin = '';
  thresholds = [];
  takeRecords() { return []; }
}

// Добавляем полифиллы в глобальный объект
beforeAll(() => {
  // Полифиллы для DOM API
  global.ResizeObserver = ResizeObserverMock as any;
  global.IntersectionObserver = IntersectionObserverMock as any;

  // Мок для window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Мок для localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
      key: (index: number) => Object.keys(store)[index] || null,
      get length() { return Object.keys(store).length; },
    };
  })();

  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Запускаем MSW
  server.listen({ onUnhandledRequest: 'error' });
});

beforeEach(() => {
  // Очищаем DOM перед каждым тестом
  if (document.body) {
    document.body.innerHTML = '';
  }
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  window.localStorage.clear();
});

afterAll(() => {
  server.close();
});