import { useState, useEffect, useRef } from 'react';
import { Input, Field } from '@chakra-ui/react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchInputProps {
    initialValue?: string;
    onSearch: (value: string) => void;
    placeholder?: string;
    delay?: number;
    width?: string;
}

export const SearchInput = ({
    initialValue = '',
    onSearch,
    placeholder = 'Поиск...',
    delay = 500,
    width = '300px',
}: SearchInputProps) => {
    const [localValue, setLocalValue] = useState(initialValue);
    const debouncedValue = useDebounce(localValue, delay);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <Field.Root>
            <Field.Label>Поиск</Field.Label>
            <Input
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                width={width}
            />
        </Field.Root>
    );
};
