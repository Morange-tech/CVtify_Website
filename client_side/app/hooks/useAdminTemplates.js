import { useState, useEffect, useCallback } from 'react';
import { adminTemplateApi } from '../services/api';
import { useAuth } from './useAuth';

const useAdminTemplates = () => {
  const { isAuthenticated, loading: authLoading, token, user } = useAuth();

  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    premium: 0,
    free: 0,
    published: 0,
    unpublished: 0,
    totalUses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    tab: 'all',
    category: 'all',
    sort: 'popular',
  });

  const canFetch = isAuthenticated && !!token && user?.role === 'admin';

  const fetchTemplates = useCallback(async (params) => {
    if (!canFetch) return;

    try {
      setLoading(true);
      setError(null);
      const response = await adminTemplateApi.getTemplates(params);
      setTemplates(response.templates || []);
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError(err.message || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [canFetch]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const createTemplate = useCallback(async (data) => {
    try {
      setActionLoading('create');

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('category', data.category);
      formData.append('description', data.description || '');
      formData.append('is_premium', data.isPremium ? '1' : '0');
      formData.append('is_published', data.isPublished ? '1' : '0');

      if (data.previewFile) {
        formData.append('preview_image', data.previewFile);
      }

      const response = await adminTemplateApi.createTemplate(formData);

      setTemplates((prev) => [response.template, ...prev]);
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        [data.isPremium ? 'premium' : 'free']:
          prev[data.isPremium ? 'premium' : 'free'] + 1,
        [data.isPublished ? 'published' : 'unpublished']:
          prev[data.isPublished ? 'published' : 'unpublished'] + 1,
      }));

      return response;
    } catch (err) {
      console.error('Failed to create template:', err);
      throw err;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const updateTemplate = useCallback(async (id, data) => {
    try {
      setActionLoading(id);

      const formData = new FormData();
      if (data.name !== undefined) formData.append('name', data.name);
      if (data.category !== undefined) formData.append('category', data.category);
      if (data.description !== undefined) formData.append('description', data.description || '');
      if (data.isPremium !== undefined) formData.append('is_premium', data.isPremium ? '1' : '0');
      if (data.isPublished !== undefined) formData.append('is_published', data.isPublished ? '1' : '0');
      if (data.previewFile) formData.append('preview_image', data.previewFile);

      const response = await adminTemplateApi.updateTemplate(id, formData);

      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? response.template : t))
      );

      return response;
    } catch (err) {
      console.error('Failed to update template:', err);
      throw err;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const deleteTemplate = useCallback(async (id) => {
    try {
      setActionLoading(id);

      const deleted = templates.find((t) => t.id === id);
      const response = await adminTemplateApi.deleteTemplate(id);

      setTemplates((prev) => prev.filter((t) => t.id !== id));

      if (deleted) {
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          [deleted.isPremium ? 'premium' : 'free']:
            prev[deleted.isPremium ? 'premium' : 'free'] - 1,
          [deleted.isPublished ? 'published' : 'unpublished']:
            prev[deleted.isPublished ? 'published' : 'unpublished'] - 1,
          totalUses: prev.totalUses - (deleted.uses || 0),
        }));
      }

      return response;
    } catch (err) {
      console.error('Failed to delete template:', err);
      throw err;
    } finally {
      setActionLoading(null);
    }
  }, [templates]);

  const togglePremium = useCallback(async (id) => {
    try {
      setActionLoading(id);
      const response = await adminTemplateApi.togglePremium(id);

      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? response.template : t))
      );

      return response;
    } catch (err) {
      console.error('Failed to toggle premium:', err);
      throw err;
    } finally {
      setActionLoading(null);
      fetchTemplates(filters);
    }
  }, [fetchTemplates, filters]);

  const togglePublished = useCallback(async (id) => {
    try {
      setActionLoading(id);
      const response = await adminTemplateApi.togglePublished(id);

      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? response.template : t))
      );

      return response;
    } catch (err) {
      console.error('Failed to toggle published:', err);
      throw err;
    } finally {
      setActionLoading(null);
      fetchTemplates(filters);
    }
  }, [fetchTemplates, filters]);

  const refresh = useCallback(() => {
    fetchTemplates(filters);
  }, [fetchTemplates, filters]);

  useEffect(() => {
    if (authLoading) return;

    if (!canFetch) {
      setLoading(false);
      return;
    }

    fetchTemplates(filters);
  }, [authLoading, canFetch, fetchTemplates, filters]);

  return {
    templates,
    stats,
    loading: authLoading || loading,
    error,
    actionLoading,
    filters,
    updateFilters,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    togglePremium,
    togglePublished,
    refresh,
  };
};

export default useAdminTemplates;