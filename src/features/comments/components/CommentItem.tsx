import { Box, Text, VStack, HStack, Avatar, Separator } from '@chakra-ui/react';
import { Comment } from '../../../types';
import { formatRelativeTime } from '../../../shared/utils/dateFormat';

interface CommentItemProps {
    comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
    return (
        <Box>
            <HStack gap={3} align="start">
                <Avatar.Root size="sm">
                    <Avatar.Fallback name={comment.author} />
                </Avatar.Root>
                <VStack align="start" gap={1} flex={1}>
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
            <Separator mt={4} />
        </Box>
    );
};
