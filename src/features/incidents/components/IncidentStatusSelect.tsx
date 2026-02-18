import { Select, FormControl, FormLabel } from '@chakra-ui/react';
import { IncidentStatus } from '../../../types';
import { STATUS_LABELS } from '../../shared/utils/constants';

interface IncidentStatusSelectProps {
  value: IncidentStatus;
  onChange: (status: IncidentStatus) => void;
  isDisabled?: boolean;
}

export const IncidentStatusSelect = ({ value, onChange, isDisabled }: IncidentStatusSelectProps) => {
  return (
    <FormControl>
      <FormLabel>Статус</FormLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as IncidentStatus)}
        isDisabled={isDisabled}
      >
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <option key={status} value={status}>
            {label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};