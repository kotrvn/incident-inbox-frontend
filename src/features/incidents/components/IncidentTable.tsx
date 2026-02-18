import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Incident } from '../../../types';
import { IncidentStatusBadge } from './IncidentStatusBadge';
import { IncidentPriorityBadge } from './IncidentPriorityBadge';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { formatDate } from '../../../utils/dateFormat';

interface IncidentTableProps {
  incidents: Incident[];
  onSort?: (field: string) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onIncidentClick?: (id: string) => void;
}

export const IncidentTable = ({
  incidents,
  onSort,
  sortField,
  sortOrder,
  onIncidentClick
}: IncidentTableProps) => {
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ?
      <TriangleUpIcon ml={1} boxSize={3} /> :
      <TriangleDownIcon ml={1} boxSize={3} />;
  };

  const handleHeaderClick = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  return (
    <TableContainer>
      <Table variant="simple" bg="white" borderRadius="lg" shadow="sm">
        <Thead bg="gray.50">
          <Tr>
            <Th cursor={onSort ? 'pointer' : 'default'} onClick={() => handleHeaderClick('id')}>
              ID {renderSortIcon('id')}
            </Th>
            <Th cursor={onSort ? 'pointer' : 'default'} onClick={() => handleHeaderClick('title')}>
              Заголовок {renderSortIcon('title')}
            </Th>
            <Th>Статус</Th>
            <Th>Приоритет</Th>
            <Th cursor={onSort ? 'pointer' : 'default'} onClick={() => handleHeaderClick('reporter')}>
              Репортер {renderSortIcon('reporter')}
            </Th>
            <Th cursor={onSort ? 'pointer' : 'default'} onClick={() => handleHeaderClick('createdAt')}>
              Дата создания {renderSortIcon('createdAt')}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {incidents.map((incident) => (
            <Tr
              key={incident.id}
              _hover={{ bg: 'gray.50' }}
              transition="background-color 0.2s"
              cursor="pointer"
              onClick={() => onIncidentClick?.(incident.id)}
            >
              <Td>
                <Link as={RouterLink} to={`/incidents/${incident.id}`} color="blue.500" fontWeight="medium">
                  {incident.id}
                </Link>
              </Td>
              <Td>
                <Box>
                  <Text fontWeight="medium">{incident.title}</Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {incident.description}
                  </Text>
                </Box>
              </Td>
              <Td>
                <IncidentStatusBadge status={incident.status} />
              </Td>
              <Td>
                <IncidentPriorityBadge priority={incident.priority} />
              </Td>
              <Td>
                <Box>
                  <Text>{incident.reporter.name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {incident.reporter.email}
                  </Text>
                </Box>
              </Td>
              <Td>
                <Text fontSize="sm">{formatDate(incident.createdAt)}</Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};