"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * JSON value persisted in localStorage. Renders `initial` on the server and
 * during hydration, then switches to the stored value. `initial` must be a
 * stable reference (module constant).
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const value = useMemo<T>(() => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  }, [raw, initial]);

  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      let previous = initial;
      const current = readRaw(key);
      if (current !== null) {
        try {
          previous = JSON.parse(current) as T;
        } catch {
          previous = initial;
        }
      }
      const resolved = typeof next === "function" ? (next as (p: T) => T)(previous) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Storage can be unavailable (private mode, quota); the UI keeps working without it.
      }
      listeners.forEach((listener) => listener());
    },
    [key, initial],
  );

  return [value, setValue] as const;
}
