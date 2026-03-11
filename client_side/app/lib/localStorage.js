// Storage keys
const KEYS = {
    USER: 'cvtify_user',
    TOKEN: 'cvtify_token'
};

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Get item from localStorage
export const getStoredUser = () => {
    if (!isBrowser) return null;
    
    try {
        const user = localStorage.getItem(KEYS.USER);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error reading user from localStorage:', error);
        return null;
    }
};

// Get token from localStorage
export const getStoredToken = () => {
    if (!isBrowser) return null;
    
    try {
        return localStorage.getItem(KEYS.TOKEN);
    } catch (error) {
        console.error('Error reading token from localStorage:', error);
        return null;
    }
};

// Save user and token to localStorage
export const saveAuth = (user, token) => {
    if (!isBrowser) return;
    
    try {
        localStorage.setItem(KEYS.USER, JSON.stringify(user));
        localStorage.setItem(KEYS.TOKEN, token);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// Clear auth data from localStorage
export const clearAuth = () => {
    if (!isBrowser) return;
    
    try {
        localStorage.removeItem(KEYS.USER);
        localStorage.removeItem(KEYS.TOKEN);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};