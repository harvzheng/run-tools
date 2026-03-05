"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useLocalStorage } from "./use-local-storage";
import { useEffect, useRef, useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useToolState<T extends Record<string, any>>(
  slug: string,
  defaultInputs: T,
): [T, (updates: Partial<T>) => void] {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initializedFromUrl = useRef(false);

  const [state, setState] = useLocalStorage<T>(
    `run-tools:${slug}`,
    defaultInputs,
  );

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
        } else if (typeof defaultVal === "boolean") {
          urlState[key as keyof T] = (param === "true") as T[keyof T];
        } else {
          urlState[key as keyof T] = param as T[keyof T];
        }
      }
    }

    if (hasUrlParams) {
      setState({ ...defaultInputs, ...urlState } as T);
    }
  }, [searchParams, defaultInputs, setState]);

  const syncUrl = useCallback(
    (newState: T) => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(newState)) {
        if (value !== defaultInputs[key]) {
          params.set(key, String(value));
        }
      }
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      window.history.replaceState(null, "", url);
    },
    [pathname, defaultInputs],
  );

  const update = useCallback(
    (updates: Partial<T>) => {
      setState((prev) => {
        const next = { ...prev, ...updates };
        syncUrl(next);
        return next;
      });
    },
    [setState, syncUrl],
  );

  return [state, update];
}
