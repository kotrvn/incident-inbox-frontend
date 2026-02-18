import { useState } from 'react';
import {
  Box,
  Button,
  Textarea,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';

interface CommentFormProps {
  incidentId: string;
  onSubmit: (content: string, author: string) => Promise<void>;
  isSubmitting?: boolean;
}

// В реальном приложении автор будет браться из контекста авторизации
const CURRENT_USER = 'Оператор Анна';

export const CommentForm = ({ incidentId, onSubmit, isSubmitting = false }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Комментарий не может быть пустым',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await onSubmit(content, CURRENT_USER);
      setContent('');
      toast({
        title: 'Успешно',
        description: 'Комментарий добавлен',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить комментарий',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={3}>
        <FormControl isRequired>
          <FormLabel>Новый комментарий</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Опишите действия по инциденту..."
            rows={3}
            resize="vertical"
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText="Добавление..."
          alignSelf="flex-end"
        >
          Добавить комментарий
        </Button>
      </VStack>
    </Box>
  );
};