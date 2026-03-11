// services/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Base fetch wrapper with auth headers and error handling
 */
async function apiFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('auth_token')
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
    credentials: 'include', // Required for Sanctum cookies
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      console.warn('Unauthorized request - user may need to log in');
    }

    const error = new Error(errorData.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
}

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

export default apiFetch;