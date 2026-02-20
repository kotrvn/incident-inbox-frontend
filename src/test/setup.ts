import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from '../mocks/server';

declare global {
    interface Window {
        ResizeObserver: typeof ResizeObserver;
        IntersectionObserver: typeof IntersectionObserver;
        matchMedia: typeof matchMedia;
        localStorage: typeof localStorage;
    }
}

if (typeof window.ResizeObserver === 'undefined') {
    class MockResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }

    window.ResizeObserver = MockResizeObserver as any;
}

if (typeof window.IntersectionObserver === 'undefined') {
    class MockIntersectionObserver {
        readonly root: Element | null = null;
        readonly rootMargin: string = '';
        readonly thresholds: ReadonlyArray<number> = [];

        constructor() {}

        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords(): IntersectionObserverEntry[] {
            return [];
        }
    }

    window.IntersectionObserver = MockIntersectionObserver as any;
}

if (typeof window.matchMedia === 'undefined') {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })) as any;
}

if (typeof window.localStorage === 'undefined') {
    let store: Record<string, string> = {};

    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: (key: string) => store[key] || null,
            setItem: (key: string, value: string) => {
                store[key] = value.toString();
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            },
        },
        writable: true,
    });
}

beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
    cleanup();
    server.resetHandlers();

    if (window.localStorage) {
        window.localStorage.clear();
    }
});

afterAll(() => {
    server.close();
});
