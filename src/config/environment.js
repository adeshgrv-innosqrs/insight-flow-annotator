// Environment configuration for Django backend integration

export const config = {
  // API Configuration
  API: {
    BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-django-backend.com' 
      : 'http://localhost:8000',
    ENDPOINTS: {
      QUESTIONS: '/api/questions/',
      SEARCH: '/api/search/',
      SUBMIT: '/api/submit/',
      HISTORY: '/api/history/',
      SSO_CALLBACK: '/auth/sso/callback/',
    }
  },

  // SSO Configuration
  SSO: {
    GOOGLE: {
      CLIENT_ID: 'your-google-client-id',
      REDIRECT_URI: 'http://localhost:8000/auth/sso/callback/',
    },
    MICROSOFT: {
      CLIENT_ID: 'your-microsoft-client-id',
      REDIRECT_URI: 'http://localhost:8000/auth/sso/callback/',
    }
  },

  // OpenAI Configuration (handled by backend)
  OPENAI: {
    MODEL: 'gpt-4',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7,
  },

  // App Configuration
  APP: {
    NAME: 'Query Evaluation Platform',
    VERSION: '1.0.0',
    FEATURES: {
      ENABLE_MOCK_DATA: true, // Enable fallback to mock data if API fails
      ENABLE_LOCAL_STORAGE: true, // Enable localStorage fallbacks
    }
  }
};

export default config;