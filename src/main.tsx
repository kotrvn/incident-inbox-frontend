import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import App from './App';

async function enableMocking() {
    if (import.meta.env.MODE !== 'development') {
        return;
    }

    const { worker } = await import('./mocks/browser');
    return worker.start({
        onUnhandledRequest: 'bypass',
    });
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <ChakraProvider value={defaultSystem}>
                <QueryClientProvider client={queryClient}>
                    <App />
                    <ReactQueryDevtools />
                </QueryClientProvider>
            </ChakraProvider>
        </React.StrictMode>
    );
});
