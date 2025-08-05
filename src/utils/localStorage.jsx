

// Save user data to localStorage under 'currentUser'
export const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Optionally: console.log('User data saved to localStorage:', user);
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

// Get user data from localStorage
export const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    return null;
  }
};

// Remove user data from localStorage
export const removeUserFromStorage = () => {
  try {
    localStorage.removeItem('currentUser');
    // Optionally: console.log('User data removed from localStorage');
  } catch (error) {
    console.error('Error removing user from localStorage:', error);
  }
};

// Save any data to localStorage with custom key
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Data saved to localStorage with key: ${key}`);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Get any data from localStorage with custom key
export const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// Clear all localStorage data
export const clearStorage = () => {
  try {
    localStorage.clear();
    console.log('All localStorage data cleared');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};