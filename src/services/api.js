// API service for Django backend integration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-django-backend.com/api' 
  : 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('session_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Questions API
  async getQuestions() {
    return this.request('/questions/');
  }

  // Search API
  async searchWithAI(query) {
    return this.request('/search/', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // Submit evaluation
  async submitEvaluation(evaluationData) {
    return this.request('/submit/', {
      method: 'POST',
      body: JSON.stringify(evaluationData),
    });
  }

  // Get user history
  async getUserHistory() {
    return this.request('/history/');
  }

  // SSO Authentication
  async authenticateWithSSO(provider, ssoData) {
    const response = await fetch('http://localhost:8000/auth/sso/callback/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...ssoData,
        provider,
      }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    
    // Store session token
    if (data.session_token) {
      localStorage.setItem('session_token', data.session_token);
      this.token = data.session_token;
    }

    return data;
  }

  // Logout
  logout() {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
    this.token = null;
  }
}

export default new ApiService();