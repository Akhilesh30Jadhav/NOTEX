// src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }


async request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (this.token) {
    config.headers.Authorization = `Bearer ${this.token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // Don't try to parse empty responses
    let data = null;
    if (response.headers.get('content-length') !== '0' && response.status !== 204) {
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid response from server');
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || `Server error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}



  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.token = response.token;
    }

    return response;
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.token = response.token;
    }

    return response;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
  }

  async getMaterials(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/materials?${queryParams}`);
  }

  async uploadMaterial(formData) {
    // Remove default JSON header for form data upload
    return this.request('/materials', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async deleteMaterial(materialId) {
    return this.request(`/materials/${materialId}`, {
      method: 'DELETE',
    });
  }

  // Convenience methods matching axios-style API
  async get(endpoint, options = {}) {
    const { params, ...rest } = options;
    let url = endpoint;
    if (params) {
      const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
      if (qs) url = `${endpoint}?${qs}`;
    }
    const data = await this.request(url, { method: 'GET', ...rest });
    return { data };
  }

  async post(endpoint, body, options = {}) {
    const isFormData = body instanceof FormData;
    const config = { method: 'POST', ...options };
    if (isFormData) {
      config.body = body;
      config.headers = { ...(options.headers || {}) };
      delete config.headers['Content-Type'];
    } else {
      config.body = JSON.stringify(body);
    }
    const data = await this.request(endpoint, config);
    return { data };
  }

  async put(endpoint, body, options = {}) {
    const data = await this.request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options });
    return { data };
  }

  async delete(endpoint, options = {}) {
    const data = await this.request(endpoint, { method: 'DELETE', ...options });
    return { data };
  }
}

export default new ApiClient();
