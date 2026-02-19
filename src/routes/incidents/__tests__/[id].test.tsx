import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { IncidentDetailPage } from '../[id]';

describe('IncidentDetailPage', () => {
  const renderWithRouter = (initialEntries = ['/incidents/INC-001']) => {
    const router = createMemoryRouter([
      {
        path: '/incidents/:id',
        element: <IncidentDetailPage />,
      },
    ], { initialEntries });

    return render(<RouterProvider router={router} />);
  };

  it('загружает и отображает детали инцидента', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText('INC-001')).toBeInTheDocument();
    expect(screen.getByText('Алексей Петров')).toBeInTheDocument();
  });

  it('обновляет статус при выборе нового значения', async () => {
    const user = userEvent.setup({ delay: null }); // Отключаем задержку для тестов
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Находим селект статуса
    const statusSelect = screen.getAllByRole('combobox')[0];
    await user.click(statusSelect);

    // Выбираем новый статус
    const inProgressOption = await screen.findByText('В работе');
    await user.click(inProgressOption);

    // Проверяем, что появилось уведомление
    await waitFor(() => {
      expect(screen.getByText('Статус обновлен')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('добавляет комментарий', async () => {
    const user = userEvent.setup({ delay: null }); // Отключаем задержку для тестов
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    }, { timeout: 3000 });

    const commentInput = screen.getByPlaceholderText('Опишите действия по инциденту...');
    await user.type(commentInput, 'Тестовый комментарий');

    const submitButton = screen.getByText('Добавить комментарий');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Тестовый комментарий')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});