import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../../../test/test-utils';
import { IncidentTable } from '../IncidentTable';
import { incidents } from '../../../../mocks/data';

describe('IncidentTable', () => {
  const mockIncidents = incidents.slice(0, 3);

  it('отображает список инцидентов', async () => {
    render(
      <IncidentTable
        incidents={mockIncidents}
        onIncidentClick={() => { }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('INC-001')).toBeInTheDocument();
    });

    expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    expect(screen.getByText('INC-002')).toBeInTheDocument();
  });

  it('отображает правильное количество строк', async () => {
    render(
      <IncidentTable
        incidents={mockIncidents}
        onIncidentClick={() => { }}
      />
    );

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Заголовок + 3 строки данных
      expect(rows).toHaveLength(4);
    });
  });

  it('вызывает onSort при клике на заголовок', async () => {
    const onSortMock = vi.fn();

    render(
      <IncidentTable
        incidents={mockIncidents}
        onSort={onSortMock}
        onIncidentClick={() => { }}
      />
    );

    await waitFor(() => {
      const idHeader = screen.getByText('ID');
      idHeader.click();
      expect(onSortMock).toHaveBeenCalledWith('id');
    });
  });
});