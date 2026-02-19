import {
  Box,
  Button,
  Textarea,
  VStack,
  Field,
  HStack,
  Text,
  Icon,
  Tooltip,
  Portal,
} from '@chakra-ui/react';
import { useCommentDraft } from '../hooks/useCommentDraft';
import { Check, Clock, Info } from 'lucide-react';
import { toaster } from '../../../shared/utils/toaster';

interface CommentFormProps {
  incidentId: string;
  onSubmit: (content: string, author: string) => Promise<void>;
  isSubmitting?: boolean;
}

const CURRENT_USER = 'Оператор Анна';

export const CommentForm = ({ incidentId, onSubmit, isSubmitting = false }: CommentFormProps) => {
  const {
    content,
    setContent,
    clearDraft,
    isSaving,
    lastSaved,
    hasDraft,
  } = useCommentDraft({ incidentId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toaster.error({
        title: 'Ошибка',
        description: 'Комментарий не может быть пустым',
      });
      return;
    }

    try {
      await onSubmit(content, CURRENT_USER);
      clearDraft();
      toaster.success({
        title: 'Успешно',
        description: 'Комментарий добавлен',
      });
    } catch (error) {
      toaster.error({
        title: 'Ошибка',
        description: 'Не удалось добавить комментарий',
      });
    }
  };

  const handleClearDraft = () => {
    setContent('');
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack gap={3}>
        <Field.Root required>
          <Field.Label>
            <HStack gap={2}>
              <Text>Новый комментарий</Text>
              {hasDraft && (
                <Tooltip.Root>
                  <Tooltip.Trigger>
                    <Icon color="blue.500">
                      <Info />
                    </Icon>
                  </Tooltip.Trigger>
                  <Portal>
                    <Tooltip.Positioner>
                      <Tooltip.Content>
                        <Text>У вас есть несохраненный черновик</Text>
                      </Tooltip.Content>
                    </Tooltip.Positioner>
                  </Portal>
                </Tooltip.Root>
              )}
            </HStack>
          </Field.Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Опишите действия по инциденту..."
            rows={4}
            resize="vertical"
          />
        </Field.Root>

        <HStack width="100%" justify="space-between">
          <HStack gap={4}>
            {isSaving && (
              <HStack gap={1} color="gray.500" fontSize="sm">
                <Icon size="sm"><Clock /></Icon>
                <Text>Сохранение...</Text>
              </HStack>
            )}
            {lastSaved && !isSaving && (
              <HStack gap={1} color="green.500" fontSize="sm">
                <Icon size="sm"><Check /></Icon>
                <Text>Сохранено в {formatLastSaved(lastSaved)}</Text>
              </HStack>
            )}
          </HStack>

          <HStack gap={2}>
            {hasDraft && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearDraft}
                disabled={isSubmitting}
              >
                Очистить
              </Button>
            )}
            <Button
              type="submit"
              colorPalette="blue"
              loading={isSubmitting}
              loadingText="Добавление..."
              disabled={!content.trim()}
            >
              Добавить комментарий
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
};