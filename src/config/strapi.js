// Strapi Configuration
// This file centralizes all Strapi API endpoints for easy maintenance
// Automatically detects development vs production environment

// Environment detection with better debugging
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const mode = import.meta.env.MODE;

// Base URL for Strapi API - automatically switches based on environment
export const STRAPI_BASE_URL = (() => {
  // If environment variable is explicitly set, use it (highest priority)
  if (import.meta.env.VITE_STRAPI_BASE_URL) {
    return import.meta.env.VITE_STRAPI_BASE_URL;
  }
  
  // Auto-detect based on environment - multiple fallback strategies
  if (isDevelopment || mode === 'development') {
    return 'http://localhost:1337';
  }
  
  if (isProduction || mode === 'production') {
    return 'https://habbit-forge-strapi-1.onrender.com';
  }
  
  // Additional fallback - check if we're running on localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:1337';
  }
  
  // Final fallback to deployed URL
  return 'https://habbit-forge-strapi-1.onrender.com';
})();

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
