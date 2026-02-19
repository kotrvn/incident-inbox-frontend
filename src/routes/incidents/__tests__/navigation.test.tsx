import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { IncidentsPage } from '../index';
import { IncidentDetailPage } from '../[id]';
import { server } from '../../../mocks/server';

vi.mock('../../../shared/utils/toaster', () => ({
  toaster: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Navigation', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });
  afterAll(() => server.close());

  it('загружает и отображает таблицу инцидентов', async () => {
    render(<IncidentsPage />, {
      initialEntries: ['/incidents'],
      path: '/incidents',
    });

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    }, { timeout: 5000 });

    // ✅ Проверяем инциденты, которые РЕАЛЬНО на первой странице
    await waitFor(() => {
      expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
    }, { timeout: 5000 });

    const rows = screen.getAllByRole('row');
    // Заголовок + 10 строк данных
    expect(rows.length).toBeGreaterThan(1);
  });

  it('отображает данные инцидентов в таблице', async () => {
    render(<IncidentsPage />, {
      initialEntries: ['/incidents'],
      path: '/incidents',
    });

    // ✅ Ждём данные первой страницы — INC-015 первый по сортировке
    await waitFor(() => {
      expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Проверяем несколько инцидентов с первой страницы
    const rows = screen.getAllByRole('row');
    const dataRow = rows.find((row) => row.textContent?.includes('Забастовка на складе'));
    expect(dataRow).toBeDefined();
    expect(dataRow!.textContent).toContain('INC-015');
  });

  it('отображает ссылку на детали инцидента с правильным href', async () => {
    render(<IncidentsPage />, {
      initialEntries: ['/incidents'],
      path: '/incidents',
    });

    await waitFor(() => {
      expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
    }, { timeout: 5000 });

    // ✅ Ищем ссылку на INC-015 — он точно на первой странице
    const allLinks = screen.getAllByRole('link');
    const incidentLink = allLinks.find(
      (link) => link.getAttribute('href') === '/incidents/INC-015'
    );

    expect(incidentLink).toBeDefined();
    expect(incidentLink).toHaveAttribute('href', '/incidents/INC-015');
  });

  it('переходит на страницу деталей при клике на ID инцидента', async () => {
    const user = userEvent.setup({ delay: null });

    render(<IncidentsPage />, {
      initialEntries: ['/incidents'],
      routes: [
        { path: '/incidents', element: <IncidentsPage /> },
        { path: '/incidents/:id', element: <IncidentDetailPage /> },
      ],
    });

    // ✅ Ждём данные первой страницы
    await waitFor(() => {
      expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
    }, { timeout: 5000 });

    // ✅ Кликаем по ссылке INC-015
    const allLinks = screen.getAllByRole('link');
    const incidentLink = allLinks.find(
      (link) => link.getAttribute('href') === '/incidents/INC-015'
    );
    expect(incidentLink).toBeDefined();
    await user.click(incidentLink!);

    // ✅ Проверяем детальную страницу INC-015
    await waitFor(() => {
      expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
      expect(screen.getByText(/Лариса Козлова/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('находит инцидент через поиск', async () => {
    const user = userEvent.setup({ delay: null });

    render(<IncidentsPage />, {
      initialEntries: ['/incidents'],
      path: '/incidents',
    });

    // Ждём загрузки
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    }, { timeout: 5000 });

    // ✅ Ищем INC-001 через поиск — так он попадёт на страницу
    const searchInput = screen.getByPlaceholderText(/Поиск/);
    await user.type(searchInput, 'Повреждённая посылка');

    // Ждём debounce (500ms) + загрузку
    await waitFor(() => {
      expect(screen.getByText(/Повреждённая посылка при доставке/)).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText(/Алексей Петров/)).toBeInTheDocument();
  });
});