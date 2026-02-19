import {
  Box,
  HStack,
  Button,
  Menu,
  Badge,
  Portal,
  Text,
} from '@chakra-ui/react';
import { IncidentStatus, IncidentPriority } from '../../../types';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../../utils/constants';
import { ChevronDown } from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onStatusChange: (status: IncidentStatus) => void;
  onPriorityChange: (priority: IncidentPriority) => void;
  onClearSelection: () => void;
  isLoading?: boolean;
}

export const BulkActionBar = ({
  selectedCount,
  onStatusChange,
  onPriorityChange,
  onClearSelection,
  isLoading,
}: BulkActionBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <Box
      position="sticky"
      bottom={4}
      bg="blue.500"
      color="white"
      p={4}
      borderRadius="lg"
      shadow="lg"
      zIndex={10}
    >
      <HStack justify="space-between" wrap="wrap" gap={4}>
        <HStack gap={4}>
          <Badge colorPalette="white" px={3} py={1} fontSize="md" rounded="full">
            Выбрано: {selectedCount}
          </Badge>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button size="sm" colorPalette="whiteAlpha" loading={isLoading}>
                <HStack gap={2}>
                  <Text>Изменить статус</Text>
                  <ChevronDown />
                </HStack>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <Menu.Item
                      key={status}
                      value={status}
                      onClick={() => onStatusChange(status as IncidentStatus)}
                    >
                      {label}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                size="sm"
                colorPalette="whiteAlpha"
                loading={isLoading}
              >
                Изменить приоритет <ChevronDown />
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {Object.entries(PRIORITY_LABELS).map(([priority, label]) => (
                    <Menu.Item
                      key={priority}
                      value={priority}
                      onClick={() => onPriorityChange(priority as IncidentPriority)}
                    >
                      {label}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>

        <Button
          size="sm"
          variant="outline"
          colorPalette="whiteAlpha"
          onClick={onClearSelection}
        >
          Очистить выбор
        </Button>
      </HStack>
    </Box>
  );
};