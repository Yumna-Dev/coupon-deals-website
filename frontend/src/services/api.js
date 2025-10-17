// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Coupon endpoints
  async getCoupons(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/coupons?${queryString}`);
  }

  async getCoupon(id) {
    return this.request(`/coupons/${id}`);
  }

  async searchCoupons(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/coupons/search?${queryString}`);
  }

  async createCoupon(data) {
    return this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCoupon(id, data) {
    return this.request(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCoupon(id) {
    return this.request(`/coupons/${id}`, {
      method: 'DELETE',
    });
  }

  // Category endpoints
  async getCategories() {
    return this.request('/categories');
  }

  // Saved coupons endpoints
  async saveCoupon(userId, couponId) {
    return this.request(`/users/${userId}/saved-coupons`, {
      method: 'POST',
      body: JSON.stringify({ couponId }),
    });
  }

  async getSavedCoupons(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users/${userId}/saved-coupons?${queryString}`);
  }

  async removeSavedCoupon(userId, couponId) {
    return this.request(`/users/${userId}/saved-coupons/${couponId}`, {
      method: 'DELETE',
    });
  }

  // Auth endpoints
  async register(data) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.setToken(null);
    return response;
  }

  async refreshToken() {
    const response = await this.request('/auth/refresh', {
      method: 'POST',
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }
}

// Export singleton instance
export default new ApiService();