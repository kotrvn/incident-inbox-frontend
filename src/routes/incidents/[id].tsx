import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Divider,
  Grid,
  GridItem,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useIncident, useUpdateIncident } from '../../features/incidents/hooks/useIncidents';
import { useComments, useAddComment } from '../../features/comments/hooks/useComments';
import { IncidentStatusSelect } from '../../features/incidents/components/IncidentStatusSelect';
import { IncidentPrioritySelect } from '../../features/incidents/components/IncidentPrioritySelect';
import { IncidentStatusBadge } from '../../features/incidents/components/IncidentStatusBadge';
import { IncidentPriorityBadge } from '../../features/incidents/components/IncidentPriorityBadge';
import { CommentList } from '../../features/comments/components/CommentList';
import { CommentForm } from '../../features/comments/components/CommentForm';
import { LoadingSpinner } from '../../features/shared/components/LoadingSpinner';
import { ErrorMessage } from '../../features/shared/components/ErrorMessage';
import { formatDate } from '../../features/shared/utils/dateFormat';

export const IncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: incident, isLoading, error } = useIncident(id!);
  const { data: comments, isLoading: commentsLoading } = useComments(id!);
  const updateIncident = useUpdateIncident();
  const addComment = useAddComment();

  if (isLoading) return <LoadingSpinner />;

  if (error || !incident) {
    return (
      <ErrorMessage
        title="Инцидент не найден"
        message="Возможно, он был удален или никогда не существовал"
      />
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateIncident.mutateAsync({
        id: incident.id,
        data: { status: newStatus as any },
      });
      toast({
        title: 'Статус обновлен',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      await updateIncident.mutateAsync({
        id: incident.id,
        data: { priority: newPriority as any },
      });
      toast({
        title: 'Приоритет обновлен',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить приоритет',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddComment = async (content: string, author: string) => {
    await addComment.mutateAsync({
      incidentId: incident.id,
      content,
      author,
    });
  };

  return (
    <Container maxW="container.xl" py={6}>
      <VStack spacing={6} align="stretch">
        <HStack>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => navigate('/incidents')}
          >
            Назад к списку
          </Button>
        </HStack>

        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Heading size="lg">{incident.title}</Heading>
              <HStack>
                <IncidentStatusBadge status={incident.status} />
                <IncidentPriorityBadge priority={incident.priority} />
              </HStack>
            </HStack>

            <Text color="gray.600" fontSize="sm">
              ID: {incident.id}
            </Text>

            <Text color="gray.700">{incident.description}</Text>

            <Divider />

            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <IncidentStatusSelect
                  value={incident.status}
                  onChange={handleStatusChange}
                  isDisabled={updateIncident.isPending}
                />
              </GridItem>
              <GridItem>
                <IncidentPrioritySelect
                  value={incident.priority}
                  onChange={handlePriorityChange}
                  isDisabled={updateIncident.isPending}
                />
              </GridItem>
            </Grid>

            <Box bg="gray.50" p={4} borderRadius="md">
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Информация о репортере:</Text>
                <Text>Имя: {incident.reporter.name}</Text>
                <Text>Email: {incident.reporter.email}</Text>
                <Text fontSize="sm" color="gray.500">
                  Создан: {formatDate(incident.createdAt)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Обновлен: {formatDate(incident.updatedAt)}
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <VStack align="stretch" spacing={6}>
            <Heading size="md">Комментарии</Heading>
            <CommentList comments={comments || []} isLoading={commentsLoading} />
            <Divider />
            <CommentForm
              incidentId={incident.id}
              onSubmit={handleAddComment}
              isSubmitting={addComment.isPending}
            />
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};