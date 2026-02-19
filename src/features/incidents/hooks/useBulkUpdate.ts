import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toaster } from '../../../shared/utils/toaster';
import { IncidentStatus, IncidentPriority } from '../../../types';

interface BulkUpdateParams {
  incidentIds: string[];
  data: {
    status?: IncidentStatus;
    priority?: IncidentPriority;
  };
}

export const useBulkUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ incidentIds, data }: BulkUpdateParams) => {
      const response = await fetch(`/api/incidents/bulk-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incidentIds, data }),
      });

      if (!response.ok) {
        throw new Error('Failed to bulk update incidents');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      
      variables.incidentIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: ['incident', id] });
      });

      toaster.success({
        title: 'Успешно',
        description: `Обновлено ${variables.incidentIds.length} инцидентов`,
      });
    },
    onError: (error) => {
      toaster.error({
        title: 'Ошибка',
        description: 'Не удалось обновить инциденты',
        duration: 5000,
      });
      console.error('Bulk update error:', error);
    },
  });
};