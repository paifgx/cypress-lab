import { useState, useEffect } from 'react';
import type { ProgramOption } from '../types';
import { fetchPrograms } from '../services/programService';

/**
 * Hook to load and manage program options.
 */
export function usePrograms() {
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPrograms(controller.signal);
        if (!isMounted) return;
        setPrograms(data);
      } catch (err) {
        if (!isMounted) return;
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message = err instanceof Error && err.message
          ? err.message
          : 'Die Programmliste konnte nicht geladen werden.';
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { programs, isLoading, error };
}