import { Skeleton, SkeletonText, Table, Box } from '@chakra-ui/react';

export const SkeletonTable = () => {
  return (
    <Box overflowX="auto" bg="white" borderRadius="lg" shadow="sm">
      <Table.Root variant="outline">
        <Table.Header bg="gray.50">
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Заголовок</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Приоритет</Table.ColumnHeader>
            <Table.ColumnHeader>Репортер</Table.ColumnHeader>
            <Table.ColumnHeader>Дата создания</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[...Array(5)].map((_, i) => (
            <Table.Row key={i}>
              <Table.Cell><Skeleton height="20px" width="60px" /></Table.Cell>
              <Table.Cell><SkeletonText lineClamp={2} gap="2" /></Table.Cell>
              <Table.Cell><Skeleton height="24px" width="80px" rounded="full" /></Table.Cell>
              <Table.Cell><Skeleton height="24px" width="80px" rounded="full" /></Table.Cell>
              <Table.Cell><SkeletonText lineClamp={2} gap="1" width="120px" /></Table.Cell>
              <Table.Cell><Skeleton height="20px" width="100px" /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};