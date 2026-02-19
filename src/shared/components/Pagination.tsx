import { HStack, Text, Icon, Pagination as ChakraPagination, Select as ChakraSelect, Field, Portal, createListCollection, IconButton, ButtonGroup } from '@chakra-ui/react';
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
  const safeCurrentPage = currentPage || 1;
  const safeTotalPages = totalPages || 1;
  const safeTotalItems = totalItems || 0;
  const safePageSize = pageSize || 10;

  console.log('Pagination render:', { safeCurrentPage, safeTotalPages, safeTotalItems, safePageSize });

  const startItem = safeTotalItems === 0 ? 0 : (safeCurrentPage - 1) * safePageSize + 1;
  const endItem = Math.min(safeCurrentPage * safePageSize, safeTotalItems);

  if (safeTotalItems === 0) {
    return null;
  }

  return (
    <HStack justify="space-between" width="100%" py={4}>
      <Text color="gray.600" fontSize="sm">
        Показано {startItem} - {endItem} из {safeTotalItems} инцидентов
      </Text>

      <HStack gap={4}>
        <ChakraPagination.Root
          count={safeTotalItems}
          pageSize={safePageSize}
          page={safeCurrentPage}
          onPageChange={(e) => onPageChange(e.page)}
        >
          <ButtonGroup variant="outline" size="sm">
            <ChakraPagination.PrevTrigger asChild>
              <IconButton
                colorPalette="gray"
                disabled={safeCurrentPage === 1}
              >
                <Icon size="sm">
                  <ChevronLeft />
                </Icon>
              </IconButton>
            </ChakraPagination.PrevTrigger>

            <ChakraPagination.Items
              render={(page) => (
                <IconButton
                  key={page.value}
                  variant={safeCurrentPage === page.value ? 'solid' : 'outline'}
                  colorPalette={safeCurrentPage === page.value ? 'blue' : 'gray'}
                  onClick={() => onPageChange(page.value)}
                >
                  {page.value}
                </IconButton>
              )}
            />

            <ChakraPagination.NextTrigger asChild>
              <IconButton
                colorPalette="gray"
                disabled={safeCurrentPage === safeTotalPages}
              >
                <Icon size="sm">
                  <ChevronRight />
                </Icon>
              </IconButton>
            </ChakraPagination.NextTrigger>
          </ButtonGroup>
        </ChakraPagination.Root>

        {showPageSize && (
          <Field.Root width="100px">
            <ChakraSelect.Root
              collection={pageSizeOptions}
              value={[String(safePageSize)]}
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