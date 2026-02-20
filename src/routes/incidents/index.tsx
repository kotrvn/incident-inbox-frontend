import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    Flex,
    Field,
    Portal,
    Select as ChakraSelect,
    createListCollection,
    Container,
    Icon,
} from '@chakra-ui/react';
import { useIncidents } from '../../features/incidents/hooks/useIncidents';
import { useBulkUpdate } from '../../features/incidents/hooks/useBulkUpdate';
import { IncidentTable } from '../../features/incidents/components/IncidentTable';
import { BulkActionBar } from '../../features/incidents/components/BulkActionBar';
import { Pagination } from '../../shared/components/Pagination';
import { SearchInput } from '../../shared/components/SearchInput';
import { IncidentStatus, IncidentPriority } from '../../types';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { SkeletonTable } from '../../shared/components/SkeletonTable';
import { EmptyState } from '../../shared/components/EmptyState';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../shared/utils/constants';
import { ChevronDown } from 'lucide-react';

export const IncidentsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [resetKey, setResetKey] = useState(0);

    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
    const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
    const [sortField, setSortField] = useState(searchParams.get('sortBy') || 'createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
        (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    );

    const [page, setPage] = useState(Math.max(1, Number(searchParams.get('page')) || 1));
    const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const isMounted = useRef(false);

    const { data, isLoading, error, refetch } = useIncidents({
        page,
        limit,
        search,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sortBy: sortField,
        sortOrder,
    });

    const bulkUpdate = useBulkUpdate();

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

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();

        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);
        if (priorityFilter) params.set('priority', priorityFilter);
        if (sortField !== 'createdAt') params.set('sortBy', sortField);
        if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
        if (page !== 1) params.set('page', String(page));
        if (limit !== 10) params.set('limit', String(limit));

        const paramsString = params.toString();
        const currentParamsString = new URLSearchParams(searchParams).toString();

        if (paramsString !== currentParamsString) {
            setSearchParams(params, { replace: true });
        }
    }, [
        search,
        statusFilter,
        searchParams,
        setSearchParams,
        priorityFilter,
        sortField,
        sortOrder,
        page,
        limit,
    ]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isMounted.current && page !== 1) {
                setPage(1);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [page, search, statusFilter, priorityFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                isMounted.current &&
                data?.pagination?.totalPages &&
                data.pagination.totalPages > 0
            ) {
                if (page > data.pagination.totalPages) {
                    setPage(data.pagination.totalPages);
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [data?.pagination?.totalPages, page]);

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const handleReset = () => {
        setSearch('');
        setResetKey((k) => k + 1);
        setStatusFilter('');
        setPriorityFilter('');
        setSortField('createdAt');
        setSortOrder('desc');
        setPage(1);
        setLimit(10);
        setSelectedIds([]);
    };

    const handlePageChange = (newPage: number) => {
        const safePage = Math.max(1, newPage);
        if (!data?.pagination || safePage <= data.pagination.totalPages) {
            setPage(safePage);
            setSelectedIds([]);
        }
    };

    const handlePageSizeChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
        setSelectedIds([]);
    };

    const handleBulkStatusChange = (status: IncidentStatus) => {
        if (selectedIds.length === 0) return;
        bulkUpdate.mutate(
            { incidentIds: selectedIds, data: { status } },
            {
                onSuccess: () => {
                    setSelectedIds([]);
                    refetch();
                },
            }
        );
    };

    const handleBulkPriorityChange = (priority: IncidentPriority) => {
        if (selectedIds.length === 0) return;
        bulkUpdate.mutate(
            { incidentIds: selectedIds, data: { priority } },
            {
                onSuccess: () => {
                    setSelectedIds([]);
                    refetch();
                },
            }
        );
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
        <Container maxW="container.xl">
            <VStack gap={6} align="stretch">
                <Flex justify="space-between" align="center">
                    <Text fontSize="2xl" fontWeight="bold">
                        Инциденты
                    </Text>
                    <HStack gap={4}>
                        {selectedIds.length > 0 && (
                            <Text color="blue.500" fontWeight="medium">
                                Выбрано: {selectedIds.length}
                            </Text>
                        )}
                        <Text color="gray.600">Всего: {data?.pagination?.totalCount || 0}</Text>
                    </HStack>
                </Flex>

                <Box bg="white" p={4} borderRadius="lg" shadow="sm">
                    <VStack gap={4}>
                        <HStack gap={4} width="100%" alignItems="flex-end">
                            <SearchInput
                                key={resetKey}
                                initialValue=""
                                onSearch={handleSearchChange}
                                placeholder="Поиск по ID, заголовку или описанию..."
                                delay={500}
                                width="300px"
                            />

                            <Field.Root width="200px">
                                <Field.Label>Статус</Field.Label>
                                <ChakraSelect.Root
                                    collection={statusOptions}
                                    value={statusFilter ? [statusFilter] : []}
                                    onValueChange={(e) => setStatusFilter(e.value[0] || '')}
                                >
                                    <ChakraSelect.Trigger>
                                        <ChakraSelect.ValueText placeholder="Все" />
                                        <ChakraSelect.Indicator>
                                            <Icon size="sm">
                                                <ChevronDown />
                                            </Icon>
                                        </ChakraSelect.Indicator>
                                    </ChakraSelect.Trigger>
                                    <Portal>
                                        <ChakraSelect.Positioner>
                                            <ChakraSelect.Content>
                                                {statusOptions.items.map((option) => (
                                                    <ChakraSelect.Item
                                                        item={option}
                                                        key={option.value}
                                                    >
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
                                        <ChakraSelect.Indicator>
                                            <Icon size="sm">
                                                <ChevronDown />
                                            </Icon>
                                        </ChakraSelect.Indicator>
                                    </ChakraSelect.Trigger>
                                    <Portal>
                                        <ChakraSelect.Positioner>
                                            <ChakraSelect.Content>
                                                {priorityOptions.items.map((option) => (
                                                    <ChakraSelect.Item
                                                        item={option}
                                                        key={option.value}
                                                    >
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
                        message={
                            search || statusFilter || priorityFilter
                                ? 'Попробуйте изменить параметры поиска'
                                : 'Пока нет ни одного инцидента'
                        }
                        actionText={
                            search || statusFilter || priorityFilter
                                ? 'Сбросить фильтры'
                                : undefined
                        }
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

                        <Pagination
                            currentPage={data?.pagination?.currentPage || 1}
                            totalPages={data?.pagination?.totalPages || 1}
                            totalItems={data?.pagination?.totalCount || 0}
                            pageSize={limit}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            showPageSize={true}
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
        </Container>
    );
};
