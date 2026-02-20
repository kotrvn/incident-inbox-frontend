import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Comment, CreateCommentRequest } from '../../../types';

const API_BASE = '/api';

export const useComments = (incidentId: string) => {
    return useQuery<Comment[]>({
        queryKey: ['comments', incidentId],
        queryFn: () =>
            fetch(`${API_BASE}/incidents/${incidentId}/comments`).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch comments');
                }
                return res.json();
            }),
        enabled: !!incidentId,
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCommentRequest) =>
            fetch(`${API_BASE}/incidents/${data.incidentId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to add comment');
                }
                return res.json();
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.incidentId] });
            queryClient.invalidateQueries({ queryKey: ['incident', variables.incidentId] });
        },
    });
};
