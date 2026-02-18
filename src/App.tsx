import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Root } from './routes/Root';
import { IncidentsPage } from './routes/incidents/index';
import { IncidentDetailPage } from './routes/incidents/[id]';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
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

function App() {
  return <RouterProvider router={router} />;
}

export default App;