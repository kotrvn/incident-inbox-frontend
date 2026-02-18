import { Box, Text, VStack, HStack, Avatar, Divider } from '@chakra-ui/react';
import { Comment } from '../../../types';
import { formatRelativeTime } from '../../shared/utils/dateFormat';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <Box>
      <HStack spacing={3} align="start">
        <Avatar size="sm" name={comment.author} />
        <VStack align="start" spacing={1} flex={1}>
          <HStack justify="space-between" width="100%">
            <Text fontWeight="medium">{comment.author}</Text>
            <Text fontSize="xs" color="gray.500">
              {formatRelativeTime(comment.createdAt)}
            </Text>
          </HStack>
          <Text color="gray.700" whiteSpace="pre-wrap">
            {comment.content}
          </Text>
        </VStack>
      </HStack>
      <Divider mt={4} />
    </Box>
  );
};