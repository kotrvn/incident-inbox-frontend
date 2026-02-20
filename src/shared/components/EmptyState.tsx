import { VStack, Text, Icon, Button } from '@chakra-ui/react';
import { Info } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    message?: string;
    actionText?: string;
    onAction?: () => void;
}

export const EmptyState = ({
    title = 'Ничего не найдено',
    message = 'Попробуйте изменить параметры поиска или фильтры',
    actionText,
    onAction,
}: EmptyStateProps) => {
    return (
        <VStack gap={4} py={12} px={4} bg="gray.50" borderRadius="lg" textAlign="center">
            <Icon boxSize={12} color="gray.400">
                <Info />
            </Icon>
            <Text fontSize="xl" fontWeight="medium" color="gray.600">
                {title}
            </Text>
            <Text color="gray.500">{message}</Text>
            {actionText && onAction && (
                <Button onClick={onAction} colorScheme="blue" variant="outline" mt={4}>
                    {actionText}
                </Button>
            )}
        </VStack>
    );
};
