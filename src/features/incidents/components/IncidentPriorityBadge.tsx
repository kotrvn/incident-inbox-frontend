import { Badge } from '@chakra-ui/react';
import { IncidentPriority } from '../../../types';
import { PRIORITY_LABELS } from '../../../utils/constants';

interface IncidentPriorityBadgeProps {
  priority: IncidentPriority;
}

const priorityColorScheme: Record<IncidentPriority, string> = {
  low: 'teal',
  medium: 'orange',
  high: 'red',
  critical: 'red',
};

export const IncidentPriorityBadge = ({ priority }: IncidentPriorityBadgeProps) => {
  return (
    <Badge
      colorPalette={priorityColorScheme[priority]}
      px={2}
      py={1}
      rounded="full"
      variant={priority === 'critical' ? 'solid' : 'subtle'}
    >
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
};