// Strapi Configuration
// This file centralizes all Strapi API endpoints for easy maintenance
// Automatically detects development vs production environment

// Environment detection with better debugging
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const mode = import.meta.env.MODE;

// Debug all environment variables
console.log('🔍 Environment Variables Debug:', {
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
  VITE_STRAPI_BASE_URL: import.meta.env.VITE_STRAPI_BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV
});

// Base URL for Strapi API - automatically switches based on environment
export const STRAPI_BASE_URL = (() => {
  // If environment variable is explicitly set, use it (highest priority)
  if (import.meta.env.VITE_STRAPI_BASE_URL) {
    console.log('🔧 Using manual override URL:', import.meta.env.VITE_STRAPI_BASE_URL);
    return import.meta.env.VITE_STRAPI_BASE_URL;
  }
  
  // Auto-detect based on environment - multiple fallback strategies
  if (isDevelopment || mode === 'development') {
    console.log('🔧 Development mode detected, using localhost');
    return 'http://localhost:1337';
  }
  
  if (isProduction || mode === 'production') {
    console.log('🔧 Production mode detected, using deployed URL');
    return 'https://habbit-forge-strapi-1.onrender.com';
  }
  
  // Additional fallback - check if we're running on localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🔧 Localhost detected, using local Strapi');
    return 'http://localhost:1337';
  }
  
  // Final fallback to deployed URL
  console.log('🔧 Using fallback deployed URL');
  return 'https://habbit-forge-strapi-1.onrender.com';
})();

// Log the current configuration for debugging
console.log(`🚀 Strapi Configuration:
  Environment: ${isDevelopment ? 'Development' : 'Production'}
  Mode: ${mode}
  Base URL: ${STRAPI_BASE_URL}
  Auto-detected: ${!import.meta.env.VITE_STRAPI_BASE_URL ? 'Yes' : 'No (manual override)'}
  Localhost check: ${typeof window !== 'undefined' ? window.location.hostname : 'N/A'}
`);

// Test function to verify configuration
export const testConfiguration = () => {
  console.log('🧪 Testing Strapi Configuration...');
  console.log('Current URL:', STRAPI_BASE_URL);
  console.log('Auth endpoint:', API_ENDPOINTS.AUTH);
  console.log('Users endpoint:', API_ENDPOINTS.USERS);
  
  // Test if we can reach the Strapi instance
  fetch(`${STRAPI_BASE_URL}/api/health`)
    .then(response => {
      console.log('✅ Strapi connection test:', response.status, response.statusText);
    })
    .catch(error => {
      console.log('❌ Strapi connection test failed:', error.message);
    });
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: `${STRAPI_BASE_URL}/api/auth`,
  USERS: `${STRAPI_BASE_URL}/api/users`,
  USERS_ME: `${STRAPI_BASE_URL}/api/users/me`,
  
  // Core features
  HABITS: `${STRAPI_BASE_URL}/api/habits`,
  GOALS: `${STRAPI_BASE_URL}/api/goals`,
  FEEDBACKS: `${STRAPI_BASE_URL}/api/feedbacks`,
  
  // Content management
  HABIT_TIPS: `${STRAPI_BASE_URL}/api/habit-tips`,
  TIP_RESOURCES: `${STRAPI_BASE_URL}/api/tip-resources`,
  MOTIVATIONAL_QUOTES: `${STRAPI_BASE_URL}/api/motivational-quotes`,
  QUOTE_RESOURCES: `${STRAPI_BASE_URL}/api/quote-resources`,
  HABIT_CATEGORIES: `${STRAPI_BASE_URL}/api/habit-categories`,
  QUOTES: `${STRAPI_BASE_URL}/api/quotes`,
  
  // File uploads
  UPLOAD: `${STRAPI_BASE_URL}/api/upload`,
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${STRAPI_BASE_URL}/api/${endpoint}`;
};

// Helper function to get populated API URL
export const getPopulatedApiUrl = (endpoint, populate = '*') => {
  return `${STRAPI_BASE_URL}/api/${endpoint}?populate=${populate}`;
};

// Environment info for debugging
export const ENV_INFO = {
  isDevelopment,
  isProduction,
  mode,
  baseUrl: STRAPI_BASE_URL,
  hasManualOverride: !!import.meta.env.VITE_STRAPI_BASE_URL,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A'
};

// Auto-test configuration when imported
setTimeout(() => {
  testConfiguration();
}, 1000);
