import {
  getAccessToken,
  getRefreshToken,
  saveAuth,
  clearAuth,
  getStoredUser,
} from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/web-api';

function formatApiError(data) {
  if (!data || typeof data !== 'object') return 'Request failed';

  if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
    return data.non_field_errors[0];
  }

  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.message === 'string') return data.message;

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value[0]) return String(value[0]);
    if (typeof value === 'string') return value;
  }

  return 'Request failed';
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('Session expired');

  const res = await fetch(`${API_BASE}/api/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    clearAuth();
    throw new Error('Session expired');
  }

  saveAuth({
    access: data.access,
    refresh: data.refresh || refresh,
    user: getStoredUser(),
  });

  return data.access;
}

export async function apiRequest(path, options = {}) {
  let token = getAccessToken();

  const doFetch = (accessToken) =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });

  let res = await doFetch(token);

  if (res.status === 401 && getRefreshToken()) {
    token = await refreshAccessToken();
    res = await doFetch(token);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(formatApiError(data));
  }

  return data;
}

export const authApi = {
  register: (body) =>
    apiRequest('/api/register/', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    apiRequest('/api/login/', { method: 'POST', body: JSON.stringify(body) }),

  logout: () =>
    apiRequest('/api/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh: getRefreshToken() }),
    }),

  profile: () => apiRequest('/api/profile/'),

  changePassword: (body) =>
    apiRequest('/api/change-password/', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export const plansApi = {
  list: (params = {}) => {
    const search = new URLSearchParams();
    if (params.billing_cycle) search.set('billing_cycle', params.billing_cycle);
    if (params.code) search.set('code', params.code);
    const query = search.toString();
    return apiRequest(`/api/subscription-plans/${query ? `?${query}` : ''}`);
  },
};

/** Unwrap paginated DRF list responses */
export function unwrapListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}
