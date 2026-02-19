import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Flex,
  Field,
  Portal,
  Select as ChakraSelect,
  createListCollection,
} from '@chakra-ui/react';
import { useIncidents } from '../../features/incidents/hooks/useIncidents';
import { useBulkUpdate } from '../../features/incidents/hooks/useBulkUpdate';
import { IncidentTable } from '../../features/incidents/components/IncidentTable';
import { BulkActionBar } from '../../features/incidents/components/BulkActionBar';
import { IncidentStatus, IncidentPriority } from '../../types';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { SkeletonTable } from '../../shared/components/SkeletonTable';
import { EmptyState } from '../../shared/components/EmptyState';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

export const IncidentsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Состояние фильтров из URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
  const [sortField, setSortField] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );

  // Состояние для bulk select
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, error, refetch } = useIncidents({
    search,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    sortBy: sortField,
    sortOrder,
  });

  const bulkUpdate = useBulkUpdate();

  // Создаем коллекции для селектов
  const statusOptions = createListCollection({
    items: [
      { value: '', label: 'Все' },
      ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    ],
  });

  const priorityOptions = createListCollection({
    items: [
      { value: '', label: 'Все' },
      ...Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    ],
  });

  // Обновляем URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (priorityFilter) params.set('priority', priorityFilter);
    if (sortField !== 'createdAt') params.set('sortBy', sortField);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);

    setSearchParams(params);
  }, [search, statusFilter, priorityFilter, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortField('createdAt');
    setSortOrder('desc');
    setSelectedIds([]);
  };

  const handleBulkStatusChange = (status: IncidentStatus) => {
    if (selectedIds.length === 0) return;

    bulkUpdate.mutate({
      incidentIds: selectedIds,
      data: { status },
    }, {
      onSuccess: () => {
        setSelectedIds([]);
      },
    });
  };

  const handleBulkPriorityChange = (priority: IncidentPriority) => {
    if (selectedIds.length === 0) return;

    bulkUpdate.mutate({
      incidentIds: selectedIds,
      data: { priority },
    }, {
      onSuccess: () => {
        setSelectedIds([]);
      },
    });
  };

  if (error) {
    return (
      <ErrorMessage
        title="Ошибка загрузки"
        message="Не удалось загрузить список инцидентов"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <VStack gap={6} align="stretch">
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">Инциденты</Text>
        <HStack gap={4}>
          {selectedIds.length > 0 && (
            <Text color="blue.500" fontWeight="medium">
              Выбрано: {selectedIds.length}
            </Text>
          )}
          <Text color="gray.600">Всего: {data?.total || 0}</Text>
        </HStack>
      </Flex>

      <Box bg="white" p={4} borderRadius="lg" shadow="sm">
        <VStack gap={4}>
          <HStack gap={4} width="100%" alignItems="flex-end">
            <Field.Root>
              <Field.Label>Поиск</Field.Label>
              <Input
                placeholder="Поиск по ID, заголовку или описанию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                width="300px"
              />
            </Field.Root>

            <Field.Root width="200px">
              <Field.Label>Статус</Field.Label>
              <ChakraSelect.Root
                collection={statusOptions}
                value={statusFilter ? [statusFilter] : []}
                onValueChange={(e) => setStatusFilter(e.value[0] || '')}
              >
                <ChakraSelect.Trigger>
                  <ChakraSelect.ValueText placeholder="Все" />
                </ChakraSelect.Trigger>
                <Portal>
                  <ChakraSelect.Positioner>
                    <ChakraSelect.Content>
                      {statusOptions.items.map((option) => (
                        <ChakraSelect.Item item={option} key={option.value}>
                          {option.label}
                        </ChakraSelect.Item>
                      ))}
                    </ChakraSelect.Content>
                  </ChakraSelect.Positioner>
                </Portal>
              </ChakraSelect.Root>
            </Field.Root>

            <Field.Root width="200px">
              <Field.Label>Приоритет</Field.Label>
              <ChakraSelect.Root
                collection={priorityOptions}
                value={priorityFilter ? [priorityFilter] : []}
                onValueChange={(e) => setPriorityFilter(e.value[0] || '')}
              >
                <ChakraSelect.Trigger>
                  <ChakraSelect.ValueText placeholder="Все" />
                </ChakraSelect.Trigger>
                <Portal>
                  <ChakraSelect.Positioner>
                    <ChakraSelect.Content>
                      {priorityOptions.items.map((option) => (
                        <ChakraSelect.Item item={option} key={option.value}>
                          {option.label}
                        </ChakraSelect.Item>
                      ))}
                    </ChakraSelect.Content>
                  </ChakraSelect.Positioner>
                </Portal>
              </ChakraSelect.Root>
            </Field.Root>

            <Button onClick={handleReset} colorPalette="gray" alignSelf="flex-end">
              Сбросить
            </Button>
          </HStack>
        </VStack>
      </Box>

      {isLoading ? (
        <SkeletonTable />
      ) : data?.incidents.length === 0 ? (
        <EmptyState
          title="Инциденты не найдены"
          message={search || statusFilter || priorityFilter ?
            "Попробуйте изменить параметры поиска" :
            "Пока нет ни одного инцидента"
          }
          actionText={search || statusFilter || priorityFilter ? "Сбросить фильтры" : undefined}
          onAction={handleReset}
        />
      ) : (
        <>
          <IncidentTable
            incidents={data?.incidents || []}
            onSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
            onIncidentClick={(id) => navigate(`/incidents/${id}`)}
            selectable={true}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />

          <BulkActionBar
            selectedCount={selectedIds.length}
            onStatusChange={handleBulkStatusChange}
            onPriorityChange={handleBulkPriorityChange}
            onClearSelection={() => setSelectedIds([])}
            isLoading={bulkUpdate.isPending}
          />
        </>
      )}
    </VStack>
  );
};