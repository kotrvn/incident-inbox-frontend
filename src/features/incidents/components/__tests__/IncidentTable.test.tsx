import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../../../test/test-utils';
import { IncidentTable } from '../IncidentTable';
import { incidents } from '../../../../mocks/data';
import userEvent from '@testing-library/user-event';

describe('IncidentTable', () => {
  const mockIncidents = incidents.slice(0, 3);

  it('отображает список инцидентов', async () => {
    render(
      <IncidentTable
        incidents={mockIncidents}
        onIncidentClick={() => { }}
      />
    );

    // Используем waitFor для асинхронной отрисовки
    await waitFor(() => {
      expect(screen.getByText('INC-001')).toBeInTheDocument();
    });

    // Используем toBeInTheDocument() вместо toBeDefined()
    expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
    expect(screen.getByText('INC-002')).toBeInTheDocument();
    expect(screen.getByText('Задержка доставки на 3 часа')).toBeInTheDocument();
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
    const user = userEvent.setup({ delay: null });
    const onSortMock = vi.fn();

    render(
      <IncidentTable
        incidents={mockIncidents}
        onSort={onSortMock}
        onIncidentClick={() => { }}
      />
    );

    // Ждем загрузки таблицы
    await waitFor(() => {
      expect(screen.getByText('INC-001')).toBeInTheDocument();
    });

    // Используем userEvent вместо прямого click()
    const idHeader = screen.getByText('ID');
    await user.click(idHeader);

    expect(onSortMock).toHaveBeenCalledWith('id');
  });

  it('вызывает onIncidentClick при клике на строку инцидента', async () => {
    const user = userEvent.setup({ delay: null });
    const onIncidentClickMock = vi.fn();

    render(
      <IncidentTable
        incidents={mockIncidents}
        onIncidentClick={onIncidentClickMock}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('INC-001')).toBeInTheDocument();
    });

    // Кликаем на строку с инцидентом
    const incidentCell = screen.getByText('Повреждённая посылка при доставке');
    await user.click(incidentCell);

    expect(onIncidentClickMock).toHaveBeenCalledWith('INC-001');
  });

  it('отображает чекбоксы когда selectable=true', async () => {
    render(
      <IncidentTable
        incidents={mockIncidents}
        onIncidentClick={() => { }}
        selectable={true}
        selectedIds={[]}
        onSelectionChange={() => { }}
      />
    );

    await waitFor(() => {
      // Проверяем наличие чекбоксов
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(4); // Один в заголовке + три в строках
    });
  });

  it('вызывает onSelectionChange при выборе инцидента', async () => {
    const user = userEvent.setup({ delay: null });
    const onSelectionChangeMock = vi.fn();

    render(
      <IncidentTable
        incidents={mockIncidents}
        onIncidentClick={() => { }}
        selectable={true}
        selectedIds={[]}
        onSelectionChange={onSelectionChangeMock}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('INC-001')).toBeInTheDocument();
    });

    // Находим чекбокс для первого инцидента (индекс 1, так как первый чекбокс - "выбрать все")
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // Кликаем на чекбокс первого инцидента

    expect(onSelectionChangeMock).toHaveBeenCalledWith(['INC-001']);
  });
});