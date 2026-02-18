"use client";

import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "./use-local-storage";
import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useToolState<T extends Record<string, any>>(
  slug: string,
  defaultInputs: T,
): [T, (updates: Partial<T>) => void] {
  const searchParams = useSearchParams();
  const initializedFromUrl = useRef(false);

  const [state, setState] = useLocalStorage<T>(
    `run-tools:${slug}`,
    defaultInputs,
  );

  // On first mount, override with URL params if present
  useEffect(() => {
    if (initializedFromUrl.current) return;
    initializedFromUrl.current = true;

    const urlState: Partial<T> = {};
    let hasUrlParams = false;

    for (const key of Object.keys(defaultInputs)) {
      const param = searchParams.get(key);
      if (param !== null) {
        hasUrlParams = true;
        const defaultVal = defaultInputs[key];
        if (typeof defaultVal === "number") {
          urlState[key as keyof T] = Number(param) as T[keyof T];
        } else {
          urlState[key as keyof T] = param as T[keyof T];
        }
      }
    }

    if (hasUrlParams) {
      setState({ ...defaultInputs, ...urlState } as T);
    }
  }, [searchParams, defaultInputs, setState]);

  const update = (updates: Partial<T>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return [state, update];
}
