/**
 * Utility functions for managing localStorage with ipms_ prefix
 * This provides consistent naming and prevents conflicts
 */

/**
 * Set an item in localStorage with ipms_ prefix
 * @param {string} key - The base key name
 * @param {any} value - The value to store
 */
export const setIpmsItem = (key, value) => {
  try {
    const ipmsKey = `ipms_${key}`;
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(ipmsKey, serializedValue);
  } catch (error) {
    console.error(`Error setting ipms item ${key}:`, error);
  }
};

/**
 * Get an item from localStorage with ipms_ prefix
 * @param {string} key - The base key name
 * @returns {any} The stored value or null if not found
 */
export const getIpmsItem = (key) => {
  try {
    const ipmsKey = `ipms_${key}`;
    const value = localStorage.getItem(ipmsKey);
    if (value === null) return null;
    
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(`Error getting ipms item ${key}:`, error);
    return null;
  }
};

/**
 * Remove an item from localStorage with ipms_ prefix
 * @param {string} key - The base key name
 */
export const removeIpmsItem = (key) => {
  try {
    const ipmsKey = `ipms_${key}`;
    localStorage.removeItem(ipmsKey);
  } catch (error) {
    console.error(`Error removing ipms item ${key}:`, error);
  }
};

/**
 * Clear all ipms_ prefixed data
 */
export const clearIpmsData = () => {
  try {
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('ipms_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing ipms data:', error);
  }
};

/**
 * Get all ipms_ prefixed keys
 * @returns {string[]} Array of ipms_ prefixed keys
 */
export const getIpmsKeys = () => {
  try {
    const keys = Object.keys(localStorage);
    return keys.filter(key => key.startsWith('ipms_'));
  } catch (error) {
    console.error('Error getting ipms keys:', error);
    return [];
  }
};

/**
 * Check if an ipms_ prefixed key exists
 * @param {string} key - The base key name
 * @returns {boolean} True if the key exists
 */
export const hasIpmsItem = (key) => {
  try {
    const ipmsKey = `ipms_${key}`;
    return localStorage.getItem(ipmsKey) !== null;
  } catch (error) {
    console.error(`Error checking ipms item ${key}:`, error);
    return false;
  }
};

/**
 * Legacy function names for backward compatibility
 */
export const setProjectItem = setIpmsItem;
export const getProjectItem = getIpmsItem;
export const removeProjectItem = removeIpmsItem;
export const clearProjectData = clearIpmsData;
export const getProjectKeys = getIpmsKeys;
export const hasProjectItem = hasIpmsItem;
