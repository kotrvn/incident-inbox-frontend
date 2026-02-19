import { HStack, Text, Icon, Button, Select as ChakraSelect, Field, Portal, createListCollection } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showPageSize?: boolean;
}

// Создаем коллекцию для опций размера страницы
const pageSizeOptions = createListCollection({
  items: [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
  ],
});

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
}: PaginationProps) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <HStack justify="space-between" width="100%" py={4}>
      <Text color="gray.600" fontSize="sm">
        Показано {startItem} - {endItem} из {totalItems} инцидентов
      </Text>

      <HStack gap={4}>
        <HStack gap={2}>
          <Button
            size="sm"
            variant="outline"
            colorPalette="gray"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Icon size="sm">
              <ChevronLeft />
            </Icon>
          </Button>

          <HStack gap={1}>
            {pageNumbers.map((pageNum) => (
              <Button
                key={pageNum}
                size="sm"
                variant={currentPage === pageNum ? 'solid' : 'outline'}
                colorPalette={currentPage === pageNum ? 'blue' : 'gray'}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
          </HStack>

          <Button
            size="sm"
            variant="outline"
            colorPalette="gray"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Icon size="sm">
              <ChevronRight />
            </Icon>
          </Button>
        </HStack>

        {showPageSize && (
          <Field.Root width="100px">
            <ChakraSelect.Root
              collection={pageSizeOptions}
              value={[String(pageSize)]}
              onValueChange={(e) => onPageSizeChange(Number(e.value[0]))}
            >
              <ChakraSelect.Trigger>
                <ChakraSelect.ValueText placeholder="10" />
                <ChakraSelect.Indicator>
                  <Icon size="sm">
                    <ChevronDown />
                  </Icon>
                </ChakraSelect.Indicator>
              </ChakraSelect.Trigger>
              <Portal>
                <ChakraSelect.Positioner>
                  <ChakraSelect.Content>
                    {pageSizeOptions.items.map((option) => (
                      <ChakraSelect.Item item={option} key={option.value}>
                        {option.label}
                      </ChakraSelect.Item>
                    ))}
                  </ChakraSelect.Content>
                </ChakraSelect.Positioner>
              </Portal>
            </ChakraSelect.Root>
          </Field.Root>
        )}
      </HStack>
    </HStack>
  );
};