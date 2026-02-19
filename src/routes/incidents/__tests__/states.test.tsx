import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/server';
import { IncidentsPage } from '../index';

describe('Error and Empty States', () => {
  beforeEach(() => {
    // Сброс хендлеров перед каждым тестом
    server.resetHandlers();
  });

  it('отображает сообщение об ошибке при неудачной загрузке', async () => {
    server.use(
      http.get('/api/incidents', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<IncidentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Ошибка загрузки')).toBeInTheDocument();
    });

    expect(screen.getByText('Попробовать снова')).toBeInTheDocument();
  });

  it('отображает пустое состояние, когда нет инцидентов', async () => {
    server.use(
      http.get('/api/incidents', () => {
        return HttpResponse.json({
          incidents: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
            limit: 10,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        });
      })
    );

    render(<IncidentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Инциденты не найдены')).toBeInTheDocument();
    });

    expect(screen.getByText('Пока нет ни одного инцидента')).toBeInTheDocument();
  });

  it('отображает пустое состояние при поиске без результатов', async () => {
    const user = userEvent.setup();
    render(<IncidentsPage />);

    await waitFor(() => {
      expect(screen.getByText('INC-001')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Поиск по ID, заголовку или описанию...');
    await user.type(searchInput, 'несуществующий текст');

    await waitFor(() => {
      expect(screen.getByText('Инциденты не найдены')).toBeInTheDocument();
    });
  });
});