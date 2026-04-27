import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/api';
import { useAuth } from './useAuth';

const useAdminDashboard = () => {
  const { isAuthenticated, loading: authLoading, token, user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('7d');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDashboard = useCallback(async (timeRange = '7d') => {
    if (!isAuthenticated || !token || user?.role !== 'admin') return;

    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getDashboard(timeRange);
      setData(response);
    } catch (err) {
      console.error('Failed to fetch admin dashboard:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, user]);

  const changePeriod = useCallback((newPeriod) => {
    setPeriod(newPeriod);
    fetchDashboard(newPeriod);
  }, [fetchDashboard]);

  const approveRequest = useCallback(async (requestId, note = '') => {
    try {
      setActionLoading(requestId);
      const response = await adminApi.approveRequest(requestId, note);

      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pendingRequests: prev.pendingRequests.filter((r) => r.id !== requestId),
          stats: prev.stats.map((s) =>
            s.icon === 'pending'
              ? { ...s, value: String(parseInt(s.value) - 1) }
              : s
          ),
        };
      });

      return response;
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const rejectRequest = useCallback(async (requestId, note = '') => {
    try {
      setActionLoading(requestId);
      const response = await adminApi.rejectRequest(requestId, note);

      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pendingRequests: prev.pendingRequests.filter((r) => r.id !== requestId),
          stats: prev.stats.map((s) =>
            s.icon === 'pending'
              ? { ...s, value: String(parseInt(s.value) - 1) }
              : s
          ),
        };
      });

      return response;
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchDashboard(period);
  }, [fetchDashboard, period]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !token || user?.role !== 'admin') {
      setLoading(false);
      return;
    }

    fetchDashboard(period);
  }, [authLoading, isAuthenticated, token, user, period, fetchDashboard]);

  return {
    data,
    loading: authLoading || loading,
    error,
    period,
    actionLoading,
    changePeriod,
    approveRequest,
    rejectRequest,
    refresh,
    stats: data?.stats ?? [],
    recentActivity: data?.recentActivity ?? [],
    pendingRequests: data?.pendingRequests ?? [],
    topTemplates: data?.topTemplates ?? [],
    revenueBreakdown: data?.revenueBreakdown ?? null,
    userBreakdown: data?.userBreakdown ?? [],
    conversionRate: data?.conversionRate ?? null,
  };
};

export default useAdminDashboard;