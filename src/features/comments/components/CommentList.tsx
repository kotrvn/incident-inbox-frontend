import { VStack, Text, Box } from '@chakra-ui/react';
import { Comment } from '../../../types';
import { CommentItem } from './CommentItem';
import { EmptyState } from '../../../shared/components/EmptyState';

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
}

export const CommentList = ({ comments, isLoading }: CommentListProps) => {
  if (isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">Загрузка комментариев...</Text>
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <EmptyState
        title="Нет комментариев"
        message="Будьте первым, кто оставит комментарий по этому инциденту"
      />
    );
  }

  return (
    <VStack gap={4} align="stretch">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </VStack>
  );
};