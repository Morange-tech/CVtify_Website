'use client';

import { useCallback, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultStats = {
  totalDownloads: 0,
  cvDownloads: 0,
  letterDownloads: 0,
  totalSizeBytes: 0,
  totalSize: '0 B',
};

function getTypeFromTab(tab) {
  if (tab === 'cvs') return 'cv';
  if (tab === 'letters') return 'letter';
  return '';
}

function buildQuery({ searchQuery = '', activeTab = 'all', sortBy = 'newest' } = {}) {
  const params = new URLSearchParams();

  if (searchQuery?.trim()) {
    params.append('search', searchQuery.trim());
  }

  const type = getTypeFromTab(activeTab);
  if (type) {
    params.append('type', type);
  }

  if (sortBy) {
    params.append('sortBy', sortBy);
  }

  return params.toString();
}

async function apiRequest(path, options = {}) {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  const hasJsonBody = options.body && !(options.body instanceof FormData);

  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include', // Sanctum / cookie auth
    ...options,
    headers: {
      Accept: options.accept || 'application/json',
      ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return response;
}

function getFilenameFromDisposition(contentDisposition, fallback = 'download') {
  if (!contentDisposition) return fallback;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const normalMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return normalMatch?.[1] || fallback;
}

function triggerBrowserDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

export default function useDownloads({
  searchQuery = '',
  activeTab = 'all',
  sortBy = 'newest',
  autoFetch = true,
} = {}) {
  const [downloads, setDownloads] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [availableFormats, setAvailableFormats] = useState(['PDF']);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState('');

  const fetchDownloads = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      setError('');

      try {
        const query = buildQuery({
          searchQuery,
          activeTab,
          sortBy,
          ...overrides,
        });

        const response = await apiRequest(`/api/downloads${query ? `?${query}` : ''}`);
        const result = await response.json();

        setDownloads(Array.isArray(result.data) ? result.data : []);
        setStats(result.stats ? { ...defaultStats, ...result.stats } : defaultStats);
        setAvailableFormats(
          Array.isArray(result.availableFormats) && result.availableFormats.length
            ? result.availableFormats
            : ['PDF']
        );

        return { success: true, data: result };
      } catch (err) {
        setError(err.message || 'Failed to load downloads');
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, activeTab, sortBy]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchDownloads();
    }
  }, [autoFetch, fetchDownloads]);

  const removeDownload = useCallback(
    async (id) => {
      setMutating(true);
      setError('');

      try {
        await apiRequest(`/api/downloads/${id}`, {
          method: 'DELETE',
        });

        await fetchDownloads();
        return { success: true };
      } catch (err) {
        setError(err.message || 'Failed to remove download');
        return { success: false, error: err.message };
      } finally {
        setMutating(false);
      }
    },
    [fetchDownloads]
  );

  const clearAllDownloads = useCallback(async () => {
    setMutating(true);
    setError('');

    try {
      await apiRequest('/api/downloads', {
        method: 'DELETE',
      });

      setDownloads([]);
      setStats(defaultStats);

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to clear downloads');
      return { success: false, error: err.message };
    } finally {
      setMutating(false);
    }
  }, []);

  const redownload = useCallback(async (id, fallbackFileName = 'download') => {
    setMutating(true);
    setError('');

    try {
      const response = await apiRequest(`/api/downloads/${id}/file`, {
        method: 'GET',
        accept: 'application/octet-stream',
      });

      const blob = await response.blob();
      const fileName = getFilenameFromDisposition(
        response.headers.get('content-disposition'),
        fallbackFileName
      );

      triggerBrowserDownload(blob, fileName);

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to download file');
      return { success: false, error: err.message };
    } finally {
      setMutating(false);
    }
  }, []);

  const createDownloadHistory = useCallback(
    async (payload) => {
      setMutating(true);
      setError('');

      try {
        const response = await apiRequest('/api/downloads', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        await fetchDownloads();

        return { success: true, data: result };
      } catch (err) {
        setError(err.message || 'Failed to save download history');
        return { success: false, error: err.message };
      } finally {
        setMutating(false);
      }
    },
    [fetchDownloads]
  );

  return {
    downloads,
    setDownloads,
    stats,
    availableFormats,
    loading,
    mutating,
    error,
    fetchDownloads,
    removeDownload,
    clearAllDownloads,
    redownload,
    createDownloadHistory,
  };
}