/**
 * Hook personalizado para manejar llamadas a la API.
 * Proporciona estado de loading, error y data, además de ejecutar llamadas.
 */
import { useState, useCallback } from "react";

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiCall();
        setData(result);
        return result;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Error en la petición";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}