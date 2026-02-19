import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Incident, UpdateIncidentRequest, IncidentsResponse } from '../../../types';

const API_BASE = '/api';
interface UseIncidentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useIncidents = (params: UseIncidentsParams = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = '',
    priority = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  const searchParams = new URLSearchParams();
  searchParams.append('page', String(page));
  searchParams.append('limit', String(limit));
  if (search) searchParams.append('search', search);
  if (status) searchParams.append('status', status);
  if (priority) searchParams.append('priority', priority);
  searchParams.append('sortBy', sortBy);
  searchParams.append('sortOrder', sortOrder);

  return useQuery<IncidentsResponse>({
    queryKey: ['incidents', { page, limit, search, status, priority, sortBy, sortOrder }],
    queryFn: () =>
      fetch(`${API_BASE}/incidents?${searchParams.toString()}`).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch incidents');
        }
        return res.json();
      }),
  });
};

export const useIncident = (id: string) => {
  return useQuery<Incident & { comments: Comment[] }>({
    queryKey: ['incident', id],
    queryFn: () => fetch(`${API_BASE}/incidents/${id}`).then((res) => {
      if (!res.ok) {
        throw new Error('Инцидент не найден');
      }
      return res.json();
    }),
    enabled: !!id,
    retry: false,
  });
};

export const useUpdateIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncidentRequest }) =>
      fetch(`${API_BASE}/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to update incident');
        return res.json();
      }),
    

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['incident', id] });
      
      const previousIncident = queryClient.getQueryData(['incident', id]);
      
      queryClient.setQueryData(['incident', id], (old: any) => ({
        ...old,
        ...data,
        updatedAt: new Date().toISOString(),
      }));

      return { previousIncident };
    },
    
    onError: (err, { id }, context) => {
      queryClient.setQueryData(['incident', id], context?.previousIncident);
    },
    
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['incident', id] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};