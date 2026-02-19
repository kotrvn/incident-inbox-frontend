import { useEffect, useState } from 'react';
import {
  Table,
  Box,
  Text,
  Link,
  Checkbox,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Incident } from '../../../types';
import { IncidentStatusBadge } from './IncidentStatusBadge';
import { IncidentPriorityBadge } from './IncidentPriorityBadge';
import { formatDate } from '../../../shared/utils/dateFormat';
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';

interface IncidentTableProps {
  incidents: Incident[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onIncidentClick?: (id: string) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export const IncidentTable = ({
  incidents,
  onSort,
  sortField,
  sortOrder,
  onIncidentClick,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
}: IncidentTableProps) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedIds);

  useEffect(() => {
    setLocalSelected(selectedIds);
  }, [selectedIds]);

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ?
      <Icon ml={1} boxSize={3}><ArrowUpWideNarrow /></Icon> :
      <Icon ml={1} boxSize={3}><ArrowDownWideNarrow /></Icon>
  };

  const handleHeaderClick = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const handleSelectAll = (details: { checked: boolean | string }) => {
    const isChecked = typeof details.checked === 'string' ? details.checked === 'true' : details.checked;
    const newSelected = isChecked ? incidents.map(i => i.id) : [];
    setLocalSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSelectOne = (id: string, details: { checked: boolean | string }) => {
    const isChecked = typeof details.checked === 'string' ? details.checked === 'true' : details.checked;
    const newSelected = isChecked
      ? [...localSelected, id]
      : localSelected.filter(selectedId => selectedId !== id);

    setLocalSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const isAllSelected = incidents.length > 0 && localSelected.length === incidents.length;
  const isIndeterminate = localSelected.length > 0 && localSelected.length < incidents.length;

  return (
    <Box overflowX="auto" bg="white" borderRadius="lg" shadow="sm">
      <Table.Root variant="outline">
        <Table.Header bg="gray.50">
          <Table.Row>
            {selectable && (
              <Table.ColumnHeader width="40px">
                <Checkbox.Root
                  checked={isAllSelected}
                  data-indeterminate={isIndeterminate ? true : undefined}
                  onCheckedChange={handleSelectAll}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.ColumnHeader>
            )}
            <Table.ColumnHeader
              cursor={onSort ? 'pointer' : 'default'}
              onClick={() => handleHeaderClick('id')}
            >
              <Flex align="center">
                ID {renderSortIcon('id')}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              cursor={onSort ? 'pointer' : 'default'}
              onClick={() => handleHeaderClick('title')}
            >
              <Flex align="center">
                Заголовок {renderSortIcon('title')}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Приоритет</Table.ColumnHeader>
            <Table.ColumnHeader
              cursor={onSort ? 'pointer' : 'default'}
              onClick={() => handleHeaderClick('reporter')}
            >
              <Flex align="center">
                Репортер {renderSortIcon('reporter')}
              </Flex>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              cursor={onSort ? 'pointer' : 'default'}
              onClick={() => handleHeaderClick('createdAt')}
            >
              <Flex align="center">
                Дата создания {renderSortIcon('createdAt')}
              </Flex>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {incidents.map((incident) => {
            const isSelected = localSelected.includes(incident.id);

            return (
              <Table.Row
                key={incident.id}
                _hover={{ bg: 'gray.50' }}
                transition="background-color 0.2s"
                bg={isSelected ? 'blue.50' : undefined}
              >
                {selectable && (
                  <Table.Cell>
                    <Checkbox.Root
                      checked={isSelected}
                      onCheckedChange={(details) => handleSelectOne(incident.id, details)}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Table.Cell>
                )}
                <Table.Cell>
                  <RouterLink to={`/incidents/${incident.id}`}>
                    <Link color="blue.500" fontWeight="medium">
                      {incident.id}
                    </Link>
                  </RouterLink>
                </Table.Cell>
                <Table.Cell cursor="pointer" onClick={() => onIncidentClick?.(incident.id)}>
                  <Box>
                    <Text fontWeight="medium">{incident.title}</Text>
                    <Text fontSize="sm" color="gray.600" lineClamp={1}>
                      {incident.description}
                    </Text>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <IncidentStatusBadge status={incident.status} />
                </Table.Cell>
                <Table.Cell>
                  <IncidentPriorityBadge priority={incident.priority} />
                </Table.Cell>
                <Table.Cell>
                  <Box>
                    <Text>{incident.reporter.name}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {incident.reporter.email}
                    </Text>
                  </Box>
                </Table.Cell>
                <Table.Cell>
                  <Text fontSize="sm">{formatDate(incident.createdAt)}</Text>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};