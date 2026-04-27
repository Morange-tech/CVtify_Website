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

export async function fetchNotifications({
  type,
  search,
  status,
  sort = 'newest',
  page = 1,
  limit = 100,
} = {}) {
  const params = new URLSearchParams();

  if (type && type !== 'all') params.append('type', type);
  if (search) params.append('search', search);
  if (status && status !== 'all') params.append('status', status);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await fetch(`${API_BASE_URL}/admin/notifications?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch notifications');
}

export async function fetchNotificationStats() {
  const response = await fetch(`${API_BASE_URL}/admin/notifications/stats`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch notification stats');
}

export async function fetchNotificationById(id) {
  const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch notification');
}

export async function markNotificationRead(id, isRead = true) {
  const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ isRead }),
  });

  return handleResponse(response, 'Failed to update notification read status');
}

export async function toggleNotificationPin(id, isPinned) {
  const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}/pin`, {
    method: 'PATCH',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ isPinned }),
  });

  return handleResponse(response, 'Failed to update pin status');
}

export async function markAllNotificationsRead() {
  const response = await fetch(`${API_BASE_URL}/admin/notifications/read-all`, {
    method: 'PATCH',
    headers: getAuthHeaders(true),
  });

  return handleResponse(response, 'Failed to mark all notifications as read');
}

export async function clearReadNotifications() {
  const response = await fetch(`${API_BASE_URL}/admin/notifications/clear-read`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to clear read notifications');
}

export async function deleteNotification(id) {
  const response = await fetch(`${API_BASE_URL}/admin/notifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to delete notification');
}

export async function updateNotificationSettings(settings) {
  const response = await fetch(`${API_BASE_URL}/admin/notifications/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: JSON.stringify(settings),
  });

  return handleResponse(response, 'Failed to update notification settings');
}

export async function fetchNotificationSettings() {
  const response = await fetch(`${API_BASE_URL}/admin/notifications/settings`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch notification settings');
}