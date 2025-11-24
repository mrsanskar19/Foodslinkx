import { useState, useEffect, useCallback } from "react";

/**
 * A custom hook that fetches data from an endpoint at a specified interval to simulate real-time updates.
 * - It manages the loading, error, and data states for the fetch operation.
 * - The hook returns an object containing the current data, any errors, and the loading status.
 *
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {number} interval - The interval in milliseconds at which to fetch the data.
 * @returns {{ data: any | null; error: Error | null; loading: boolean }} An object containing the fetched data, error, and loading state.
 */
export const useRealTimeFetch = (endpoint: string, interval: number) => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | undefined;

    const fetchDataWrapped = async () => {
      if (isMounted) {
        await fetchData();
      }
    };

    fetchDataWrapped(); // Initial fetch
    intervalId = setInterval(fetchDataWrapped, interval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchData, interval]);

  return { data, error, loading };
};
