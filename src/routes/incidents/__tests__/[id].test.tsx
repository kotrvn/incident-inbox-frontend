import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { IncidentDetailPage } from '../[id]';
import { server } from '../../../mocks/server';
import { http, HttpResponse } from 'msw';

vi.mock('../../../shared/utils/toaster', () => ({
  toaster: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderOptions = {
  initialEntries: ['/incidents/INC-001'],
  path: '/incidents/:id',
};

// ✅ Хелпер для чтения черновика
const getDraft = (incidentId: string) => {
  try {
    const drafts = JSON.parse(localStorage.getItem('comment_drafts') || '{}');
    return drafts[incidentId]?.content || null;
  } catch {
    return null;
  }
};

describe('IncidentDetailPage', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'warn' });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    server.close();
  });

  it('загружает и отображает детали инцидента', async () => {
    render(<IncidentDetailPage />, renderOptions);

    await waitFor(() => {
      expect(screen.getByText(/INC-001/)).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText(/Повреждённая посылка/)).toBeInTheDocument();
    expect(screen.getByText(/Алексей Петров/)).toBeInTheDocument();
  });

  it('отображает 404 для несуществующего инцидента', async () => {
    server.use(
      http.get('*/api/incidents/INC-999', () => {
        return new HttpResponse(
          JSON.stringify({ message: 'Инцидент не найден' }),
          { status: 404 }
        );
      })
    );

    render(<IncidentDetailPage />, {
      initialEntries: ['/incidents/INC-999'],
      path: '/incidents/:id',
    });

    await waitFor(() => {
      expect(screen.getByText(/Инцидент не найден/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('обновляет статус при выборе нового значения', async () => {
    const user = userEvent.setup({ delay: null });
    render(<IncidentDetailPage />, renderOptions);

    await waitFor(() => {
      expect(screen.getByText(/INC-001/)).toBeInTheDocument();
    }, { timeout: 5000 });

    const statusSelect = screen.getAllByRole('combobox')[0];
    await user.click(statusSelect);

    const inProgressOption = await screen.findByText('В работе');
    await user.click(inProgressOption);

    const { toaster } = await import('../../../shared/utils/toaster');
    await waitFor(() => {
      expect(toaster.success).toHaveBeenCalled();
    });
  });

  it('добавляет комментарий', async () => {
    const user = userEvent.setup({ delay: null });
    render(<IncidentDetailPage />, renderOptions);

    await waitFor(() => {
      expect(screen.getByText(/INC-001/)).toBeInTheDocument();
    }, { timeout: 5000 });

    const commentInput = screen.getByPlaceholderText('Опишите действия по инциденту...');
    await user.type(commentInput, 'Тестовый комментарий');

    const submitButton = screen.getByText('Добавить комментарий');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Тестовый комментарий')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('сохраняет черновик комментария в localStorage', async () => {
    const user = userEvent.setup({ delay: null });
    render(<IncidentDetailPage />, renderOptions);

    await waitFor(() => {
      expect(screen.getByText(/INC-001/)).toBeInTheDocument();
    }, { timeout: 5000 });

    const commentInput = screen.getByPlaceholderText('Опишите действия по инциденту...');
    await user.type(commentInput, 'Черновик комментария');

    // ✅ useDebounce = 1000ms, затем сохранение в localStorage
    // Ждём debounce + эффект сохранения
    await waitFor(() => {
      expect(getDraft('INC-001')).toBe('Черновик комментария');
    }, { timeout: 3000 });
  });

  it('очищает черновик после отправки комментария', async () => {
    const user = userEvent.setup({ delay: null });
    render(<IncidentDetailPage />, renderOptions);

    await waitFor(() => {
      expect(screen.getByText(/INC-001/)).toBeInTheDocument();
    }, { timeout: 5000 });

    const commentInput = screen.getByPlaceholderText('Опишите действия по инциденту...');
    await user.type(commentInput, 'Комментарий для отправки');

    // Ждём сохранения черновика
    await waitFor(() => {
      expect(getDraft('INC-001')).toBe('Комментарий для отправки');
    }, { timeout: 3000 });

    // Отправляем комментарий
    const submitButton = screen.getByText('Добавить комментарий');
    await user.click(submitButton);

    // ✅ clearDraft() удаляет ключ из объекта drafts
    await waitFor(() => {
      expect(getDraft('INC-001')).toBeNull();
    }, { timeout: 3000 });

    // Поле ввода очищено
    expect(commentInput).toHaveValue('');
  });

  it('загружает черновик из localStorage при открытии', async () => {
    // ✅ Предварительно сохраняем черновик
    localStorage.setItem('comment_drafts', JSON.stringify({
      'INC-001': {
        content: 'Ранее сохранённый черновик',
        timestamp: new Date().toISOString(),
      },
    }));

    render(<IncidentDetailPage />, renderOptions);

    await waitFor(() => {
      expect(screen.getByText(/INC-001/)).toBeInTheDocument();
    }, { timeout: 5000 });

    // ✅ Черновик загружен в textarea
    const commentInput = screen.getByPlaceholderText('Опишите действия по инциденту...');
    expect(commentInput).toHaveValue('Ранее сохранённый черновик');
  });
});