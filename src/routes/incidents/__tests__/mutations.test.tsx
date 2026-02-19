import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { IncidentDetailPage } from '../[id]';

describe('Mutations', () => {
  const renderDetailPage = (incidentId = 'INC-001') => {
    const router = createMemoryRouter([
      {
        path: '/incidents/:id',
        element: <IncidentDetailPage />,
      },
    ], {
      initialEntries: [`/incidents/${incidentId}`],
    });

    return render(<RouterProvider router={router} />);
  };

  it('изменяет статус инцидента', async () => {
    const user = userEvent.setup();
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    });

    const statusSelect = screen.getAllByRole('combobox')[0];
    await user.click(statusSelect);

    const inProgressOption = await screen.findByText('В работе');
    await user.click(inProgressOption);

    await waitFor(() => {
      expect(screen.getByText('Статус обновлен')).toBeInTheDocument();
    });
  });

  it('добавляет комментарий к инциденту', async () => {
    const user = userEvent.setup();
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    });

    const commentInput = screen.getByPlaceholderText('Опишите действия по инциденту...');
    await user.type(commentInput, 'Тестовый комментарий для проверки');

    const submitButton = screen.getByText('Добавить комментарий');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Тестовый комментарий для проверки')).toBeInTheDocument();
    });
  });
});