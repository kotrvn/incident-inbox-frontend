import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IncidentTable } from '../IncidentTable';
import { incidents } from '../../../../mocks/data';

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
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('IncidentTable', () => {
  it('отображает список инцидентов', () => {
    renderWithProviders(
      <IncidentTable
        incidents={incidents}
        onIncidentClick={() => { }}
      />
    );

    expect(screen.getByText('INC-001')).toBeInTheDocument();
    expect(screen.getByText('Повреждённая посылка при доставке')).toBeInTheDocument();
  });

  it('отображает правильное количество строк', () => {
    renderWithProviders(
      <IncidentTable
        incidents={incidents.slice(0, 2)}
        onIncidentClick={() => { }}
      />
    );

    const rows = screen.getAllByRole('row');
    // Заголовок + 2 строки данных
    expect(rows).toHaveLength(3);
  });

  it('вызывает onSort при клике на заголовок', () => {
    const onSortMock = vi.fn();

    renderWithProviders(
      <IncidentTable
        incidents={incidents}
        onSort={onSortMock}
        onIncidentClick={() => { }}
      />
    );

    const idHeader = screen.getByText('ID');
    idHeader.click();

    expect(onSortMock).toHaveBeenCalledWith('id');
  });
});