import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '../../../test/test-utils';
import userEvent from '@testing-library/user-event';
import { IncidentDetailPage } from '../[id]';
import { server } from '../../../mocks/server';

vi.mock('../../../shared/utils/toaster', () => ({
    toaster: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('Изменения в инциденте', () => {
    beforeAll(() => {
        server.listen({ onUnhandledRequest: 'error' });
    });

    afterEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });

    afterAll(() => {
        server.close();
    });

    const renderDetailPage = (incidentId = 'INC-001') => {
        return render(<IncidentDetailPage />, {
            initialEntries: [`/incidents/${incidentId}`],
            path: '/incidents/:id',
        });
    };

    it('Изменяет статус инцидента', async () => {
        const user = userEvent.setup({ delay: null });
        renderDetailPage();

        await waitFor(
            () => {
                expect(screen.getByText(/Повреждённая посылка/)).toBeInTheDocument();
            },
            { timeout: 5000 }
        );

        const statusSelect = screen.getAllByRole('combobox')[0];
        await user.click(statusSelect);

        const inProgressOption = await screen.findByText('В работе');
        await user.click(inProgressOption);

        const { toaster } = await import('../../../shared/utils/toaster');
        await waitFor(() => {
            expect(toaster.success).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Статус обновлен',
                })
            );
        });
    });

    it('Добавляет комментарий к инциденту', async () => {
        const user = userEvent.setup({ delay: null });
        renderDetailPage();

        await waitFor(
            () => {
                expect(screen.getByText(/Повреждённая посылка/)).toBeInTheDocument();
            },
            { timeout: 5000 }
        );

        const commentInput = screen.getByPlaceholderText('Опишите действия по инциденту...');
        await user.type(commentInput, 'Тестовый комментарий для проверки');

        const submitButton = screen.getByText('Добавить комментарий');
        await user.click(submitButton);

        await waitFor(
            () => {
                expect(screen.getByText('Тестовый комментарий для проверки')).toBeInTheDocument();
            },
            { timeout: 3000 }
        );
    });
});
