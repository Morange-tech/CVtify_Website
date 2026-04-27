import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../services/api';
import { useAuth } from './useAuth';

const useDashboard = () => {
  const { isAuthenticated, loading: authLoading, token } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await dashboardApi.getDashboard();
      setData(response);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const refreshStats = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await dashboardApi.getStats();
      setData((prev) => (prev ? { ...prev, ...response } : prev));
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  }, [isAuthenticated, token]);

  const refreshDocuments = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await dashboardApi.getDocuments();
      setData((prev) =>
        prev ? { ...prev, recentDocuments: response.documents } : prev
      );
    } catch (err) {
      console.error('Failed to refresh documents:', err);
    }
  }, [isAuthenticated, token]);

  const refresh = useCallback(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    fetchDashboard();
  }, [authLoading, isAuthenticated, token, fetchDashboard]);

  return {
    data,
    loading: authLoading || loading,
    error,
    refresh,
    refreshStats,
    refreshDocuments,

    user: data?.user ?? null,
    stats: data?.stats ?? [],
    recentDocuments: data?.recentDocuments ?? [],
    storage: data?.storage ?? null,
    isPremium: data?.isPremium ?? false,
    profileStrength: data?.profileStrength ?? null,
    advancedStats: data?.advancedStats ?? [],
    tips: data?.tips ?? [],
  };
};

export default useDashboard;