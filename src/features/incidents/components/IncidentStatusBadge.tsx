import { Badge } from '@chakra-ui/react';
import { IncidentStatus } from '../../../types';
import { STATUS_LABELS } from '../../../utils/constants';

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
}

const statusColorScheme: Record<IncidentStatus, string> = {
  new: 'blue',
  in_progress: 'yellow',
  resolved: 'green',
  closed: 'gray',
};

export const IncidentStatusBadge = ({ status }: IncidentStatusBadgeProps) => {
  return (
    <Badge colorPalette={statusColorScheme[status]} px={2} py={1} rounded="full">
      {STATUS_LABELS[status]}
    </Badge>
  );
};