// src/hooks/useIdempotency.ts
import { useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useIdempotency() {
  const keyRef = useRef<string>(uuidv4());

  const generateNewKey = useCallback(() => {
    keyRef.current = uuidv4();
    return keyRef.current;
  }, []);

  const getCurrentKey = useCallback(() => {
    return keyRef.current;
  }, []);

  return {
    idempotencyKey: getCurrentKey(),
    generateNewKey,
    getCurrentKey,
  };
}