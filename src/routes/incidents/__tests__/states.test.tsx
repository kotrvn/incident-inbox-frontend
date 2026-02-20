import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/server';
import { IncidentsPage } from '../index';

vi.setConfig({ testTimeout: 10000 });

describe('Ошибка или пустая страница', () => {
    beforeEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });

    it('Отображает сообщение об ошибке при неудачной загрузке', async () => {
        server.use(
            http.get('/api/incidents', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        render(<IncidentsPage />);

        await waitFor(
            () => {
                expect(screen.getByText(/Ошибка загрузки/i)).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        expect(screen.getByText(/Попробовать снова/i)).toBeInTheDocument();
    });

    it('Отображает пустое состояние, когда нет инцидентов', async () => {
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

        await waitFor(
            () => {
                expect(screen.getByText(/Инциденты не найдены/i)).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        expect(screen.getByText(/Пока нет ни одного инцидента/i)).toBeInTheDocument();
    });

    it('Отображает пустое состояние при поиске без результатов', async () => {
        const user = userEvent.setup({ delay: null });

        render(<IncidentsPage />);

        await waitFor(
            () => {
                expect(screen.getByRole('table')).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        await waitFor(
            () => {
                const cells = screen.getAllByRole('cell');
                const hasIncident = cells.some((cell) => cell.textContent?.includes('INC-'));
                expect(hasIncident).toBe(true);
            },
            { timeout: 2000 }
        );

        const searchInput = screen.getByPlaceholderText(/Поиск по ID, заголовку или описанию/i);
        await user.type(searchInput, 'несуществующий текст');

        await waitFor(
            () => {
                expect(screen.getByText(/Инциденты не найдены/i)).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        await waitFor(
            () => {
                const cells = screen.queryAllByRole('cell');
                const hasIncident = cells.some((cell) => cell.textContent?.includes('INC-'));
                expect(hasIncident).toBe(false);
            },
            { timeout: 2000 }
        );
    });

    it('Повторно загружает данные при клике на кнопку "Попробовать снова"', async () => {
        server.use(
            http.get('/api/incidents', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        render(<IncidentsPage />);

        await waitFor(
            () => {
                expect(screen.getByText(/Ошибка загрузки/i)).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        server.resetHandlers();

        const retryButton = screen.getByText(/Попробовать снова/i);
        await userEvent.setup({ delay: null }).click(retryButton);

        await waitFor(
            () => {
                expect(screen.getByRole('table')).toBeInTheDocument();
            },
            { timeout: 3000 }
        );

        await waitFor(
            () => {
                const cells = screen.getAllByRole('cell');
                const hasIncident = cells.some((cell) => cell.textContent?.includes('INC-'));
                expect(hasIncident).toBe(true);
            },
            { timeout: 2000 }
        );
    });
});
