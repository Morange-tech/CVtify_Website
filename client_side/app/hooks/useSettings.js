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

export async function fetchSettings() {
  const response = await fetch(`${API_BASE_URL}/admin/settings`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch settings');
}

export async function updateSettings(settings) {
  const response = await fetch(`${API_BASE_URL}/admin/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: JSON.stringify(settings),
  });

  return handleResponse(response, 'Failed to update settings');
}

export async function resetSettings() {
  const response = await fetch(`${API_BASE_URL}/admin/settings/reset`, {
    method: 'POST',
    headers: getAuthHeaders(true),
  });

  return handleResponse(response, 'Failed to reset settings');
}