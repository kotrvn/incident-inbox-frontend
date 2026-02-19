import {
  Box,
  HStack,
  Button,
  Badge,
  Select as ChakraSelect,
  Field,
  Portal,
  createListCollection,
  Icon,
  Flex,
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

const statusCollection = createListCollection({
  items: Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
});

const priorityCollection = createListCollection({
  items: Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
});

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
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      p={4}
      borderRadius="lg"
      shadow="lg"
      zIndex={10}
    >
      <HStack justify="space-between" wrap="wrap" gap={4}>
        <HStack gap={4}>
          <Badge colorPalette="blue" px={3} py={1} fontSize="md" rounded="full">
            Выбрано: {selectedCount}
          </Badge>

          {/* Select для статуса */}
          <Field.Root width="200px">
            <ChakraSelect.Root
              collection={statusCollection}
              onValueChange={(e) => onStatusChange(e.value[0] as IncidentStatus)}
              disabled={isLoading}
            >
              <ChakraSelect.Trigger>
                <Flex justify="space-between" align="center" width="100%">
                  <ChakraSelect.ValueText placeholder="Изменить статус" />
                  <Icon color="gray.500">
                    <ChevronDown size={16} />
                  </Icon>
                </Flex>
              </ChakraSelect.Trigger>
              <Portal>
                <ChakraSelect.Positioner>
                  <ChakraSelect.Content>
                    {statusCollection.items.map((option) => (
                      <ChakraSelect.Item item={option} key={option.value}>
                        {option.label}
                      </ChakraSelect.Item>
                    ))}
                  </ChakraSelect.Content>
                </ChakraSelect.Positioner>
              </Portal>
            </ChakraSelect.Root>
          </Field.Root>

          {/* Select для приоритета */}
          <Field.Root width="200px">
            <ChakraSelect.Root
              collection={priorityCollection}
              onValueChange={(e) => onPriorityChange(e.value[0] as IncidentPriority)}
              disabled={isLoading}
            >
              <ChakraSelect.Trigger>
                <Flex justify="space-between" align="center" width="100%">
                  <ChakraSelect.ValueText placeholder="Изменить приоритет" />
                  <Icon color="gray.500">
                    <ChevronDown size={16} />
                  </Icon>
                </Flex>
              </ChakraSelect.Trigger>
              <Portal>
                <ChakraSelect.Positioner>
                  <ChakraSelect.Content>
                    {priorityCollection.items.map((option) => (
                      <ChakraSelect.Item item={option} key={option.value}>
                        {option.label}
                      </ChakraSelect.Item>
                    ))}
                  </ChakraSelect.Content>
                </ChakraSelect.Positioner>
              </Portal>
            </ChakraSelect.Root>
          </Field.Root>
        </HStack>

        <Button
          colorPalette="gray"
          onClick={onClearSelection}
        >
          Очистить выбор
        </Button>
      </HStack>
    </Box>
  );
};