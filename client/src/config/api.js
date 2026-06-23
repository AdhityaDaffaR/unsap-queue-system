const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok && !data.success) {
    throw new Error(data.message || `Request gagal (${res.status})`);
  }
  return data;
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  get: async (path, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${path}`, { headers });
    return handleResponse(res);
  },
  post: async (path, body, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
  patch: async (path, body, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },
};
