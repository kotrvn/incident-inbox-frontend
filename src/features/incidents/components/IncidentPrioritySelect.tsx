import { Select as ChakraSelect, Field, Portal, createListCollection, Icon } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { IncidentPriority } from '../../../types';
import { PRIORITY_LABELS } from '../../../shared/utils/constants';

interface IncidentPrioritySelectProps {
  value: IncidentPriority;
  onChange: (priority: IncidentPriority) => void;
  isDisabled?: boolean;
}

const priorityCollection = createListCollection({
  items: Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
});

export const IncidentPrioritySelect = ({ value, onChange, isDisabled }: IncidentPrioritySelectProps) => {
  return (
    <Field.Root>
      <Field.Label>Приоритет</Field.Label>
      <ChakraSelect.Root
        collection={priorityCollection}
        value={[value]}
        onValueChange={(e) => onChange(e.value[0] as IncidentPriority)}
        disabled={isDisabled}
      >
        <ChakraSelect.Trigger>
          <ChakraSelect.ValueText />
          <ChakraSelect.Indicator>
            <Icon size="sm">
              <ChevronDown />
            </Icon>
          </ChakraSelect.Indicator>
        </ChakraSelect.Trigger>
        <Portal>
          <ChakraSelect.Positioner>
            <ChakraSelect.Content>
              {priorityCollection.items.map((option) => (
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