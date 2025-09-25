import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';

interface UseAdminDataOptions {
  endpoint: string;
  dataKey?: string;
  refreshInterval?: number;
}

export function useAdminData<T>({ 
  endpoint, 
  dataKey = 'data',
  refreshInterval = 0 
}: UseAdminDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const result = await response.json();
      const fetchedData = dataKey ? result[dataKey] : result;
      
      setData(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
      
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [endpoint, dataKey]);

  const refreshData = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  const updateItem = useCallback((id: string, updatedItem: Partial<T>) => {
    setData(prevData => 
      prevData.map(item => 
        (item as any).id === id ? { ...item, ...updatedItem } : item
      )
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prevData => prevData.filter(item => (item as any).id !== id));
  }, []);

  const addItem = useCallback((newItem: T) => {
    setData(prevData => [...prevData, newItem]);
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set up refresh interval if specified
    let interval: NodeJS.Timeout | null = null;
    if (refreshInterval > 0) {
      interval = setInterval(fetchData, refreshInterval);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    refreshData,
    updateItem,
    removeItem,
    addItem,
    setData
  };
}

// Specific hooks for different admin pages
export function useUsers() {
  return useAdminData({
    endpoint: '/api/admin/users',
    dataKey: 'users'
  });
}

export function useOrganizations() {
  return useAdminData({
    endpoint: '/api/admin/organizations',
    dataKey: 'organizations'
  });
}

export function useParticipants() {
  return useAdminData({
    endpoint: '/api/admin/participants',
    dataKey: 'participants'
  });
}

export function useCohorts() {
  return useAdminData({
    endpoint: '/api/admin/cohorts',
    dataKey: 'cohorts'
  });
}

export function useAssessments() {
  return useAdminData({
    endpoint: '/api/admin/assessments',
    dataKey: 'assessments'
  });
}

export function useAttempts() {
  return useAdminData({
    endpoint: '/api/admin/attempts',
    dataKey: 'attempts'
  });
}
