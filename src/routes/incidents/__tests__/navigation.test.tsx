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

describe('Навигация', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
    afterEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });
    afterAll(() => server.close());

    it('Загружает и отображает таблицу инцидентов', async () => {
        render(<IncidentsPage />, {
            initialEntries: ['/incidents'],
            path: '/incidents',
        });

        await waitFor(
            () => {
                expect(screen.getByRole('table')).toBeInTheDocument();
            },
            { timeout: 5000 }
        );

        await waitFor(
            () => {
                expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
            },
            { timeout: 5000 }
        );

        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(1);
    });

    it('Отображает данные инцидентов в таблице', async () => {
        render(<IncidentsPage />, {
            initialEntries: ['/incidents'],
            path: '/incidents',
        });

        await waitFor(
            () => {
                expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
            },
            { timeout: 5000 }
        );

        const rows = screen.getAllByRole('row');
        const dataRow = rows.find((row) => row.textContent?.includes('Забастовка на складе'));
        expect(dataRow).toBeDefined();
        expect(dataRow!.textContent).toContain('INC-015');
    });

    it('Отображает ссылку на детали инцидента с правильным href', async () => {
        render(<IncidentsPage />, {
            initialEntries: ['/incidents'],
            path: '/incidents',
        });

        await waitFor(
            () => {
                expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
            },
            { timeout: 5000 }
        );

        const allLinks = screen.getAllByRole('link');
        const incidentLink = allLinks.find(
            (link) => link.getAttribute('href') === '/incidents/INC-015'
        );

        expect(incidentLink).toBeDefined();
        expect(incidentLink).toHaveAttribute('href', '/incidents/INC-015');
    });

    it('Переходит на страницу деталей при клике на ID инцидента', async () => {
        const user = userEvent.setup({ delay: null });

        render(<IncidentsPage />, {
            initialEntries: ['/incidents'],
            routes: [
                { path: '/incidents', element: <IncidentsPage /> },
                { path: '/incidents/:id', element: <IncidentDetailPage /> },
            ],
        });

        await waitFor(
            () => {
                expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
            },
            { timeout: 5000 }
        );

        const allLinks = screen.getAllByRole('link');
        const incidentLink = allLinks.find(
            (link) => link.getAttribute('href') === '/incidents/INC-015'
        );
        expect(incidentLink).toBeDefined();
        await user.click(incidentLink!);

        await waitFor(
            () => {
                expect(screen.getByText(/Забастовка на складе/)).toBeInTheDocument();
                expect(screen.getByText(/Лариса Козлова/)).toBeInTheDocument();
            },
            { timeout: 5000 }
        );
    });

    it('Находит инцидент через поиск', async () => {
        const user = userEvent.setup({ delay: null });

        render(<IncidentsPage />, {
            initialEntries: ['/incidents'],
            path: '/incidents',
        });

        await waitFor(
            () => {
                expect(screen.getByRole('table')).toBeInTheDocument();
            },
            { timeout: 5000 }
        );

        const searchInput = screen.getByPlaceholderText(/Поиск/);
        await user.type(searchInput, 'Повреждённая посылка');

        await waitFor(
            () => {
                expect(screen.getByText(/Повреждённая посылка при доставке/)).toBeInTheDocument();
            },
            { timeout: 5000 }
        );

        expect(screen.getByText(/Алексей Петров/)).toBeInTheDocument();
    });
});
