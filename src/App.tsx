import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Root } from './routes/Root';
import { IncidentsPage } from './routes/incidents/index';
import { IncidentDetailPage } from './routes/incidents/[id]';
import { useErrorLogger } from './shared/hooks/useErrorLogger';
import { ErrorBoundary } from './shared/components/ErrorBoundary';

function AppContent() {
  const { logError } = useErrorLogger();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: (
        <ErrorBoundary onError={logError}>
          <div>Ошибка маршрута</div>
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