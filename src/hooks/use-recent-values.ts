"use client";

import { useLocalStorage } from "./use-local-storage";
import { useCallback } from "react";

/**
 * Tracks recently entered values for a given key.
 * Values are stored in localStorage at `run-tools:recent:<key>`.
 */
export function useRecentValues(key: string, maxItems = 5) {
  const [values, setValues] = useLocalStorage<number[]>(
    `run-tools:recent:${key}`,
    [],
  );

  const record = useCallback(
    (value: number) => {
      setValues((prev) => {
        const deduped = prev.filter((v) => v !== value);
        return [value, ...deduped].slice(0, maxItems);
      });
    },
    [setValues, maxItems],
  );

  return { values, record };
}
