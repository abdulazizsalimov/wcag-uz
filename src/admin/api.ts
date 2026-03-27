const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers as Record<string, string> || {}) },
  });
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

// Auth
export const authApi = {
  status: () => request('/api/auth/status'),
  setup: (password: string) => request('/api/auth/setup', { method: 'POST', body: JSON.stringify({ password }) }),
  login: (password: string) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
  check: () => request('/api/auth/check'),
  changePassword: (current_password: string, new_password: string) =>
    request('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) }),
};

// Settings
export const settingsApi = {
  get: () => request('/api/admin/settings'),
  update: (data: Record<string, { uz: string; ru: string }>) =>
    request('/api/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// Menu
export const menuApi = {
  list: () => request('/api/admin/menu'),
  create: (data: { label_uz: string; label_ru: string; path: string; order_index?: number; is_visible?: boolean; page_id?: number | null }) =>
    request('/api/admin/menu', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: { label_uz: string; label_ru: string; path: string; order_index?: number; is_visible?: boolean; page_id?: number | null }) =>
    request(`/api/admin/menu/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/api/admin/menu/${id}`, { method: 'DELETE' }),
  reorder: (ids: number[]) => request('/api/admin/menu/reorder', { method: 'PUT', body: JSON.stringify(ids) }),
};

// Pages
export interface PageBlock {
  id?: number;
  block_type: string;
  content: Record<string, unknown>;
  order_index: number;
}

export interface Page {
  id: number;
  slug: string;
  title_uz: string;
  title_ru: string;
  meta_description_uz?: string;
  meta_description_ru?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  blocks?: PageBlock[];
}

export const pagesApi = {
  list: () => request('/api/admin/pages'),
  create: (data: { slug: string; title_uz: string; title_ru: string; meta_description_uz?: string; meta_description_ru?: string; is_published?: boolean }) =>
    request('/api/admin/pages', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: number) => request(`/api/admin/pages/${id}`),
  update: (id: number, data: { slug: string; title_uz: string; title_ru: string; meta_description_uz?: string; meta_description_ru?: string; is_published?: boolean }) =>
    request(`/api/admin/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/api/admin/pages/${id}`, { method: 'DELETE' }),
  updateBlocks: (id: number, blocks: PageBlock[]) =>
    request(`/api/admin/pages/${id}/blocks`, { method: 'PUT', body: JSON.stringify({ blocks }) }),
};

// Footer
export const footerApi = {
  get: () => request('/api/admin/footer'),
  updateSettings: (data: Record<string, { uz: string; ru: string }>) =>
    request('/api/admin/footer/settings', { method: 'PUT', body: JSON.stringify(data) }),
  createLink: (data: { label_uz: string; label_ru: string; url: string; column_index?: number; order_index?: number }) =>
    request('/api/admin/footer/links', { method: 'POST', body: JSON.stringify(data) }),
  updateLink: (id: number, data: { label_uz: string; label_ru: string; url: string; column_index?: number; order_index?: number }) =>
    request(`/api/admin/footer/links/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLink: (id: number) => request(`/api/admin/footer/links/${id}`, { method: 'DELETE' }),
};

// Public
export const publicApi = {
  site: () => fetch(`${API_URL}/api/site`).then(r => r.json()),
  page: (slug: string) => fetch(`${API_URL}/api/pages/${slug}`).then(r => r.json()),
};
