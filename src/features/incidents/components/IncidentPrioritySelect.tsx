import { Select, FormControl, FormLabel } from '@chakra-ui/react';
import { IncidentPriority } from '../../../types';
import { PRIORITY_LABELS } from '../../shared/utils/constants';

interface IncidentPrioritySelectProps {
  value: IncidentPriority;
  onChange: (priority: IncidentPriority) => void;
  isDisabled?: boolean;
}

export const IncidentPrioritySelect = ({ value, onChange, isDisabled }: IncidentPrioritySelectProps) => {
  return (
    <FormControl>
      <FormLabel>Приоритет</FormLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as IncidentPriority)}
        isDisabled={isDisabled}
      >
        {Object.entries(PRIORITY_LABELS).map(([priority, label]) => (
          <option key={priority} value={priority}>
            {label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};