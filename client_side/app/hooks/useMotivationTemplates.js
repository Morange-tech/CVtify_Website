import { useState, useEffect, useCallback } from 'react';
import { motivationTemplateApi } from '../services/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const toAbsoluteImageUrl = (path) => {
  if (!path) return '/images/placeholder-template.jpg';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) return path;

  const cleanBase = API_BASE_URL.replace(/\/api$/, '');
  return `${cleanBase}${path.startsWith('/') ? path : `/${path}`}`;
};

const extractTemplates = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.templates)) return response.templates;
  if (Array.isArray(response?.data?.templates)) return response.data.templates;
  return [];
};

const normalizeTemplate = (template) => {
  const isPremium = template.isPremium ?? template.is_premium ?? false;
  const isFree = !(isPremium);

  const badges = Array.isArray(template.badges)
    ? template.badges
    : [
        ...(template.isPopular || template.is_popular ? ['popular'] : []),
        ...(template.isNew || template.is_new ? ['new'] : []),
        ...(isFree ? ['free'] : ['premium']),
      ];

  return {
    id: template.id,
    templateId: template.templateId || template.template_id || template.id,
    name: template.name || 'Untitled Template',
    description: template.description || '',
    image: toAbsoluteImageUrl(
      template.image ||
      template.previewImage ||
      template.preview_image ||
      template.thumbnail ||
      template.thumbnail_url ||
      template.image_url
    ),
    isFree,
    isPremium,
    isPublished: template.isPublished ?? template.is_published ?? true,
    badges,
    rating: template.rating ?? 0,
    uses: template.uses ?? template.usage_count ?? template.use_count ?? 0,
    downloads: template.downloads ?? template.download_count ?? 0,
    isWishlisted: template.isWishlisted ?? template.is_wishlisted ?? false,
    category: template.category || '',
    raw: template,
  };
};

const useMotivationTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await motivationTemplateApi.getTemplates();
      console.log('Public motivation templates response:', response);

      const rawTemplates = extractTemplates(response);
      const normalizedTemplates = rawTemplates.map(normalizeTemplate);

      setTemplates(normalizedTemplates);
    } catch (err) {
      console.error('Failed to fetch motivation templates:', err);
      setError(err.message || 'Failed to load templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleWishlist = useCallback(async (templateId) => {
    try {
      const response = await motivationTemplateApi.toggleWishlist(templateId);

      const isWishlisted =
        response?.is_wishlisted ??
        response?.data?.is_wishlisted ??
        false;

      setTemplates((prev) =>
        prev.map((t) =>
          t.id === templateId
            ? { ...t, isWishlisted }
            : t
        )
      );

      return { ...response, is_wishlisted: isWishlisted };
    } catch (err) {
      if (err.status === 401 || err.response?.status === 401) {
        return { error: 'auth_required' };
      }
      throw err;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    toggleWishlist,
    refresh,
  };
};

export default useMotivationTemplates;