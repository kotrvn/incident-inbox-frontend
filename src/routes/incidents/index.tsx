import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  VStack,
  FormControl,
  FormLabel,
  Text,
  Flex,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useIncidents } from '../../features/incidents/hooks/useIncidents';
import { IncidentTable } from '../../features/incidents/components/IncidentTable';
import { LoadingSpinner } from '../../features/shared/components/LoadingSpinner';
import { ErrorMessage } from '../../features/shared/components/ErrorMessage';
import { EmptyState } from '../../features/shared/components/EmptyState';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../features/shared/utils/constants';

export const IncidentsPage = () => {

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Инициализируем состояние из URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
  const [sortField, setSortField] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );

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

  const { data, isLoading, error, refetch } = useIncidents({
    search,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    sortBy: sortField,
    sortOrder,
  });



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
  };

  if (isLoading) return <LoadingSpinner />;

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
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">Инциденты</Text>
        <Text color="gray.600">Всего: {data?.total || 0}</Text>
      </Flex>

      <Box bg="white" p={4} borderRadius="lg" shadow="sm">
        <VStack spacing={4}>
          <HStack spacing={4} width="100%">
            <FormControl>
              <FormLabel>Поиск</FormLabel>
              <Input
                placeholder="Поиск по ID, заголовку или описанию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>

            <FormControl width="200px">
              <FormLabel>Статус</FormLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Все</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl width="200px">
              <FormLabel>Приоритет</FormLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">Все</option>
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button onClick={handleReset} mt="auto" colorScheme="gray">
              Сбросить
            </Button>
          </HStack>
        </VStack>
      </Box>

      {data?.incidents.length === 0 ? (
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
        <IncidentTable
          incidents={data?.incidents || []}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
          onIncidentClick={(id) => navigate(`/incidents/${id}`)}
        />
      )}
    </VStack>
  );
};