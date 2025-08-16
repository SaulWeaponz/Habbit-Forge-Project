// Authentication utility functions
import { getJwtToken } from './localStorage';

/**
 * Get the current authentication token
 * Priority: JWT token from login > Environment variable > null
 */
export const getAuthToken = () => {
  // First try to get JWT token from user login
  const jwtToken = getJwtToken();
  if (jwtToken) {
    return jwtToken;
  }
  
  // Fallback to environment variable (for admin/static operations)
  const envToken = import.meta.env.VITE_STRAPI_AUTH_TOKEN;
  if (envToken && envToken !== 'your_strapi_auth_token_here') {
    return envToken;
  }
  
  return null;
};

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  return !!(token && isAuth);
};

/**
 * Logout user and clear all auth data
 */
export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('authMethod');
};
