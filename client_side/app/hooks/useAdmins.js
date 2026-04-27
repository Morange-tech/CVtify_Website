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

export async function fetchAdmins({
  tab = 'all',
  role = 'all',
  search = '',
  sort = 'newest',
} = {}) {
  const params = new URLSearchParams();

  if (tab && tab !== 'all') params.append('tab', tab);
  if (role && role !== 'all') params.append('role', role);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);

  const response = await fetch(`${API_BASE_URL}/admin/admins?${params.toString()}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch admins');
}

export async function fetchAdminStats() {
  const response = await fetch(`${API_BASE_URL}/admin/admins/stats`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch admin stats');
}

export async function fetchAdminById(id) {
  const response = await fetch(`${API_BASE_URL}/admin/admins/${id}`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to fetch admin');
}

export async function createAdmin(payload) {
  const response = await fetch(`${API_BASE_URL}/admin/admins`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });

  return handleResponse(response, 'Failed to create admin');
}

export async function updateAdmin(id, payload) {
  const response = await fetch(`${API_BASE_URL}/admin/admins/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });

  return handleResponse(response, 'Failed to update admin');
}

export async function updateAdminRole(id, role) {
  const response = await fetch(`${API_BASE_URL}/admin/admins/${id}/role`, {
    method: 'PATCH',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ role }),
  });

  return handleResponse(response, 'Failed to update admin role');
}

export async function updateAdminStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/admin/admins/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ status }),
  });

  return handleResponse(response, 'Failed to update admin status');
}

export async function deleteAdmin(id) {
  const response = await fetch(`${API_BASE_URL}/admin/admins/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(response, 'Failed to delete admin');
}