import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner = ({ text = 'Загрузка...' }: LoadingSpinnerProps) => {
  return (
    <Flex justify="center" align="center" minH="200px">
      <VStack gap={4}>
        <Spinner size="xl" borderWidth="4px" color="blue.500" />
        <Text color="gray.600">{text}</Text>
      </VStack>
    </Flex>
  );
};