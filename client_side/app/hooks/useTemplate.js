// hooks/useTemplates.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { templateApi } from '../services/api';

/**
 * Custom hook to manage templates data from Laravel backend
 */
export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [tabFilters, setTabFilters] = useState([
    { label: 'All Templates', value: 'all' },
    { label: 'Free', value: 'free' },
    { label: 'Premium', value: 'premium' },
    { label: 'Popular', value: 'popular' },
  ]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch templates from API
   */
  const fetchTemplates = useCallback(async (filter = 'all') => {
    try {
      setLoading(true);
      setError(null);

      const response = await templateApi.getTemplates(filter);

      setTemplates(response.data || []);

      // Update filters from backend meta if provided
      if (response.meta?.filters) {
        setTabFilters(response.meta.filters);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load templates. Please try again.'
      );
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Change active filter and refetch
   */
  const changeFilter = useCallback(
    (filter) => {
      setActiveFilter(filter);
      fetchTemplates(filter);
    },
    [fetchTemplates]
  );

  /**
   * Toggle wishlist for a template
   */
  const toggleWishlist = useCallback(async (templateId) => {
    try {
      const response = await templateApi.toggleWishlist(templateId);

      // Optimistically update local state
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId
            ? { ...t, isWishlisted: response.is_wishlisted }
            : t
        )
      );

      return response;
    } catch (err) {
      // If it's an auth error, handle gracefully
      if (err.response?.status === 401) {
        return { error: 'auth_required' };
      }

      console.error('Failed to toggle wishlist:', err);
      throw err;
    }
  }, []);

  /**
   * Refresh templates
   */
  const refresh = useCallback(() => {
    fetchTemplates(activeFilter);
  }, [fetchTemplates, activeFilter]);

  // Initial fetch
  useEffect(() => {
    fetchTemplates('all');
  }, [fetchTemplates]);

  return {
    templates,
    tabFilters,
    activeFilter,
    loading,
    error,
    changeFilter,
    toggleWishlist,
    refresh,
  };
};

export default useTemplates;