import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { IncidentsPage } from '../index';
import { IncidentDetailPage } from '../[id]';

describe('Navigation', () => {
  it('переходит на страницу деталей при клике на инцидент', async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter([
      {
        path: '/',
        element: <IncidentsPage />,
      },
      {
        path: '/incidents/:id',
        element: <IncidentDetailPage />,
      },
    ], {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('INC-001')).toBeInTheDocument();
    });

    const incidentLink = screen.getByRole('link', { name: /INC-001/i });
    await user.click(incidentLink);

    await waitFor(() => {
      expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    });
  });

  it('отображает 404 для несуществующего инцидента', async () => {
    const router = createMemoryRouter([
      {
        path: '/incidents/:id',
        element: <IncidentDetailPage />,
      },
    ], {
      initialEntries: ['/incidents/INC-999'],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Инцидент не найден')).toBeInTheDocument();
    });
  });
});