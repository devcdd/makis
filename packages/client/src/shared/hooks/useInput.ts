import { useState, useCallback } from 'react';
import { VALIDATION_MESSAGES } from '@/constants/messages/validation';

interface UseInputOptions<T = string> {
  initialValue?: T;
  validator?: (value: T) => boolean | string;
}

interface UseInputReturn<T> {
  value: T;
  onChange: (value: T) => void;
  reset: () => void;
  isValid: boolean;
  error?: string;
}

export function useInput<T = string>(
  options: UseInputOptions<T> = {},
): UseInputReturn<T> {
  const { initialValue = '' as T, validator } = options;

  const [value, setValue] = useState<T>(initialValue);

  const validate = useCallback(
    (val: T) => {
      if (!validator) return { isValid: true };

      const result = validator(val);
      if (typeof result === 'boolean') {
        return {
          isValid: result,
          error: result ? undefined : VALIDATION_MESSAGES.INVALID_VALUE,
        };
      }
      return { isValid: false, error: result };
    },
    [validator],
  );

  const validation = validate(value);

  const onChange = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    onChange,
    reset,
    isValid: validation.isValid,
    error: validation.error,
  };
}
