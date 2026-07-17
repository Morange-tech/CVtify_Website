import { getToken } from '../lib/auth';

// services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Base fetch wrapper with auth headers and error handling
 */
async function apiFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined'
    ? getToken()
    : null;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text();
    let errorData = {};

    try {
      errorData = JSON.parse(text);
    } catch {
      errorData = { message: text || `HTTP ${response.status}` };
    }

    const error = new Error(errorData.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = errorData;

    throw error;
  }

  return response.json();
}


export const userApi = {
  /**
   * Update the authenticated user's name/email
   */
  updateProfile: async ({ name, email }) => {
    return apiFetch('/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name, email }),
    });
  },

  /**
   * Change the authenticated user's password
   */
  changePassword: async ({ currentPassword, newPassword, newPasswordConfirmation }) => {
    return apiFetch('/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      }),
    });
  },

  /**
   * Permanently delete the authenticated user's own account
   */
  deleteAccount: async () => {
    return apiFetch('/account', {
      method: 'DELETE',
    });
  },

  /**
   * Cancel the authenticated user's premium subscription
   */
  cancelSubscription: async () => {
    return apiFetch('/subscription/cancel', {
      method: 'POST',
    });
  },
};

export const templateApi = {
  /**
   * Fetch all templates with optional filter
   * @param {string} filter - 'all' | 'free' | 'premium' | 'popular'
   * @param {string} category - 'creative' | 'professional' | 'simple'
   */
  getTemplates: async (filter = 'all', category = null) => {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') params.append('filter', filter);
    if (category) params.append('category', category);

    const queryString = params.toString();
    const endpoint = `/templates${queryString ? `?${queryString}` : ''}`;

    return apiFetch(endpoint);
  },

  /**
   * Fetch a single template by ID
   */
  getTemplate: async (id) => {
    return apiFetch(`/templates/${id}`);
  },

  /**
   * Toggle wishlist status for a template
   */
  toggleWishlist: async (templateId) => {
    return apiFetch(`/templates/${templateId}/wishlist`, {
      method: 'POST',
    });
  },

  /**
   * Get user's wishlisted templates
   */
  getUserWishlist: async () => {
    return apiFetch('/user/wishlist');
  },
};

// services/api.js — add motivation template methods

export const motivationTemplateApi = {
  getTemplates: async (filter = 'all', category = null) => {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') params.append('filter', filter);
    if (category) params.append('category', category);

    const queryString = params.toString();
    const endpoint = `/motivation-templates${queryString ? `?${queryString}` : ''}`;

    return apiFetch(endpoint);
  },

  getTemplate: async (id) => {
    return apiFetch(`/motivation-templates/${id}`);
  },

  toggleWishlist: async (templateId) => {
    return apiFetch(`/motivation-templates/${templateId}/wishlist`, {
      method: 'POST',
    });
  },

  /**
   * Get user's wishlisted motivation letter templates
   */
  getUserWishlist: async () => {
    return apiFetch('/user/motivation-wishlist');
  },
};

export const dashboardApi = {
  getDashboard: async () => {
    return apiFetch('/dashboard');
  },

  getStats: async () => {
    return apiFetch('/dashboard/stats');
  },

  getDocuments: async (limit = 5) => {
    return apiFetch(`/dashboard/documents?limit=${limit}`);
  },
};


export const adminTemplateApi = {
  getTemplates: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.tab && params.tab !== 'all') query.append('tab', params.tab);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString();
    return apiFetch(`/admin/templates${queryString ? `?${queryString}` : ''}`);
  },

  createTemplate: async (formData) => {
    const token = typeof window !== 'undefined'
      ? getToken()
      : null;

    const response = await fetch(`${API_BASE_URL}/admin/templates`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: formData, // FormData for file upload
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  },

  updateTemplate: async (id, formData) => {
    // FormData with _method=PUT for Laravel
    formData.append('_method', 'PUT');

    const token = typeof window !== 'undefined'
      ? getToken()
      : null;

    const response = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: 'POST', // POST with _method=PUT for file uploads
      headers: {
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  },

  deleteTemplate: async (id) => {
    return apiFetch(`/admin/templates/${id}`, { method: 'DELETE' });
  },

  togglePremium: async (id) => {
    return apiFetch(`/admin/templates/${id}/toggle-premium`, { method: 'PATCH' });
  },

  togglePublished: async (id) => {
    return apiFetch(`/admin/templates/${id}/toggle-published`, { method: 'PATCH' });
  },

  removeImage: async (id) => {
    return apiFetch(`/admin/templates/${id}/image`, { method: 'DELETE' });
  },
};

export const adminResourceApi = {
  getResources: async (type) => {
    const query = type ? `?type=${type}` : '';
    return apiFetch(`/admin/resources${query}`);
  },

  createResource: async (payload) => {
    return apiFetch('/admin/resources', { method: 'POST', body: JSON.stringify(payload) });
  },

  updateResource: async (id, payload) => {
    return apiFetch(`/admin/resources/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  deleteResource: async (id) => {
    return apiFetch(`/admin/resources/${id}`, { method: 'DELETE' });
  },

  togglePublished: async (id) => {
    return apiFetch(`/admin/resources/${id}/toggle-published`, { method: 'PATCH' });
  },

  toggleFeatured: async (id) => {
    return apiFetch(`/admin/resources/${id}/toggle-featured`, { method: 'PATCH' });
  },

  getFaqs: async () => {
    return apiFetch('/admin/resources/faqs');
  },

  createFaq: async (payload) => {
    return apiFetch('/admin/resources/faqs', { method: 'POST', body: JSON.stringify(payload) });
  },

  updateFaq: async (id, payload) => {
    return apiFetch(`/admin/resources/faqs/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },

  deleteFaq: async (id) => {
    return apiFetch(`/admin/resources/faqs/${id}`, { method: 'DELETE' });
  },

  toggleFaqActive: async (id) => {
    return apiFetch(`/admin/resources/faqs/${id}/toggle-active`, { method: 'PATCH' });
  },
};

export const adminApi = {
  getDashboard: async (period = '7d') => {
    return apiFetch(`/admin/dashboard?period=${period}`);
  },

  getStats: async (period = '7d') => {
    return apiFetch(`/admin/dashboard/stats?period=${period}`);
  },

  approveRequest: async (requestId, note = '') => {
    return apiFetch(`/admin/premium-requests/${requestId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  rejectRequest: async (requestId, note = '') => {
    return apiFetch(`/admin/premium-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  },

  // ✅ CV management
  getCVs: async (params = {}) => {
    const query = new URLSearchParams();

    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.template && params.template !== 'all') query.append('template', params.template);
    if (params.user && params.user !== 'all') query.append('user', params.user);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);

    const queryString = query.toString();
    return apiFetch(`/admin/cvs${queryString ? `?${queryString}` : ''}`);
  },

  getCV: async (id) => {
    return apiFetch(`/admin/cvs/${id}`);
  },

  deleteCV: async (id) => {
    return apiFetch(`/admin/cvs/${id}`, {
      method: 'DELETE',
    });
  },

  bulkDeleteCVs: async (ids) => {
    return apiFetch('/admin/cvs/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },

  // ✅ Users for filters
  getUsers: async () => {
    return apiFetch('/admin/users');
  },

  // ✅ Templates for filters/stats
  getTemplates: async () => {
    return apiFetch('/admin/templates');
  },
};

export default apiFetch;