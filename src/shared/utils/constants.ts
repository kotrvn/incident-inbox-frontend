import { IncidentPriority, IncidentStatus } from '../../types';

export const STATUS_LABELS: Record<IncidentStatus, string> = {
    new: 'Новый',
    in_progress: 'В работе',
    resolved: 'Решен',
    closed: 'Закрыт',
};

export const PRIORITY_LABELS: Record<IncidentPriority, string> = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критичный',
};

export const PRIORITY_COLORS: Record<IncidentPriority, string> = {
    low: '#69b0ac',
    medium: '#feaa6d',
    high: '#fe6d6d',
    critical: '#b74141',
};

export const STATUS_COLORS: Record<IncidentStatus, string> = {
    new: '#3b82f6',
    in_progress: '#eab308',
    resolved: '#22c55e',
    closed: '#6b7280',
};
