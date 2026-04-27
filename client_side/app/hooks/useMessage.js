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

export async function fetchMessages({
  status,
  category,
  priority,
  search,
  sort = 'newest',
  page = 1,
  limit = 50,
} = {}) {
  const params = new URLSearchParams();

  if (status && status !== 'all') params.append('status', status);
  if (category && category !== 'all') params.append('category', category);
  if (priority && priority !== 'all') params.append('priority', priority);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await fetch(`${API_BASE_URL}/admin/messages?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch messages');
}

export async function fetchMessageById(id) {
  const response = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch message');
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/admin/messages/stats`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch message stats');
}

export async function sendReply(id, message, sender_name = 'Admin') {
  const response = await fetch(`${API_BASE_URL}/admin/messages/${id}/reply`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ message, sender_name }),
  });

  return handleResponse(response, 'Failed to send reply');
}

export async function updateMessageStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/admin/messages/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ status }),
  });

  return handleResponse(response, 'Failed to update status');
}

export async function toggleRead(id, isRead) {
  const response = await fetch(`${API_BASE_URL}/admin/messages/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ isRead }),
  });

  return handleResponse(response, 'Failed to toggle read');
}

export async function toggleStar(id, isStarred) {
  const response = await fetch(`${API_BASE_URL}/admin/messages/${id}/star`, {
    method: 'PATCH',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ isStarred }),
  });

  return handleResponse(response, 'Failed to toggle star');
}

export async function deleteMessage(id) {
  const response = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to delete message');
}