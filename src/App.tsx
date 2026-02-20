import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Root } from './routes/Root';
import { IncidentsPage } from './routes/incidents/index';
import { IncidentDetailPage } from './routes/incidents/[id]';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { ErrorMessage } from './shared/components/ErrorMessage';

function AppContent() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root />,
            errorElement: (
                <ErrorBoundary>
                    <ErrorMessage
                        title="404"
                        message="Cтраница не найдена"
                        onRetry={() => window.history.go(-1)}
                    />
                </ErrorBoundary>
            ),
            children: [
                {
                    index: true,
                    element: <Navigate to="/incidents" replace />,
                },
                {
                    path: 'incidents',
                    element: <IncidentsPage />,
                },
                {
                    path: 'incidents/:id',
                    element: <IncidentDetailPage />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

function App() {
    return (
        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>
    );
}

export default App;
