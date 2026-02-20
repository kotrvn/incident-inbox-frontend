import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

interface RouteConfig {
    path: string;
    element: React.ReactElement;
}

interface CustomRenderOptions {
    initialEntries?: string[];
    path?: string;
    routes?: RouteConfig[];
}

function render(ui: React.ReactElement, options?: CustomRenderOptions) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
            },
        },
    });

    const { path, routes, initialEntries = ['/'] } = options || {};

    return rtlRender(
        <ChakraProvider value={defaultSystem}>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={initialEntries}>
                    {routes ? (
                        <Routes>
                            {routes.map((route) => (
                                <Route key={route.path} path={route.path} element={route.element} />
                            ))}
                        </Routes>
                    ) : path ? (
                        <Routes>
                            <Route path={path} element={ui} />
                        </Routes>
                    ) : (
                        <Routes>
                            <Route path="*" element={ui} />
                        </Routes>
                    )}
                </MemoryRouter>
            </QueryClientProvider>
        </ChakraProvider>
    );
}

// ts-expected-error<re-export everything>
export * from '@testing-library/react';
export { render };
