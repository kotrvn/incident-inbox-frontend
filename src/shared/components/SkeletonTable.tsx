import { Skeleton, SkeletonText, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

export const SkeletonTable = () => {
  return (
    <Table variant="simple" bg="white" borderRadius="lg" shadow="sm">
      <Thead bg="gray.50">
        <Tr>
          <Th>ID</Th>
          <Th>Заголовок</Th>
          <Th>Статус</Th>
          <Th>Приоритет</Th>
          <Th>Репортер</Th>
          <Th>Дата создания</Th>
        </Tr>
      </Thead>
      <Tbody>
        {[...Array(5)].map((_, i) => (
          <Tr key={i}>
            <Td><Skeleton height="20px" width="60px" /></Td>
            <Td><SkeletonText noOfLines={2} spacing="2" /></Td>
            <Td><Skeleton height="24px" width="80px" borderRadius="full" /></Td>
            <Td><Skeleton height="24px" width="80px" borderRadius="full" /></Td>
            <Td><SkeletonText noOfLines={2} spacing="1" width="120px" /></Td>
            <Td><Skeleton height="20px" width="100px" /></Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};