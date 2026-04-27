// app/hooks/useMyCvs.js

'use client';

import { useState, useEffect, useCallback } from 'react';

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

async function handleResponse(response, defaultMessage) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || `${defaultMessage} (${response.status})`);
  }

  return response.json().catch(() => ({}));
}

export default function useMyCvs({ search = '', sort = 'lastEdited' } = {}) {
  const [cvs, setCvs] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCvs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);

      const response = await fetch(`${API_BASE_URL}/cvs?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(response, 'Failed to fetch CVs');

      if (data.success) {
        setCvs(data.cvs || []);
        setMeta(data.meta || { total: 0 });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch CVs');
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  useEffect(() => {
    fetchCvs();
  }, [fetchCvs]);

  const renameCv = useCallback(async (id, title) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cvs/${id}/rename`, {
        method: 'PATCH',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ title }),
      });

      const data = await handleResponse(response, 'Failed to rename CV');

      if (data.success) {
        setCvs((prev) => prev.map((cv) => (cv.id === id ? data.cv : cv)));
      }

      return data;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const deleteCv = useCallback(async (id) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cvs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(response, 'Failed to delete CV');

      if (data.success) {
        setCvs((prev) => prev.filter((cv) => cv.id !== id));
        setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      }

      return data;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const duplicateCv = useCallback(async (id) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cvs/${id}/duplicate`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify({}),
      });

      const data = await handleResponse(response, 'Failed to duplicate CV');

      if (data.success) {
        setCvs((prev) => [data.cv, ...prev]);
        setMeta((prev) => ({ ...prev, total: prev.total + 1 }));
      }

      return data;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const shareCv = useCallback(async (id) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cvs/${id}/share`, {
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(response, 'Failed to generate share link');

      if (data.success && data.cv) {
        setCvs((prev) => prev.map((cv) => (cv.id === id ? data.cv : cv)));
      }

      return data;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const downloadCv = useCallback(async (id) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cvs/${id}/download`, {
        headers: getAuthHeaders(),
      });

      const data = await handleResponse(response, 'Failed to download CV');

      if (data.success && data.cv) {
        setCvs((prev) => prev.map((cv) => (cv.id === id ? data.cv : cv)));
      }

      return data;
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    cvs,
    meta,
    loading,
    actionLoading,
    error,
    refresh: fetchCvs,
    renameCv,
    deleteCv,
    duplicateCv,
    shareCv,
    downloadCv,
  };
}