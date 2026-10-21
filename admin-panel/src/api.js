const API_BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? '/api/index.php'
  : 'https://askmebag.com/api/index.php';

const getHeaders = () => {
  const token = localStorage.getItem('askmebag_admin_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('askmebag_admin_token');
      const err = await res.json().catch(() => ({ message: 'Invalid email or password.' }));
      throw new Error(err.message || 'Invalid email or password.');
    }
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
};

export const api = {
  get: (path) =>
    fetch(`${API_BASE}${path}`, { headers: getHeaders() }).then(handleResponse),

  post: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  postForm: (path, formData) => {
    const token = localStorage.getItem('askmebag_admin_token');
    return fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }).then(handleResponse);
  },

  delete: (path) =>
    fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),
};

export const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  quotation_sent: 'Quote Sent',
  follow_up: 'Follow-up',
  negotiation: 'Negotiation',
  converted: 'Converted',
  closed: 'Closed',
  lost: 'Lost',
};

export const STATUS_COLORS = {
  new: '#f59e0b',
  contacted: '#3b82f6',
  quotation_sent: '#8b5cf6',
  follow_up: '#f97316',
  negotiation: '#06b6d4',
  converted: '#10b981',
  closed: '#6b7280',
  lost: '#ef4444',
};
