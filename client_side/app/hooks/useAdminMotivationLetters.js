// app/hooks/useAdminMotivationLetters.js

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getAuthHeaders(contentType = false) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('No token found');
  }

  return {
    Accept: 'application/json',
    ...(contentType ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${token}`,
  };
}

function getAuthHeadersMultipart() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    throw new Error('No token found');
  }

  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response, defaultMessage) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || `${defaultMessage} (${response.status})`);
  }

  return response.json().catch(() => ({}));
}

function buildFormData(data) {
  const formData = new FormData();

  if (data.name !== undefined) formData.append('name', data.name);
  if (data.category !== undefined) formData.append('category', data.category);
  if (data.description !== undefined) formData.append('description', data.description || '');
  if (data.isPremium !== undefined) formData.append('is_premium', data.isPremium ? '1' : '0');
  if (data.isPublished !== undefined) formData.append('is_published', data.isPublished ? '1' : '0');
  if (data.previewFile) formData.append('preview_image', data.previewFile);

  return formData;
}

const DEFAULT_FILTERS = {
  tab: 'all',
  category: 'all',
  search: '',
  sort: 'newest',
};

const DEFAULT_STATS = {
  total: 0,
  premium: 0,
  free: 0,
  published: 0,
  unpublished: 0,
  totalUses: 0,
};

export default function useAdminMotivationLetters() {
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const abortControllerRef = useRef(null);

  const fetchTemplates = useCallback(async (currentFilters) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (currentFilters.tab && currentFilters.tab !== 'all') params.append('tab', currentFilters.tab);
      if (currentFilters.category && currentFilters.category !== 'all') params.append('category', currentFilters.category);
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.sort) params.append('sort', currentFilters.sort);

      const response = await fetch(`${API_BASE_URL}/admin/motivation-letter-templates?${params.toString()}`, {
        headers: getAuthHeaders(),
        signal: controller.signal,
      });

      const result = await handleResponse(response, 'Failed to fetch motivation letter templates');

      if (result.success) {
        setTemplates(result.templates || []);
        setStats(result.stats || DEFAULT_STATS);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to fetch motivation letter templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates(filters);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters, fetchTemplates]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const createTemplate = useCallback(async (data) => {
    const formData = buildFormData(data);

    const response = await fetch(`${API_BASE_URL}/admin/motivation-letter-templates`, {
      method: 'POST',
      headers: getAuthHeadersMultipart(),
      body: formData,
    });

    const result = await handleResponse(response, 'Failed to create template');

    if (result.success) {
      setTemplates((prev) => [result.template, ...prev]);
      if (result.stats) setStats(result.stats);
    }

    return result;
  }, []);

  const updateTemplate = useCallback(async (id, data) => {
    const formData = buildFormData(data);

    const response = await fetch(`${API_BASE_URL}/admin/motivation-letter-templates/${id}`, {
      method: 'POST',
      headers: getAuthHeadersMultipart(),
      body: formData,
    });

    const result = await handleResponse(response, 'Failed to update template');

    if (result.success) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? result.template : t))
      );
      if (result.stats) setStats(result.stats);
    }

    return result;
  }, []);

  const deleteTemplate = useCallback(async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/motivation-letter-templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await handleResponse(response, 'Failed to delete template');

    if (result.success) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (result.stats) setStats(result.stats);
    }

    return result;
  }, []);

  const togglePremium = useCallback(async (id) => {
    setActionLoading(id);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/motivation-letter-templates/${id}/toggle-premium`, {
        method: 'PATCH',
        headers: getAuthHeaders(true),
      });

      const result = await handleResponse(response, 'Failed to toggle premium status');

      if (result.success) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? result.template : t))
        );
        if (result.stats) setStats(result.stats);
      }

      return result;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const togglePublished = useCallback(async (id) => {
    setActionLoading(id);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/motivation-letter-templates/${id}/toggle-published`, {
        method: 'PATCH',
        headers: getAuthHeaders(true),
      });

      const result = await handleResponse(response, 'Failed to toggle publish status');

      if (result.success) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? result.template : t))
        );
        if (result.stats) setStats(result.stats);
      }

      return result;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchTemplates(filters);
  }, [filters, fetchTemplates]);

  return {
    templates,
    stats,
    loading,
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
}