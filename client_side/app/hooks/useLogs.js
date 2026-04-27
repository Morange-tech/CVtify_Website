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

export async function fetchLogs({
  tab = 'all',
  type = 'all',
  severity = 'all',
  role = 'all',
  search = '',
  sort = 'newest',
  page = 1,
  limit = 100,
} = {}) {
  const params = new URLSearchParams();

  if (tab && tab !== 'all') params.append('tab', tab);
  if (type && type !== 'all') params.append('type', type);
  if (severity && severity !== 'all') params.append('severity', severity);
  if (role && role !== 'all') params.append('role', role);
  if (search) params.append('search', search);
  params.append('sort', sort);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await fetch(`${API_BASE_URL}/admin/logs?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch logs');
}

export async function fetchLogStats() {
  const response = await fetch(`${API_BASE_URL}/admin/logs/stats`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch log stats');
}

export async function fetchLogById(id) {
  const response = await fetch(`${API_BASE_URL}/admin/logs/${id}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch log');
}

export async function deleteLog(id) {
  const response = await fetch(`${API_BASE_URL}/admin/logs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to delete log');
}

export async function clearLogs(filters = {}) {
  const response = await fetch(`${API_BASE_URL}/admin/logs/clear`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify(filters),
  });

  return handleResponse(response, 'Failed to clear logs');
}