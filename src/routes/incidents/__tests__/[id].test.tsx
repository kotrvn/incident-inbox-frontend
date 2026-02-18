import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IncidentDetailPage } from '../[id]';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/incidents/INC-001']}>
        <Routes>
          <Route path="/incidents/:id" element={component} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('IncidentDetailPage', () => {
  it('загружает и отображает детали инцидента', async () => {
    renderWithProviders(<IncidentDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    });
  });

  it('обновляет статус при выборе нового значения', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IncidentDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    });

    const statusSelect = screen.getByLabelText('Статус');
    await user.selectOptions(statusSelect, 'in_progress');

    await waitFor(() => {
      expect(screen.getByText('Статус обновлен')).toBeInTheDocument();
    });
  });

  it('добавляет комментарий', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IncidentDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    });

    const commentInput = screen.getByPlaceholderText('Опишите действия по инциденту...');
    const submitButton = screen.getByText('Добавить комментарий');

    await user.type(commentInput, 'Тестовый комментарий');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Комментарий добавлен')).toBeInTheDocument();
      expect(screen.getByText('Тестовый комментарий')).toBeInTheDocument();
    });
  });
});