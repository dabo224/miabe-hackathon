import CryptoJS from 'crypto-js';

/**
 * Generates a SHA256 hash of the given data object.
 * This is used to create an immutable fingerprint of the birth record.
 * @param {Object} data - The birth record data.
 * @returns {string} - The SHA256 hash.
 */
export const generateHash = (data) => {
  // Sort keys to ensure consistent hashing
  const sortedData = Object.keys(data)
    .sort()
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});

  return CryptoJS.SHA256(JSON.stringify(sortedData)).toString();
};
