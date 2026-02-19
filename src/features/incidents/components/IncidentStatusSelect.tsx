import { Select as ChakraSelect, Field, Portal, createListCollection } from '@chakra-ui/react';
import { IncidentStatus } from '../../../types';
import { STATUS_LABELS } from '../../../utils/constants';

interface IncidentStatusSelectProps {
  value: IncidentStatus;
  onChange: (status: IncidentStatus) => void;
  isDisabled?: boolean;
}

const statusCollection = createListCollection({
  items: Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
});

export const IncidentStatusSelect = ({ value, onChange, isDisabled }: IncidentStatusSelectProps) => {
  return (
    <Field.Root>
      <Field.Label>Статус</Field.Label>
      <ChakraSelect.Root
        collection={statusCollection}
        value={[value]}
        onValueChange={(e) => onChange(e.value[0] as IncidentStatus)}
        disabled={isDisabled}
      >
        <ChakraSelect.Trigger>
          <ChakraSelect.ValueText />
        </ChakraSelect.Trigger>
        <Portal>
          <ChakraSelect.Positioner>
            <ChakraSelect.Content>
              {statusCollection.items.map((option) => (
                <ChakraSelect.Item item={option} key={option.value}>
                  {option.label}
                </ChakraSelect.Item>
              ))}
            </ChakraSelect.Content>
          </ChakraSelect.Positioner>
        </Portal>
      </ChakraSelect.Root>
    </Field.Root>
  );
};