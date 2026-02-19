import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/server';
import { IncidentsPage } from '../index';

// Увеличиваем таймаут для всех тестов в этом файле
vi.setConfig({ testTimeout: 10000 });

describe('Error and Empty States', () => {
  beforeEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  it('отображает сообщение об ошибке при неудачной загрузке', async () => {
    server.use(
      http.get('/api/incidents', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<IncidentsPage />);

    // Ждем появления сообщения об ошибке
    await waitFor(() => {
      expect(screen.getByText(/Ошибка загрузки/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Проверяем, что кнопка повтора есть
    expect(screen.getByText(/Попробовать снова/i)).toBeInTheDocument();
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

    // Проверяем пустое состояние
    await waitFor(() => {
      expect(screen.getByText(/Инциденты не найдены/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText(/Пока нет ни одного инцидента/i)).toBeInTheDocument();
  });

  it('отображает пустое состояние при поиске без результатов', async () => {
    const user = userEvent.setup({ delay: null });

    render(<IncidentsPage />);

    // Ждем загрузки начальных данных - проверяем наличие таблицы
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Проверяем, что есть хотя бы один инцидент
    await waitFor(() => {
      const cells = screen.getAllByRole('cell');
      const hasIncident = cells.some(cell => cell.textContent?.includes('INC-'));
      expect(hasIncident).toBe(true);
    }, { timeout: 2000 });

    // Вводим поисковый запрос
    const searchInput = screen.getByPlaceholderText(/Поиск по ID, заголовку или описанию/i);
    await user.type(searchInput, 'несуществующий текст');

    // Ждем появления пустого состояния (учитываем debounce 500ms)
    await waitFor(() => {
      expect(screen.getByText(/Инциденты не найдены/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Проверяем, что таблица исчезла или не содержит инцидентов
    await waitFor(() => {
      const cells = screen.queryAllByRole('cell');
      const hasIncident = cells.some(cell => cell.textContent?.includes('INC-'));
      expect(hasIncident).toBe(false);
    }, { timeout: 2000 });
  });

  // Добавим тест для проверки повторной загрузки после ошибки
  it('повторно загружает данные при клике на кнопку "Попробовать снова"', async () => {
    // Сначала возвращаем ошибку
    server.use(
      http.get('/api/incidents', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<IncidentsPage />);

    // Ждем появления сообщения об ошибке
    await waitFor(() => {
      expect(screen.getByText(/Ошибка загрузки/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Меняем хендлер на успешный ответ
    server.resetHandlers(); // Возвращаем стандартные хендлеры

    // Кликаем на кнопку повтора
    const retryButton = screen.getByText(/Попробовать снова/i);
    await userEvent.setup({ delay: null }).click(retryButton);

    // Проверяем, что данные загрузились
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    }, { timeout: 3000 });

    await waitFor(() => {
      const cells = screen.getAllByRole('cell');
      const hasIncident = cells.some(cell => cell.textContent?.includes('INC-'));
      expect(hasIncident).toBe(true);
    }, { timeout: 2000 });
  });
});