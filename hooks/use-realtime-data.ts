
"use client";

import { useState, useEffect } from 'react';

/**
 * A custom hook that fetches data from an endpoint at a specified interval to simulate real-time updates.
 * - It manages the loading, error, and data states for the fetch operation.
 * - The hook returns an object containing the current data, any errors, and the loading status.
 *
 * @template T - The expected type of the data to be fetched.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {number} [interval=5000] - The interval in milliseconds at which to fetch the data.
 * @returns {{ data: T | null; error: any | null; loading: boolean }} An object containing the fetched data, error, and loading state.
 */
export function useRealtimeData<T>(endpoint: string, interval: number = 5000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // initial fetch

    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [endpoint, interval]);

  return { data, error, loading };
}
