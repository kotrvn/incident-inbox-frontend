import { Alert, AlertIcon, AlertTitle, AlertDescription, Button, VStack } from '@chakra-ui/react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({
  title = 'Ошибка',
  message = 'Что-то пошло не так',
  onRetry
}: ErrorMessageProps) => {
  return (
    <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" py={8} borderRadius="lg">
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {title}
      </AlertTitle>
      <AlertDescription maxWidth="sm" mb={4}>
        {message}
      </AlertDescription>
      {onRetry && (
        <Button onClick={onRetry} colorScheme="red" size="sm">
          Попробовать снова
        </Button>
      )}
    </Alert>
  );
};