import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Separator,
  SimpleGrid,
} from '@chakra-ui/react';
import { useIncident, useUpdateIncident } from '../../features/incidents/hooks/useIncidents';
import { useComments, useAddComment } from '../../features/comments/hooks/useComments';
import { IncidentStatusSelect } from '../../features/incidents/components/IncidentStatusSelect';
import { IncidentPrioritySelect } from '../../features/incidents/components/IncidentPrioritySelect';
import { IncidentStatusBadge } from '../../features/incidents/components/IncidentStatusBadge';
import { IncidentPriorityBadge } from '../../features/incidents/components/IncidentPriorityBadge';
import { CommentList } from '../../features/comments/components/CommentList';
import { CommentForm } from '../../features/comments/components/CommentForm';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { ErrorMessage } from '../../shared/components/ErrorMessage';
import { toaster } from '../../utils/toaster';
import { formatDate } from '../../utils/dateFormat';
import { ArrowLeft } from 'lucide-react';

export const IncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
      toaster.success({
        title: 'Статус обновлен',
        description: `Статус изменен на ${newStatus}`,
      });
    } catch (error) {
      toaster.error({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
      });
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      await updateIncident.mutateAsync({
        id: incident.id,
        data: { priority: newPriority as any },
      });
      toaster.success({
        title: 'Приоритет обновлен',
        description: `Приоритет изменен на ${newPriority}`,
      });
    } catch (error) {
      toaster.error({
        title: 'Ошибка',
        description: 'Не удалось обновить приоритет',
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
      <VStack gap={6} align="stretch">
        <HStack>
          <Button
            variant="ghost"
            onClick={() => navigate('/incidents')}
          >
            <HStack gap={2}>
              <ArrowLeft />
              <Text>Назад к списку</Text>
            </HStack>
          </Button>
        </HStack>

        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <VStack align="stretch" gap={4}>
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

            <Separator />

            <SimpleGrid columns={2} gap={6}>
              <IncidentStatusSelect
                value={incident.status}
                onChange={handleStatusChange}
                isDisabled={updateIncident.isPending}
              />
              <IncidentPrioritySelect
                value={incident.priority}
                onChange={handlePriorityChange}
                isDisabled={updateIncident.isPending}
              />
            </SimpleGrid>

            <Box bg="gray.50" p={4} borderRadius="md">
              <VStack align="start" gap={2}>
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
          <VStack align="stretch" gap={6}>
            <Heading size="md">Комментарии</Heading>
            <CommentList comments={comments || []} isLoading={commentsLoading} />
            <Separator />
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