/**
 * Centralized API helper for Nexamed Frontend.
 * Supports configurable VITE_API_BASE_URL for cross-domain deployments (e.g. Vercel + Render),
 * while defaulting to relative paths (/api/...) for single-domain or proxy setups.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const apiFetch = (path, options = {}) => {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  return fetch(url, options);
};

export default apiFetch;
