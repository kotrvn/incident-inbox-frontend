import { Alert, AlertTitle, AlertDescription, Button, Icon, Container } from '@chakra-ui/react';
import { CircleAlert } from 'lucide-react';

interface ErrorMessageProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export const ErrorMessage = ({
    title = 'Ошибка',
    message = 'Что-то пошло не так',
    onRetry,
}: ErrorMessageProps) => {
    return (
        <Container maxW="container.xl" mt={4}>
            <Alert.Root
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                py={8}
                borderRadius="lg"
            >
                <Icon size="lg" mb={2}>
                    <CircleAlert />
                </Icon>
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    {title}
                </AlertTitle>
                <AlertDescription maxWidth="sm" mb={4}>
                    {message}
                </AlertDescription>
                {onRetry && (
                    <Button onClick={onRetry} colorPalette="red" size="sm">
                        Попробовать снова
                    </Button>
                )}
            </Alert.Root>
        </Container>
    );
};
